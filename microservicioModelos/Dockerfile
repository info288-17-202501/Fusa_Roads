FROM python:3.9-slim

WORKDIR /app

# Copiar y instalar requirements básicos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código fuente
COPY . .

EXPOSE $APP_PORT

CMD ["sh", "-c", "uvicorn app.api.main:app --host 0.0.0.0 --port $APP_PORT"]