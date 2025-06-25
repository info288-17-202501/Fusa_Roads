FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ./app .

EXPOSE $APP_PORT

CMD ["sh", "-c", "uvicorn api.main:app --host 0.0.0.0 --port $APP_PORT"]