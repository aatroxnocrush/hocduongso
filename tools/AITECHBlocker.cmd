@echo off
setlocal enabledelayedexpansion

:: ============================================================
::  AITECH BLOCKER — AIO Tool
::  (C) AITECH 2026
:: ============================================================

:: Window setup
title AITECH Blocker
mode con: cols=66 lines=40
color 0F

:: Self-elevate to admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo   [!] Can quyen Administrator...
    echo   Dang yeu cau nang quyen...
    echo.
    powershell -NoProfile -Command "Start-Process -FilePath '%~dpnx0' -Verb RunAs"
    exit /b
)

:: Set ESC character for ANSI colors
for /F "tokens=1,2 delims=#" %%a in ('"prompt #$E# & echo on & for %%b in (1) do rem"') do set "ESC=%%a"

:: Config
set "HOSTS=%SystemRoot%\System32\drivers\etc\hosts"

goto MENU

:: ============================================================
::  CHECK STATUS
:: ============================================================
:CHECK_STATUS
set "S_GAME=0"
set "S_SOCIAL=0"
set "S_GAMBLE=0"
set "S_ADULT=0"

if exist "%HOSTS%" (
    findstr /c:"NS_GAME START" "%HOSTS%" >nul 2>&1 && set "S_GAME=1"
    findstr /c:"NS_SOCIAL START" "%HOSTS%" >nul 2>&1 && set "S_SOCIAL=1"
    findstr /c:"NS_GAMBLING START" "%HOSTS%" >nul 2>&1 && set "S_GAMBLE=1"
    findstr /c:"NS_ADULT START" "%HOSTS%" >nul 2>&1 && set "S_ADULT=1"
)
goto :eof

:: ============================================================
::  MAIN MENU
:: ============================================================
:MENU
cls
call :CHECK_STATUS

echo.
echo  %ESC%[95m ============================================================%ESC%[0m
echo  %ESC%[95m     _  _                  ___               _              %ESC%[0m
echo  %ESC%[95m    ^| \^| ^| _____ ____ _   / __^| _ __  __ _ _ _^| ^|__           %ESC%[0m
echo  %ESC%[95m    ^| .` ^|/ _ \ V / _` ^|  \__ \^| '_ \/ _` ^| '_^| / /           %ESC%[0m
echo  %ESC%[95m    ^|_^|\_^|\___/\_/\__,_^|  ^|___/^| .__/\__,_^|_^| ^|_\_\           %ESC%[0m
echo  %ESC%[95m                              ^|_^|                            %ESC%[0m
echo  %ESC%[90m           BLOCKER — Chan Game ^& Web Xau                    %ESC%[0m
echo  %ESC%[95m ============================================================%ESC%[0m
echo.

:: Status dashboard
if "!S_GAME!"=="1" (
    echo   %ESC%[42;97m  ON  %ESC%[0m  Game Online         %ESC%[90mGarena, Steam, Roblox...%ESC%[0m
) else (
    echo   %ESC%[41;97m OFF  %ESC%[0m  %ESC%[90mGame Online%ESC%[0m
)
if "!S_SOCIAL!"=="1" (
    echo   %ESC%[42;97m  ON  %ESC%[0m  Mang xa hoi         %ESC%[90mTikTok, Facebook, IG...%ESC%[0m
) else (
    echo   %ESC%[41;97m OFF  %ESC%[0m  %ESC%[90mMang xa hoi%ESC%[0m
)
if "!S_GAMBLE!"=="1" (
    echo   %ESC%[42;97m  ON  %ESC%[0m  Co bac online       %ESC%[90m188bet, Fun88, W88...%ESC%[0m
) else (
    echo   %ESC%[41;97m OFF  %ESC%[0m  %ESC%[90mCo bac online%ESC%[0m
)
if "!S_ADULT!"=="1" (
    echo   %ESC%[42;97m  ON  %ESC%[0m  Web 18+             %ESC%[90mNoi dung nguoi lon%ESC%[0m
) else (
    echo   %ESC%[41;97m OFF  %ESC%[0m  %ESC%[90mWeb 18+%ESC%[0m
)

echo.
echo  %ESC%[90m ------------------------------------------------------------%ESC%[0m
echo  %ESC%[97m  TOGGLE TUNG LOAI%ESC%[0m
echo  %ESC%[90m ------------------------------------------------------------%ESC%[0m
echo.
echo   %ESC%[93m[1]%ESC%[0m  Toggle Game Online
echo   %ESC%[93m[2]%ESC%[0m  Toggle Mang xa hoi
echo   %ESC%[93m[3]%ESC%[0m  Toggle Co bac online
echo   %ESC%[93m[4]%ESC%[0m  Toggle Web 18+
echo.
echo  %ESC%[90m ------------------------------------------------------------%ESC%[0m
echo  %ESC%[97m  THAO TAC NHANH%ESC%[0m
echo  %ESC%[90m ------------------------------------------------------------%ESC%[0m
echo.
echo   %ESC%[92m[5]%ESC%[0m  BAT TAT CA
echo   %ESC%[91m[6]%ESC%[0m  TAT TAT CA
echo.
echo  %ESC%[90m ------------------------------------------------------------%ESC%[0m
echo  %ESC%[97m  DNS ^& KHAC%ESC%[0m
echo  %ESC%[90m ------------------------------------------------------------%ESC%[0m
echo.
echo   %ESC%[95m[7]%ESC%[0m  Doi DNS an toan
echo   %ESC%[33m[8]%ESC%[0m  Khoi phuc DNS mac dinh
echo   %ESC%[94m[9]%ESC%[0m  Flush DNS cache
echo   %ESC%[91m[0]%ESC%[0m  Thoat
echo.
echo  %ESC%[90m  AITECH 2026 ^| github.com/novasparkteam%ESC%[0m
echo.

set /p "CHOICE=  Nhap lua chon: "

if "!CHOICE!"=="1" goto TOGGLE_GAME
if "!CHOICE!"=="2" goto TOGGLE_SOCIAL
if "!CHOICE!"=="3" goto TOGGLE_GAMBLE
if "!CHOICE!"=="4" goto TOGGLE_ADULT
if "!CHOICE!"=="5" goto ENABLE_ALL
if "!CHOICE!"=="6" goto DISABLE_ALL
if "!CHOICE!"=="7" goto DNS_MENU
if "!CHOICE!"=="8" goto DNS_RESET
if "!CHOICE!"=="9" goto FLUSH_DNS
if "!CHOICE!"=="0" goto EXIT

echo   %ESC%[91mLua chon khong hop le!%ESC%[0m
timeout /t 1 >nul
goto MENU

:: ============================================================
::  TOGGLE GAME
:: ============================================================
:TOGGLE_GAME
if "!S_GAME!"=="1" (
    call :REMOVE_BLOCK "NS_GAME"
    echo.
    echo   %ESC%[92m[OK] Da TAT chan Game Online.%ESC%[0m
) else (
    call :ADD_BLOCK "NS_GAME" "Game Online" "garena.vn,www.garena.vn,lienquan.garena.vn,freefire.garena.vn,playtogether.garena.vn,pubgmobile.com,www.pubgmobile.com,mobilelegends.com,www.mobilelegends.com,genshin.hoyoverse.com,riotgames.com,www.riotgames.com,leagueoflegends.com,www.leagueoflegends.com,valorant.com,www.valorant.com,store.steampowered.com,steamcommunity.com,epicgames.com,www.epicgames.com,roblox.com,www.roblox.com,minecraft.net,www.minecraft.net,fortnite.com,www.fortnite.com,miniclip.com,www.miniclip.com,y8.com,www.y8.com,poki.com,www.poki.com,crazygames.com,www.crazygames.com,kizi.com,www.kizi.com,friv.com,www.friv.com,zing.vn,www.zing.vn,me.zing.vn"
    echo.
    echo   %ESC%[92m[OK] Da BAT chan Game Online!%ESC%[0m
)
ipconfig /flushdns >nul 2>&1
echo.
pause
goto MENU

:: ============================================================
::  TOGGLE SOCIAL
:: ============================================================
:TOGGLE_SOCIAL
if "!S_SOCIAL!"=="1" (
    call :REMOVE_BLOCK "NS_SOCIAL"
    echo.
    echo   %ESC%[92m[OK] Da TAT chan Mang xa hoi.%ESC%[0m
) else (
    call :ADD_BLOCK "NS_SOCIAL" "Mang xa hoi" "tiktok.com,www.tiktok.com,vm.tiktok.com,facebook.com,www.facebook.com,m.facebook.com,web.facebook.com,instagram.com,www.instagram.com,twitter.com,www.twitter.com,x.com,www.x.com,reddit.com,www.reddit.com,9gag.com,www.9gag.com,twitch.tv,www.twitch.tv"
    echo.
    echo   %ESC%[92m[OK] Da BAT chan Mang xa hoi!%ESC%[0m
)
ipconfig /flushdns >nul 2>&1
echo.
pause
goto MENU

:: ============================================================
::  TOGGLE GAMBLE
:: ============================================================
:TOGGLE_GAMBLE
if "!S_GAMBLE!"=="1" (
    call :REMOVE_BLOCK "NS_GAMBLING"
    echo.
    echo   %ESC%[92m[OK] Da TAT chan Co bac.%ESC%[0m
) else (
    call :ADD_BLOCK "NS_GAMBLING" "Co bac online" "188bet.com,www.188bet.com,fun88.com,www.fun88.com,w88.com,www.w88.com,fb88.com,www.fb88.com,m88.com,www.m88.com,bong88.com,www.bong88.com,sbobet.com,www.sbobet.com,bet365.com,www.bet365.com,vn88.com,www.vn88.com,12bet.com,www.12bet.com"
    echo.
    echo   %ESC%[92m[OK] Da BAT chan Co bac!%ESC%[0m
)
ipconfig /flushdns >nul 2>&1
echo.
pause
goto MENU

:: ============================================================
::  TOGGLE ADULT
:: ============================================================
:TOGGLE_ADULT
if "!S_ADULT!"=="1" (
    call :REMOVE_BLOCK "NS_ADULT"
    echo.
    echo   %ESC%[92m[OK] Da TAT chan Web 18+.%ESC%[0m
) else (
    call :ADD_BLOCK "NS_ADULT" "Web 18+" "pornhub.com,www.pornhub.com,xvideos.com,www.xvideos.com,xnxx.com,www.xnxx.com,xhamster.com,www.xhamster.com,redtube.com,www.redtube.com,youporn.com,www.youporn.com,spankbang.com,www.spankbang.com"
    echo.
    echo   %ESC%[92m[OK] Da BAT chan Web 18+!%ESC%[0m
)
ipconfig /flushdns >nul 2>&1
echo.
pause
goto MENU

:: ============================================================
::  ENABLE ALL
:: ============================================================
:ENABLE_ALL
echo.
echo   %ESC%[96mDang bat chan TAT CA...%ESC%[0m

if "!S_GAME!"=="0" call :ADD_BLOCK "NS_GAME" "Game Online" "garena.vn,www.garena.vn,lienquan.garena.vn,freefire.garena.vn,playtogether.garena.vn,pubgmobile.com,www.pubgmobile.com,mobilelegends.com,www.mobilelegends.com,genshin.hoyoverse.com,riotgames.com,www.riotgames.com,leagueoflegends.com,www.leagueoflegends.com,valorant.com,www.valorant.com,store.steampowered.com,steamcommunity.com,epicgames.com,www.epicgames.com,roblox.com,www.roblox.com,minecraft.net,www.minecraft.net,fortnite.com,www.fortnite.com,miniclip.com,www.miniclip.com,y8.com,www.y8.com,poki.com,www.poki.com,crazygames.com,www.crazygames.com,kizi.com,www.kizi.com,friv.com,www.friv.com,zing.vn,www.zing.vn,me.zing.vn"

if "!S_SOCIAL!"=="0" call :ADD_BLOCK "NS_SOCIAL" "Mang xa hoi" "tiktok.com,www.tiktok.com,vm.tiktok.com,facebook.com,www.facebook.com,m.facebook.com,web.facebook.com,instagram.com,www.instagram.com,twitter.com,www.twitter.com,x.com,www.x.com,reddit.com,www.reddit.com,9gag.com,www.9gag.com,twitch.tv,www.twitch.tv"

if "!S_GAMBLE!"=="0" call :ADD_BLOCK "NS_GAMBLING" "Co bac online" "188bet.com,www.188bet.com,fun88.com,www.fun88.com,w88.com,www.w88.com,fb88.com,www.fb88.com,m88.com,www.m88.com,bong88.com,www.bong88.com,sbobet.com,www.sbobet.com,bet365.com,www.bet365.com,vn88.com,www.vn88.com,12bet.com,www.12bet.com"

if "!S_ADULT!"=="0" call :ADD_BLOCK "NS_ADULT" "Web 18+" "pornhub.com,www.pornhub.com,xvideos.com,www.xvideos.com,xnxx.com,www.xnxx.com,xhamster.com,www.xhamster.com,redtube.com,www.redtube.com,youporn.com,www.youporn.com,spankbang.com,www.spankbang.com"

ipconfig /flushdns >nul 2>&1
echo.
echo   %ESC%[92m[OK] DA BAT CHAN TAT CA!%ESC%[0m
echo.
pause
goto MENU

:: ============================================================
::  DISABLE ALL
:: ============================================================
:DISABLE_ALL
echo.
set /p "CONFIRM=  %ESC%[93mTat chan TAT CA? (y/n): %ESC%[0m"
if /i not "!CONFIRM!"=="y" goto MENU

echo.
echo   %ESC%[96mDang go bo tat ca...%ESC%[0m

call :REMOVE_BLOCK "NS_GAME"
call :REMOVE_BLOCK "NS_SOCIAL"
call :REMOVE_BLOCK "NS_GAMBLING"
call :REMOVE_BLOCK "NS_ADULT"

ipconfig /flushdns >nul 2>&1
echo.
echo   %ESC%[92m[OK] Da TAT tat ca. Website da mo lai.%ESC%[0m
echo.
pause
goto MENU

:: ============================================================
::  DNS MENU
:: ============================================================
:DNS_MENU
cls
echo.
echo  %ESC%[95m ============================================================%ESC%[0m
echo  %ESC%[97m  CHON DNS AN TOAN%ESC%[0m
echo  %ESC%[95m ============================================================%ESC%[0m
echo.
echo   %ESC%[93m[1]%ESC%[0m  OpenDNS FamilyShield    %ESC%[90m208.67.222.123%ESC%[0m
echo        %ESC%[90mLoc web 18+ ^& noi dung xau tu dong%ESC%[0m
echo.
echo   %ESC%[93m[2]%ESC%[0m  CleanBrowsing Family    %ESC%[90m185.228.168.168%ESC%[0m
echo        %ESC%[90mChan 18+ ^& malware%ESC%[0m
echo.
echo   %ESC%[93m[3]%ESC%[0m  Cloudflare Family       %ESC%[90m1.1.1.3%ESC%[0m
echo        %ESC%[90mNhanh nhat, chan malware ^& 18+%ESC%[0m
echo.
echo   %ESC%[93m[4]%ESC%[0m  Google DNS              %ESC%[90m8.8.8.8%ESC%[0m
echo        %ESC%[90mNhanh, khong loc noi dung%ESC%[0m
echo.
echo   %ESC%[91m[0]%ESC%[0m  Quay lai
echo.

set /p "DNS_CHOICE=  Nhap lua chon: "

if "!DNS_CHOICE!"=="1" set "DNS1=208.67.222.123" & set "DNS2=208.67.220.123" & set "DNS_NAME=OpenDNS FamilyShield" & goto DNS_SET
if "!DNS_CHOICE!"=="2" set "DNS1=185.228.168.168" & set "DNS2=185.228.169.168" & set "DNS_NAME=CleanBrowsing Family" & goto DNS_SET
if "!DNS_CHOICE!"=="3" set "DNS1=1.1.1.3" & set "DNS2=1.0.0.3" & set "DNS_NAME=Cloudflare Family" & goto DNS_SET
if "!DNS_CHOICE!"=="4" set "DNS1=8.8.8.8" & set "DNS2=8.8.4.4" & set "DNS_NAME=Google DNS" & goto DNS_SET
if "!DNS_CHOICE!"=="0" goto MENU
goto DNS_MENU

:DNS_SET
echo.
echo   %ESC%[96mDang doi DNS sang !DNS_NAME!...%ESC%[0m

for /f "skip=3 tokens=3,4*" %%A in ('netsh interface show interface ^| findstr /i "Connected"') do (
    netsh interface ip set dns name="%%C" static !DNS1! >nul 2>&1
    netsh interface ip add dns name="%%C" !DNS2! index=2 >nul 2>&1
)

ipconfig /flushdns >nul 2>&1
echo.
echo   %ESC%[92m[OK] Da doi DNS: !DNS_NAME!!%ESC%[0m
echo   %ESC%[90m  Primary:   !DNS1!%ESC%[0m
echo   %ESC%[90m  Secondary: !DNS2!%ESC%[0m
echo.
pause
goto MENU

:: ============================================================
::  DNS RESET
:: ============================================================
:DNS_RESET
echo.
echo   %ESC%[96mDang khoi phuc DNS mac dinh...%ESC%[0m

for /f "skip=3 tokens=3,4*" %%A in ('netsh interface show interface ^| findstr /i "Connected"') do (
    netsh interface ip set dns name="%%C" dhcp >nul 2>&1
)

ipconfig /flushdns >nul 2>&1
echo.
echo   %ESC%[92m[OK] Da khoi phuc DNS mac dinh!%ESC%[0m
echo.
pause
goto MENU

:: ============================================================
::  FLUSH DNS
:: ============================================================
:FLUSH_DNS
echo.
ipconfig /flushdns >nul 2>&1
echo   %ESC%[92m[OK] DNS cache da duoc xoa!%ESC%[0m
echo.
pause
goto MENU

:: ============================================================
::  EXIT
:: ============================================================
:EXIT
echo.
echo   %ESC%[95mTam biet! Hoc tap tot nhe!%ESC%[0m
timeout /t 2 >nul
exit

:: ============================================================
::  HELPER: ADD BLOCK
::  call :ADD_BLOCK "ID" "Name" "d1,d2,d3"
:: ============================================================
:ADD_BLOCK
set "CAT_ID=%~1"
set "CAT_NAME=%~2"
set "DOMAINS=%~3"

>> "%HOSTS%" echo # === %CAT_ID% START ===
>> "%HOSTS%" echo # AITECH ^| %CAT_NAME% ^| %date%

for %%D in (%DOMAINS%) do (
    >> "%HOSTS%" echo 0.0.0.0 %%D
)

>> "%HOSTS%" echo # === %CAT_ID% END ===

goto :eof

:: ============================================================
::  HELPER: REMOVE BLOCK
::  call :REMOVE_BLOCK "ID"
:: ============================================================
:REMOVE_BLOCK
set "RB_ID=%~1"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$c = Get-Content -Path '%HOSTS%' -Raw -ErrorAction SilentlyContinue; if($c){ $c = $c -replace '(?s)# === %RB_ID% START ===.+?# === %RB_ID% END ===\r?\n?',''; Set-Content -Path '%HOSTS%' -Value $c.TrimEnd() -NoNewline }"

goto :eof
