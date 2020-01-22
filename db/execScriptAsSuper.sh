#!/bin/bash

  echo "Executing as superuser $1 $dbname $dbpass"
  cat $1 | sed 's/\${PGPASS}/'"$dbpass"'/' > /tmp/$1

  PGPASSWORD=$dbpass psql $dbname  -q -U postgres -f /tmp/$1


