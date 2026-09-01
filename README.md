# Land Acquisition Predictor

A machine learning-driven web application for predicting land acquisition costs, feasibility, and risk scores.

## Project Structure

```
land-acquisition-predictor/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routers/
│   │   ├── ml/
│   │   └── data/
│   └── requirements.txt
├── frontend/
│   └── (React + Vite + Tailwind CSS application)
└── README.md
```

## Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   - Windows:
     ```cmd
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run FastAPI Server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend API will be running at `http://127.0.0.1:8000`.
   - Swagger documentation: `http://127.0.0.1:8000/docs`
   - Health check: `http://127.0.0.1:8000/health`

## Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies and start dev server**:
   ```bash
   npm install
   npm run dev
   ```
   The frontend application will be running at `http://localhost:5173`.
