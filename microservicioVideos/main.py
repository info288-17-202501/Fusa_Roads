import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()
host = os.getenv("HOST", "127.0.0.1") 
port = int(os.getenv("PORT", 8000))

if __name__ == "__main__":
    uvicorn.run("app.api.main:app", host=host, port=port, reload=True)