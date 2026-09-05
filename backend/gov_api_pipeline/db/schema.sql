-- Government Land Acquisition & Infrastructure Data Pipeline Schema
-- Relational Database DDL for SQLite / PostgreSQL

-- 1. Core Projects Table
CREATE TABLE IF NOT EXISTS projects (
    project_id TEXT PRIMARY KEY,
    official_project_id TEXT UNIQUE,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    project_type TEXT,
    implementing_agency TEXT,
    executing_agency TEXT,
    funding_source TEXT,
    project_status TEXT DEFAULT 'UNDER_DEVELOPMENT',
    approval_date TEXT,
    original_target_date TEXT,
    latest_target_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Project Locations Table
CREATE TABLE IF NOT EXISTS locations (
    location_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    tehsil_anchal TEXT,
    village_mouza TEXT,
    latitude REAL,
    longitude REAL,
    location_map_url TEXT,
    FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);

-- 3. Land Details & Compensation Progress Table
CREATE TABLE IF NOT EXISTS land_details (
    land_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL UNIQUE,
    land_area_acres REAL,
    land_area_hectares REAL,
    forest_land_ha REAL DEFAULT 0.0,
    forest_land_share_pct REAL DEFAULT 0.0,
    affected_land_feature TEXT,
    waterbody_impact TEXT DEFAULT 'NO',
    affected_families INTEGER DEFAULT 0,
    affected_habitations INTEGER DEFAULT 0,
    compensation_disbursed_pct REAL DEFAULT 0.0,
    possession_pct REAL DEFAULT 0.0,
    rehabilitation_progress_pct REAL DEFAULT 0.0,
    encumbrance_free_land TEXT DEFAULT 'NO',
    FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);

-- 4. Regulatory & Environmental Clearances Table
CREATE TABLE IF NOT EXISTS clearances (
    clearance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL UNIQUE,
    sia_status TEXT DEFAULT 'PENDING',
    environmental_clearance TEXT DEFAULT 'PENDING',
    forest_clearance_stage1 TEXT DEFAULT 'NA',
    forest_clearance_stage2 TEXT DEFAULT 'NA',
    approval_pending_days REAL DEFAULT 0.0,
    FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);

-- 5. Legal & Disputes Table
CREATE TABLE IF NOT EXISTS litigations (
    litigation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL UNIQUE,
    land_dispute TEXT DEFAULT 'NO',
    local_resistance TEXT DEFAULT 'NO',
    law_order_issue TEXT DEFAULT 'NO',
    litigation_active TEXT DEFAULT 'NO',
    litigation_type TEXT,
    court_level TEXT,
    legal_disputes_count INTEGER DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);

-- 6. Project Financials & Overruns Table
CREATE TABLE IF NOT EXISTS financials (
    financial_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL UNIQUE,
    original_cost_cr REAL DEFAULT 0.0,
    revised_cost_cr REAL DEFAULT 0.0,
    cost_overrun_cr REAL DEFAULT 0.0,
    cost_overrun_pct REAL DEFAULT 0.0,
    expenditure_cr REAL DEFAULT 0.0,
    FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);

-- 7. Predictive Risk Metrics Table
CREATE TABLE IF NOT EXISTS risk_metrics (
    risk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL UNIQUE,
    delay_days INTEGER DEFAULT 0,
    schedule_slippage_days INTEGER DEFAULT 0,
    risk_score REAL DEFAULT 0.0,
    risk_category TEXT DEFAULT 'Low',
    political_social_sensitivity TEXT DEFAULT 'LOW',
    stakeholder_coordination_risk TEXT DEFAULT 'LOW',
    root_cause TEXT,
    FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);

-- 8. Source Attributions & API Audit Trail
CREATE TABLE IF NOT EXISTS source_audit_logs (
    audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_portal_url TEXT,
    direct_entry_url TEXT,
    gazette_notification_link TEXT,
    api_endpoint TEXT,
    http_status INTEGER,
    response_payload_hash TEXT,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);

-- Indexes for high-performance analytical queries
CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects(sector);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(project_status);
CREATE INDEX IF NOT EXISTS idx_locations_state_district ON locations(state, district);
CREATE INDEX IF NOT EXISTS idx_risk_category ON risk_metrics(risk_category);
