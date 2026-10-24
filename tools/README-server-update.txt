server-update.sh
================

这个脚本部署在网站服务器 198.13.53.6 上，路径是
    /usr/local/bin/summer-pinellia-update.sh

作用：把 https://summer-pinellia.duckdns.org/ 的内容更新到 GitHub main 分支最新版。

用法
----
    summer-pinellia-update.sh            正常更新
    summer-pinellia-update.sh --check    只看有没有新版本，不改任何文件
    summer-pinellia-update.sh --clean    更新后顺便清理未跟踪文件
    summer-pinellia-update.sh --help     查看脚本自带说明

为什么不用 git pull
-------------------
这个仓库的历史被重写过（清掉了历史里的大文件），
git pull 会报 divergent branches。脚本用 fetch + reset --hard。

安全措施
--------
* flock 加锁，避免两个更新同时跑
* 更新前记录旧版本，更新后做 HTTP 健康检查
* 健康检查失败会自动回滚到旧版本
* 日志写在 /var/log/summer-pinellia-update.log
* 每次更新在 /var/backups/summer-pinellia/ 留一条记录（含新旧版本号）

可覆盖的环境变量
----------------
    SP_REPO    仓库路径     默认 /var/www/summer-pinellia
    SP_BRANCH  分支         默认 main
    SP_URL     健康检查地址 默认 https://summer-pinellia.duckdns.org/
    SP_LOG     日志路径     默认 /var/log/summer-pinellia-update.log
    SP_KEEP    保留记录份数 默认 10
