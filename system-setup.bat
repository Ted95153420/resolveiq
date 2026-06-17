@echo off
echo WARNING: This will delete ALL containers and ALL images.

echo Stopping and deleting all containers...
for /f %%i in ('docker ps -aq') do docker rm -f %%i

echo Deleting all images...
for /f %%i in ('docker images -q') do docker rmi -f %%i

echo Changing directory to resolveiq/server...
cd /d C:\DEVELOPMENT\resolveiq\server

echo Building API image...
docker build -t resolveiq-api .

echo Running API container...
docker run -d -p 4000:4000 --name resolveiq-api-container resolveiq-api

echo Changing directory to resolveiq/client/userfrontend...
cd /d C:\DEVELOPMENT\resolveiq\client\userfrontend

echo Building UI image...
docker build -t resolveiq-ui .

echo Running UI container...
docker run -d -p 8080:80 --name resolveiq-ui-container resolveiq-ui

