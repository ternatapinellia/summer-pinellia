/* Language switcher: 中文 / English (in-place text swap) */
(function () {
  var DICT = {
  "周边展示": "Peripheral displays",
  "拍立得 / 徽章 / 亚克力": "Polaroid / Badge / Acrylic",
  "文章": "Article",
  "DR SPT 与 DN SPT 相关作品": "DR SPT and DN SPT-related works",
  "DR Tenna 与 DN Tenna 相关作品": "DR Tenna and works related to DN Tenna",
  "Battat 相关作品": "Works related to Batat",
  "项目": "Project",
  "△ 三角符文相关": "△ Triangular runes related",
  "DELTARUNE Tenna 乙女游戏【施工中】": "DELTARUNE Tenna Otome Game [Under Construction]",
  "DNT桌宠": "DNT desktop pet",
  "Windows桌面宠物程序": "Windows desktop pet program",
  "SWAP SPAMTON桌宠": "SWAP SPAMTON: Table pet",
  "Windows桌面打字&手柄识别工具，含三角符文各种角色皮肤": "Windows desktop typing and controller recognition tool, includes various character skins with triangular runes",
  "OpenQQ同步桥": "OpenQQ Sync Bridge",
  "SeaDice OpenQQ数据同步工具": "SeaDice OpenQQ data synchronization tool",
  "开放平台Webhook部署工具": "Open-platform Webhook deployment tool",
  "留言": "Leave a message",
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
  ".旧QQ+旧群已绑定其他 OpenQQ 身份时拒绝再次绑定。": ". If the old QQ + old group has already bound another OpenQQ identity, refuse to bind again.",
  "使用方式： 双击启动openqq.exe，然后保持运行，不能关闭": "How to use: Double-click to start openqq.exe, then keep running; do not close it",
  "在目标QQ 群执行： 如 .旧QQ绑定 2522629086 1081354778，也就是格式是： .旧QQ绑定": "Execute in the target QQ group: For example, .Old QQ binding 2522629086 1081354778, i.e., format: .Old QQ binding",
  "，后bot会朝你使用账号的QQ号@qq.com发送验证码邮件，输入。旧QQ验证码+6位数字的验证码后可绑定。再次绑定该群号和QQ账号会失败，仅限单次数绑定。QQ号+群号可用于多群进行绑定查询log。": ", after which the bot will send a verification code email to the QQ number @qq.com you use for your account. Enter it. After the old QQ verification code + 6-digit verification code, you can bind it. Binding the group number and QQ account again will fail; binding is limited to a single attempt. QQ number + group number can be used for binding logs in multiple groups.",
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
  "Windows桌面打字&手柄识别工具，含三角符文各种角色皮肤 工具是x发布的compet的补丁包，compet原软件链接：https://github.com/morningmeal/morningmeal_ComPet": "Windows desktop typing & gamepad recognition tool, including triangular runes and various character skins. The tool is the patch package for ComPet released by x, original software link: https://github.com/morningmeal/morningmeal_ComPet",
  "该补丁包支持手柄识别以及游戏时候的按键和手柄识别，理论上其他打字桌宠可通用（如果是py代码版本的）": "This patch package supports gamepad recognition and key/gamepad recognition during gameplay. In theory, it can be used with other typing desktop pets (if it is a py code version).",
  "gamepad-package.exe解压后文件夹中数十个文件需要放置到和桌宠软件exe同目录下。该补丁针对软件名，只能使用compet.exe该软件名。": "After unzipping gamepad-package.exe, dozens of files in the folder need to be placed in the same directory as the desktop pet software exe. This patch is specific to the software name and can only be used with compet.exe.",
  "使用的时候请首先按下gamepadsetting.bat来配置手柄按键，目前按键键位按照xbox手柄键位书写。而后按下start.vbs进行启动。": "When using, first press gamepadsetting.bat to configure the gamepad keys; the current key mapping follows Xbox controller layout. Then press start.vbs to launch.",
  "ggdw为swapspamton的皮肤包。addispam为ads时期spamton的皮肤包，dnt为defernull tenna的皮肤包，big shot是dr的bs时期皮肤包。": "ggdw is the skin pack for SwapSpamton. addispam is the skin pack for the Ads era Spamton, dnt is the skin pack for Defernull Tenna, big shot is the skin pack for DR’s BS era.",
  "解压后即可导入图片使用，如软件支持zip导入，也可直接导入。": "After unzipping, images can be imported and used. If the software supports zip import, it can also be imported directly.",
  "config.json中可以查看各个桌宠的按键配置规范，f18-f24和上下左右按键等为原本配置的手柄键位。": "In config.json, you can check the key configuration specifications of each desktop pet. F18-F24 and arrow keys, etc., are originally configured gamepad keys.",
  "不支持开机自启，需要自启请自行将start.vbs添加到开机自启的注册表中。": "Does not support startup on boot; for auto-start, please add start.vbs to the startup registry manually.",
  "下载手柄按键补丁包": "Download gamepad key patch package",
  "spamton相关皮肤包": "Spamton-related skin packs",
  "下载addispam皮肤包": "Download addispam skin pack",
  "下载swapspamton皮肤包": "Download swapspamton skin pack",
  "下载dr big shot皮肤包": "Download DR big shot skin pack",
  "tenna相关皮肤包": "Tenna-related skin packs",
  "下载dfntn皮肤包": "Download dfntn skin pack",
  "其他链接": "Other links"
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
      Array.prototype.forEach.call(btn.querySelectorAll("[data-lang]"), function (sp) {
        if (sp.getAttribute("data-lang") === lang) sp.className = "active";
        else sp.className = "";
      });
    }
  }

  window.switchLang = function () {
    var next = current() === "zh" ? "en" : "zh";
    localStorage.setItem("lang", next);
    apply(next);
  };

  function boot() { apply(current()); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
