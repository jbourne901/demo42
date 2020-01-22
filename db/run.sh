#!/bin/bash

source ./.env

export logfile=log

source ./scripts.sh


mkdir -p /dev/shm/postgres
chown postgres:postgres /dev/shm/postgres

rm -f $logfile



ewu 1.createuser.sql
ewd 2.recreatedb.sql
ewucdb 3.grant.sql
es 4.create.sp.trace.sql
es 5.create-table-log.sql
es 6.create-sp-logadd.sql
es 7.create-sp-logjsonadd.sql
es 8.create-types.sql

es 8.1.create.sp.jsetstr.sql
es 8.2.create.sp.jsetint.sql
es 8.3.create.sp.jsetjson.sql
es 8.4.create.sp.jarraddstr.sql
es 8.5.create.sp.jarraddint.sql
es 8.6.create.sp.jarraddjson.sql


es 9.create.sp.ensure.sql
es 9.1.create.sp.successwithpayloadjson.sql
es 9.2.create.sp.unknownerrjson.sql
es 9.3.create.sp.successwithoutpayload.sql
es 9.4.create.sp.errsjson.sql


ess 10.create-extension-dblink.sql
es 11.create.sp.makeramtablespace.sql
ess 12.createtablespace.sql
es 13.drop-tables.sql

es 14.create-table-users.sql
es 15.create.sp.userlistjson.sql
es 16.create.sp.usergetjson.sql
es 17.create.sp.userupdatejson.sql
es 18.create.sp.useraddjson.sql
es 19.create.sp.userdeletejson.sql
es 20.create.sp.usersavejson.sql

es 24.create-sp-admin-user-add.sql
es 25.create-sp-userloginjson.sql

es 26.create-table-epage.sql
es 27.create.sp.epageaddjson.sql
es 29.create.sp.epagelistjson.sql
es 30.create.sp.epagegetjson.sql
es 30.1.create.sp.epageactionsetnextpage.sql
es 31.create.sp.epageactiongetjson.sql

