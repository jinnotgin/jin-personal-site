---
slug: alastair
name: Alastair
thread: homegrown
year: 2016
status: archived
intent: A private, cloud-less home automation platform for IoT devices and sensors.
stack: [Python, Raspberry Pi, OpenWRT, IoT, sensor algorithms]
links: [GitHub::https://github.com/jinnotgin/alastair]
images: [/img/projects/alastair-illustration.jpeg::Alastair system illustration showing a private home automation setup., /img/projects/alastair-main.png::Alastair interface for monitoring and controlling home devices.]
---

## Why it existed

Most smart home systems depended on third-party cloud services, which made convenience feel tied to avoidable security and privacy tradeoffs.

## The friction it answered

I wanted a smart home implementation that could control lights, plugs, cooling, presence, occupancy, and camera streaming without handing the core control loop to an external provider.

## What was built

A full-stack system across Raspberry Pi, ESP8266 plugs, Yeelight bulbs, IR control, temperature and light sensors, PIR motion sensing, Python watchdog scripts, OpenWRT scripts, LIRC, EventGhost, ARP scans, Bluetooth detection, and a web interface.

## What it left behind

Completed in March 2016 and archived, but it remains the clearest early marker of the homegrown systems thread: local control, readable source, and a willingness to wire hardware, scripts, and realtime sensor algorithms together.
