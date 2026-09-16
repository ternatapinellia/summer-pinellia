from pathlib import Path
from docx import Document
import html


SOURCE = Path("article_source")
OUTPUT = Path("articles")



# ==========================
# 模板
# ==========================


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


</div>

</div>


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


</body>

</html>
"""







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
                "<p>" + html.escape(text) + "</p>"
            )


    if result:

        return "\n".join(result)


    return "<p>暂无内容</p>"








# ==========================
# 路径
# ==========================


def get_css_path(output):

    depth = len(
        output.relative_to(OUTPUT).parts
    )

    return "../" * depth + "style.css"





def get_home_path(output):

    depth = len(
        output.relative_to(OUTPUT).parts
    )

    return "../" * depth + "index.html"





def get_parent_path():

    return "../index.html"








# ==========================
# 判断入口目录
# ==========================


def is_entry_folder(output):

    folder = output.parent.relative_to(OUTPUT)


    # articles/index.html

    if len(folder.parts) == 0:

        return True


    # 一级目录

    if len(folder.parts) == 1:

        return True


    return False







# ==========================
# 生成文章
# ==========================


def create_article(source, output):


    output.write_text(

        ARTICLE_TEMPLATE.format(

            title=html.escape(source.stem),

            content=read_docx(source),

            css=get_css_path(output),

            home=get_home_path(output)

        ),

        encoding="utf-8"

    )









# ==========================
# 生成目录
# ==========================


def create_index(folder, output):


    folders = []

    articles = []



    for item in sorted(folder.iterdir()):



        # 文件夹

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



        # docx

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





    # 返回按钮

    if is_entry_folder(output):


        nav = f"""

<a class="back-btn" href="{get_home_path(output)}">

← 返回首页

</a>

"""


    else:


        nav = f"""

<a class="back-btn" href="{get_parent_path()}">

← 返回上一级

</a>


<a class="back-btn" href="{get_home_path(output)}">

← 返回首页

</a>

"""





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






    output.write_text(

        INDEX_TEMPLATE.format(

            title=html.escape(folder.name),

            folders=folder_html,

            articles=article_html,

            css=get_css_path(output),

            nav=nav

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



    for item in source.iterdir():


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

        print("没有找到 article_source")

        return



    process_folder(

        SOURCE,

        OUTPUT

    )


    print("文章生成完成")





if __name__ == "__main__":

    main()