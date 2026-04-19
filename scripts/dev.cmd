@echo off
rem Wrapper para arrancar o dev server com o Node no PATH,
rem usado pelo Claude Preview (.claude/launch.json).
set "PATH=C:\Program Files\nodejs;%PATH%"
npm run dev
