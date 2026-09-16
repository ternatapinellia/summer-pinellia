from pathlib import Path
import json
import shutil
import re
from html import unescape


ROOT = Path(r"D:\summer-pinellia")

BACKUP = ROOT / "backup_before_v3"



def depth_path(file):

    depth = len(
        file.parent.relative_to(ROOT).parts
    )

    return "../" * depth



# =====================
# 备份
# =====================

def backup(file):

    target = BACKUP / file.relative_to(ROOT)

    target.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    shutil.copy2(
        file,
        target
    )




# =====================
# 生成主题JS
# =====================

def create_theme_js():

    (ROOT/"theme.js").write_text(
r'''
document.addEventListener(
"DOMContentLoaded",
()=>{

let btn=document.querySelector(
"#theme-btn"
);


let mode=localStorage.getItem(
"theme"
);


if(mode==="light"){

document.documentElement.classList.add(
"light"
);

}



function update(){

if(!btn)return;


btn.innerHTML=
document.documentElement.classList.contains("light")
?
"🌙"
:
"☀️";

}



update();



if(btn){

btn.onclick=()=>{


document.documentElement.classList.toggle(
"light"
);


localStorage.setItem(
"theme",
document.documentElement.classList.contains("light")
?
"light"
:
"dark"
);


update();


};


}



});
''',
encoding="utf-8"
)




# =====================
# 搜索JS
# =====================

def create_search_js():

    (ROOT/"search.js").write_text(
r'''
document.addEventListener(
"DOMContentLoaded",
()=>{


let input=document.querySelector(
"#site-search"
);


if(!input)return;



fetch(
input.dataset.json
)

.then(r=>r.json())

.then(data=>{


input.addEventListener(
"input",
()=>{


let old=document.querySelector(
"#search-result"
);


if(old)
old.remove();



let key=input.value.trim();



if(!key)
return;



let box=document.createElement(
"div"
);


box.id="search-result";


box.style.position="fixed";
box.style.right="80px";
box.style.top="70px";
box.style.background="#111";
box.style.color="white";
box.style.padding="10px";
box.style.borderRadius="15px";
box.style.zIndex="99999";



data.filter(
x=>

x.title.includes(key)
||
x.content.includes(key)

)
.slice(0,10)
.forEach(
x=>{


let a=document.createElement(
"a"
);


a.href=x.url;

a.innerText=x.title;


a.style.display="block";

a.style.color="white";

a.style.padding="8px";



box.appendChild(a);



}
);



document.body.appendChild(
box
);



});


});


});
''',
encoding="utf-8"
)




# =====================
# 搜索数据库
# =====================

def create_search_json():

    data=[]


    for file in ROOT.rglob("*.html"):


        if "backup_before_v3" in file.parts:
            continue



        text=file.read_text(
            encoding="utf-8",
            errors="ignore"
        )


        m=re.search(
            r"<title>(.*?)</title>",
            text,
            re.S
        )


        title=unescape(
            m.group(1)
        ) if m else file.stem



        content=re.sub(
            "<.*?>",
            "",
            text
        )



        data.append({

            "title":title,

            "url":
            str(
                file.relative_to(ROOT)
            ).replace("\\","/"),

            "content":
            unescape(content)

        })



    with open(
        ROOT/"search.json",
        "w",
        encoding="utf-8"
    ) as f:


        json.dump(
            data,
            f,
            ensure_ascii=False,
            indent=2
        )






# =====================
# 修改HTML
# =====================

def modify(file):


    text=file.read_text(
        encoding="utf-8"
    )


    old=text



    # 按钮

    if "theme-btn" not in text:


        text=text.replace(
            "<body>",
            """
<body>

<div id="theme-btn">
☀️
</div>

""",
            1
        )



    # 搜索

    if "site-search" not in text:


        text=text.replace(
            "<body>",
            """
<body>

<div class="search-box">

<input id="site-search"
data-json="%ssearch.json"
placeholder="搜索..."
>

</div>

"""
            %
            depth_path(file),
            1
        )



    path=depth_path(file)



    # 删除旧JS

    text=re.sub(
        r'<script src=.*?theme\.js.*?</script>',
        '',
        text
    )

    text=re.sub(
        r'<script src=.*?search\.js.*?</script>',
        '',
        text
    )



    text=text.replace(

        "</body>",

        f"""
<script src="{path}theme.js"></script>
<script src="{path}search.js"></script>

</body>
""",

        1
    )



    if text!=old:


        backup(file)


        file.write_text(
            text,
            encoding="utf-8"
        )


        print(
            "修改:",
            file
        )





# =====================
# 主程序
# =====================

def main():

    BACKUP.mkdir(
        exist_ok=True
    )


    create_theme_js()

    create_search_js()

    create_search_json()



    for html in ROOT.rglob("*.html"):

        if "backup_before_v3" not in html.parts:

            modify(html)



    print(
        "完成"
    )



if __name__=="__main__":

    main()