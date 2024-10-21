#!/bin/sh

FILE=.jest.config.json
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

jest --config $FILE --rootDir . $@

echo "Unit testing completed!"