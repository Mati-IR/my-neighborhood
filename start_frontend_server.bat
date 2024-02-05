@echo off
cd %~dp0frontend\html
python -m http.server 7999
