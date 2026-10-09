let searchData = [];

// 根据当前页面语言，使用同目录下的 search.json
function getSearchJsonPath() {
    return "./search.json";
}

async function loadSearchData() {
    try {
        let response = await fetch(getSearchJsonPath());
        searchData = await response.json();
    } catch(e) {
        console.log("搜索索引加载失败:", e);
    }
}

function doSearch() {
    let box = document.getElementById("site-search");
    let resultBox = document.getElementById("searchResult");
    if (!box || !resultBox) return;

    let keyword = box.value.trim().toLowerCase();
    resultBox.innerHTML = "";

    if (keyword === "") {
        resultBox.style.display = "none";
        return;
    }

    let results = searchData.filter(item => {
        let title = (item.title || "").toLowerCase();
        let content = (item.content || "").toLowerCase();
        return title.includes(keyword) || content.includes(keyword);
    });

    resultBox.style.display = "block";

    if (results.length === 0) {
        let lang = (localStorage.getItem("lang") || "zh") === "en" ? "en" : "zh";
        let msg = lang === "en" ? "No results found" : "没有找到相关内容";
        resultBox.innerHTML = '<div class="search-item">' + msg + '</div>';
        return;
    }

    results.forEach(item => {
        let div = document.createElement("div");
        div.className = "search-item";
        div.innerHTML = '<a href="' + item.path + '">📄 ' + item.title + '</a>';
        resultBox.appendChild(div);
    });
}

// 点击外部关闭
document.addEventListener("click", function(e) {
    let box = document.querySelector(".search-box");
    let result = document.getElementById("searchResult");
    if (box && !box.contains(e.target)) {
        if (result) result.style.display = "none";
    }
});

// 初始化
window.addEventListener("DOMContentLoaded", () => {
    loadSearchData();
    let box = document.getElementById("site-search");
    if (box) {
        box.addEventListener("input", doSearch);
        box.addEventListener("keyup", doSearch);
        box.addEventListener("change", doSearch);
    }
});