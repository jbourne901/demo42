
drop domain if exists TYPE_EPAGEID;
CREATE DOMAIN TYPE_EPAGEID bigint;

drop domain if exists TYPE_EPAGENAME;
CREATE DOMAIN TYPE_EPAGENAME varchar(50);

drop domain if exists TYPE_EPAGELABEL;
CREATE DOMAIN TYPE_EPAGELABEL varchar(50);

drop domain if exists TYPE_EPAGEQUERY;
CREATE DOMAIN TYPE_EPAGEQUERY varchar(50);

drop domain if exists TYPE_EPAGETYPE;
CREATE DOMAIN TYPE_EPAGETYPE varchar(20);


drop domain if exists TYPE_EPAGEPKNAME;
CREATE DOMAIN TYPE_EPAGEPKNAME varchar(20);

drop domain if exists TYPE_EPAGEENTITY;
CREATE DOMAIN TYPE_EPAGEENTITY varchar(40);


call TRACE('create table epage');

create table epage(
  id SERIAL PRIMARY KEY,
  entity TYPE_EPAGEENTITY,
  name TYPE_EPAGENAME NOT NULL,
  label TYPE_EPAGELABEL,
  type TYPE_EPAGETYPE NOT NULL,  -- list, edit
  query TYPE_EPAGEQUERY,
  pkname TYPE_EPAGEPKNAME,
  ordno int
);

create unique index ix_epage_epagename on epage(name);
------------------------------------------------------------------


drop domain if exists TYPE_EPAGEFIELDID;
CREATE DOMAIN TYPE_EPAGEFIELDID bigint;

drop domain if exists TYPE_EPAGEFIELDNAME;
CREATE DOMAIN TYPE_EPAGEFIELDNAME varchar(50);

drop domain if exists TYPE_EPAGEFIELDLABEL;
CREATE DOMAIN TYPE_EPAGEFIELDLABEL varchar(50);


drop domain if exists TYPE_EPAGEFIELDTYPE;
CREATE DOMAIN TYPE_EPAGEFIELDTYPE varchar(20);


call TRACE('create table epagefield');

create table epagefield (
  id SERIAL PRIMARY KEY,
  name TYPE_EPAGEFIELDNAME NOT NULL,
  label TYPE_EPAGEFIELDLABEL,
  type TYPE_EPAGEFIELDTYPE,
  ordno int,
  epageid TYPE_EPAGEID,
  FOREIGN KEY(epageid) references epage(id) on delete cascade
);

create unique index ix_epagefield_epageid_name on epagefield(epageid, name);
------------------------------------------------------------------

drop domain if exists TYPE_EPAGEACTIONID;
CREATE DOMAIN TYPE_EPAGEACTIONID bigint;

drop domain if exists TYPE_EPAGEACTIONAME;
CREATE DOMAIN TYPE_EPAGEACTIONNAME varchar(40);
drop domain if exists TYPE_EPAGEACTIONLABEL;
CREATE DOMAIN TYPE_EPAGEACTIONLABEL varchar(40);
drop domain if exists TYPE_EPAGEACTIONQUERY;
CREATE DOMAIN TYPE_EPAGEACTIONQUERY varchar(40);
drop domain if exists TYPE_EPAGEACTIONTYPE;
CREATE DOMAIN TYPE_EPAGEACTIONTYPE varchar(20);

drop domain if exists TYPE_EPAGEACTIONCONFIRM;
CREATE DOMAIN TYPE_EPAGEACTIONCONFIRM varchar(200);

drop domain if exists TYPE_EPAGEACTIONISITEMACTION;
CREATE DOMAIN TYPE_EPAGEACTIONISITEMACTION bool;

drop domain if exists TYPE_EPAGEACTIONLOCATION;
CREATE DOMAIN TYPE_EPAGEACTIONLOCATION varchar(50);

drop domain if exists TYPE_EPAGEACTIONSTYLE;
CREATE DOMAIN TYPE_EPAGEACTIONSTYLE varchar(50);



call TRACE('create table epageaction');

create table epageaction (
  id SERIAL PRIMARY KEY,
  name TYPE_EPAGEACTIONNAME NOT NULL,
  label TYPE_EPAGEACTIONLABEL,
  type TYPE_EPAGEACTIONTYPE NOT NULL,
  nextpage TYPE_EPAGENAME,
  confirm TYPE_EPAGEACTIONCONFIRM,
  query TYPE_EPAGEACTIONQUERY,
  isitemaction TYPE_EPAGEACTIONISITEMACTION NOT NULL default false,
  ordno int NOT NULL,
  epageid TYPE_EPAGEID,
  location TYPE_EPAGEACTIONLOCATION,
  style TYPE_EPAGEACTIONSTYLE,
  FOREIGN KEY(epageid) references epage(id) on delete cascade
);

create unique index ix_epageaction_epageid_name on epageaction(id, name);
------------------------------------------------------------------


