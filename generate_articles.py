from pathlib import Path
from docx import Document
import html



SOURCE = Path("article_source")
OUTPUT = Path("articles")





# ==========================
# 文章页面
# ==========================


ARTICLE_TEMPLATE = """

<!DOCTYPE html>

<html lang="zh-CN">


<head>

<meta charset="UTF-8">

<title>{title}</title>

<link rel="stylesheet" href="{css}">

</head>



<body>


<div class="container">


<div class="project-page">


<a class="back-btn" href="index.html">

← 返回上一级

</a>



<h1>

{title}

</h1>



<div class="article-content">

{content}

</div>



</div>


</div>


</body>


</html>

"""









# ==========================
# 目录页面
# ==========================


INDEX_TEMPLATE = """

<!DOCTYPE html>

<html lang="zh-CN">


<head>


<meta charset="UTF-8">


<title>{title}</title>


<link rel="stylesheet" href="{css}">


</head>



<body>



<div class="container">


<div class="project-page">



<a class="back-btn" href="{home}">

← 返回首页

</a>




<h1>

{title}

</h1>





<div class="article-grid">


{content}


</div>




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


        print("跳过损坏文件:", file)

        return "<p>文件无法读取</p>"



    result = []



    for p in doc.paragraphs:


        if p.text.strip():


            result.append(

                html.escape(p.text)

            )



    if not result:


        return "<p>暂无内容</p>"



    return "<br><br>".join(result)









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









# ==========================
# 生成文章
# ==========================


def create_article(source, output):


    output.write_text(

        ARTICLE_TEMPLATE.format(

            title=html.escape(source.stem),

            content=read_docx(source),

            css=get_css_path(output)

        ),

        encoding="utf-8"

    )









# ==========================
# 生成目录
# ==========================


def create_index(folder, output):


    cards = []



    for item in sorted(folder.iterdir()):



        # 文件夹


        if item.is_dir():



            cards.append(

f"""

<a class="article-card"

href="{item.name}/index.html">


<h3>

📁 {item.name}

</h3>


</a>

"""

            )





        # docx


        elif item.suffix.lower() == ".docx":



            if item.name.startswith("~$"):

                continue



            cards.append(

f"""

<a class="article-card"

href="{item.stem}.html">


<h3>

📄 {item.stem}

</h3>


</a>

"""

            )





        else:


            continue






    output.write_text(


        INDEX_TEMPLATE.format(

            title=folder.name,

            content="".join(cards),

            css=get_css_path(output),

            home=get_home_path(output)

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



        else:


            continue





    create_index(

        source,

        output / "index.html"

    )









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