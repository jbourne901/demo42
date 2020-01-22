
DO  
$body$
        BEGIN
            raise notice  'Begin' ;
            CREATE ROLE ${USERNAME} LOGIN PASSWORD '${USERPASS}';
            GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${USERNAME};
        EXCEPTION WHEN others THEN
            raise notice 'user role exists, not re-creating';
        END
$body$

