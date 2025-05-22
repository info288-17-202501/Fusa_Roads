from fastapi import  Depends, HTTPException, FastAPI
from sqlalchemy import text, Session
from app.database import models, schemas
from app.database.main import get_db


app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/stats/users")
def get_user_stats(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT 
            COUNT(*) as total_users,
            MAX(created_at) as last_created
        FROM users
    """)).fetchone()
    
    return {
        "total_users": result[0],
        "last_created": result[1]
    }