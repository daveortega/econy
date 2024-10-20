#!/bin/sh
echo "Code review starts"

FILE=.eslint.yml
LEVEL_UP="../"

while [ true ]
do
  if [ -f "$FILE" ]; then
    echo "Config file found at $FILE"
    break
  else
    FILE="${LEVEL_UP}${FILE}"
  fi
done

eslint "$@" --config $FILE .

echo "Code review completed!"