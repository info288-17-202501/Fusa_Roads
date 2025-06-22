*Acá abajo se encuentran todas las dependencias necesarias*
pip install -r requirements.txt

*Crear .env en este directorio, con la siguiente estructura*

DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=FuSA_DB


*Activar puerto del backend*

uvicorn app.main:app --reload --port 8001