## Install node js and npm
```
1- apt-get install build-essential libssl-dev
2- sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
3- curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
4- sudo apt -y install nodejs
5- sudo apt-get install nodejs
6- sudo apt -y  install gcc g++ make
7- node --version
8- npm --version
```


## Start Node JS application

```
1- npm install
2- export PORT=4000
3- export HOST_URL=https://yoururl.com
4- npm start

```


## Follow these steps to create a Docker container

```
1- cd ./helloSignDemo/
2- docker build -t hellosigndemo:1.0 .
3- docker run -p 5001:5000 -e HOST_URL=https://yoururl.com hellosigndemo:1.0

```
