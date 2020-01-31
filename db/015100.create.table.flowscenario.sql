

call TRACE('create table agentscenario');

create table agentscenario(
id SERIAL PRIMARY KEY,
name varchar(40) not null,
flow JSONB
);

create unique index ix_agentscenario_name on agentscenario(name);


create table agentscenariotemplate(
id SERIAL PRIMARY KEY,
name varchar(40),
label varchar(40),
ports JSONB,
flow JSONB
);


------------------------------------------------------------------

call EntityRegister('agentscenario', 'agentscenario');


