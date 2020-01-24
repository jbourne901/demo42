#!/bin/bash

eas() {
  ./execAsSuper.sh $1 >>$logfile 2>&1
  checkErr $1
}

ewu() {
  ./execScriptWithUser.sh $1 >>$logfile 2>&1
  checkErr $1
}

ewucdb() {
  ./execScriptWithUserCurrentDB.sh $1 >>$logfile 2>&1
  checkErr $1
}


ewd() {
  ./execScriptWithDB.sh $1 >>$logfile 2>&1
  checkErr $1
}

checkErr() {
  if [ $? -eq 0 ]; then
     rm -f /tmp/$1
  else
     echo $1 FAIL
     rm -f /tmp/$1
     exit 1
  fi
  grep -i error $logfile |egrep -v "unknown err" |egrep -v errors |egrep -v error_
  if [ $? -eq 1 ]; then
     rm -f /tmp/$1
  else
     echo $1 FAIL
     rm -f /tmp/$1
     exit 1
  fi

  grep FAIL $logfile
  if [ $? -eq 1 ]; then
     rm -f /tmp/$1
  else
     echo $1 FAIL
     rm -f /tmp/$1
     exit 1
  fi
  echo $1 OK
}

es() {
  ./execScript.sh $1 >>$logfile 2>&1
  checkErr $1
}


ess() {
  ./execScriptAsSuper.sh $1 >>$logfile 2>&1
  checkErr $1
}


