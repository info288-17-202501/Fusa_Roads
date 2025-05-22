# Notas Sobre Minio

Minio es un servidor de almacenamiento de objetos de codigo abierto, es similar y compatible con S3.
Permite guardar y gestionar datos de forma eficiente.

[https://min.io/docs/minio/container/administration/concepts.html](Core administration concepts):Un objeto son datos binarios, a veces conocidos como binary large OBject (BLOB), Blobs pueden ser imagenes, archivos de audio, hojas de calculo, codigo ejecutable binario, y mucho mas.
Minio utiliza buckets para organizar objetos. Un bucket es similar a una carpeta o directorio en un sistema de archivos, donde cada bucket puede almacenar un numero arbitrario de objetos.
Minio permite tener multiples niveles de directorios anidados usando prefijos.

Minio requiere que cada cliente realize la autenticacion y la autorizacion para cada nueva operacion -> IAM
Minio usa **AWS signature version 4 protocol** para la autentificacion de los clientes.
Los clientes tienen que presentar
    - Clave de acceso valida
    - Clave secreta
Para acceder al API administrativa. (PUT, GET, DELETE)

Minio luego verifica que los clientes tienen autorizacion para realizar las acciones o usar recursos del despliegue. Minio usa policy-based access control(PBAC)

Minio soporta la encripcion de los objetos en el disco duro (encryption-at-rest) y la encripcion de los objetos mientras se transmiten de un lugar a otro (encryption-in-transit)

Mnio al usar prefijos para crear los directorios no limita la cantidad de objetos que un directorio puede contener. **Tambien condiciones de hardware y red pueden afectar al redimiento con prefijos largos.**

Quotes de la pagina de minio:

    - *"Deployments with modest or budget-focused hardware should architect their workloads to target 10,000 objects per prefix as a baseline. Increase this target based on benchmarking and monitoring of real world workloads up to what the hardware can meaningfully handle."*

    - *"Deployments with high-performance or enterprise-grade hardware can typically handle prefixes with millions of objects or more."*

Minio tiene **tiering rules** que permites que objetos accedidos frecuentemente queden guardados en 'hot or warm storage', lo cual es mas costoso pero ofrese mejor rendimiento.

Minio tiene un sistema de 'Locking' para bloquear objetos y asi evitando la eliminacion o modificacion hasta que se retire el bloqueo. Tiene:
    - legal holds: bloquea indifinidamente para todos los usuarios
    - Compliance holds: restricciones temporales para todos los usuarios
    - Governing locks: reglas temporales para usuarios sin privilegios

Normalmente objetos con el mismo nombre(incluyendo prefijo) se sobrescriben pero existe una opcion para tener objetos con multiples versiones en un mismo bucket.

Minio requiere accesso exclusivo a los drives o volumenes dados para el manejo del almacenamiento de objetos. Niun otro proceso, software, scripts o personas deberian realizar niuna accion directamente a estos almacenamientos[https://min.io/docs/minio/container/administration/object-management.html](Object management)





