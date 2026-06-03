@echo off
echo ==========================================
echo  pnpm 설치 및 프론트서버 날먹 구동 치트키
echo ==========================================
call npm install -g pnpm
call pnpm install
echo ==========================================
echo  설치 완료! 이제 프론트 서버를 켭니다.
echo ==========================================
call pnpm run dev
pause