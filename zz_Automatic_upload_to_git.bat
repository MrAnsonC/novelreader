@echo off
echo Choose a commit message:
echo 1. index page更新
echo 2. reading page更新
echo 3. 小说更新
echo 4. 其他信息？


:Prompt
set /p choice="选择以下哪里更新/新增: "

if "%choice%"=="1" set "message=index page update"
if "%choice%"=="2" set "message=reading page update"
if "%choice%"=="3" goto NovelChoice
if "%choice%"=="4" set /p message="输入Commit的信息: "

goto Continue

:NovelChoice
echo 选择以下那本小说更新/新增:
echo 0. 新小说（输入）
echo 1. 守水库？我守的是时间长河！
echo 2. 从未来归来的工藤柯南
echo 3. 人在柯南，有脑内选项系统

set /p novelChoice="选择以下那本小说更新/新增: "
if "%novelChoice%"=="0" goto AddNovel
if "%novelChoice%"=="1" set "message=守水库？我守的是时间长河！ 小说更新啦！"
if "%novelChoice%"=="2" set "message=从未来归来的工藤柯南 小说更新啦"
if "%novelChoice%"=="3" set "message=人在柯南，有脑内选项系统 小说更新啦"

goto Continue

:AddNovel
set /p entermessage="输入小说名称: "
set "message=新小说： %entermessage%"

:Continue
cd %CD%
git add .
git commit -m "%message%"
git push