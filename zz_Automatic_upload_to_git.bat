@echo off
set /p message="Enter the commit message: "
if "%message%"=="" set "message=Update latest action"

cd %CD%
git add .
git commit -m "%message%"
git push

