#!/bin/bash
echo "Esperando que MongoDB esté disponible..."

# Esperar a que mongo acepte conexiones
until mongo --host mongo -u root -p example --authenticationDatabase admin --eval "print('mongo ready')" &>/dev/null
do
    sleep 2
done

echo "MongoDB está listo. Ejecutando script JS..."
mongo --host mongo -u root -p example --authenticationDatabase admin /docker-entrypoint-initdb.d/init.js