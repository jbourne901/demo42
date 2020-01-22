#!/bin/bash


 echo "Executing $1 $dbname"
 PGPASSWORD=$dbpass psql $dbname -q -U postgres -f $1


