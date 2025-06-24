# MongoDB con docker

Esta carpeta contiene el docker-compose para crear la imagen de mongo y mongo express. Contienen un scritp .js para crear las colecciones.
Si se da el caso de que mongo ya tenga datos anteriormente, el .js no hara nada. (Si este es el caso usar docker-compose down -v).

Para ejecutar usar docker-compose up --build
