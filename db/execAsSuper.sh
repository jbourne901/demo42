#!/bin/bash

  echo "Executing $1 $dbname"
  PGPASSWORD=$dbpass psql postgres -q -U postgres -f $1 



