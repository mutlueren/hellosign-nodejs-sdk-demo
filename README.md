## Start Node JS application

```
1- npm install
2- export PORT=4000
3- export HOST_URL=https://yoururl.com
4- npm start

```


## Follow these steps to create a Docker container

```
1- cd /helloSignDemo/
2- docker build -t hellosigndemo:1.0 .
3- docker run -p 5001:5000 -e HOST_URL=https://yoururl.com hellosigndemo:1.0

```
