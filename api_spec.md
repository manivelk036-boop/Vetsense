# VetSense AI — REST API Architecture & Hardware Ingestion Specification

## Overview
This specification details the REST API endpoints connecting the **ESP32 Edge Microcontrollers**, **Backend Database (PostgreSQL)**, **AI/ML Inference Microservice**, and the **VetSense AI Web Dashboard**.

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/login`
Authenticates Farmer, Veterinarian, or Farm Administrator.
- **Request**:
  ```json
  {
    "username": "rajkumar",
    "password": "farm123",
    "role": "farmer"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "u1",
      "name": "Rajkumar M.",
      "role": "farmer",
      "farm": "Kaveri Dairy Farm"
    }
  }
  ```

---

## 2. IoT Sensor Ingestion Endpoints (ESP32)

### `POST /api/v1/iot/telemetry`
High-throughput ingestion endpoint called by the ESP32 gateway every 5–30 seconds.
- **Headers**: `X-Device-Token: <ESP32_SECRET_KEY>`
- **Request Body**:
  ```json
  {
    "device_id": "ESP32-S3-MILK-GATEWAY-01",
    "cow_id": "COW-001",
    "timestamp": "2026-09-02T16:45:00Z",
    "sensors": {
      "milk_yield_liters": 8.20,
      "milk_conductivity_ms_cm": 7.82,
      "milk_temp_c": 37.2,
      "body_temp_c": 39.1,
      "activity_index": 42,
      "ambient_temp_c": 31.0,
      "ambient_humidity_pct": 72.0
    },
    "hardware_health": {
      "battery_mv": 3920,
      "signal_rssi_dbm": -64,
      "checksum_valid": true
    }
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "status": "ingested",
    "sanity_passed": true,
    "ai_triggered": true
  }
  ```

---

## 3. AI Early Warning & Forecasting Endpoints

### `GET /api/v1/ai/forecast/:cow_id`
Returns real-time risk score, the 4 intelligence layer vectors, and 7–14 day forecast trajectory.
- **Response**:
  ```json
  {
    "cow_id": "COW-001",
    "risk_score": 82.0,
    "category": "High Risk",
    "confidence_pct": 91.0,
    "data_trust": "High",
    "forecast_window": "3-7 days",
    "contributing_factors": [
      { "factor": "Milk yield decreased", "impact": "high", "delta": "-18%" },
      { "factor": "Conductivity abnormal", "impact": "high", "delta": "+28%" },
      { "factor": "Activity reduced", "impact": "high", "delta": "-40%" }
    ],
    "layers": {
      "temporal_fingerprint_score": 88.4,
      "personalized_baseline_deviation": { "yield": -18, "conductivity": 28, "activity": -40 },
      "farm_adaptive_multiplier": 1.12,
      "data_trust_evaluations": {
        "missing_data_pct": 0.0,
        "outlier_detected": false,
        "connection_reliability": "100%"
      }
    }
  }
  ```

---

## 4. Alerting & Notification Endpoints

### `GET /api/v1/alerts?status=unacknowledged`
Returns active alerts for herd.

### `POST /api/v1/alerts/:alert_id/acknowledge`
Marks an alert as seen with operator remarks.

---

## 5. Clinical & Laboratory Endpoints

### `POST /api/v1/vet/records`
Submits veterinary clinical observations, diagnoses, and treatments.

### `POST /api/v1/lab/records`
Submits milk Somatic Cell Count (SCC), California Mastitis Test (CMT), and bacterial cultures.
