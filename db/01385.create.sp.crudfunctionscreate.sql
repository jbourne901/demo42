call TRACE('create SP CRUDFunctionsCreate');

create or replace procedure CRUDFunctionsCreate(tablename entitytable.table%TYPE)
as $spcc1$
declare
begin

call ListFunctionCreate(tablename);
call GetFunctionCreate(tablename);
call AddFunctionCreate(tablename);
call UpdateFunctionCreate(tablename);
call DeleteFunctionCreate(tablename);
call SaveFunctionCreate(tablename);


end
$spcc1$
language plpgsql;






call TRACE('create SP TestCRUDFunctionsCreate');

create or replace procedure  TestCRUDFunctionsCreate()
as $$
declare
begin

call TRACE( concat('TestCRUDFunctionsCreate ') );
call CRUDFunctionsCreate('workgroups');

end
$$
language plpgsql;


call TestCRUDFunctionsCreate();
