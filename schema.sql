-- ============================================================
-- VetSense AI — Production Relational & Time-Series Database Schema
-- Optimized for PostgreSQL 15+ / TimescaleDB
-- ============================================================

-- 1. Farms
CREATE TABLE IF NOT EXISTS farms (
    id VARCHAR(36) PRIMARY KEY,
    farm_name VARCHAR(120) NOT NULL,
    location_district VARCHAR(80) NOT NULL,
    state VARCHAR(50) DEFAULT 'Tamil Nadu',
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    ambient_thi_threshold NUMERIC(4,1) DEFAULT 72.0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (Farmers, Veterinarians, Farm Administrators)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    farm_id VARCHAR(36) REFERENCES farms(id) ON DELETE SET NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'vet', 'admin')),
    phone VARCHAR(20),
    language_pref VARCHAR(5) DEFAULT 'en' CHECK (language_pref IN ('en', 'ta')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Cows (Individual Animal Profiles)
CREATE TABLE IF NOT EXISTS cows (
    id VARCHAR(36) PRIMARY KEY,
    farm_id VARCHAR(36) REFERENCES farms(id) ON DELETE CASCADE,
    tag_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(80) NOT NULL,
    breed VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    lactation_number INT DEFAULT 1,
    weight_kg NUMERIC(6,2),
    last_calving_date DATE,
    rfid_collar_uuid VARCHAR(64) UNIQUE,
    current_risk_category VARCHAR(20) DEFAULT 'healthy' CHECK (current_risk_category IN ('healthy', 'low', 'moderate', 'high')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. ESP32 Sensor Telemetry Readings (Time-series table)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id BIGSERIAL,
    cow_id VARCHAR(36) REFERENCES cows(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    esp32_device_id VARCHAR(50) NOT NULL,
    milk_yield_liters NUMERIC(5,2),
    milk_electrical_conductivity_ms_cm NUMERIC(5,2),
    milk_temperature_celsius NUMERIC(4,2),
    body_temperature_celsius NUMERIC(4,2),
    activity_rumination_index INT CHECK (activity_rumination_index BETWEEN 0 AND 100),
    ambient_temperature_celsius NUMERIC(4,2),
    ambient_humidity_pct NUMERIC(4,1),
    battery_millivolts INT,
    signal_rssi INT,
    PRIMARY KEY (id, recorded_at)
);
-- If using TimescaleDB:
-- SELECT create_hypertable('sensor_readings', 'recorded_at');

-- 5. Manual Farm & Management Records
CREATE TABLE IF NOT EXISTS manual_farm_records (
    id VARCHAR(36) PRIMARY KEY,
    farm_id VARCHAR(36) REFERENCES farms(id) ON DELETE CASCADE,
    recorded_by VARCHAR(36) REFERENCES users(id),
    record_date DATE NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    milking_area_hygiene VARCHAR(30),
    worker_hygiene_rating VARCHAR(30),
    pre_milking_teat_dip_applied BOOLEAN DEFAULT TRUE,
    post_milking_teat_dip_applied BOOLEAN DEFAULT TRUE,
    bedding_condition VARCHAR(50),
    feed_type VARCHAR(100),
    water_access_ad_lib BOOLEAN DEFAULT TRUE,
    observation_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Veterinary Clinical Diagnostics & Treatment Records
CREATE TABLE IF NOT EXISTS veterinary_records (
    id VARCHAR(36) PRIMARY KEY,
    cow_id VARCHAR(36) REFERENCES cows(id) ON DELETE CASCADE,
    vet_user_id VARCHAR(36) REFERENCES users(id),
    exam_date DATE NOT NULL,
    clinical_confirmation VARCHAR(50) NOT NULL,
    diagnosis TEXT NOT NULL,
    treatment_applied TEXT NOT NULL,
    prescribed_medication TEXT,
    affected_quarters VARCHAR(50), -- e.g. 'LR, RF'
    follow_up_date DATE,
    case_status VARCHAR(20) DEFAULT 'active' CHECK (case_status IN ('active', 'monitoring', 'closed')),
    clinical_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Laboratory Milk Analysis Records
CREATE TABLE IF NOT EXISTS laboratory_records (
    id VARCHAR(36) PRIMARY KEY,
    cow_id VARCHAR(36) REFERENCES cows(id) ON DELETE CASCADE,
    test_date DATE NOT NULL,
    somatic_cell_count INT NOT NULL, -- cells/mL
    california_mastitis_test_result VARCHAR(30), -- Negative, Trace, 1+, 2+, 3+
    milk_ph NUMERIC(3,2),
    milk_fat_pct NUMERIC(4,2),
    milk_protein_pct NUMERIC(4,2),
    bacterial_culture_pathogen VARCHAR(120),
    antimicrobial_susceptibility TEXT,
    report_pdf_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. AI Predictions & Temporal Forecasting Logs
CREATE TABLE IF NOT EXISTS ai_predictions (
    id VARCHAR(36) PRIMARY KEY,
    cow_id VARCHAR(36) REFERENCES cows(id) ON DELETE CASCADE,
    predicted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(50) DEFAULT 'VetSense-BovNet-v4.2',
    mastitis_risk_score NUMERIC(5,2) NOT NULL, -- 0.00 to 100.00
    risk_category VARCHAR(20) NOT NULL CHECK (risk_category IN ('no_risk', 'low', 'moderate', 'high')),
    model_confidence_pct NUMERIC(5,2) NOT NULL,
    data_trust_level VARCHAR(20) NOT NULL CHECK (data_trust_level IN ('High', 'Medium', 'Low')),
    forecast_window_days VARCHAR(30) DEFAULT '7-14 days',
    temporal_fingerprint_score NUMERIC(5,2),
    individual_baseline_deviation JSONB,
    farm_adaptive_multiplier NUMERIC(4,2),
    contributing_factors JSONB,
    is_alert_triggered BOOLEAN DEFAULT FALSE
);

-- 9. Alerts System
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(36) PRIMARY KEY,
    cow_id VARCHAR(36) REFERENCES cows(id) ON DELETE CASCADE,
    ai_prediction_id VARCHAR(36) REFERENCES ai_predictions(id),
    dispatched_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('moderate', 'high', 'critical')),
    risk_score NUMERIC(5,2) NOT NULL,
    prediction_trust VARCHAR(20) DEFAULT 'High',
    alert_summary TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(36) REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ,
    veterinarian_notified BOOLEAN DEFAULT FALSE
);

-- Indices for Fast High-Throughput Ingestion
CREATE INDEX idx_sensor_cow_time ON sensor_readings(cow_id, recorded_at DESC);
CREATE INDEX idx_ai_predictions_cow ON ai_predictions(cow_id, predicted_at DESC);
CREATE INDEX idx_alerts_unack ON alerts(is_acknowledged) WHERE is_acknowledged = FALSE;
