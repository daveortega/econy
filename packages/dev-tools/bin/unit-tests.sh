#!/bin/sh

FILE=.jest.config.json
LEVEL_UP="../"
RELATIVE_PATH=""

while [ true ]
do
  if [ -f "$FILE" ]; then
    echo "Config file found at $FILE"
    break
  else
    FILE="${LEVEL_UP}${FILE}"
    RELATIVE_PATH="${LEVEL_UP}${RELATIVE_PATH}"
  fi
done

export NODE_CONFIG_DIR="${RELATIVE_PATH}config"

echo "NODE_CONFIG_DIR set to $NODE_CONFIG_DIR"

jest --config $FILE --rootDir . $@

echo "Unit testing completed!"