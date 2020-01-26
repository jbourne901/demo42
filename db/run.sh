#!/bin/bash

source ./.env

export logfile=log

source ./scripts.sh


mkdir -p /dev/shm/postgres
chown postgres:postgres /dev/shm/postgres

rm -f $logfile



ewu 00010.createuser.sql
ewd 00030.recreatedb.sql
ewucdb 00070.grant.sql
es 00100.create.sp.trace.sql
es 00120.create-table-log.sql
es 00125.create-sp-logadd.sql
es 00130.create-sp-logjsonadd.sql

ess 00150.create-extension-dblink.sql
ess 00151.create-extension-uuid.sql
ess 00152.create-extension-pgcrypto.sql

es 00160.create.sp.makeramtablespace.sql
ess 00170.createtablespace.sql


es 00180.create-types.sql



es 00200.create.sp.jsetstr.sql
es 00205.create.sp.jsetint.sql
es 00210.create.sp.jsetjson.sql
es 00215.create.sp.jarraddstr.sql
es 00220.create.sp.jarraddint.sql
es 00230.create.sp.jarraddjson.sql

es 00240.create.sp.splitstring.sql
es 00245.create.sp.kvjson.sql
es 00250.create.sp.squot.sql
es 00255.create.sp.dquot.sql

es 00260.create.sp.ensure.sql


es 00300.create.sp.successwithpayloadjson.sql
es 00310.create.sp.unknownerrjson.sql
es 00315.create.sp.successwithoutpayload.sql
es 00320.create.sp.errsjson.sql


es 00400.drop-tables.sql

es 00450.create.table.entitytable.sql
es 00480.create.sp.eventnotify.sql
es 00485.create.sp.entityregister.sql
es 00550.create.table.language.sql
es 00555.create.sp.languagefill.sql
es 00600.create-table-localization.sql

es 00660.create.sp.eventlistenjson.sql
es 00670.create.sp.passwordhash.sql

es 00700.create-table-users.sql
es 00800.create.table.session.sql

es 00801.create.sp.testsession.sql
es 00802.create.sp.validatesessionjson.sql


es 00803.create.sp.languagelist.sql
es 00804.create.sp.languagelistalljson.sql
es 00805.create.sp.localizationlistjson.sql
es 00806.create.sp.localizationaddjson.sql
es 00807.create.sp.localizationadd2.sql


es 00810.create.sp.userlistjson.sql
es 00820.create.sp.usergetjson.sql
es 00830.create.sp.userupdatejson.sql
es 00850.create.sp.useraddjson.sql
es 00860.create.sp.userdeletejson.sql
es 00870.create.sp.usersavejson.sql
es 00880.create.sp.users.notify.sql
es 00900.create-sp-admin-user-add.sql
es 00910.create-sp-userloginjson.sql

es 01100.create-table-epage.sql
es 01120.create.sp.standardaddactionjson.sql
es 01125.create.sp.standardeditactionjson.sql
es 01130.create.sp.standarddeleteactionjson.sql
es 01135.create.sp.standardpageactionsjson.sql
es 01140.create.sp.standardsaveactionjson.sql
es 01145.create.sp.standardcancelactionjson.sql
es 01150.create.sp.standardeditactionsjson.sql
es 01155.create.sp.standardlistfieldjson.sql
es 01160.create.sp.standardlistfieldfromtextjson.sql
es 01165.create.sp.standardlistfieldsjson.sql
es 01170.create.sp.standardlistpagejson.sql
es 01175.create.sp.standardtextfieldjson.sql
es 01180.create.sp.standardtextfieldfromtextjson.sql
es 01185.create.sp.standardtextfieldsjson.sql
es 01190.create.sp.standardeditpagejson.sql
es 01195.create.sp.epageaddjson.sql
es 01200.create.sp.standardepageaddjson.sql
es 01205.create.sp.epagelistjson.sql
es 01210.create.sp.epagegetjson.sql
es 01215.create.sp.epageactionsetnextpage.sql
es 01220.create.sp.epageactiongetjson.sql

es 01260.create-table-queue.sql
es 01265.create.sp.queuelistjson.sql
es 01270.create.sp.queuegetjson.sql
es 01275.create.sp.queueupdatejson.sql
es 01280.create.sp.queueaddjson.sql
es 01285.create.sp.queuedeletejson.sql
es 01290.create.sp.queuesavejson.sql
es 01295.create.sp.queue.notify.sql
es 01350.create.sp.localizationfill.sql
es 01355.create.sp.localizationlistalljson.sql

es 01360.create.sp.listfunctioncreate.sql
es 01365.create.sp.addfunctioncreate.sql
es 01370.create.sp.updatefunctioncreate.sql
es 01375.create.sp.getfunctioncreate.sql
es 01380.create.sp.deletefunctioncreate.sql
es 01385.create.sp.crudfunctionscreate.sql


