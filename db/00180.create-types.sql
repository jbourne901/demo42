call TRACE(' create types');

drop domain if exists TYPE_PK;
drop domain if exists TYPE_ORDNO;

create domain TYPE_PK AS BIGINT NOT NULL ;
create domain TYPE_ORDNO AS INT NOT NULL;

drop domain if exists TYPE_LOCALIZEDLABEL;
create DOMAIN TYPE_LOCALIZEDLABEL varchar(500);

drop domain if exists TYPE_LANGUAGE;
create DOMAIN TYPE_LANGUAGE varchar(2);

drop domain if exists TYPE_SESSIONPARAM;
create DOMAIN TYPE_SESSIONPARAM JSONB;

