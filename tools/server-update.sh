#!/usr/bin/env bash
# =====================================================================
#  summer-pinellia 一键更新脚本
#
#  作用：把 https://summer-pinellia.duckdns.org/ 的站点内容更新到
#        GitHub 上 main 分支的最新版本。
#
#  用法：
#      summer-pinellia-update.sh            正常更新
#      summer-pinellia-update.sh --check    只检查有没有新版本，不改动任何文件
#      summer-pinellia-update.sh --clean    更新后顺便删掉多余的未跟踪文件
#      summer-pinellia-update.sh --help     显示这段帮助
#
#  为什么不用 git pull：
#      这个仓库的提交历史被重写过（清理过历史里的大文件），
#      git pull 会报 divergent branches / 冲突。必须用
#      git fetch + git reset --hard，脚本已经按这个方式做。
#
#  安全措施：
#      * 加锁，防止两个更新同时跑
#      * 更新前记录当前版本，更新后做健康检查
#      * 健康检查失败自动回滚到更新前的版本
#      * 每次更新写日志（含旧版本号、新版本号、改动文件数）
# =====================================================================
set -euo pipefail

# ---- 可调参数（都支持用环境变量覆盖，方便测试与迁移） ----
REPO="${SP_REPO:-/var/www/summer-pinellia}"
BRANCH="${SP_BRANCH:-main}"
SITE_URL="${SP_URL:-https://summer-pinellia.duckdns.org/}"
RUN_AS="${SP_RUN_AS:-caddy}"
LOG="${SP_LOG:-/var/log/summer-pinellia-update.log}"
LOCK="${SP_LOCK:-/var/lock/summer-pinellia-update.lock}"
BACKUP_DIR="${SP_BACKUP_DIR:-/var/backups/summer-pinellia}"
KEEP="${SP_KEEP:-10}"
HEALTH_RETRIES="${SP_HEALTH_RETRIES:-3}"

# ---- 命令行参数 ----
CLEAN=0
CHECK_ONLY=0
for arg in "$@"; do
  case "$arg" in
    --clean) CLEAN=1 ;;
    --check) CHECK_ONLY=1 ;;
    -h|--help) sed -n '2,25p' "$0"; exit 0 ;;
    *) echo "未知参数: $arg（用 --help 看用法）" >&2; exit 2 ;;
  esac
done

log() {
  local msg="[$(date '+%F %T')] $*"
  echo "$msg"
  [[ -w "$(dirname "$LOG")" || -w "$LOG" ]] && echo "$msg" >>"$LOG" || true
}

fail() { log "错误：$*"; exit 1; }

# ---- 只用 caddy 用户操作仓库，避免 git 的 dubious ownership ----
git_run() {
  if [[ "$(id -un)" == "$RUN_AS" ]]; then
    git -C "$REPO" "$@"
  else
    sudo -u "$RUN_AS" git -C "$REPO" "$@"
  fi
}

# ---- 1. 基本检查 ----
[[ -d "$REPO/.git" ]] || fail "$REPO 不是 git 仓库"
command -v git   >/dev/null || fail "找不到 git"
command -v curl  >/dev/null || fail "找不到 curl"

# ---- 2. 加锁，避免并发 ----
mkdir -p "$(dirname "$LOCK")" 2>/dev/null || true
if command -v flock >/dev/null; then
  exec 9>"$LOCK"
  flock -n 9 || fail "另一个更新正在进行（锁文件 $LOCK），请稍后再试"
fi

log "===== 开始更新 summer-pinellia ====="
log "仓库：$REPO   分支：$BRANCH"

# ---- 3. 记录当前版本 ----
OLD="$(git_run rev-parse HEAD)"
OLD_SHORT="${OLD:0:7}"
log "当前版本：$OLD_SHORT"

# ---- 4. 拉取远端（失败重试 3 次） ----
fetch_ok=0
for i in 1 2 3; do
  if git_run fetch --prune origin "$BRANCH" >/dev/null 2>&1; then
    fetch_ok=1; break
  fi
  log "fetch 第 $i 次失败，3 秒后重试…"
  sleep 3
done
[[ "$fetch_ok" == "1" ]] || fail "连不上 GitHub，fetch 失败（检查网络/代理）"

NEW="$(git_run rev-parse "origin/$BRANCH")"
NEW_SHORT="${NEW:0:7}"
log "远端版本：$NEW_SHORT"

# ---- 5. 判断有没有更新 ----
if [[ "$OLD" == "$NEW" ]]; then
  log "已经是最新版本，无需更新。"
  log "===== 结束 ====="
  exit 0
fi

CHANGED="$(git_run diff --name-only "$OLD" "$NEW" | wc -l | tr -d ' ')"
log "发现新版本，共 $CHANGED 个文件有改动"

if [[ "$CHECK_ONLY" == "1" ]]; then
  log "（--check 模式，不做任何改动）"
  git_run --no-pager diff --stat "$OLD" "$NEW" | tail -20 || true
  log "===== 结束 ====="
  exit 0
fi

# ---- 6. 更新前留个记录，方便回溯 ----
mkdir -p "$BACKUP_DIR"
STAMP="$(date '+%Y%m%d-%H%M%S')"
printf 'time=%s\nold=%s\nnew=%s\nchanged_files=%s\n' \
  "$(date '+%F %T')" "$OLD" "$NEW" "$CHANGED" >"$BACKUP_DIR/$STAMP.txt"
# 只保留最近 KEEP 份记录
ls -1t "$BACKUP_DIR"/*.txt 2>/dev/null | tail -n +$((KEEP+1)) | xargs -r rm -f
log "更新记录：$BACKUP_DIR/$STAMP.txt"

# ---- 7. 切换到新版本 ----
log "开始切换到新版本…"
if ! git_run reset --hard "$NEW" >/dev/null 2>&1; then
  fail "git reset 失败，仓库保持原样"
fi

if [[ "$CLEAN" == "1" ]]; then
  log "清理未跟踪文件（--clean）…"
  git_run clean -fd >/dev/null 2>&1 || true
fi

# 站点由 caddy 读取，属主要对
chown -R "$RUN_AS:$RUN_AS" "$REPO" 2>/dev/null || true

# ---- 8. 健康检查（失败就回滚） ----
health_check() {
  local code
  for i in $(seq 1 "$HEALTH_RETRIES"); do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$SITE_URL" 2>/dev/null || echo 000)"
    if [[ "$code" == "200" ]]; then return 0; fi
    log "健康检查第 $i 次返回 $code，2 秒后重试…"
    sleep 2
  done
  return 1
}

log "健康检查：$SITE_URL"
if health_check; then
  log "站点正常（HTTP 200）"
else
  log "健康检查失败，开始回滚到 $OLD_SHORT …"
  git_run reset --hard "$OLD" >/dev/null 2>&1 || true
  chown -R "$RUN_AS:$RUN_AS" "$REPO" 2>/dev/null || true
  if health_check; then
    fail "更新后站点异常，已回滚到 $OLD_SHORT（站点恢复正常）"
  else
    fail "更新后站点异常，回滚也未能恢复，请手动排查"
  fi
fi

log "更新完成：$OLD_SHORT → $NEW_SHORT（$CHANGED 个文件）"
log "===== 结束 ====="
