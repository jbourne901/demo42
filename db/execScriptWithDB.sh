#!/bin/bash

  echo "Executing as superuser $1 $dbname $dbpass"
  cat $1 | sed 's/\${PGPASS}/'"$dbpass"'/' | sed 's/\${DBNAME}/'"$dbname"'/'  > /tmp/$1

  PGPASSWORD=$dbpass psql -q -U postgres -f /tmp/$1


