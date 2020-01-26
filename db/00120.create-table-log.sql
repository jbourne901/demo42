call TRACE(' create table log');

drop table if exists log;

create table log(
  ts timestamp default now(), 
  str text,
  str2 text,
  js JSON,
  js2 JSON,
  js3 JSON
);

