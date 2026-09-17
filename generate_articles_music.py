from pathlib import Path
from docx import Document
import html
import re


SOURCE = Path("article_source")
OUTPUT = Path("articles")



# ==========================
# HTML模板
# ==========================


MUSIC_BLOCK = """

<audio id="bgm" loop></audio>

<div class="music-box">

<div class="music-title">
🎵 当前音乐：
<span id="musicName">未播放</span>
</div>


<div class="music-controls">

<button class="music-btn small" onclick="prevMusic()">⏮</button>

<button id="playBtn" class="music-btn play" onclick="toggleMusic()">▶</button>

<button class="music-btn small" onclick="nextMusic()">⏭</button>


<select id="songSelect">

</select>


</div>

</div>

"""


ARTICLE_TEMPLATE = """
<!DOCTYPE html>
<html lang="zh-CN">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>{title}</title>

<link rel="stylesheet" href="{css}">

</head>


<body>


<button id="theme-btn">
🌙
</button>


<div class="container">

<div class="project-page">


<div class="nav-bar">

<a class="back-btn" href="index.html">

← 返回上一级

</a>


<a class="back-btn" href="{home}">

← 返回首页

</a>

</div>



<h1>{title}</h1>


<div class="article-content">

{content}

</div>



<div class="nav-bar">

{article_nav}

</div>



<!-- 留言 -->

<div class="comment-box">


<h3>
留言
</h3>


<textarea
id="message"
placeholder="留下你的留言">
</textarea>


<button onclick="sendComment()">

发送

</button>


</div>



</div>

</div>



{music}



<script src="{theme}"></script>

<script src="{script}"></script>


</body>

</html>
"""




INDEX_TEMPLATE = """
<!DOCTYPE html>

<html lang="zh-CN">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">


<title>{title}</title>


<link rel="stylesheet" href="{css}">

</head>


<body>


<button id="theme-btn">
🌙
</button>


<div class="container">

<div class="project-page">


<div class="nav-bar">

{nav}

</div>



<h1>{title}</h1>


{folders}


{articles}



</div>

</div>


{music}


<script src="{theme}"></script>

<script src="{script}"></script>


</body>

</html>
"""





# ==========================
# 自然排序
# ==========================


def natural_sort(items):

    return sorted(

        items,

        key=lambda x:[

            int(text) if text.isdigit()

            else text.lower()


            for text in re.split(

                r'(\d+)',

                x.name

            )

        ]

    )





# ==========================
# 读取docx
# ==========================


def read_docx(file):

    try:

        doc = Document(file)

    except Exception:

        return "<p>文件无法读取</p>"


    result = []


    for p in doc.paragraphs:

        text = p.text.strip()


        if text:

            result.append(

                "<p>"

                +

                html.escape(text)

                +

                "</p>"

            )


    if result:

        return "\n".join(result)


    return "<p>暂无内容</p>"





# ==========================
# 路径
# ==========================


def get_depth(output):

    return len(

        output.relative_to(OUTPUT).parts

    )



def get_css_path(output):

    return "../"*get_depth(output)+"style.css"



def get_theme_path(output):

    return "../"*get_depth(output)+"theme.js"



def get_script_path(output):

    return "../"*get_depth(output)+"script.js"



def get_home_path(output):

    return "../"*get_depth(output)+"index.html"




def get_parent_path():

    return "../index.html"





# ==========================
# 判断入口目录
# 保持原逻辑
# ==========================


def is_entry_folder(output):

    folder = output.parent.relative_to(OUTPUT)


    if len(folder.parts)==0:

        return True


    if len(folder.parts)==1:

        return True


    return False
# ==========================
# 生成文章
# ==========================


def create_article(source, output):


    docs = [

        x for x in natural_sort(
            list(source.parent.iterdir())
        )

        if x.suffix.lower() == ".docx"
        and not x.name.startswith("~$")

    ]


    index = docs.index(source)


    article_nav = []


    # 上一篇

    if index > 0:

        prev = docs[index-1]

        article_nav.append(

f"""
<a class="back-btn"
href="{prev.stem}.html">

← {html.escape(prev.stem)}

</a>
"""

        )


    # 下一篇

    if index < len(docs)-1:

        nxt = docs[index+1]

        article_nav.append(

f"""
<a class="back-btn"
href="{nxt.stem}.html">

{html.escape(nxt.stem)} →

</a>
"""

        )



    output.write_text(

        ARTICLE_TEMPLATE.format(

            title=html.escape(source.stem),

            content=read_docx(source),

            css=get_css_path(output),

            theme=get_theme_path(output),

            script=get_script_path(output),

            home=get_home_path(output),

            article_nav="".join(article_nav),

            music=MUSIC_BLOCK

        ),

        encoding="utf-8"

    )









# ==========================
# 生成目录
# ==========================


def create_index(folder, output):


    folders = []

    articles = []



    for item in natural_sort(
        list(folder.iterdir())
    ):



        if item.is_dir():


            folders.append(

f"""
<a class="article-card"
href="{item.name}/index.html">

<h3>

📁 {html.escape(item.name)}

</h3>

</a>
"""

            )



        elif item.suffix.lower() == ".docx":


            if item.name.startswith("~$"):

                continue



            articles.append(

f"""
<a class="article-card"
href="{item.stem}.html">

<h3>

📄 {html.escape(item.stem)}

</h3>

</a>
"""

            )





    folder_html = ""


    if folders:


        folder_html = f"""

<h2>

目录

</h2>


<div class="article-grid">

{"".join(folders)}

</div>

"""




    article_html = ""


    if articles:


        article_html = f"""

<h2>

文章

</h2>


<div class="article-grid">

{"".join(articles)}

</div>

"""





    # 保留你的返回逻辑

    if is_entry_folder(output):


        nav = f"""

<a class="back-btn"
href="{get_home_path(output)}">

← 返回首页

</a>

"""


    else:


        nav = f"""

<a class="back-btn"
href="{get_parent_path()}">

← 返回上一级

</a>


<a class="back-btn"
href="{get_home_path(output)}">

← 返回首页

</a>

"""





    output.write_text(

        INDEX_TEMPLATE.format(

    title=html.escape(folder.name),

    folders=folder_html,

    articles=article_html,

    css=get_css_path(output),

    theme=get_theme_path(output),

    script=get_script_path(output),

    nav=nav,

    music=MUSIC_BLOCK

),

        encoding="utf-8"

    )









# ==========================
# 遍历
# ==========================


def process_folder(source, output):


    output.mkdir(

        parents=True,

        exist_ok=True

    )



    for item in natural_sort(
        list(source.iterdir())
    ):


        if item.is_dir():


            process_folder(

                item,

                output / item.name

            )



        elif item.suffix.lower() == ".docx":


            if item.name.startswith("~$"):

                continue



            create_article(

                item,

                output / (item.stem + ".html")

            )





    create_index(

        source,

        output / "index.html"

    )









# ==========================
# 主程序
# ==========================


def main():


    if not SOURCE.exists():

        print(
            "没有找到 article_source"
        )

        return



    process_folder(

        SOURCE,

        OUTPUT

    )


    print(
        "文章生成完成"
    )





if __name__ == "__main__":

    main()