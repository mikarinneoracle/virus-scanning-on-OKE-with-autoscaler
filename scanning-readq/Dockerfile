FROM node:16.16.0

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN tar -xvf cls-l64-703-e.tar.gz

RUN ./install-uvscan -y

RUN mv avvdat-10637.zip /usr/local/uvscan/

RUN cd /usr/local/uvscan/ && unzip avvdat-10637.zip

CMD [ "node", "index.js" ]
