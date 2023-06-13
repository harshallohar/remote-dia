# Architecture

- All softwares run on ubuntu server.
  - Except for grafana which is running on managed Grafana cloud -> [aprodrive2022.grafana.net](aprodrive2022.grafana.net).
- [InfluxDB](www.influxdata.com) is used to store Remote Dagnosis data.
- Scripts are written in nodeJS to:
  - collect and store RD data.
  - provide functionality to name pic IDs.

Server OS: **UBUNTU**

# Software needed

## Node JS

### Notes

- Installed using nvm.

### Steps

1. Install nvm. [Instructions](https://github.com/nvm-sh/nvm)
2. `nvm install node`
3. Checking: `node -v`

## Influx DB

1. Download **.deb** file from [here](https://docs.influxdata.com/influxdb/v2.5/install/?t=Linux)
2. `sudo dpkg -i <.deb file>`
3. `sudo systemctl start influxdb`
4. Check: `sudo systemctl status infuxdb`
5. InfluxDb listens on localhost:8086
6. Go to <ip_addr:8086>. Setup buckets to store data, generate api keys which would be used inside nodeJS scripts.

## SQLite

1. `sudo apt install sqlite3`
2. check: `sqlite3 --version`


## PM2

1. `npm install -g pm2`
2. Check: `pm2 -v`

## Nginx

1. `sudo apt install nginx`
2. `sudo systemctl start nginx`
3. `systemctl status nginx`

# Transfering latest-stable commit of nodeJS scripts to server

## Notes
- There is makefile inside each script
- This is done on your local machine
- The naming_service and the main data collection api are in a single repository.
- The naming_service is inside the folder by same name
- Run `make create-zip` which creates zip packages to be uploaded to server

## Steps

1. Transfer files to server using scp: `scp -i <private key> <file_name> ubuntu@3.136.155.225:/home/ubuntu`
2. Add .env files inside root folder
3. Run make prod inside each folders
4. PM2  [follow these instructions](https://pm2.keymetrics.io/docs/usage/startup/)
5. Add nginx configuration file to /etc/nginx/sites-enabled, and reload nginx

