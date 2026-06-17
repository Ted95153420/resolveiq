@echo off

set ROOT=%~dp0

echo Removing old Redpanda container if it exists...
docker rm -f streaming 2>nul

echo Starting redpanda...
cd /d "%ROOT%streaming"
docker compose up -d


echo  Removing old API container/image if they exist...
docker rm -f resolveiq-api-container 2>nul
docker rmi -f resolveiq-api 2>nul


echo Building API image...
cd /d "%ROOT%server"
docker build -t resolveiq-api .

echo Running API container...
docker run -d -p 4000:4000 --name resolveiq-api-container resolveiq-api

echo Removing old UI container/image if they exist...
docker rm -f resolveiq-ui-container 2>nul
docker rmi -f resolveiq-ui 2>nul

echo building UI Image...
cd /d "%ROOT%client\userfrontend"
docker build -t resolveiq-ui .

echo Running UI container...
docker run -d -p 8080:80 --name resolveiq-ui-container resolveiq-ui

echo Starting consumer in Git Bash...
start "ResolveIQ Consumer" "C:\Program Files\Git\bin\bash.exe" -lc "cd /c/DEVELOPMENT/resolveiq/streaming/consumer && npm start; exec bash"

echo Done.
echo UI:  http://localhost:8080
echo API: http://localhost:4000