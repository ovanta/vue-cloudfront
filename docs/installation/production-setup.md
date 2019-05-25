## Production setup 
To run Vue Cloudfront in the production nmode you'll need a Virtual (or real) Private Server with root access.
We assume that you're using `Debian 9.5` in the following steps.

Assumptions for the rest of this tutorial:
* You're having root access to Debian Linux machine.
* We'll be using the local port 8080 for `vue-cloudfront-api` and 3000 for `vue-cloudfront`, this port should not be exposed as they will be hidden behind a nginx proxy;
* You have SSL certificate for your domain. SSL encryption is required for PWA + service workers;

Both, the frontend and api, are running in docker containers. So it's required to have [docker](https://www.docker.com/) 
and [docker-compose](https://docs.docker.com/compose/) on your machine. 
As proxy we're using [nginx](https://www.nginx.com/) and [certbot](https://certbot.eff.org/) as ssl certificate provider.
 
### Installation
First it's good to run the following commands to update exisiting packages and package repositories. Note: the following commands must be run as root.
```bash
apt update -y
apt upgrade -y
```

Next we need to install the required packages:
```bash

# Nginx
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Certbot
echo "deb http://ftp.debian.org/debian stretch-backports main" > /etc/apt/sources.list.d/stretch-backports.list
apt update -y
apt install -y python-certbot-nginx -t stretch-backports
```

Navigate to the directory where you wish to install `vue-cloudfront` and `vue-cloudfront-api`:
```bash

# Install git
apt install git -y

# Download both vue-cloudfront and vue-cloudfront-api
git clone https://github.com/vue-cloudfront/vue-cloudfront
git clone https://github.com/vue-cloudfront/vue-cloudfront-api
```

Be sure to make the docker entry-scripts of both the frontend and backend executable:
```bash
sudo chmod +x ./vue-cloudfront/docker/vue-cloudfront.sh
sudo chmod +x ./vue-cloudfront-api/docker/vue-cloudfront-api.sh
```

Run containers:
```bash
# Build and run vue-cloudfront
cd ./vue-cloudfront
docker build -f docker/Dockerfile . -t vue-cloudfront
docker run -p 3000:3000 -d vue-cloudfront

# Compose and run vue-cloudfront-api
cd ../vue-cloudfront-api
docker-compose up -d
```

After this is done, we need to configure nginx to proxy each request to its correspondending endpoint:
```bash
Domain=example.com
cat > /etc/nginx/conf.d/${Domain}.conf <<EOL
server {
    listen 80;
    server_name ${Domain};
    client_max_body_size 500M;

    location ~ (precache-manifest.*|service-worker)\.js {
        add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
        expires off;
        access_log off;
    }

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:8080/api;
    }
    
    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
    
    # Restrict TLS protocols and some ssl improvements
    ssl_ecdh_curve secp521r1:secp384r1;
    
    # Hide upstream proxy headers
    proxy_hide_header X-Powered-By;
    proxy_hide_header X-AspNetMvc-Version;
    proxy_hide_header X-AspNet-Version;
    proxy_hide_header X-Drupal-Cache;

    # Custom headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubdomains" always;
    add_header Referrer-Policy "no-referrer";
    add_header Feature-Policy "geolocation none; midi none; notifications none; push none; sync-xhr none; microphone none; camera none; magnetometer none; gyroscope none; speaker none; vibrate none; fullscreen self; payment none; usb none;";
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    # Close slow connections (in case of slow loris attack)
    client_body_timeout 10s;
    client_header_timeout 10s;
    keepalive_timeout 5s 5s;
    send_timeout 10s;
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
    ssl_certificate /etc/letsencrypt/live/[YOUR DOMAIN]/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/[YOUR DOMAIN]/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    ...
```
