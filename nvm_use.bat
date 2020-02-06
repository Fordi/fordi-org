@echo off
REM This is because the author of nvm-windows is a donk who
REM doesn't understand the primary use case of `nvm use`
set /p NODE_VERSION=<.nvmrc
nvm install %NODE_VERSION% > nul
nvm use %NODE_VERSION%
