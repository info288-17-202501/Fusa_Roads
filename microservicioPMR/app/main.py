from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.routes import pmr_routes, pia_video_routes, ubicacion_routes, uso_routes

app = FastAPI(title="Microservicio PMR")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pmr_routes.router)
app.include_router(pia_video_routes.router)
app.include_router(ubicacion_routes.router)
app.include_router(uso_routes.router)



