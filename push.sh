#!/bin/bash

git add .

read -p "Commit message: " msg

if [ -z "$msg" ]; then
  msg="update project"
fi

git commit -m "$msg" || true
git push origin1 main
git push origin2 main
