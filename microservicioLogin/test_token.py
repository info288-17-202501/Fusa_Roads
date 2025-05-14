import requests
import time

# CONFIG
BASE_URL = "http://localhost:8000"
USERNAME = "seba"
PASSWORD = "seba0705"
WAIT_SECONDS = 15  # espera más de lo que dura el token (ej: 1 minuto)

# 1. Hacer login
login_response = requests.post(
    f"{BASE_URL}/token",
    data={"username": USERNAME, "password": PASSWORD},
    headers={"Content-Type": "application/x-www-form-urlencoded"}
)

if login_response.status_code != 200:
    print("❌ Error al iniciar sesión:", login_response.json())
    exit()

access_token = login_response.json()["access_token"]
refresh_token = login_response.json()["refresh_token"]
print("✅ Token obtenido con éxito.")
print("🕒 Esperando", WAIT_SECONDS, "segundos para que expire...")

# 2. Esperar a que el token expire
time.sleep(WAIT_SECONDS)

# 3. Intentar acceder a la ruta protegida
for i in range (3):
    profile_response = requests.get(
        f"{BASE_URL}/users/profile",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    # 4. Resultado
    if profile_response.status_code == 200:
        print("🟢 El token aún es válido (no ha expirado).")
        print("Respuesta:", profile_response.json())
    else:
        print("🔴 Token expirado o inválido.")
        print("Detalle:", profile_response.json())

    #time.sleep(5)

