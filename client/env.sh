#!/bin/sh
for i in $(env | grep VITE_)
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)
    echo $key=$value
    # sed All files
    # find /var/www/html/public -type f -exec sed -i "s|${key}|${value}|g" '{}' +

    # sed JS and CSS only
    find /var/www/html/public -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|${key}|${value}|g" '{}' +
done