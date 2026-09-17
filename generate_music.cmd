@echo off
chcp 65001 >nul

echo let musics = [ > music_list.txt

for %%i in (music\*.mp3) do (
    echo rootPath + "%%i", >> music_list.txt
)

echo ]; >> music_list.txt

powershell -Command "(Get-Content music_list.txt) -replace '\\','/' | Set-Content music_list.txt"

pause