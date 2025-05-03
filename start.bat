@echo off
title Start

:: Send notify to the server
node SendStartupNotification.js

:start
node index.js
goto start
