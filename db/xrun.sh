#!/bin/bash

source ./.env

export logfile=log

source ./scripts.sh


mkdir -p /dev/shm/postgres
chown postgres:postgres /dev/shm/postgres

rm -f $logfile


es 9.5.create.sp.splitstring.sql

