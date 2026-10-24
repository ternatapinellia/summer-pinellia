/* Language switcher: 中文 / English (in-place text swap) */
(function () {
  var DICT = {
    "v3.3 修复：数据库连接泄漏导致海豹变慢": "v3.3 fix: database connection leak slowed SealDice down",
  "桥在 lookup() 里用了 with self.connect(...)。但 Python 的 sqlite3 中，with 语句只提交事务，并不会关闭连接，于是每次查询都会泄漏一个连接。这些连接一直持有读事务，阻塞海豹的 WAL checkpoint。": "The bridge used with self.connect(...) inside lookup(). In Python's sqlite3, the with statement only commits the transaction and does not close the connection, so every query leaked a connection. Those connections held read transactions open and blocked SealDice's WAL checkpoint.",
  "结果 -wal 文件持续膨胀（实测有实例涨到主库的 11 倍），每次读库都要扫越来越大的 WAL。表现为海豹的 database.log 里不断出现 1~4 秒的 SLOW SQL，机器人回复变慢，偶发因为超过 QQ 被动回复窗口而发不出消息。": "As a result the -wal file kept growing (in one instance it reached 11 times the size of the main database) and every read had to scan an ever larger WAL. The symptom was repeated 1-4 second SLOW SQL entries in SealDice's database.log, slower replies, and occasionally messages that could not be sent because they missed the QQ passive-reply window.",
  "现在改为显式关闭：": "It now closes the connection explicitly:",
  "升级后建议重启一次海豹，让已经膨胀的 -wal 立即回收。": "After upgrading, restart SealDice once so the bloated -wal is reclaimed immediately.",
  "v3.2 更新：绑定判定": "v3.2: binding identity",
  "绑定身份从「旧QQ + 旧群」改为「旧QQ + 旧群 + OpenQQ账号 + 目标群」。这样一来，同一个旧 QQ 可以绑到多个不同的 OpenQQ 官 bot，而完全相同的配对再次绑定会被拒绝。": "The binding identity changed from (old QQ + old group) to (old QQ + old group + OpenQQ account + target group). One old QQ may now bind to several different OpenQQ bots, while re-binding the exact same pair is rejected.",
  "旧版本留下的记录仍能识别，不会因为升级而允许重复绑定；下次成功绑定时会自动整理成新格式。": "Records left by older versions are still recognised, so upgrading never allows a duplicate binding; the next successful bind rewrites them into the new format.",
  "v3.0 修复：兼容 GBK 编码的历史数据": "v3.0 fix: support legacy GBK-encoded data",
  "旧版海豹在某些 Windows 环境下，会把中文按 GBK 编码写进数据库。桥读取时默认按严格 UTF-8 解码，遇到这种数据会直接报错：": "On some Windows setups, older SealDice versions wrote Chinese text into the database using GBK. The bridge originally decoded strictly as UTF-8 and failed immediately on such rows:",
  "表现为绑定直接失败、返回 500。现在所有数据库连接都改用了容错解码，顺序是 UTF-8 → GB18030 → GBK → Big5 → latin-1，最后才做字符替换。像「Bryana Marist (测试角色).st 力量65str65...」这种角色名，现在能完整读出，中文和属性数值都不会丢。": "The symptom was binding failing outright with HTTP 500. All database connections now use tolerant decoding, trying UTF-8, then GB18030, GBK, Big5 and latin-1, and only replacing characters as a last resort. A card name like \"Bryana Marist (test character).st STR65str65...\" now reads back completely, with no loss of Chinese text or stat values.",
  "影响范围：绑定、角色查询、增量同步全部覆盖，不再因为个别历史数据卡死整个流程。": "This covers binding, character lookup and incremental sync, so a few legacy rows no longer stall the whole flow.",
  "QQ Webhook Gateway": "QQ Webhook Gateway",
  "QQ官方机器人Webhook部署网关": "Webhook deployment gateway for QQ official bots",
  "海豹骰子接 QQ 官方机器人 Webhook 的网关。": "A gateway for connecting SealDice to the QQ official bot Webhook.",
  "项目简介": "About this project",
  "QQ 官方的 WebSocket 模式有个绕不开的问题：会话大约每小时会被强制重连一次，重连的那几秒连接是断的，期间消息可能丢失。如果反复重连失败还会雪崩，出现长时间收不到消息的情况。": "The QQ official WebSocket mode has an unavoidable problem: the session is forcibly reconnected roughly once an hour, and during those seconds the connection is down, so messages may be lost. If reconnection keeps failing it can cascade, leaving the bot unable to receive messages for a long time.",
  "另外，官方被动回复有时效窗口，回复稍慢就会报「回复消息 msg_id 已过期」（错误码 40034005），表现出来就是后台已经生成了回复，QQ 里却发不出来。": "In addition, official passive replies have a time window. Reply a bit too slowly and you get \\\"reply message msg_id expired\\\" (error code 40034005). The symptom is that the bot already generated a reply, but nothing shows up in QQ.",
  "这个网关把链路切到 Webhook 模式，并且补上了海豹 1.6.1 缺少的部分。海豹自带的 Webhook 只做事件验签，没有实现 QQ 官方的 op=13 回调地址校验，所以直接在开放平台填海豹地址会提示「签名校验不通过」，保存不了。": "This gateway switches the link to Webhook mode and fills in what SealDice 1.6.1 is missing. SealDice's built-in Webhook only verifies event signatures; it does not implement the QQ official op=13 callback URL validation, so filling the SealDice address directly into the open platform returns \\\"signature check failed\\\" and cannot be saved.",
  "网关做的事情：": "What the gateway does:",
  "op=13 地址校验：按官方算法生成 plain_token + signature 应答，让后台能保存回调地址。": "op=13 URL validation: generates the plain_token + signature response using the official algorithm, so the platform accepts the callback URL.",
  "事件验签：校验 X-Signature-Ed25519，签名对象是 timestamp + body。": "Event signature check: verifies X-Signature-Ed25519, signed over timestamp + body.",
  "事件去重：同一个 event id 在 30 分钟内只转发一次，避免 QQ 重投导致一条指令回复多次。": "Event deduplication: the same event id is forwarded only once within 30 minutes, preventing QQ redelivery from making one command reply several times.",
  "先 ACK 再异步转发：QQ 不用等海豹处理完，重投和回复过期都会大幅减少。": "ACK first, then forward asynchronously: QQ does not wait for SealDice to finish, greatly reducing redelivery and expired replies.",
  "转发重试 + 并发限流：避免瞬间打满海豹的 accept 队列导致丢消息。": "Forward retries plus concurrency limiting: prevents flooding SealDice's accept queue and losing messages.",
  "架构": "Architecture",
  "如果海豹本身就跑在外网服务器上，可以省掉 frps 和 frpc，直接 Caddy 到网关再到海豹。": "If SealDice itself runs on the public server, you can skip frps and frpc: Caddy straight to the gateway, then to SealDice.",
  "下载": "Download",
  "直接下载（含 Caddy / frpc / 源码 / 文档）": "Download directly (includes Caddy / frpc / source / docs)",
  "包里有什么": "What is in the package",
  "QQWebhookGateway.exe：网关主程序，常驻运行。": "QQWebhookGateway.exe: the main gateway program, runs resident.",
  "QQWebhookVerify.exe：自检工具，一条命令验证 op=13 和去重。": "QQWebhookVerify.exe: self-check tool, verifies op=13 and deduplication in one command.",
  "QQWebhookLoadTest.exe：压力测试，模拟几百条消息并统计错误率。": "QQWebhookLoadTest.exe: load test, simulates hundreds of messages and reports the error rate.",
  "caddy.exe：HTTPS 服务器（Windows 版 v2.11.7）。": "caddy.exe: HTTPS server (Windows build v2.11.7).",
  "frpc.exe：隧道客户端，config 里启用时自动拉起。": "frpc.exe: tunnel client, launched automatically when enabled in config.",
  "config.json：配置文件，只需要改 AppSecret。": "config.json: the config file; only AppSecret needs changing.",
  "Caddyfile-示例.txt：5 种 Caddy 写法。": "Caddyfile-示例.txt: five Caddy configurations.",
  "部署方式 A / B / C：国内直连、外网服务器中转、Linux。": "Deployment A / B / C: domestic direct, public-server relay, Linux.",
  "source：三个程序的 Go 源码，Linux 版从这里编译。": "source: Go source for all three programs; build the Linux version from here.",
  "开始之前：准备一个域名": "Before you start: get a domain",
  "QQ 官方的网页回调只接受 HTTPS 地址，所以需要一个域名。两种办法，选一个：": "QQ official web callbacks only accept HTTPS addresses, so you need a domain. Two options, pick one:",
  "外网服务器加 Caddy（不用备案，推荐）：把域名解析到外网服务器，用 Caddy 自动签证书。": "Public server plus Caddy (no ICP filing needed, recommended): point the domain at the public server and let Caddy issue the certificate.",
  "国内买域名并备案：域名解析到跑海豹的那台服务器，直接用 Caddy。": "Buy a domestic domain and file it: point the domain at the SealDice server and use Caddy directly.",
  "免费域名也可以，例如 DuckDNS。Caddy 的写法都在「Caddyfile-示例.txt」里。": "Free domains work too, for example DuckDNS. All Caddy examples are in \\\"Caddyfile-示例.txt\\\".",
  "怎么选部署方式": "Which deployment to choose",
  "家里或国内服务器，没有备案域名，用方式 B（外网服务器中转）。": "Home or domestic server without a filed domain: use option B (public-server relay).",
  "国内服务器，已有备案域名，用方式 A（直连）。": "Domestic server with a filed domain: use option A (direct).",
  "海豹本来就跑在外网服务器上，用方式 A，并把 config.json 里 frp 关掉。": "SealDice already on the public server: use option A and turn frp off in config.json.",
  "海豹跑在 Linux 上，用方式 C，源码在 source 目录。": "SealDice on Linux: use option C, source is in the source folder.",
  "唯一必须改的配置": "The only required config change",
  "打开 config.json，只要改这一项：": "Open config.json and change just this one field:",
  "AppSecret 就在海豹目录 data/default/serve.yaml 里，找 appSecret 那一行，复制过来即可。": "AppSecret is in the SealDice data/default/serve.yaml file. Find the appSecret line and copy it over.",
  "不需要重新申请机器人，也不用填 QQ 号，用海豹里已有的 AppID 和 AppSecret 就够了。": "No need to apply for a new bot or fill in a QQ number; the AppID and AppSecret already in SealDice are enough.",
  "三步上手（方式 B：外网服务器中转）": "Three steps (option B: public-server relay)",
  "1. 外网服务器：装 frps 和 Caddy": "1. Public server: install frps and Caddy",
  "frps 只需要在外网服务器上装一次，之后不管你开多少个骰子都用同一个，不用再动它。它只做一件事：开 7000 端口等 frpc 连上来。": "frps only needs installing once on the public server. Afterwards any number of dice reuse it; you never touch it again. It does one thing: open port 7000 and wait for frpc to connect.",
  "Caddy 把域名转给隧道端口，端口要和 config.json 的 frp.remotePort 一致：": "Caddy forwards the domain to the tunnel port. This port must match frp.remotePort in config.json:",
  "2. 你的服务器：改海豹和 config.json": "2. Your server: edit SealDice and config.json",
  "海豹 data/default/serve.yaml 里找到官方 QQ 端点那段：": "In SealDice data/default/serve.yaml, find the official QQ endpoint section:",
  "重启海豹，日志出现这两行才算成功：": "Restart SealDice. It is only successful if these two lines appear in the log:",
  "config.json 里填隧道信息，网关启动时会自动把 frpc 一起拉起来：": "Fill the tunnel info into config.json. The gateway launches frpc automatically at startup:",
  "3. 填开放平台并自检": "3. Fill in the open platform and self-check",
  "回调地址填：": "Set the callback URL to:",
  "然后跑自检：": "Then run the self-check:",
  "期望看到：": "Expected output:",
  "含义是同一条事件发 3 次，网关只转发 1 次、拦下 2 次。": "This means the same event was sent 3 times, and the gateway forwarded it once and blocked twice.",
  "压力测试结果": "Load test results",
  "用 QQWebhookLoadTest.exe 模拟 500 条唯一事件加 20% 重复，三台实际部署的机器实测：": "Using QQWebhookLoadTest.exe to simulate 500 unique events plus 20% duplicates, measured on three real deployments:",
  "错误率 0%，转发数与唯一事件数完全一致。": "Error rate 0%, and the forwarded count exactly matches the unique event count.",
  "看运行状态": "Checking runtime status",
  "received：收到的请求总数。": "received: total requests received.",
  "validated：成功的 op=13 校验次数。": "validated: successful op=13 validations.",
  "acked：已回 ACK 的事件数。": "acked: events already ACKed.",
  "duplicates：被拦下的重复事件数。": "duplicates: duplicate events blocked.",
  "forwarded：实际转发给海豹的次数。": "forwarded: times actually forwarded to SealDice.",
  "failed：转发失败次数，应始终为 0。": "failed: forward failures, should always be 0.",
  "rejected：验签失败次数，应始终为 0。": "rejected: signature check failures, should always be 0.",
  "lastError：最近一次转发失败原因，正常时为空。": "lastError: reason for the last forward failure, empty when healthy.",
  "lastFwd：最近一次转发结果，正常是 200 OK。": "lastFwd: last forward result, normally 200 OK.",
  "常见问题": "FAQ",
  "后台保存提示「签名校验不通过」": "Saving the callback URL says \\\"signature check failed\\\"",
  "说明请求没走到网关。按顺序查：": "This means the request never reached the gateway. Check in order:",
  "网关在跑吗？浏览器打开 http://127.0.0.1:9092/health": "Is the gateway running? Open http://127.0.0.1:9092/health in a browser.",
  "公网能通吗？浏览器打开 https://你的域名/health": "Is the public path reachable? Open https://your-domain/health in a browser.",
  "Caddy 的端口和 config.json 的 frp.remotePort 对得上吗": "Do the Caddy port and frp.remotePort in config.json match?",
  "方式 B 还要看隧道连没连上，看网关目录下的 frpc.log": "For option B, also check whether the tunnel connected; look at frpc.log in the gateway folder.",
  "消息收不到": "Messages not arriving",
  "看海豹日志有没有「收到群的消息」。没有就说明消息没进来，查回调地址和隧道；有就说明消息进来了，是海豹那边的问题。": "Check the SealDice log for \\\"received group message\\\". If absent, the message never arrived: check the callback URL and tunnel. If present, the message did arrive and the problem is on the SealDice side.",
  "海豹回复了，但 QQ 里看不到": "SealDice replied but nothing shows in QQ",
  "这是出站问题，和本网关无关。常见原因是「回复消息 msg_id 已过期」（错误码 40034005），也就是回复太慢超过了 QQ 的被动回复有效期。本网关先 ACK 再转发，已经大幅降低这个概率。": "This is an outbound issue and unrelated to this gateway. The usual cause is \\\"reply message msg_id expired\\\" (error code 40034005), meaning the reply was too slow and exceeded QQ's passive reply window. This gateway ACKs first and forwards after, greatly reducing that probability.",
  "一条指令回复好几次": "One command replies several times",
  "本网关已按 event id 去重。若仍重复，检查是否有第二个程序也在收同一个 AppID 的回调，比如旧的 webhook 桥还开着；再检查是否同一个 QQ 号被两个骰子同时挂着；以及开放平台里回调地址是否只填了一个。": "This gateway already deduplicates by event id. If duplicates persist, check whether a second program is also receiving callbacks for the same AppID (for example an old webhook bridge still running), whether the same QQ number is held by two dice at once, and whether only one callback URL is set in the open platform.",
  "需要重新申请机器人密钥吗": "Do I need to apply for a new bot secret?",
  "不需要。用海豹里已有的 AppID 和 AppSecret 就行，它们本来就在 serve.yaml 里，不需要额外申请或登录。": "No. Just use the AppID and AppSecret already in SealDice; they are in serve.yaml and require no extra application or login.",
  "安全提醒": "Security notes",
  "appSecret 等同机器人密码，config.json 不要提交到公开仓库。": "appSecret is effectively the bot password; do not commit config.json to a public repository.",
  "网关只监听 127.0.0.1，公网访问一律走 Caddy 的 HTTPS。": "The gateway only listens on 127.0.0.1; all public access goes through Caddy over HTTPS.",
  "不要把 9092 端口直接暴露到公网。": "Do not expose port 9092 directly to the public internet.",
  "frp 的 token 也要用强口令。": "Use a strong password for the frp token as well.",
  "周边展示": "Peripheral displays",
  "拍立得 / 徽章 / 亚克力": "Polaroid / Badge / Acrylic",
  "文章": "Article",
  "DR SPT 与 DN SPT 相关作品": "DR SPT and DN SPT-related works",
  "DR Tenna 与 DN Tenna 相关作品": "DR Tenna and works related to DN Tenna",
  "Battat 相关作品": "Works related to Battat",
  "项目": "Project",
  "△ 三角符文相关": "△ Deltarune",
  "DELTARUNE Tenna 乙女游戏【施工中】": "DELTARUNE Tenna Otome Game [Under Construction]",
  "DNT桌宠": "DNT desktop pet",
  "Windows桌面宠物程序": "Windows desktop pet program",
  "SWAP SPAMTON桌宠": "SWAP SPAMTON: Table pet",
  "Windows桌面打字&手柄识别工具，含三角符文各种角色皮肤": "Windows desktop typing & controller recognition tool, includes various Deltarune character skins",
  "OpenQQ同步桥": "OpenQQ Sync Bridge",
  "SeaDice OpenQQ数据同步工具": "SeaDice OpenQQ data synchronization tool",
  "开放平台Webhook部署工具": "Open-platform Webhook deployment tool",
  "留言": "Leave a message",
  "留下你的留言": "Leave a message here",
  "发送": "Send it",
  "当前音乐：": "Current Music:",
  "未播放": "Not played",
  "Defernull Spamton 周边": "Around Defernull Spamton",
  "← 返回首页": "← Return to the homepage",
  "商品类型": "Product types",
  "拍立得": "Instant camera",
  "徽章": "Badge",
  "亚克力": "Acrylic",
  "周边": "Surroundings",
  "商品介绍": "Product introduction",
  "Defernull Spamton 相关周边展示。 包含拍立得、徽章、亚克力等商品。": "Defernull Spamton-related merchandise displays. Includes Instones, badges, acrylic, and other merchandise.",
  "购买链接": "Purchase link",
  "购买地址": "Purchase address",
  "Defernull Tenna 周边": "Around Defernull Tenna",
  "Defernull Tenna 相关周边展示。 包含拍立得、徽章、亚克力等商品。": "Defernull Tenna related merchandise displays. Includes instant cameras, badges, acrylic, and other merchandise.",
  "Summer Pinellia - 周边展示": "Summer Pinellia - Peripheral Display",
  "首页": "Home",
  "角色周边 · 作品展示 · 仅供参考": "Character merchandise · Artwork showcase · For reference only",
  "角色 A": "Role A",
  "这里填写角色介绍。 展示相关插画、徽章、亚克力、挂件等周边内容。": "Fill in the character introduction here. Display related illustrations, badges, acrylic, keychains, and other related merchandise.",
  "插画": "Illustrations",
  "查看详情 →": "View details →",
  "角色 B": "Role B",
  "这里填写角色介绍。 展示该角色相关创作和周边记录。": "Fill in the character introduction here. Display the character's related creations and related records.",
  "挂件": "Pendants",
  "明信片": "Postcards",
  "周边套装": "Peripheral sets",
  "角色 C": "Role C",
  "这里填写角色介绍。 可以放角色故事以及制作过程。": "Fill in the character introduction here. You can include the character story and the production process.",
  "手办": "Figurines",
  "收藏": "Collection",
  "⚠️ 本页面展示内容仅供参考， 图片为个人创作及周边展示。": "⚠️ The content displayed on this page is for reference only; the images are personal creations and merchandise displays.",
  "Deltarune Spamton 周边": "Around Deltarune Spamton",
  "Deltarune Spamton 相关周边展示。 包含拍立得、徽章、亚克力等商品。": "Display of Deltarune Spamton-related merchandise. Includes Polaroids, badges, acrylic, and other merchandise.",
  "Deltarune Tenna 周边": "Around Deltarune Tenna",
  "Deltarune Tenna 相关周边展示。 包含拍立得、徽章、亚克力等商品。": "Display of Deltarune Tenna related merchandise. Includes instant cameras, badges, acrylic, and other merchandise.",
  "Deltarune tenna乙女游戏-Arventuerror": "Deltarune Tenna Otome Game - Arventuerror",
  "游戏简介": "Game Introduction",
  "你只是普普通通地睡了一觉……大概，为什么就突然来到了一个电视人做的所谓的bug齐出的游戏当中？！身为勇者的你，正式开始自己的冒险旅程吧！": "You just had an ordinary nap...... Maybe why did you suddenly find yourself in a game full of bugs made by a TV personality?! As a hero, now officially begin your adventure!",
  "当然，比起那些，似乎这个游戏的制作人，tenna先生，更想和你玩一个恋爱游戏……": "Of course, compared to those, it seems the game's producer, Mr. Tenna, would rather play a romance game with you......",
  "观前提示": "Pre-viewing reminder",
  "作者对于Tenna的性格有自己的理解，ooc致歉，如有不适请退出；游戏尽量保证了选项的自由度，但本作以视觉小说为主，不能保证全部的自由。": "The author has their own understanding of Tenna's personality. OOC apologizes, and if you feel uncomfortable, please exit. The game strives to allow freedom in choices, but since it is mainly a visual novel, it cannot guarantee full freedom.",
  "本作女主角，也就是你，会开口说话，稍微有属于自己的性格。除此以外，本作包含yn和Tenna的心理活动，如有不适请勿游玩": "The heroine, that is, you, can speak and has a bit of her own personality. In addition, the game includes the psychological activities of yn and Tenna. If you feel unwell, please do not play",
  "本作参考为terrorbane和icey，剧情有部分相似之处。此外，本作有且仅有yn和Tenna的恋爱乙女路线。撰写本作剧本的作者笔力有限，笔力心力止步于此，诸多不足之处还望海涵，如在观看中有所不适请及时退出。": "This work is referenced by Terrorbane and Icey, and there are some similarities in the story. Additionally, the story has and only features the otome romance route between yn and Tenna. The author of this script has limited writing skills, and their writing and dedication stop there. We hope you will forgive any shortcomings, and if you experience any discomfort while watching, please exit promptly.",
  "下载": "Download",
  "施工中": "Under construction",
  "项目简介": "Project Overview",
  "DNT桌宠是一款 Windows 桌面宠物程序。 支持桌面互动、语音、提醒、便签、新闻、外观切换等功能。": "DNT Desktop Pet is a Windows desktop pet program. It supports desktop interaction, voice commands, reminders, notes, news, and appearance switching.",
  "使用说明": "Instructions for use",
  "左键点击桌宠可以进行互动和显示对话。 右键点击桌宠可以打开菜单以及退出程序。 控制面板、新闻界面、便签界面同样可以通过右键退出。": "Left-clicking on a desk pet lets you interact and display conversations. Right-clicking on a desk pet opens menus and exits programs. You can also exit the Control Panel, News screen, and Notes interface with a right click.",
  "支持中英文切换。 如果不需要互动功能，可以暂停、隐藏桌宠， 或者关闭自动对话。 关闭自动对话后，会停止时间间隔对话以及点击桌宠触发的对话。": "Supports switching between Chinese and English. If you don't need the interactive feature, you can pause, hide your table pet, or turn off automatic conversation. After turning off automatic chat, it will stop time-interval conversations and conversations triggered by clicking on table pets.",
  "支持调节桌宠音量，也可以关闭声音。 固定时间会有喝水、吃饭、睡觉提醒。 支持 Windows 开机自启动。 右键菜单中的便签功能可以记录日常灵感或重要事件。": "Supports adjusting the volume of your desktop pet and also turning off sound. There are reminders for drinking, eating, and sleeping at fixed times. Supports Windows startup on startup. The sticky note feature in the right-click menu lets you record daily inspirations or important events.",
  "右键可以切换桌宠形态。 形态 2 拥有 7 套服装。 按住 Ctrl 并滚动鼠标滚轮，可以调整桌宠大小。": "Right-click to switch the table pet form. Form 2 has 7 outfits. Hold Ctrl and scroll the mouse wheel to adjust the table pet size.",
  "直接下载": "Download directly",
  "百度云网盘链接": "Baidu Cloud Link",
  "使用提示": "Usage tips",
  "下载压缩包后解压， 直接双击 desktoppet.exe 即可使用。": "After downloading the compressed package, extract it, then double-click desktoppet.exe to use.",
  "如果下载后无法打开， 或者打开后立即关闭， 请检查 Windows 安全中心和防火墙是否允许该软件运行。 大概率是被防火墙拦截。": "If you cannot open after downloading, or close immediately after opening, check whether Windows Security Center and the firewall allow the software to run. Most likely, it is blocked by the firewall.",
  "OpenQQ Bridge 是用于 SeaDice 与 OpenQQ 身份兼容的数据桥接工具。 用于解决 OpenQQ 平台身份变化后， 原有角色卡、属性数据以及日志数据无法直接读取的问题。 支持旧 QQ 数据绑定到当前 OpenQQ 身份， 实现数据兼容读取。": "OpenQQ Bridge is a data bridging tool for SeaDice and OpenQQ identity compatibility. It solves the problem where original role cards, attribute data, and log data cannot be directly read after OpenQQ platform identity changes. Supports binding old QQ data to current OpenQQ identities to enable compatible data reading.",
  "本版支持：": "This version supports:",
  "多 SeaDice 实例分别配置 Bridge 端口。": "Multiple SeaDice instances are configured separately with Bridge ports.",
  "在 SeaDice 插件配置页面填写发件邮箱、SMTP 授权码、SMTP 服务器和端口。": "On the SeaDice plugin configuration page, enter the sender email, SMTP authorization code, SMTP server, and port.",
  ".旧QQ邮箱测试：向配置中的发件邮箱发送测试邮件。": ".Old QQ Email Test: Send test emails to the configured sending email.",
  ".旧QQ绑定": ".Old QQ binding",
  "：自动向": ": Automatic",
  "@qq.com 发送 6 位验证码。": "@qq.com sends a 6-bit verification code.",
  ".旧QQ验证码": ".Old QQ verification codes",
  "：验证成功后才执行数据迁移。 验证码 5 分钟有效，最多错误 5 次。": ": Data migration is only performed after successful verification. Verification codes are valid for 5 minutes and can be incorrect up to 5 times.",
  "绑定身份是「旧QQ + 旧群 + OpenQQ账号 + 目标群」。同一个旧QQ可以绑到多个不同的OpenQQ账号，换账号不需要先解绑；只有完全相同的组合重复绑定才会被拒绝。": "The binding identity is (old QQ + old group + OpenQQ account + target group). One old QQ may bind to several different OpenQQ accounts, and switching accounts does not require unbinding first; only re-binding the exact same combination is rejected.",
  "使用方式： 双击启动openqq.exe，然后保持运行，不能关闭": "How to use: Double-click to start openqq.exe, then keep running; do not close it",
  "在目标QQ 群执行： 如 .旧QQ绑定 2522629086 1081354778，也就是格式是： .旧QQ绑定": "Execute in the target QQ group: For example, .Old QQ binding 2522629086 1081354778, i.e., format: .Old QQ binding",
  "，后bot会朝你使用账号的QQ号@qq.com发送验证码邮件，输入 .旧QQ验证码+6位数字 即可完成绑定。": ", after which the bot sends a verification-code email to <old QQ>@qq.com. Enter .旧QQ验证码 plus the 6-digit code to complete the binding.",
  "同一个旧QQ可以分别绑到多个不同的OpenQQ账号，不用先解绑；只有完全相同的组合重复绑定才会失败。": "One old QQ can be bound to several different OpenQQ accounts, with no need to unbind first; only re-binding the exact same combination fails.",
  "QQ号+群号可用于多群进行绑定查询log。": "The QQ number + group number can be used to look up logs bound in multiple groups.",
  "绑定完成后再执行： .st或者。pc或者。log，先前的log可通过log get+名字取出。": "After binding is complete, run: .st or. pc or. log. The previous log can be retrieved using log get+name.",
  "百度云链接": "Baidu Cloud Link",
  "注意： - 插件配置中的“SMTP授权码”不是邮箱登录密码。 - QQ邮箱通常使用 smtp.qq.com:465，并使用 SMTP 授权码。 - 测试邮件会发送到你填写的“发件邮箱”本身。 - bridge_port.txt 与 EXE 放在同步桥目录中；EXE 默认读取其中的端口。 - email_config.json 仅作为兼容/手工启动备用配置，本版正常使用时由 SeaDice 插件配置向 Bridge 临时下发邮箱配置。": "Note: - The \"SMTP authorization code\" in the plugin configuration is not the mailbox login password. - QQ Mail usually uses smtp.qq.com:465 and uses SMTP authorization codes. - Test emails will be sent directly to the \"sending email\" you provided. - bridge_port.txt and EXE are placed in the synchronized bridge directory; EXE reads the ports within by default. - email_config.json Only as a backup/manual boot configuration; in this version, the SeaDice plugin configuration temporarily sends emails to Bridge.",
  "不要在干净备份上直接测试 .st；干净备份里的角色仍属于旧 QQ，OpenQQ 官 bot 不会自动显示它。": "Do not directly test .st on clean backups; The role in clean backups still belongs to the old QQ, and the OpenQQ official bot will not display it automatically.",
  "TIPS：因为文件只读取海豹的data和datalog的db文件，所以有的角色卡可能会在转换以后出现丢失情况，比如出现空角色卡，或者log绑定失败，大部分是因为数据库出现了问题，可用原始备份的data和datalog的db文件进行替换再删除相应的后缀为wal和shm的文件，海豹再度启动会自动生成相应的wal和shm干净文件。data文件会在数据转换前进行备份，后缀是beforexxxx": "TIPS: Since the files only read Seal's data and datalog DB files, some character cards may be lost after conversion, such as empty character cards or log binding failures. Most of these are due to database issues. You can use the original backup data and datalog DB files to replace them and delete the files with wal and shm extensions. Seal will automatically generate clean wal and shm files when you restart them. Data files are backed up before data conversion, with the extension beforexxxx",
  "如十分必要可以来找骰主尝试找回数据。把data和datalog整理读取后可以得到对应的角色卡文件，只要存在过。": "If absolutely necessary, you can try to find the dice owner to retrieve the data. After organizing and reading the data and datalog, you can obtain the corresponding character card files, as long as they exist.",
  "这版插件是AI写的代码，不能保证不会出现其他的bug，除此以外，尚未验证过该插件同步的log数据是否能继续记录日志。": "This plugin is AI-written code and cannot guarantee that other bugs will not appear. Besides that, it has not been verified whether the logs synchronized by the plugin can continue to be logged.",
  "本工具用于为开放平台机器人后台回调提供稳定的 Webhook 地址。 通过 Caddy 提供 HTTPS 反向代理， 配合 FRP 内网穿透， 解决本地服务器无法直接提供公网 HTTPS 回调地址的问题。": "This tool provides stable Webhook addresses for backend callbacks of open platform bots. Provides HTTPS reverse proxy via Caddy, combined with FRP intranet traversal, solving the problem that local servers cannot directly provide public HTTPS callback addresses.",
  "使用场景": "Usage scenarios",
  "适用于：": "Suitable for:",
  "没有公网 IP 的机器人服务器": "Bot servers without public IPs",
  "本地运行机器人程序，需要公网 Webhook 地址": "Running the bot locally requires a public webhook address",
  "不希望购买国内备案域名的用户": "Users who do not wish to purchase domestic registered domain names",
  "需要长期稳定回调地址的开放平台机器人": "Open platform bots that require long-term, stable callback addresses",
  "部署方式": "Deployment methods",
  "方案 A：拥有国内域名": "Option A: Own a domestic domain name",
  "如果拥有已经备案的国内域名， 可以直接部署。 下载工具包后：": "If you already have a registered domestic domain, you can deploy it directly. After downloading the toolkit:",
  "修改 Caddyfile": "Modify the Caddyfile",
  "修改 config/bots 文件": "Modify the config/bots file",
  "填写机器人 AppID 和 Secret": "Fill in the bot's App ID and Secret",
  "启动服务即可": "Just start the service",
  "其中 bots 文件需要填写开放平台机器人的身份信息。 Caddyfile 用于配置 HTTPS 域名以及反向代理规则。": "The bots file requires the identity information of the open platform bot. Caddyfile is used to configure HTTPS domain names and reverse proxy rules.",
  "方案 B：没有国内域名": "Option B: No domestic domain name",
  "可以租用国外云服务器。 推荐：": "You can rent foreign cloud servers. Recommended:",
  "日本节点 VPS（延迟较低）": "Japan Node VPS (Low Latency)",
  "Linux 系统": "Linux system",
  "安装 Caddy + FRP": "Install Caddy + FRP",
  "服务器端负责：": "The server side is responsible for:",
  "绑定公网域名": "Bind a public domain name",
  "提供 HTTPS": "HTTPS is provided",
  "转发 Webhook 请求": "Forwarding Webhook requests",
  "本地服务器负责：": "Local servers are responsible for:",
  "运行机器人程序": "Run the robot program",
  "运行 frpc": "Run frpc",
  "保持与 VPS 的连接": "Stay connected to the VPS",
  "Linux 部署流程": "Linux deployment process",
  "1. 更新系统": "1. Update the system",
  "2. 安装基础工具": "2. Install basic tools",
  "3. 安装 Caddy": "3. Install Caddy",
  "4. 编辑 Caddy 配置": "4. Edit the Caddy configuration",
  "示例：": "Example:",
  "保存：": "Save:",
  "重载：": "Overload:",
  "5. 安装 FRP": "5. Install the FRP",
  "下载对应 Linux 架构版本：": "Download the corresponding Linux architecture version:",
  "解压：": "Extraction:",
  "进入目录：": "Enter the table of contents:",
  "启动：": "Launch:",
  "FRP 支持将内网服务通过公网服务器转发出去，常用于没有公网 IP 的场景。:contentReference[oaicite:2]{index=2}": "FRP supports forwarding intranet services through public servers, commonly used in scenarios without public IPs. :contentReference[oaicite:2]{index=2}",
  "配置文件修改": "Configuration file modification",
  "修改：": "Modification:",
  "appid=你的机器人appid secret=你的机器人secret": "appid = your robot appid secret = your robot secret",
  "替换成开放平台提供的信息。": "Replace information provided by open platforms.",
  "修改域名：": "Modify domain:",
  "修改代理端口：": "Modify proxy port:",
  "127.0.0.1:你的监听端口": "127.0.0.1: Your listening port",
  "[common] server_addr = VPS地址 server_port = 7000 [openqq] type = http local_ip = 127.0.0.1 local_port = 你的机器人端口 custom_domains = your-domain.com": "[common] server_addr = VPS address server_port = 7000 [openqq] type = http local_ip = 127.0.0.1 local_port = Your bot port custom_domains = your-domain.com",
  "启动检查": "Start check",
  "查看 Caddy：": "View Caddy:",
  "查看 FRP：": "View FRP:",
  "SWAP SPAMTON 桌宠": "SWAP SPAMTON Desktop Pet",
  "SWAPSPAMTON windows电脑桌宠": "SWAPSPAMTON Windows PC Desktop Pet",
  "SWAP SPAMTON桌宠是一款 Windows 桌面宠物程序。 支持桌面互动、语音、提醒、便签、商店、小游戏等功能。": "SWAP SPAMTON Desktop Pet is a Windows desktop pet program. It supports desktop interaction, voice, reminders, notes, store, mini-games, and other features.",
  "左键点击桌宠可以进行互动和显示对话。 右键点击桌宠可以打开菜单以及退出程序。 控制面板、商店界面、便签界面同样可以通过右键退出。": "Left-click on the desktop pet to interact and display dialogue. Right-click on the pet to open the menu and exit the program. The control panel, store interface, and note interface can also be exited via right-click.",
  "点击小游戏可自行游玩多种已配置完毕的游戏。 按住 Ctrl 并滚动鼠标滚轮，可以调整桌宠大小。": "Click on mini-games to play various pre-configured games. Hold Ctrl and scroll the mouse wheel to adjust the size of the desktop pet.",
  "百度云网盘链接 暂无": "Baidu Cloud link: Not available",
  "下载压缩包后解压， 直接双击SPT-DeskPet.exe即可使用。": "After downloading the compressed package, unzip it and double-click SPT-DeskPet.exe to use.",
  "Windows桌面打字&手柄识别工具，含三角符文各种角色皮肤 工具是x发布的compet的补丁包，compet原软件链接：https://github.com/morningmeal/morningmeal_ComPet": "Windows desktop typing & gamepad recognition tool, including various Deltarune character skins. The tool is the patch package for ComPet released by x, original software link: https://github.com/morningmeal/morningmeal_ComPet",
  "该补丁包支持手柄识别以及游戏时候的按键和手柄识别，理论上其他打字桌宠可通用（如果是py代码版本的）": "This patch package supports gamepad recognition and key/gamepad recognition during gameplay. In theory, it can be used with other typing desktop pets (if it is a py code version).",
  "gamepad-package.exe解压后文件夹中数十个文件需要放置到和桌宠软件exe同目录下。该补丁针对软件名，只能使用compet.exe该软件名。": "After unzipping gamepad-package.exe, dozens of files in the folder need to be placed in the same directory as the desktop pet software exe. This patch is specific to the software name and can only be used with compet.exe.",
  "使用的时候请首先按下gamepadsetting.bat来配置手柄按键，目前按键键位按照xbox手柄键位书写。而后按下start.vbs进行启动。": "When using, first press gamepadsetting.bat to configure the gamepad keys; the current key mapping follows Xbox controller layout. Then press start.vbs to launch.",
  "ggdw为swapspamton的皮肤包。addispam为ads时期spamton的皮肤包，big shot是dr的bs时期皮肤包，spt是dr spamton的皮肤，neo是dr的spamton neo皮肤包，hot shot是defernull hot shot的皮肤包。dns是dfn spt的皮肤包，dn sneo是defernull的spamton neo的皮肤包，dnt为defernull tenna的皮肤包，swaptenna是swapspamtenna au的tenna的皮肤包": "ggdw is the skin pack for SwapSpamton. addispam is the skin pack for the Ads era Spamton, big shot is the skin pack for DR’s BS era, spt is the skin pack for DR Spamton, neo is the skin pack for DR’s Spamton NEO, hot shot is the skin pack for Defernull Hot Shot. dns is the skin pack for DFN SPT, dn sneo is the skin pack for Defernull Spamton NEO, dnt is the skin pack for Defernull Tenna, swaptenna is the skin pack for Tenna from the SwapTenna AU.",
  "解压后即可导入图片使用，如软件支持zip导入，也可直接导入。": "After unzipping, images can be imported and used. If the software supports zip import, it can also be imported directly.",
  "config.json中可以查看各个桌宠的按键配置规范，f18-f24和上下左右按键等为原本配置的手柄键位。": "In config.json, you can check the key configuration specifications of each desktop pet. F18-F24 and arrow keys, etc., are originally configured gamepad keys.",
  "不支持开机自启，需要自启请自行将start.vbs添加到开机自启的注册表中。": "Does not support startup on boot; for auto-start, please add start.vbs to the startup registry manually.",
  "下载手柄按键补丁包": "Download gamepad key patch package",
  "spamton相关皮肤包": "Spamton-related skin packs",
  "下载addispam皮肤包": "Download addispam skin pack",
  "下载swapspamton皮肤包": "Download swapspamton skin pack",
  "下载dr big shot皮肤包": "Download DR big shot skin pack",
  "下载spt皮肤包": "Download spt skin pack",
  "下载hot shot皮肤包": "Download hot shot skin pack",
  "下载dr spamton neo皮肤包": "Download DR Spamton NEO skin pack",
  "下载dns皮肤包": "Download dns skin pack",
  "下载dn sneo皮肤包": "Download dn sneo skin pack",
  "下载swaptenna皮肤包": "Download swaptenna skin pack",
  "tenna相关皮肤包": "Tenna-related skin packs",
  "下载dfntn皮肤包": "Download dfntn skin pack",
  "其他链接": "Other links",
  "搜索文章...": "Search articles...",
  "搜索...": "Search...",
  "搜索文章": "Search articles",
  "SMTP 授权码怎么填": "How to get the SMTP authorization code",
  "验证码是桥用你填的「发件邮箱」发出去的，所以这个邮箱必须先开通 SMTP 并生成授权码。": "The bridge sends the verification code from the \"sender email\" you configure, so that mailbox must have SMTP enabled and an authorization code generated.",
  "授权码属于【发件邮箱】，收验证码的 旧QQ号@qq.com 什么都不用设置。": "The authorization code belongs to the SENDER mailbox. The <old QQ>@qq.com mailbox that receives the code needs no setup at all.",
                        "8. 保存后在群里发 .旧QQ邮箱测试 ，能收到测试邮件就说明配好了。": "8. Save, then send .旧QQ邮箱测试 in the group. If the test email arrives, the setup is correct.",
  "容易踩的坑：填成 QQ 登录密码一定失败；授权码里的空格要去掉；忘了授权码可以回到第 4 步点「生成授权码」重新生成（旧的会失效）；改过 QQ 密码后授权码通常也会失效；同一个发件邮箱可以给多个海豹实例共用；收不到邮件时让对方检查 QQ 邮箱的「设置 → 反垃圾」，必要时把发件邮箱加进白名单。": "Common pitfalls: using the QQ login password always fails; remove the spaces from the authorization code; if you lose the code, go back to step 4 and click \"Generate authorization code\" again (the old one stops working); the code usually also stops working after you change your QQ password; one sender mailbox can be shared by several SealDice instances; if mail does not arrive, ask the recipient to check Settings -> Anti-spam in their QQ mailbox and whitelist the sender if needed.",
  "1. 电脑浏览器打开 https://mail.qq.com ，登录你要当发件箱的 QQ 邮箱 2. 左上角 设置 → 账号（有的版本叫「账户」） 3. 往下找到「POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务」 4. 在「IMAP/SMTP服务」那一行点【开启】（开 POP3/SMTP 也行，两个开一个就够） 5. 按提示用绑定手机发一条短信，发完点「我已发送」 6. 通过后会显示一串 16 位授权码，形如 abcd efgh ijkl mnop，只显示这一次，先复制下来 7. 回到插件配置填写：": "1. Open https://mail.qq.com in a desktop browser and sign in to the QQ mailbox you want to use as the sender. 2. Top-left Settings -> Account. 3. Scroll down to POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV services. 4. On the IMAP/SMTP service row click Enable (POP3/SMTP also works; one is enough). 5. Follow the prompt to send an SMS from your bound phone, then click I have sent it. 6. On success a 16-character authorization code appears, e.g. abcd efgh ijkl mnop. It is shown only once, so copy it now. 7. Go back to the plugin configuration and fill in:",
  "发件邮箱 → 你刚才登录的那个邮箱，如 123456@qq.com SMTP授权码 → 那 16 位，【去掉空格】，变成 abcdefghijklmnop SMTP服务器 → smtp.qq.com（不用改） SMTP端口 → 465（不用改）": "Sender email -> the mailbox you just signed in to, e.g. 123456@qq.com. SMTP authorization code -> the 16 characters with spaces removed, e.g. abcdefghijklmnop. SMTP server -> smtp.qq.com (no change). SMTP port -> 465 (no change).",
};
  var LANGS = {
  "zh": {
    "label": "中文",
    "html_lang": "zh-CN",
    "placeholder_search": "搜索..."
  },
  "en": {
    "label": "English",
    "html_lang": "en",
    "placeholder_search": "Search..."
  }
};

  function norm(s) { return String(s || "").replace(/\s+/g, " ").trim(); }

  function current() {
    var v = localStorage.getItem("lang");
    return v === "en" ? "en" : "zh";
  }

  function collectTextNodes() {
    var out = [];
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var t = p.nodeName.toLowerCase();
        if (t === "script" || t === "style") return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = w.nextNode())) out.push(n);
    return out;
  }

  function apply(lang) {
    // --- text nodes ---
    collectTextNodes().forEach(function (node) {
      if (node.__zh === undefined) node.__zh = node.nodeValue;
      var orig = node.__zh;
      if (lang === "en") {
        var en = DICT[norm(orig)];
        if (en) node.nodeValue = en;
      } else {
        node.nodeValue = orig;
      }
    });

    // --- placeholders ---
    Array.prototype.forEach.call(document.querySelectorAll("[placeholder]"), function (el) {
      if (el.__zhPh === undefined) el.__zhPh = el.getAttribute("placeholder");
      var ph = el.__zhPh;
      if (lang === "en") {
        var en = DICT[norm(ph)];
        el.setAttribute("placeholder", en || ph);
      } else {
        el.setAttribute("placeholder", ph);
      }
    });

    // --- internal links (zh <-> en article trees) ---
    Array.prototype.forEach.call(document.querySelectorAll("a[href]"), function (a) {
      if (a.__zhHref === undefined) a.__zhHref = a.getAttribute("href");
      var h = a.__zhHref;
      if (!h) return;
      if (lang === "en") {
        if (h.indexOf("articles/zh/") !== -1) {
          a.setAttribute("href", h.replace("articles/zh/", "articles/en/"));
        }
      } else {
        a.setAttribute("href", h);
      }
    });

    // --- title ---
    if (document.__zhTitle === undefined) document.__zhTitle = document.title;
    if (lang === "en") {
      var t = DICT[norm(document.__zhTitle)];
      document.title = t || document.__zhTitle;
    } else {
      document.title = document.__zhTitle;
    }

    // --- html lang ---
    document.documentElement.lang = LANGS[lang].html_lang;

    // --- search index follows language ---
    if (typeof window.reloadSearchData === "function") {
      try { window.reloadSearchData(); } catch (e) {}
    }

    // --- button state ---
    var btn = document.getElementById("lang-btn");
    if (btn) {
      // 只显示“将要切换到的语言”，与文章页一致
      if (lang === "en") {
        btn.textContent = "中文";
        btn.setAttribute("title", "切换到中文");
      } else {
        btn.textContent = "EN";
        btn.setAttribute("title", "Switch to English");
      }
    }
  }

  window.switchLang = function () {
    var next = current() === "zh" ? "en" : "zh";
    localStorage.setItem("lang", next);
    apply(next);
  };

  function boot() {
    if (document.querySelector(".search-box")) {
      document.body.classList.add("has-search");
    }
    apply(current());
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
