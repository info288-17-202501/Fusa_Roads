## ⚙️ Variables de Entorno
Asegúrate de tener un archivo `.env` en la raíz del proyecto (`/microservicioPMR`) con las siguientes variables:

+ DB_USER=tu_usuario
+ DB_PASSWORD=tu_contraseña
+ DB_HOST=localhost
+ DB_PORT=5432
+ DB_NAME=nombre_base_datos

Estas variables son cargadas en config/settings.py usando pydantic-settings.

## 📌 Instalar requerimientos previos
- Ejecuta el comando `pip install -r requirements.txt`

## 🚀 Comando para ejecutar el backend
- `python -m uvicorn app.main:app --reload --port 8006` desde la carpeta microservicioPMR

## 🧠 Arquitectura
- `routes/`: Contiene los controladores FastAPI que exponen los endpoints.
- `services/`: Implementan la lógica de negocio, trabajando con los modelos.
- `models/`: Tablas definidas con SQLAlchemy.
- `schemas/`: Validación y serialización de datos con Pydantic.
- `database/`: Configura el motor de base de datos y sesiones.
- `config/`: Gestión de configuración y entorno.

