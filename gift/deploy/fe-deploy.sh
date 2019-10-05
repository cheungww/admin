#!/bin/sh

GIT_HOME=~/developer/git-repository/
DEST_PATH=~/product/front-end/

if [ ! -n "$1" ];
then
    echo -e "Please input a project name! You can input as follows:"
    echo -e "./fe-deploy.sh admin"
    exit
fi

if [ $1 = "admin" ];
then
    echo -e "---------Enter Project----------------"
    cd $GIT_HOME$1
else
    echo -e "Invalid Project Name"
    exit
fi

# clear build
echo -e "---------Clean Build-----------"
rm -rf ./build

echo -e "---------Git Pull--------------"
git pull

echo -e "---------Yarn Install----------"
yarn

echo -e "---------Yarn Run Build----------"
yarn build

if [ -d "./build" ];
then
    echo -e "---------clean Dest----------"
    rm -rf $DEST_PATH/build
    
    echo -e "---------copy Dest----------"
    cp -R ./build $DEST_PATH/$1/
    
    echo -e "---------Deploy Sucess----------"
else
    echo -e "---------Deploy Fail------------"
fi
