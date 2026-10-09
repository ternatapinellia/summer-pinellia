let searchData = [];
let indexReady = false;


// ==========================
// 站点根路径（兼容 file:// 与 GitHub Pages 子目录）
// ==========================

function basePath() {

    // 用 search.js 自身的 URL 反推站点根目录
    // 兼容：「search.js?v=4」这种无前缀写法，和「../../../search.js」这种相对路径

    var ss = document.querySelectorAll("script[src]");
    for (var i = 0; i < ss.length; i++) {
        var raw = ss[i].getAttribute("src") || "";
        if (!/search\.js(\?|#|$)/.test(raw)) continue;
        try {
            var u = new URL(raw, window.location.href);
            var path = u.pathname;
            return path.substring(0, path.lastIndexOf("/") + 1);
        } catch (e) {
            // 继续找下一个
        }
    }

    // 兜底：当前页面所在目录
    var m = window.location.pathname.match(/^(.*\/)[^\/]*$/);
    return m ? m[1] : "/";
}


function langName() {
    return localStorage.getItem("lang") === "en" ? "en" : "zh";
}


// ==========================
// 加载索引：优先当前语言，其次通用
// ==========================

async function fetchJson(url) {
    var r = await fetch(url);
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.json();
}


async function loadSearchData() {

    var base = basePath();
    var lang = langName();

    var candidates = [
        base + "search_" + lang + ".json",
        base + "search.json",
        "/search_" + lang + ".json",
        "/search.json"
    ];

    for (var i = 0; i < candidates.length; i++) {
        try {
            searchData = await fetchJson(candidates[i]);
            if (Array.isArray(searchData) && searchData.length) {
                indexReady = true;
                console.log("搜索索引已加载:", candidates[i], searchData.length, "条");
                return;
            }
        } catch (e) {
            // 试下一个
        }
    }

    indexReady = false;
    console.log("搜索索引加载失败：本地直接打开(file://)时无法读取索引，请用本地服务器或部署后再试");
}


// ==========================
// 搜索
// ==========================

function doSearch() {

    var box = document.getElementById("site-search");
    var resultBox = document.getElementById("searchResult");
    if (!box || !resultBox) return;

    var keyword = box.value.trim().toLowerCase();
    resultBox.innerHTML = "";

    if (keyword === "") {
        resultBox.style.display = "none";
        return;
    }

    resultBox.style.display = "block";

    if (!indexReady) {
        var isEn = langName() === "en";
        resultBox.innerHTML = '<div class="search-item">' +
            (isEn ? "Search index not loaded yet." : "搜索索引尚未加载完成。") +
            '</div>';
        return;
    }

    var results = searchData.filter(function (item) {
        var title = (item.title || "").toLowerCase();
        var content = (item.content || "").toLowerCase();
        return title.indexOf(keyword) !== -1 || content.indexOf(keyword) !== -1;
    });

    if (results.length === 0) {
        var en = langName() === "en";
        resultBox.innerHTML = '<div class="search-item">' +
            (en ? "No results found" : "没有找到相关内容") + '</div>';
        return;
    }

    results.slice(0, 50).forEach(function (item) {
        var div = document.createElement("div");
        div.className = "search-item";
        div.innerHTML = '<a href="' + basePath() + item.path + '">\uD83D\uDCC4 ' + item.title + '</a>';
        resultBox.appendChild(div);
    });
}


// ==========================
// 点击外部关闭
// ==========================

document.addEventListener("click", function (e) {
    var box = document.querySelector(".search-box");
    var result = document.getElementById("searchResult");
    if (box && !box.contains(e.target)) {
        if (result) result.style.display = "none";
    }
});


// ==========================
// 初始化
// ==========================

window.addEventListener("DOMContentLoaded", function () {
    loadSearchData();
    var box = document.getElementById("site-search");
    if (box) {
        box.addEventListener("input", doSearch);
        box.addEventListener("keyup", doSearch);
        box.addEventListener("change", doSearch);
    }
});


// 语言切换后重新加载索引
window.reloadSearchData = function () {
    searchData = [];
    indexReady = false;
    loadSearchData();
};
