#!/bin/bash

PID=$(ps -ef | grep litemall.jar | grep -v grep | awk '{ print $2 }')

if [ ! -z "$PID" ]; then
    kill $PID
    sleep 5  # 等待进程完全停止
fi