call TRACE('create SP LocalizationFillJSON');

create or replace procedure LocalizationFillJSON()
as $$
declare
begin

delete from localization;


call LocalizationAdd2('loginform', 'pageheader', 'Login to Solo', 'Entrar de SOLO');
call LocalizationAdd2('loginform', 'fieldlabel_username', 'Username', 'Nombre de usario');
call LocalizationAdd2('loginform', 'fieldlabel_password', 'Password', 'Contrasena');
call LocalizationAdd2('loginform', 'buttonlabel_login', 'Login', 'Entrar');
call LocalizationAdd2('loginform', 'error_loginfailed', 'Login failed', 'Error de inicio de sesion');


end
$$
language plpgsql;


call LocalizationFillJSON();

