#!/bin/sh

FILE=.knip.json
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

knip --config ${FILE} --exclude dependencies,unlisted

echo "knip review completed!"