# Use latest node version
FROM node:latest
MAINTAINER Simon Reinisch <toports@gmx.de>

# Use app directory as working dir
WORKDIR /app

# Upgrade
RUN apt-get update && \
    apt-get upgrade -y

# Copy content into the container at /app
COPY . /app

# Expost port 3000
EXPOSE 3000

# Run setup script
CMD 'docker/vue-cloudfront.sh'
