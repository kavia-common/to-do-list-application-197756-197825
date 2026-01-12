#!/bin/bash
cd /home/kavia/workspace/code-generation/to-do-list-application-197756-197825/backend_expressjs
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

