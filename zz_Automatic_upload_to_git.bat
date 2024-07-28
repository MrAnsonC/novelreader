@echo off
echo Choose a commit message:
echo 1. index page update
echo 2. reading page update
echo 3. novel update
echo 4. Enter other message


:Prompt
set /p choice="选择以下哪里更新/新增: "

if "%choice%"=="1" set "message=index page update"
if "%choice%"=="2" set "message=reading page update"
if "%choice%"=="3" goto NovelChoice
if "%choice%"=="4" set /p message="Enter your custom commit message: "

goto Continue

:NovelChoice
echo 选择以下那本小说更新/新增:
echo 1. 守水库？我守的是时间长河！
echo 2. 从未来归来的工藤柯南
echo 3. 新小说（输入）
set /p novelChoice="选择以下那本小说更新/新增: "
if "%novelChoice%"=="1" set "message=守水库？我守的是时间长河！ 小说更新啦！"
if "%novelChoice%"=="2" set "message=从未来归来的工藤柯南 小说更新啦"
if "%novelChoice%"=="3" (
    set /p message="Enter the new novel name: "
    set "message=新增小说：%novelName%"
)
goto Continue

:Continue
cd %CD%
git add .
git commit -m "%message%"
git push
