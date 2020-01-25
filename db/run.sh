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
es 9.5.create.sp.splitstring.sql
es 9.6.create.sp.kvjson.sql
es 9.7.create.sp.squot.sql
es 9.8.create.sp.dquot.sql



ess 10.create-extension-dblink.sql
es 11.create.sp.makeramtablespace.sql
ess 12.createtablespace.sql

es 13.drop-tables.sql

es 13.0.1.create.table.entitytable.sql
es 13.0.1.1.create.sp.eventnotify.sql
es 13.0.2.create.sp.entityregister.sql
es 13.0.2.1.create.table.language.sql
es 13.0.2.2.create.sp.languagefill.sql
es 13.0.2.3.create.sp.languagelist.sql
es 13.0.2.4.create.sp.languagelistalljson.sql


es 13.0.3.create-table-localization.sql
es 13.0.4.create.sp.localizationlistjson.sql
es 13.0.5.create.sp.localizationaddjson.sql
es 13.0.7.create.sp.localizationadd2.sql



es 13.2.create.sp.eventlistenjson.sql

es 14.create-table-users.sql
es 15.create.sp.userlistjson.sql
es 16.create.sp.usergetjson.sql
es 17.create.sp.userupdatejson.sql
es 18.create.sp.useraddjson.sql
es 19.create.sp.userdeletejson.sql
es 20.create.sp.usersavejson.sql
es 21.create.sp.users.notify.sql

es 24.create-sp-admin-user-add.sql
es 25.create-sp-userloginjson.sql

es 26.create-table-epage.sql
es 26.1.create.sp.standardaddactionjson.sql
es 26.2.create.sp.standardeditactionjson.sql
es 26.3.create.sp.standarddeleteactionjson.sql
es 26.4.create.sp.standardpageactionsjson.sql
es 26.5.create.sp.standardsaveactionjson.sql
es 26.6.create.sp.standardcancelactionjson.sql
es 26.7.create.sp.standardeditactionsjson.sql
es 26.9.create.sp.standardlistfieldjson.sql
es 26.9.1.create.sp.standardlistfieldfromtextjson.sql
es 26.10.create.sp.standardlistfieldsjson.sql
es 26.11.create.sp.standardlistpagejson.sql

es 26.12.create.sp.standardtextfieldjson.sql
es 26.13.create.sp.standardtextfieldfromtextjson.sql
es 26.14.create.sp.standardtextfieldsjson.sql
es 26.15.create.sp.standardeditpagejson.sql

es 27.create.sp.epageaddjson.sql
es 27.1.create.sp.standardepageaddjson.sql

es 29.create.sp.epagelistjson.sql
es 30.create.sp.epagegetjson.sql
es 30.1.create.sp.epageactionsetnextpage.sql
es 31.create.sp.epageactiongetjson.sql

es 32.create-table-queue.sql
es 33.create.sp.queuelistjson.sql
es 34.create.sp.queuegetjson.sql
es 35.create.sp.queueupdatejson.sql
es 36.create.sp.queueaddjson.sql
es 37.create.sp.queuedeletejson.sql
es 38.create.sp.queuesavejson.sql
es 39.create.sp.queue.notify.sql

es 40.create.sp.localizationfill.sql
es 41.create.sp.localizationlistalljson.sql
es 42.create.sp.listfunctioncreate.sql
es 43.create.sp.addfunctioncreate.sql
es 44.create.sp.updatefunctioncreate.sql
es 45.create.sp.getfunctioncreate.sql
es 46.create.sp.deletefunctioncreate.sql
es 47.create.sp.crudfunctionscreate.sql


