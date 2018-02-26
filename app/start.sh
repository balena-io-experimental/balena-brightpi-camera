#!/bin/bash

export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket

### Enable i2c and other interfaces
modprobe i2c-dev || true

### WIFI-CONNECT
# Choose a condition for running WiFi Connect according to your use case:

# 1. Is there a default gateway?
# ip route | grep default

# 2. Is there Internet connectivity?
# nmcli -t g | grep full

# 3. Is there Internet connectivity via a google ping?
wget --spider http://google.com 2>&1
if [ $? -eq 0 ]; then
  printf "\nconnected to internet, skipping wifi-connect\n\n"
else
  printf "\nnot connected, starting wifi-connect\n\n"
  ./wifi-connect --activity-timeout 600
fi

### Start app
node /usr/src/app/index.js
