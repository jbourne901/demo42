
drop domain if exists TYPE_USERID;
CREATE DOMAIN TYPE_USERID bigint;


call TRACE('create table users');

create table users(
id SERIAL PRIMARY KEY,
name varchar(50),
username varchar(20) not null,
hashpassword varchar(100),
language TYPE_LANGUAGE
);

create unique index ix_users_username on users(username);
------------------------------------------------------------------

call EntityRegister('user', 'users');


