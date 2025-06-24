# MicroservicioVideos

Este microservicio tiene las funcionalidades para levantar un servidor para recibir solicitudes HTTP de la pagina de fusa. Tambien se tiene los recursos necesarios para realizar la carga masiva de datos.

Estos servicios asumen que los servicios de bases de datos ya estan levantados. (Para ver sobre esto ir a shared /**_service/)

Comandos a usar:

WARNING: Asegurar que el init.minio.sh este en LF, esto algo de caracteres que si esta en CRLF no dejara ejecutar el init-minio (Lo cual termina por no crear el bucket y carpetas)
![imagen_ejemplo](image.png)
