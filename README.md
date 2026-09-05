# 🏛️ BhoomiDrishti: Predictive Analytics & Land Acquisition Governance Platform
> **Smart India Hackathon (SIH) Problem Statement #26017 Solution**  
> An End-to-End AI/ML & SHAP Explainability Platform for Predicting Land Acquisition Delays, Identifying Bottlenecks, and Recommending Administrative Interventions under PM Gati Shakti.

---

## 📌 1. Problem Statement Summary (SIH 26017)
Infrastructure development in India (highways, railways, industrial corridors, irrigation, and power transmission) frequently faces severe time and cost overruns due to land acquisition friction. Key causes include:
- Unresolved legal disputes and compensation titling issues.
- Pending inter-departmental forest, environmental, and revenue clearances.
- Slow Rehabilitation & Resettlement (R&R) execution.
- Lack of data-driven predictive tools for senior administrators and district collectors to intervene before delays escalate.

**BhoomiDrishti** solves this by leveraging machine learning (XGBoost v2.0) and local model explainability (SHAP) to forecast acquisition delays, classify project risk profiles, and provide automated, rule-based administrative remedies.

---

## 🚀 2. Core Platform Capabilities & Features

- **Predictive ML Engine**: Evaluates land acquisition parameters (compensation disbursed %, possession %, legal dispute count, pending approval days, R&R progress %, stakeholder responsiveness) to compute a continuous **Risk Score (0–100)** and projected delay in days.
- **SHAP Explainability**: Explains *why* a specific project is flagged as High Risk, identifying top contributing factors and their magnitude.
- **Actionable Policy Remedies**: Automatically maps SHAP risk drivers to concrete administrative interventions (e.g., fast-track legal cells, direct out-of-court arbitration, or phase-wise possession).
- **Interactive GIS Heatmap**: Visualizes district-level risk clusters across Indian states on an interactive Leaflet map.
- **Email & Mobile Authentication**: Secure, role-tailored authentication accepting Email Address or 10-Digit Mobile Number with dynamic Cadre and Designation propagation across the header.
- **72-Hour Rolling Alert Stream**: Real-time high-risk project alerts with CSV export and multi-channel notifications (SMS, Email, Push).
- **Multi-Language Support (English / Hindi)**: Dynamic UI translation, IST server clock sync, and UX4G accessibility compliance.

---

## 📂 3. Project Directory Structure

```
BhoomiDrishti/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entrypoint
│   │   ├── routers/             # Routers for projects, stats, predict, alerts
│   │   ├── ml/                  # Model training & SHAP explainability engine
│   │   └── data/                # Data pipelines & district coordinates
│   ├── gov_api_pipeline/        # Automated daily government API pipeline
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── context/             # AuthContext (Email/Phone) & LanguageContext (EN/HI)
│   │   ├── layouts/             # Layout header with dynamic Cadre/Designation pill & Logout
│   │   ├── pages/               # Dashboard, Projects, RiskMap, Alerts, PredictNew, Login
│   │   └── api/                 # Axios API client
│   └── package.json
└── README.md
```

---

## 🔑 4. Demo Credentials (Email & Mobile Auth)

| # | Selected Workspace | Email ID | Mobile Number | Default Password | Officer Name & Cadre (Topbar Badge) |
|---|---|---|---|---|---|
| **1** | **District Administrator** | `a.sharma@gov.in` | `9876543210` | `password123` | **Dr. A. Sharma, IAS** (`DM Cadre` • District Collector / SLAO) |
| **2** | **Field Officer** | `r.verma@gov.in` | `9876543210` | `password123` | **R. K. Verma** (`Field Cadre` • Field Survey Officer) |
| **3** | **Central Administration** | `s.mehta@nic.in` | `9876543210` | `password123` | **S. Mehta, IAS** (`PMU Cadre` • Senior Policymaker / Central PMU) |

---

## 🛠️ 5. Tech Stack & ML Performance

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Machine Learning** | Python 3.10+, XGBoost v2.0, SHAP, scikit-learn, Pandas, NumPy | Model training, delay regression, risk classification (94.2% Accuracy, 0.95 R² Score) & feature explainability. |
| **Backend API** | FastAPI, Uvicorn, Pydantic, joblib | High-performance async REST API serving ML inferences, project data, and statistics. |
| **Frontend UI** | React 18, Vite, Tailwind CSS, Lucide Icons | Responsive Navy & Teal government dashboard with dynamic role header and multi-language support. |
| **Data Visualization** | Recharts, Leaflet, React-Leaflet | Stacked bar charts, SHAP impact visualizers, circular gauge meters, and GIS district markers. |

### ML Model Performance
- **Model Engine**: XGBoost v2.0 Regressor & Classifier
- **Model Accuracy**: **94.2%**
- **R² Score**: **0.95**
- **Explainability**: SHAP (SHapley Additive exPlanations) TreeExplainer

---

## 📐 6. System Architecture & Production Workflow

```mermaid
flowchart TD
    subgraph Data Layer
        A1[Gov API Pipeline / Semi-Synthetic Dataset] --> A2[Data Pipeline & Feature Preprocessing]
    end

    subgraph ML & Explainability Pipeline
        A2 --> B1[XGBoost Regressor / Classifier]
        B1 --> B2[Model Artifact Serialization (.joblib)]
        B1 --> B3[SHAP TreeExplainer Engine]
    end

    subgraph API Layer
        B2 & B3 --> C1[FastAPI REST API Engine]
        C1 --> C2[/api/projects Router]
        C1 --> C3[/api/projects/{id}/insights Router]
        C1 --> C4[/api/predict Live ML Router]
        C1 --> C5[/api/stats Analytics Router]
        C1 --> C6[/api/alerts 72-Hour Stream Router]
    end

    subgraph Web Portal & Visualization
        C2 & C3 & C4 & C5 & C6 --> D1[React + Vite Frontend Dashboard]
        D1 --> D2[AuthContext Email/Phone State]
    end

    subgraph End Users
        D2 --> E1[🏛️ Senior Policymaker / Central PMU]
        D2 --> E2[📍 District Collector / SLAO]
        D2 --> E3[📋 Field Survey Officer]
    end
```

---

## ⚡ 7. Local Setup & Running Instructions

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### Step 1: Backend Setup & Server Execution
```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*FastAPI server runs at `http://127.0.0.1:8000`. Interactive API Docs are available at `http://127.0.0.1:8000/docs`.*

### Step 2: Frontend Setup
Open a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start Vite React dev server
npm run dev
```
*Frontend application will run at `http://localhost:5173`.*

---

## 🌐 8. API Reference Overview

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/projects` | `GET` | Paginated list of projects with filtering by state, district, sector, risk level & search. |
| `/api/projects/{id}` | `GET` | Complete raw feature breakdown of a specific project. |
| `/api/projects/{id}/insights` | `GET` | Runs SHAP TreeExplainer and returns top drivers + recommended policy remedies. |
| `/api/predict` | `POST` | Live inference endpoint accepting hypothetical project parameters and returning real-time risk score + SHAP factors. |
| `/api/stats/overview` | `GET` | System-wide statistics: total projects, risk counts, average delay. |
| `/api/stats/by-state` | `GET` | Risk category breakdown aggregated per state for stacked charts. |
| `/api/stats/by-district` | `GET` | District-level risk distribution with lat/long coordinates for GIS plotting. |
| `/api/alerts` | `GET` | 72-hour rolling high-risk project notification stream requiring immediate intervention. |

---

## 📜 License & Compliance
Developed for the **Smart India Hackathon (SIH) Problem Statement 26017**.  
Aligned with **PM Gati Shakti National Master Plan** & **Ministry of Road Transport & Highways (MoRTH)** guidelines.
