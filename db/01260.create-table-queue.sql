
drop domain if exists TYPE_QUEUEID;
CREATE DOMAIN TYPE_QUEUEID bigint;

drop domain if exists TYPE_QUEUENAME;
CREATE DOMAIN TYPE_QUEUENAME varchar(50);


call TRACE('create table queue');

create table queue(
id SERIAL PRIMARY KEY,
name TYPE_QUEUENAME not null
);

create unique index ix_queue_queuename on queue(name);
------------------------------------------------------------------

call EntityRegister('queue', 'Queue');

