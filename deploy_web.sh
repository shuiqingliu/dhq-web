#!/bin/bash

if [ $# != 2 ] ; then
echo "USAGE: $0 username password"
exit 1;
fi

curl 'http://10.3.8.211' --data "DDDDD=$1&upass=$2&0MKKey=" > /dev/null 2>&1

#git pull
cd /root/dhq/dhq-web/
git checkout -- .
git checkout dev
git pull origin dev

#build
npm run build

#rm 
rm -rf /opt/dhq/dhq-web-static/*

#cp 
cp -rf /root/dhq/dhq-web/dist/* /opt/dhq/dhq-web-static/

curl http://10.3.8.211/F.htm > /dev/null 2>&1

