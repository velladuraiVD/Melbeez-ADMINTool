# Melbeez-ADMINTool
Melbeez Admin Tool Code repository

Docker Build and Run Command

```sh
docker build -f Dockerfile -t melbeez-admin .

docker run --name Melbeez-UI -it -p 3005:3005 melbeez-admin
