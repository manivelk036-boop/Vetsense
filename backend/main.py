from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from datetime import datetime
import random

from models import (
    MilkSensorReading, WearableReading, EnvironmentReading,
    LabSCCReading, LabPHReading, ManualObservation,
    VeterinaryOutcomeRequest, Animal, PredictionResult,
    MilkingSessionTick
)
from database import DB
from ai_engine import ai_engine

app = FastAPI(
    title="MASTI-GUARD AI API",
    description="AI-Enabled Predictive Modelling for Early Forecasting of Bovine Mastitis in Indian Dairy Farms",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server and production clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "project": "MASTI-GUARD AI",
        "tagline": "Predict Early. Protect Better.",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

# ====================================================================
# SENSOR DATA INGESTION (IoT / Wearables / Lab / Manual)
# ====================================================================

@app.post("/api/sensor/milk")
def ingest_milk_sensor(data: MilkSensorReading):
    """ESP32 Inline Flow, Temperature & Conductivity sensor telemetry."""
    # Find and update animal live parameters
    animal = next((a for a in DB["animals"] if a["animal_id"] == data.animal_id), None)
    if animal:
        animal["current_milk_yield"] = data.yield_accumulated
        animal["current_ec"] = data.conductivity
        animal["current_milk_temp"] = data.milk_temperature
        animal["last_updated"] = "Just now"

    # Update sensor status
    DB["sensor_status"]["milk_flow_sensor"]["last_reading"] = f"{data.flow_rate} L/min"
    DB["sensor_status"]["conductivity_sensor"]["last_reading"] = f"{data.conductivity} mS/cm"
    DB["sensor_status"]["milk_temp_sensor"]["last_reading"] = f"{data.milk_temperature} °C"

    return {"status": "SUCCESS", "message": f"Milk telemetry recorded for {data.animal_id}"}

@app.post("/api/sensor/wearable")
def ingest_wearable_sensor(data: WearableReading):
    """Collar / Ear sensor telemetry: Activity & Body Temperature."""
    animal = next((a for a in DB["animals"] if a["animal_id"] == data.animal_id), None)
    if animal:
        animal["current_activity"] = data.activity_index
        animal["current_body_temp"] = data.body_temperature
        animal["last_updated"] = "Just now"

    DB["sensor_status"]["wearable_collar"]["last_reading"] = f"{data.activity_index} index"
    DB["sensor_status"]["body_temp_sensor"]["last_reading"] = f"{data.body_temperature} °C"

    return {"status": "SUCCESS", "message": f"Wearable telemetry recorded for {data.animal_id}"}

@app.post("/api/sensor/environment")
def ingest_environment_sensor(data: EnvironmentReading):
    """Barn environmental conditions: Ambient Temperature and Humidity."""
    DB["sensor_status"]["environment_station"]["last_reading"] = f"{data.ambient_temperature} °C / {data.relative_humidity}% RH"
    return {"status": "SUCCESS", "message": "Barn environment telemetry recorded"}

@app.post("/api/lab/scc")
def ingest_lab_scc(data: LabSCCReading):
    """Somatic Cell Count laboratory optical counter analysis."""
    animal = next((a for a in DB["animals"] if a["animal_id"] == data.animal_id), None)
    if animal:
        animal["current_scc"] = data.scc_count
        animal["last_updated"] = "Just now"
    return {"status": "SUCCESS", "message": f"SCC record {data.scc_count} cells/mL updated for {data.animal_id}"}

@app.post("/api/lab/ph")
def ingest_lab_ph(data: LabPHReading):
    """Milk pH meter measurement."""
    animal = next((a for a in DB["animals"] if a["animal_id"] == data.animal_id), None)
    if animal:
        animal["current_ph"] = data.ph_value
        animal["last_updated"] = "Just now"
    return {"status": "SUCCESS", "message": f"Milk pH {data.ph_value} updated for {data.animal_id}"}

@app.post("/api/manual/observation")
def record_manual_observation(obs: ManualObservation):
    """Farmer / Milker manual observation form."""
    animal = next((a for a in DB["animals"] if a["animal_id"] == obs.animal_id), None)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    if obs.scc:
        animal["current_scc"] = obs.scc
    if obs.ph:
        animal["current_ph"] = obs.ph

    # Trigger re-prediction with AI engine
    prediction = ai_engine.predict_risk(
        animal_id=obs.animal_id,
        current_data={
            "milk_yield": animal["current_milk_yield"],
            "conductivity": animal["current_ec"],
            "activity": animal["current_activity"],
            "body_temperature": animal["current_body_temp"],
            "scc": animal["current_scc"],
            "ph": animal["current_ph"]
        },
        baseline_data=animal["baseline"],
        previous_mastitis=animal["previous_mastitis"]
    )
    animal["risk_score"] = prediction["risk_score"]
    animal["risk_category"] = prediction["risk_category"]

    # Check if new alert should be created
    if prediction["risk_category"] in ["HIGH", "MODERATE"]:
        new_alert = {
            "id": f"ALT-{random.randint(100, 999)}",
            "animal_id": obs.animal_id,
            "title": f"{prediction['risk_category']} MASTITIS RISK DETECTED",
            "risk_score": prediction["risk_score"],
            "risk_category": prediction["risk_category"],
            "reason": f"Manual update: Udder={obs.udder_observation}, Milk={obs.milk_appearance}. AI indicates elevated probability.",
            "action": "Perform California Mastitis Test (CMT) & isolate during milking.",
            "acknowledged": False,
            "assigned_vet": "Dr. Ramesh Sharma (B.V.Sc)",
            "timestamp": "Just now"
        }
        DB["alerts"].insert(0, new_alert)

    return {
        "status": "SUCCESS",
        "message": f"Manual observation recorded for {obs.animal_id}",
        "updated_risk": prediction["risk_score"],
        "category": prediction["risk_category"]
    }

# ====================================================================
# ANIMAL MANAGEMENT & PROFILES
# ====================================================================

@app.get("/api/animals")
def get_animals(
    risk: Optional[str] = None,
    breed: Optional[str] = None,
    search: Optional[str] = None
):
    """Retrieves list of 50 animals with filtering & search capabilities."""
    results = DB["animals"]
    if risk and risk.upper() != "ALL":
        results = [a for a in results if a["risk_category"].upper() == risk.upper()]
    if breed and breed.upper() != "ALL":
        results = [a for a in results if a["breed"].lower() == breed.lower()]
    if search:
        s = search.lower()
        results = [a for a in results if s in a["animal_id"].lower() or s in a["breed"].lower()]
    return results

@app.get("/api/animals/{animal_id}")
def get_animal_detail(animal_id: str):
    """Retrieves full profile, personalized baselines, and current readings."""
    animal = next((a for a in DB["animals"] if a["animal_id"] == animal_id), None)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    # Run AI engine to ensure latest explainability
    prediction = ai_engine.predict_risk(
        animal_id=animal_id,
        current_data={
            "milk_yield": animal["current_milk_yield"],
            "conductivity": animal["current_ec"],
            "activity": animal["current_activity"],
            "body_temperature": animal["current_body_temp"],
            "scc": animal["current_scc"],
            "ph": animal["current_ph"]
        },
        baseline_data=animal["baseline"],
        previous_mastitis=animal["previous_mastitis"]
    )

    deviations = ai_engine.calculate_deviations(
        current={
            "milk_yield": animal["current_milk_yield"],
            "conductivity": animal["current_ec"],
            "activity": animal["current_activity"],
            "body_temperature": animal["current_body_temp"]
        },
        baseline=animal["baseline"]
    )

    return {
        "animal": animal,
        "prediction": prediction,
        "deviations": deviations,
        "environment": {"ambient_temp": 32.0, "humidity": 76.0}
    }

@app.get("/api/animals/{animal_id}/history")
def get_animal_history(animal_id: str, days: int = 30):
    """Retrieves longitudinal time series data up to 30 days."""
    if animal_id not in DB["history"]:
        raise HTTPException(status_code=404, detail="No historical records found for this animal")
    hist = DB["history"][animal_id]
    return hist[-days:]

# ====================================================================
# HERD INTELLIGENCE & ANALYTICS
# ====================================================================

@app.get("/api/herd/risk")
def get_herd_risk():
    """Computes aggregate herd-level intelligence and distribution."""
    animals = DB["animals"]
    total = len(animals)
    no_risk = len([a for a in animals if a["risk_category"] == "NO RISK"])
    low = len([a for a in animals if a["risk_category"] == "LOW"])
    moderate = len([a for a in animals if a["risk_category"] == "MODERATE"])
    high = len([a for a in animals if a["risk_category"] == "HIGH"])

    avg_yield = round(sum(a["current_milk_yield"] for a in animals) / max(1, total), 2)
    avg_ec = round(sum(a["current_ec"] for a in animals) / max(1, total), 2)
    avg_activity = round(sum(a["current_activity"] for a in animals) / max(1, total), 1)
    avg_scc = int(sum(a["current_scc"] for a in animals) / max(1, total))

    # Weekly herd risk forecast trajectory (Week 1 -> Week 4)
    herd_trend = [
        {"week": "Week 1", "high_risk_count": 4, "avg_ec": 5.82, "herd_risk_pct": 28},
        {"week": "Week 2", "high_risk_count": 6, "avg_ec": 5.95, "herd_risk_pct": 39},
        {"week": "Week 3", "high_risk_count": 9, "avg_ec": 6.12, "herd_risk_pct": 51},
        {"week": "Week 4", "high_risk_count": 14, "avg_ec": 6.34, "herd_risk_pct": 64}
    ]

    return {
        "total_animals": total,
        "breakdown": {
            "no_risk": no_risk,
            "low": low,
            "moderate": moderate,
            "high": high
        },
        "herd_risk_score": 64,
        "herd_risk_category": "MODERATE / ELEVATED",
        "herd_trend_alert": "Increasing herd-level risk trend detected over 4-week window",
        "averages": {
            "milk_yield": avg_yield,
            "conductivity": avg_ec,
            "activity": avg_activity,
            "scc": avg_scc
        },
        "weekly_trend": herd_trend
    }

# ====================================================================
# ALERTS & RECOMMENDATION ENGINE
# ====================================================================

@app.get("/api/alerts")
def get_alerts():
    """Retrieves all active alerts with recommended actions."""
    return DB["alerts"]

@app.post("/api/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str):
    """Farmer acknowledges an active risk notification."""
    for alert in DB["alerts"]:
        if alert["id"] == alert_id:
            alert["acknowledged"] = True
            return {"status": "SUCCESS", "message": f"Alert {alert_id} acknowledged"}
    raise HTTPException(status_code=404, detail="Alert not found")

# ====================================================================
# VETERINARY CLINICAL WORKFLOW & AI FEEDBACK LOOP
# ====================================================================

@app.post("/api/veterinary/outcome")
def record_veterinary_outcome(outcome: VeterinaryOutcomeRequest):
    """
    Veterinarian records clinical exam outcome (Confirmed / Not Confirmed / Requires Follow-up).
    Feeds back into model training evaluation dataset.
    """
    record = {
        "id": f"VET-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "animal_id": outcome.animal_id,
        "clinical_outcome": outcome.clinical_outcome,
        "affected_quarters": outcome.affected_quarters,
        "clinical_signs_present": outcome.clinical_signs_present,
        "treatment_recommendation": outcome.treatment_recommendation,
        "vet_notes": outcome.vet_notes,
        "vet_id": outcome.vet_id,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
    }
    DB["veterinary_outcomes"].insert(0, record)

    # If confirmed, increment true positive in model tracking
    if outcome.clinical_outcome == "Confirmed":
        DB["model_info"]["confusion_matrix"]["true_positive"] += 1
    elif outcome.clinical_outcome == "Not Confirmed":
        DB["model_info"]["confusion_matrix"]["false_positive"] += 1

    return {
        "status": "SUCCESS",
        "message": f"Veterinary clinical outcome saved for {outcome.animal_id}",
        "record": record
    }

@app.get("/api/veterinary/cases")
def get_veterinary_cases():
    """Returns animals needing veterinary assessment and recorded outcomes."""
    high_risk_animals = [a for a in DB["animals"] if a["risk_category"] in ["HIGH", "MODERATE"]]
    return {
        "pending_reviews": high_risk_animals,
        "completed_outcomes": DB["veterinary_outcomes"]
    }

# ====================================================================
# AI MODEL MANAGEMENT & PERFORMANCE
# ====================================================================

@app.get("/api/ai/model")
def get_ai_model_info():
    """Returns AI model registry metadata, metrics, and confusion matrix."""
    return DB["model_info"]

@app.post("/api/ai/retrain")
def retrain_ai_model():
    """Prototype action simulating model retraining with newly recorded veterinary outcomes."""
    DB["model_info"]["training_dataset_size"] += len(DB["veterinary_outcomes"])
    DB["model_info"]["last_training_date"] = datetime.now().strftime("%Y-%m-%d")
    DB["model_info"]["accuracy"] = round(min(0.94, DB["model_info"]["accuracy"] + 0.005), 3)
    DB["model_info"]["f1_score"] = round(min(0.92, DB["model_info"]["f1_score"] + 0.006), 3)
    return {
        "status": "SUCCESS",
        "message": "AI Model retrained successfully with latest clinical ground truth",
        "updated_model_info": DB["model_info"]
    }

# ====================================================================
# GIS & REGIONAL MAPPING
# ====================================================================

@app.get("/api/gis/farms")
def get_gis_farms():
    """Returns regional dairy farms with risk heat-indicators."""
    return DB["farms_gis"]

# ====================================================================
# SENSORS & DATA QUALITY
# ====================================================================

@app.get("/api/sensors/status")
def get_sensor_status():
    """Returns live connection health and telemetry of IoT hardware."""
    return DB["sensor_status"]

@app.get("/api/data-quality")
def get_data_quality():
    """Returns sensor validity and data integrity metrics."""
    return DB["data_quality"]

# ====================================================================
# MILKING SESSION LIVE SIMULATOR
# ====================================================================

@app.get("/api/milking/current")
def get_current_milking_session():
    """Returns current active milking session telemetry."""
    return DB["current_milking_session"]

@app.post("/api/milking/tick")
def tick_milking_session():
    """Simulates real-time telemetry tick (flow, temperature, accumulated yield)."""
    sess = DB["current_milking_session"]
    if sess["status"] == "IN_PROGRESS":
        # Increment elapsed time & yield
        sess["elapsed_sec"] += 5
        flow = round(max(0.6, min(2.1, sess["flow_rate"] + random.uniform(-0.1, 0.1))), 2)
        sess["flow_rate"] = flow
        sess["yield_accumulated"] = round(min(7.5, sess["yield_accumulated"] + (flow * 5 / 60)), 2)
        sess["milk_temperature"] = round(38.4 + random.uniform(-0.1, 0.1), 1)
        sess["conductivity"] = round(6.8 + random.uniform(-0.05, 0.05), 2)
        if sess["elapsed_sec"] > 300:
            sess["status"] = "COMPLETED"
    return sess

@app.post("/api/milking/complete")
def complete_milking_session():
    """Marks milking session completed and saves summary record."""
    sess = DB["current_milking_session"]
    sess["status"] = "COMPLETED"
    return {"status": "SUCCESS", "session": sess}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
