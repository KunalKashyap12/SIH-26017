from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import projects, stats, predict

app = FastAPI(
    title="Land Acquisition Predictor API",
    description="AI-powered system predicting land acquisition delays and risk scores for infrastructure projects in India",
    version="1.0.0",
)

# CORS configuration for frontend dev server
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*",  # Allow dev environment connections
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wire all routers
app.include_router(projects.router)
app.include_router(stats.router)
app.include_router(predict.router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "land-acquisition-predictor-backend",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
