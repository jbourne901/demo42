#!/bin/bash

source ./.env

export logfile=log

source ./scripts.sh


rm -f $logfile

es 13.0.4.create.sp.localizationlistjson.sql

