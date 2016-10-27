#!/bin/bash

export TERM=xterm

screen -S devwatch -d -m npm run watch
screen -S nodeapp -d -m npm run app

webpackwatchPid=`screen -ls | grep "devwatch" | sed 's/	//g' | cut -f1 -d'.'`
nodeappPid=`screen -ls | grep "nodeapp" | sed 's/	//g' | cut -f1 -d'.'`

echo "npm run watch is running on screen with name webpackwatch, use ./afsm screenconn `hostname` devwatch to monitor the process..."
echo "npm run app is running on screen with name nodeapp, use ./afsm screenconn `hostname` nodeapp to monitor the process..."

while [ 1 ]
do
  checkdevwatch=`ps auxwww | grep "${webpackwatchPid}"`
  checknodeapp=`ps auxwww | grep "${nodeappPid}"`
  if [ "x${checkdevwatch}" = "x" ] || [ "x${checknodeapp}" = "x" ]
  then
    kill -9 ${webpackwatchPid}
    kill -9 ${nodeappPid}
    exit
  fi
  sleep 5
done
