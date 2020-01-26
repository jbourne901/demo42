#!/bin/bash

source ./.env

export logfile=log

source ./scripts.sh


rm -f $logfile

es $1

