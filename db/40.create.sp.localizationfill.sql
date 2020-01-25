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

call LocalizationAdd2('landingpage', 'pageheader', 'Select a menu option', 'Selectione una opcion de menu');
call LocalizationAdd2('navbarmenu', 'loggedinas', 'Logged in as', 'Conectado como');

call LocalizationAdd2('navbarmenu', 'users', 'Users', 'Usarios');
call LocalizationAdd2('navbarmenu', 'campaigns', 'Campaigns', 'Campanas');

call LocalizationAdd2('navbarmenu', 'logout', 'Logout', 'Cerrar session');




end
$$
language plpgsql;


call LocalizationFillJSON();

