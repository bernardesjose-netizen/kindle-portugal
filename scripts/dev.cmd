@echo off
rem Wrapper para arrancar o dev server com o Node no PATH,
rem usado pelo Claude Preview (.claude/launch.json).
set "PATH=C:\Program Files\nodejs;%PATH%"
if defined PORT (
  npx astro dev --port %PORT%
) else (
  npm run dev
)
