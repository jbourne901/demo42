
DO
$body$
BEGIN

raise notice ' Dropping DB';

END
$body$
;


drop database if exists ${DBNAME};

DO
$body$
BEGIN
raise notice 'creating DB';


END
$body$;


create database ${DBNAME};

--SET AUTOCOMMIT;


