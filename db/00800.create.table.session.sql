


call TRACE('create table session');

drop domain if exists TYPE_SESSIONKEY;
CREATE DOMAIN TYPE_SESSIONKEY varchar(100);



create table session(
id SERIAL PRIMARY KEY,
sessionkey TYPE_SESSIONKEY,
userid TYPE_USERID,
foreign key(userid) references users(id) on delete cascade
);


------------------------------------------------------------------

call EntityRegister('session', 'session');


