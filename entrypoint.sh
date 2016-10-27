#!/bin/sh

APP_PATH="/usr/src/app"
NODE_MODULES_PATH="${APP_PATH}/node_modules"

echo "upgrading npm version to @3"
npm install npm@3 -g

cd ${APP_PATH}
if [ ! -d "${NODE_MODULES_PATH}" ] 
then
  echo "FIRST TIME RUN: npm install all modules... This may take a while..."

  npm install
fi

directoryWatcherPath="node_modules/watchpack/lib/DirectoryWatcher.js"
option="ignored: /node_modules/,"
watchNodeModules=`cat ${directoryWatcherPath} | grep "${option}"`
if [ "x${watchNodeModules}" = "x" ]
then
  sed -i "s|followSymlinks: false,|&\n${option}|" "${directoryWatcherPath}"
fi

echo "running npm run dev..."
npm run dev
