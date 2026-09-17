import os
import re


pattern = re.compile(
    r'<select\s+id=["\']mode["\'].*?</select>',
    re.IGNORECASE | re.DOTALL
)


new = '<select id="songSelect"></select>'


count = 0


for root, dirs, files in os.walk("."):

    for file in files:

        if file.endswith(".html"):

            path = os.path.join(root, file)

            try:

                with open(path, "r", encoding="utf-8") as f:
                    text = f.read()


                new_text, num = pattern.subn(
                    new,
                    text
                )


                if num > 0:

                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_text)


                    count += 1

                    print("修改:", path)


            except Exception as e:

                print("失败:", path, e)


print()
print("完成，共修改:", count, "个 HTML")