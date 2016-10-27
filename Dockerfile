FROM node:4.5.0

RUN apt-get -y update && apt-get -y install screen && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

COPY entrypoint.sh /

ENTRYPOINT [ "/entrypoint.sh" ]
EXPOSE 5600
