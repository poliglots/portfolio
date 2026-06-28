#!/bin/bash

clearNcommit(){
    git checkout --orphan new-main

    git add .
    git commit -m "always 1st"

    git branch -D main

    git branch -m main

    git push --force --set-upstream origin main
}



read -t 10 -p "Enter code to proceed (you have 10 seconds): " code
if [ -z "$code" ]; then
    echo ""
    echo "No code entered within the time limit."
elif [ "$code" == "go" ]; then
    echo "clearing old commits and pushing fresh ones"
    clearNcommit
else
  echo "Invalid choice. Please enter correct code"
  exit 1
fi