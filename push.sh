#!/bin/bash

git add .

read -p "Commit message: " msg

if [ -z "$msg" ]; then
  msg="update project"
fi

git commit -m "$msg"
git push origin main
