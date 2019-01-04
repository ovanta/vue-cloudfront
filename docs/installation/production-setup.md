## Production setup 
To run Vue Cloudfront in the production nmode you'll need a Virtual (or real) Private Server with root access.
We assume that you're using `Debian 9.5` in the following steps.

Assumptions for the rest of this tutorial:
* You're having root access to Debian Linux machine.
* We'll be using the local port 8080 for `vue-cloudfront-api`, this port should not be exposed as they will be hidden behind a nginx proxy;
* You have SSL certificate for your domain. SSL encryption is required for PWA + service workers;

### Requirements
Dependencies
 1. git - _as vcs_ (Tested with v2.11.0)
 2. nginx - _as webserver_ (Tested with v11.5.0)
 3. mongodb - _as database_ (Tested with v4.0.5)
 4. node - _to install dependencies_ (Tested with v4.0.5)
 5. certbot - _to get an ssl certificate_ (Tested with 0.28.0)
 6. tmux - _to split processes_
 7. dirmngr - _to add the MongoDB public GPG Key_

Repositories
 1. vue-cloudfront (https://github.com/Simonwep/vue-cloudfront)
 2. vue-cloudfront-api (https://github.com/Simonwep/vue-cloudfront-api)
 
 
### Installation
First it's good to run the following commands to update exisiting packages and package repositories. Note: the following commands must be run as root.
```bash
apt update -y
apt upgrade -y
```

Next we need to install the required dependencies, although `tmux` is more a useful terminal multiplexer than a dependency.
```bash

# Git
apt install -y git

# tmux
apt install -y tmux

# dirmngr
apt install dirmngr

# Nodejs
curl -sL https://deb.nodesource.com/setup_11.x | bash -
apt install -y nodejs

# Nginx
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Certbot
echo "deb http://ftp.debian.org/debian stretch-backports main" > /etc/apt/sources.list.d/stretch-backports.list
apt update -y
apt install -y python-certbot-nginx -t stretch-backports

# Mongodb
echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/4.0 main" > /etc/apt/sources.list.d/mongodb-org-4.0.list
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
apt update -y
apt install -y mongodb-org
```

If you run into difficulties installing Certbot or MongoDB, please refer to their documentation: _[How to install Certbot](https://certbot.eff.org/lets-encrypt/debianstretch-nginx)_ and _[How to install MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/)_

Before we to install the frontend and api, we need to start MongoDB:
```bash
# Mongodb db folder
mkdir /data
mkdir /data/db

# Start mongodb in a tmux session
tmux new -d -s mongodb 'mongod'
```
We can always access MongoDB via `tmux a -t mongodb`. For more information, see http://man.openbsd.org/OpenBSD-current/man1/tmux.1

Now that all dependecies have been installed and MongoDB is running in the background, it's time to download the actual api and frontend.
Navigate to the directory where you wish to install `vue-cloudfront` and `vue-cloudfront-api` (`/opt/vue-cloudfront` is recommended):
```bash

# Download both vue-cloudfront and vue-cloudfront-api
git clone https://github.com/Simonwep/vue-cloudfront
git clone https://github.com/Simonwep/vue-cloudfront-api

# Install and build vue-cloudfront
cd ./vue-cloudfront
sudo npm i
npm run build

# Install and run vue-cloudfront-api
# If dependencies installation fails run 'rm package-lock.json' and run 'npm i' again
cd ../vue-cloudfront-api
sudo npm i

# Make storage directory
mkdir _storage

# Run vue-cloudfront-api in a tmux session
tmux new -d -s vue-cloudfront-api 'npm run launch'
```
As with MongoDB, we can access the process via `tmux a -t vue-cloudfront-api`

After this is done, we need to configure nginx to proxy each request to its correspondending endpoint:
```bash
Domain=example.com
VueCloudfrontPath=/home/me/vue-cloudfront
cat > /etc/nginx/conf.d/${Domain}.conf <<EOL
server {
    listen 80;
    server_name ${Domain};
    client_max_body_size 500M;

    location /service-worker.js {
        add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
        expires off;
        access_log off;
        root ${VueCloudfrontPath}/dist;
    }

    location / {
        autoindex on;
        root ${VueCloudfrontPath}/dist;
    }

    location /api {
        proxy_pass http://localhost:8080/api;
    }
}
EOL
```

To run a PWA, we also need SSL. To install a certificate, we'll use Certbot:
```
sudo certbot --nginx
```

Last but not least, we need to restart the nginx so that our changes get applied.
```
systemctl restart nginx
```

### Further improvements
There are some more things that can be done to improve performance.

#### HTTP/2
Since certbot doesn't automatically enable http/2, we'll need to enable it manually.
Navigate to `/etc/nginx/conf.d/[YOUR DOMAIN].conf` and add `http2` after `ssl`:
``` 
    ...
    location /api {
        proxy_pass http://localhost:8080/api;
    }

    listen 443 ssl http2; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/simonwep.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/simonwep.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    ...
```
