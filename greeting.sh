#!/bin/bash

# Get the current hour (00-23)
HOUR=$(date +%H)

# Get the full current date and time
CURRENT_DATE=$(date)

echo "----------------------------------------"

if [ $HOUR -lt 12 ]; then
  echo "Good morning!"
elif [ $HOUR -lt 18 ]; then
  echo "Good afternoon!"
else
  echo "Good evening!"
fi

echo "It is currently: $CURRENT_DATE"
echo "----------------------------------------"
