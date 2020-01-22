#!/bin/bash

  echo "Executing as superuser $1 $dbname $dbpass $username $userpass"
  cat $1 | sed 's/\${PGPASS}/'"$dbpass"'/' | sed 's/\${USERPASS}/'"$userpass"'/' | sed 's/\${USERNAME}/'"$username"'/' > /tmp/$1
  cp  /tmp/$1 /tmp/log

  PGPASSWORD=$dbpass psql $dbname -q -U postgres -f /tmp/$1


