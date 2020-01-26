call TRACE(' create procedure makeramtablespace');



CREATE OR REPLACE procedure makeramtablespace(postgrespass varchar(30))
as $func$
declare connstr varchar(200);
BEGIN
   IF EXISTS (SELECT 1 FROM pg_tablespace WHERE spcname = 'ram') THEN
      call TRACE('Tablespace ram already exists - skipping.');
      return;
   END IF;

   select concat('hostaddr=127.0.0.1 port=5432 user=postgres password=', postgrespass, ' dbname=',current_database()) into connstr;
   CALL TRACE( concat(' makeramtablespace ', connstr ) ); 
   PERFORM dblink_connect(connstr);
   PERFORM dblink_exec( 'CREATE TABLESPACE ram LOCATION ''/dev/shm/postgres''' );
   call TRACE('Tablespace ram created.');
   PERFORM dblink_disconnect();
END
$func$  LANGUAGE plpgsql;



