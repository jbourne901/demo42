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

call LocalizationAdd2('global', 'buttonlabel_add', 'Add', 'Anadir');
call LocalizationAdd2('global', 'buttonlabel_delete', 'Delete', 'Eliminar');
call LocalizationAdd2('global', 'buttonlabel_edit', 'Edit', 'Editar');
call LocalizationAdd2('global', 'column_actions', 'Actions', 'Aciones');
call LocalizationAdd2('global', 'buttonlabel_save', 'Save', 'Salvar');
call LocalizationAdd2('global', 'buttonlabel_cancel', 'Cancel', 'Cancelar');



call LocalizationAdd2('user_list', 'column_name', 'Name', 'Nombre');
call LocalizationAdd2('user_list', 'column_username', 'Username', 'Nombre de usario');

call LocalizationAdd2('user_edit', 'fieldname_name', 'Name', 'Nombre');
call LocalizationAdd2('user_edit', 'fieldname_username', 'Username', 'Nombre de usario');
call LocalizationAdd2('user_edit', 'fieldname_password', 'Password', 'Contrasena');
call LocalizationAdd2('user_edit', 'fieldname_password2', 'Confirm password', 'Confirmar contrasena');
call LocalizationAdd2('user_edit', 'pageheader', 'Edit User', 'Editar Usario');


call LocalizationAdd2('global', 'error_fieldname_required', '${fieldname} is required', '${fieldname} is obligatoro');
call LocalizationAdd2('global', 'error_fieldname_mustbeunique', '${fieldname} must be unique', '${fieldname} debe ser unico');

call LocalizationAdd2('user_edit', 'error_passwordsdontmatch', 'Passwords dont match', 'La contracenas no coinciden');

call LocalizationAdd2('queue_list', 'column_name', 'Name', 'Nombre');

call LocalizationAdd2('global', 'confirm_listitemdelete', 'Are you sure you want to delete ${entity} ${name}?',
                                                         '¿Estás seguro de que deseas eliminar ${entity} ${name}?');

end
$$
language plpgsql;


call LocalizationFillJSON();

