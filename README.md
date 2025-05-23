# 🚀 Deploy Dockerized Web App on EC2 with Nginx

This guide walks you through deploying a simple Node.js app using Docker on an AWS EC2 instance, reverse-proxying it via NGINX.

---

## ✅ Step 1: Launch EC2 Instance

- OS: Ubuntu 22.04
- Instance type: `t2.micro` (Free Tier)
- Security group:
  - Allow **port 22** (SSH)
  - Allow **port 80** (HTTP)
  - Allow **port 443** (HTTPS)

![image](https://github.com/AmanSharma39/docker-nginx-webapp/blob/ec4629da93f1da4c024adcb079f44a9b3830429e/Screenshot%202025-05-22%20175956.png)
![image](https://github.com/AmanSharma39/docker-nginx-webapp/blob/ec4629da93f1da4c024adcb079f44a9b3830429e/Screenshot%202025-05-22%20175935.png)
---

## ✅ Step 2: SSH into EC2

```bash
ssh -i your-key.pem ubuntu@<your-ec2-public-ip>
```
---
## ✅ Step 3: Install Required Software

```bash
sudo apt update && sudo apt upgrade -y

# Docker
sudo apt install docker.io -y
sudo systemctl enable docker
sudo systemctl start docker

# Docker Compose
sudo apt install docker-compose -y

# NGINX
sudo apt install nginx -y
```
---
## ✅ Step 4: Create a Sample Node.js App
```bash
mkdir myapp && cd myapp
```
### index.html

```bash
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello from Docker on EC2!'));
app.listen(5000, () => console.log('App running on port 5000'));
```
### package.json
```bash
{
  "name": "myapp",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```
### Dockerfile

```bash
FROM node:18
WORKDIR /app

COPY . .
RUN npm install
EXPOSE 5000
CMD ["node", "index.js"]
```
---
## ✅ Step 5: Docker Compose Setup

```bash
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
```
### Run it:
```bash
sudo docker-compose up -d
```
![image](https://github.com/AmanSharma39/docker-nginx-webapp/blob/ec4629da93f1da4c024adcb079f44a9b3830429e/Screenshot%202025-05-22%20192308.png)
![image](https://github.com/AmanSharma39/docker-nginx-webapp/blob/ec4629da93f1da4c024adcb079f44a9b3830429e/Screenshot%202025-05-22%20192559.png)
![image](https://github.com/AmanSharma39/docker-nginx-webapp/blob/ec4629da93f1da4c024adcb079f44a9b3830429e/Screenshot%202025-05-22%20192709.png)
---

## ✅ Step 6: Configure NGINX Reverse Proxy
### Edit the NGINX default config:

```bash 
sudo nano /etc/nginx/sites-available/default
```
### Replace with:
```bash 
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
### Then reload:
```bash
sudo nginx -t
sudo systemctl restart nginx
```
---
## ✅ Step 7: Test in Browser
### Visit:
```bash
http://<your-ec2-public-ip>
```
![image](https://github.com/AmanSharma39/docker-nginx-webapp/blob/ec4629da93f1da4c024adcb079f44a9b3830429e/Screenshot%202025-05-22%20193906.png)
---
## ✅ Step 8: To pause everything 
```bash 
cd ~/myapp
sudo docker-compose down
sudo systemctl stop nginx
``` 
---
## ✅ Step 9: To resume
```bash
sudo docker-compose up -d
sudo systemctl start nginx
```
