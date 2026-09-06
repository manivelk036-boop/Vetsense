import random
from datetime import datetime, timedelta
from typing import Dict, List, Any

# In-memory database with realistic seed data for prototype
DB: Dict[str, Any] = {
    "animals": [],
    "history": {},  # animal_id -> list of daily records for last 30 days
    "alerts": [],
    "veterinary_outcomes": [],
    "sensor_status": {
        "esp32_gateway": {"status": "ONLINE", "last_reading": "2 sec ago", "battery": "100%", "signal": "-62 dBm"},
        "milk_flow_sensor": {"status": "ONLINE", "last_reading": "1.2 L/min", "battery": "Mains", "signal": "Strong"},
        "milk_temp_sensor": {"status": "ONLINE", "last_reading": "38.4 °C", "battery": "Mains", "signal": "Strong"},
        "conductivity_sensor": {"status": "ONLINE", "last_reading": "6.8 mS/cm", "battery": "Mains", "signal": "Strong"},
        "wearable_collar": {"status": "ONLINE", "last_reading": "68 index", "battery": "94%", "signal": "-68 dBm"},
        "body_temp_sensor": {"status": "ONLINE", "last_reading": "38.7 °C", "battery": "91%", "signal": "-70 dBm"},
        "environment_station": {"status": "ONLINE", "last_reading": "32 °C / 76% RH", "battery": "Solar / 98%", "signal": "Strong"}
    },
    "data_quality": {
        "milk_sensor_validity": 98.4,
        "wearable_validity": 95.2,
        "scc_validity": 100.0,
        "environment_validity": 99.1,
        "missing_records_pct": 0.8,
        "outlier_rate_pct": 1.2,
        "sync_latency_ms": 140
    },
    "farms_gis": [
        {
            "id": "FARM_001",
            "name": "Amul Cooperative Dairy #14, Anand",
            "state": "Gujarat",
            "district": "Anand",
            "lat": 22.5645,
            "lng": 72.9289,
            "total_animals": 50,
            "high_risk_count": 4,
            "herd_risk_pct": 64,
            "risk_status": "HIGH",
            "recent_alert": "COW001 +3 animals with elevated EC & yield drop"
        },
        {
            "id": "FARM_002",
            "name": "Bhavani Valley Dairy, Erode",
            "state": "Tamil Nadu",
            "district": "Erode",
            "lat": 11.3410,
            "lng": 77.7172,
            "total_animals": 65,
            "high_risk_count": 2,
            "herd_risk_pct": 42,
            "risk_status": "MODERATE",
            "recent_alert": "Minor heat stress warning; humidity > 80%"
        },
        {
            "id": "FARM_003",
            "name": "Karnal Green Milks, Karnal",
            "state": "Haryana",
            "district": "Karnal",
            "lat": 29.6857,
            "lng": 76.9905,
            "total_animals": 80,
            "high_risk_count": 1,
            "herd_risk_pct": 22,
            "risk_status": "LOW",
            "recent_alert": "All milking parlors sanitized"
        },
        {
            "id": "FARM_004",
            "name": "Malwa Heritage Dairy, Ludhiana",
            "state": "Punjab",
            "district": "Ludhiana",
            "lat": 30.9010,
            "lng": 75.8573,
            "total_animals": 70,
            "high_risk_count": 5,
            "herd_risk_pct": 71,
            "risk_status": "HIGH",
            "recent_alert": "Subclinical cluster suspected in Barn B"
        },
        {
            "id": "FARM_005",
            "name": "Kaveri Dairy Producers, Mysuru",
            "state": "Karnataka",
            "district": "Mysuru",
            "lat": 12.2958,
            "lng": 76.6394,
            "total_animals": 45,
            "high_risk_count": 0,
            "herd_risk_pct": 14,
            "risk_status": "NO RISK",
            "recent_alert": "Stable baseline parameters"
        }
    ],
    "model_info": {
        "current_model": "Random Forest v1.0",
        "model_version": "rf-mastitis-2026.1",
        "future_model": "XGBoost v2.0 (Ready to activate)",
        "training_dataset_size": 15420,
        "last_training_date": "2026-08-28",
        "validation_status": "Time-based cross-validation (7–14d horizon)",
        "accuracy": 0.892,
        "precision": 0.865,
        "recall": 0.884,
        "f1_score": 0.874,
        "roc_auc": 0.931,
        "forecast_7d_accuracy": 0.912,
        "forecast_14d_accuracy": 0.854,
        "confusion_matrix": {
            "true_positive": 178,
            "false_positive": 24,
            "false_negative": 22,
            "true_negative": 776
        }
    },
    "current_milking_session": {
        "session_id": "SESS-20260906-01",
        "animal_id": "COW001",
        "status": "IN_PROGRESS",
        "flow_rate": 1.2,
        "milk_temperature": 38.4,
        "conductivity": 6.8,
        "yield_accumulated": 5.2,
        "started_at": "18:42:10",
        "elapsed_sec": 245
    }
}

def seed_synthetic_data():
    """Populates 50 realistic Indian dairy animals with 30-day longitudinal data."""
    if DB["animals"]:
        return

    random.seed(42)
    breeds = ["Holstein Cross", "Jersey Cross", "Murrah Buffalo", "Gir", "Sahiwal"]

    # Specific flagship COW001
    cow001 = {
        "animal_id": "COW001",
        "breed": "Holstein Cross",
        "age": 5,
        "lactation": 3,
        "previous_mastitis": True,
        "vaccination_status": "Up to date",
        "current_milk_yield": 5.2,
        "current_ec": 6.8,
        "current_activity": 68,
        "current_body_temp": 38.7,
        "current_milk_temp": 38.4,
        "current_scc": 250000,
        "current_ph": 6.65,
        "baseline": {
            "milk_yield": 5.8,
            "conductivity": 5.9,
            "activity": 85,
            "body_temperature": 38.4,
            "scc": 120000,
            "ph": 6.55
        },
        "risk_score": 78,
        "risk_category": "HIGH",
        "forecast_horizon": "7–14 days",
        "last_updated": "Just now",
        "subclinical_warning": True
    }
    DB["animals"].append(cow001)

    # 30-day history for COW001 showing clear trajectory from 25% -> 78%
    cow001_hist = []
    base_date = datetime.now() - timedelta(days=29)
    # Days -29 to -8: Stable normal baseline
    for d in range(22):
        dt = base_date + timedelta(days=d)
        cow001_hist.append({
            "date": dt.strftime("%Y-%m-%d"),
            "day_label": f"Day -{29-d}",
            "milk_yield": round(5.8 + random.uniform(-0.15, 0.15), 2),
            "conductivity": round(5.9 + random.uniform(-0.1, 0.1), 2),
            "activity": int(85 + random.uniform(-4, 4)),
            "body_temp": round(38.4 + random.uniform(-0.1, 0.1), 2),
            "milk_temp": round(38.3 + random.uniform(-0.1, 0.1), 2),
            "scc": int(115000 + random.uniform(-10000, 15000)),
            "ph": round(6.54 + random.uniform(-0.02, 0.03), 2),
            "risk_score": int(random.uniform(18, 24))
        })

    # Exact trajectory for the last 8 days (Day -7 to Today) as specified in prompt:
    trajectory = [
        {"day": -7, "risk": 25, "yield": 5.75, "ec": 6.02, "act": 83, "bt": 38.42, "scc": 140000},
        {"day": -6, "risk": 29, "yield": 5.68, "ec": 6.11, "act": 81, "bt": 38.45, "scc": 155000},
        {"day": -5, "risk": 34, "yield": 5.60, "ec": 6.22, "act": 78, "bt": 38.49, "scc": 170000},
        {"day": -4, "risk": 43, "yield": 5.50, "ec": 6.35, "act": 76, "bt": 38.54, "scc": 190000},
        {"day": -3, "risk": 52, "yield": 5.42, "ec": 6.48, "act": 74, "bt": 38.59, "scc": 210000},
        {"day": -2, "risk": 64, "yield": 5.32, "ec": 6.62, "act": 71, "bt": 38.64, "scc": 230000},
        {"day": -1, "risk": 71, "yield": 5.25, "ec": 6.71, "act": 69, "bt": 38.68, "scc": 242000},
        {"day": 0,  "risk": 78, "yield": 5.20, "ec": 6.80, "act": 68, "bt": 38.70, "scc": 250000}
    ]

    for item in trajectory:
        dt = datetime.now() + timedelta(days=item["day"])
        label = "Today" if item["day"] == 0 else f"Day {item['day']}"
        cow001_hist.append({
            "date": dt.strftime("%Y-%m-%d"),
            "day_label": label,
            "milk_yield": item["yield"],
            "conductivity": item["ec"],
            "activity": item["act"],
            "body_temp": item["bt"],
            "milk_temp": 38.4,
            "scc": item["scc"],
            "ph": 6.65,
            "risk_score": item["risk"]
        })
    DB["history"]["COW001"] = cow001_hist

    # Generate remaining 49 animals
    # Target distribution:
    # Total = 50
    # No Risk: 30
    # Low Risk: 10
    # Moderate Risk: 6
    # High Risk: 4 (COW001 + 3 others)
    categories_pool = (
        ["HIGH"] * 3 +
        ["MODERATE"] * 6 +
        ["LOW"] * 10 +
        ["NO RISK"] * 30
    )
    random.shuffle(categories_pool)

    for i in range(2, 51):
        c_id = f"COW{str(i).zfill(3)}"
        category = categories_pool[i - 2]
        breed = random.choice(breeds)
        age = random.randint(3, 9)
        lactation = random.randint(1, 5)
        prev_mast = True if category in ["HIGH", "MODERATE"] and random.random() > 0.4 else False

        # Baseline per animal
        b_yield = round(random.uniform(5.5, 9.5), 1)
        b_ec = round(random.uniform(5.2, 6.0), 2)
        b_act = int(random.uniform(80, 95))
        b_bt = round(random.uniform(38.2, 38.5), 1)
        b_scc = random.randint(80000, 160000)
        b_ph = 6.55

        if category == "HIGH":
            risk = random.randint(75, 88)
            curr_yield = round(b_yield * random.uniform(0.85, 0.90), 2)
            curr_ec = round(b_ec * random.uniform(1.14, 1.22), 2)
            curr_act = int(b_act * random.uniform(0.75, 0.82))
            curr_bt = round(b_bt + random.uniform(0.3, 0.6), 2)
            curr_scc = random.randint(240000, 380000)
            curr_ph = round(6.64 + random.uniform(0.02, 0.08), 2)
            subclinical = True
        elif category == "MODERATE":
            risk = random.randint(50, 74)
            curr_yield = round(b_yield * random.uniform(0.91, 0.95), 2)
            curr_ec = round(b_ec * random.uniform(1.06, 1.12), 2)
            curr_act = int(b_act * random.uniform(0.85, 0.92))
            curr_bt = round(b_bt + random.uniform(0.15, 0.3), 2)
            curr_scc = random.randint(180000, 230000)
            curr_ph = round(6.60 + random.uniform(0.01, 0.04), 2)
            subclinical = True
        elif category == "LOW":
            risk = random.randint(25, 49)
            curr_yield = round(b_yield * random.uniform(0.96, 0.99), 2)
            curr_ec = round(b_ec * random.uniform(1.01, 1.04), 2)
            curr_act = int(b_act * random.uniform(0.94, 0.98))
            curr_bt = round(b_bt + random.uniform(0.0, 0.15), 2)
            curr_scc = random.randint(140000, 175000)
            curr_ph = round(6.56 + random.uniform(0.0, 0.03), 2)
            subclinical = False
        else: # NO RISK
            risk = random.randint(8, 24)
            curr_yield = round(b_yield * random.uniform(0.98, 1.02), 2)
            curr_ec = round(b_ec * random.uniform(0.98, 1.01), 2)
            curr_act = int(b_act * random.uniform(0.97, 1.03))
            curr_bt = round(b_bt + random.uniform(-0.1, 0.1), 2)
            curr_scc = random.randint(70000, 130000)
            curr_ph = 6.55
            subclinical = False

        animal_dict = {
            "animal_id": c_id,
            "breed": breed,
            "age": age,
            "lactation": lactation,
            "previous_mastitis": prev_mast,
            "vaccination_status": "Up to date",
            "current_milk_yield": curr_yield,
            "current_ec": curr_ec,
            "current_activity": curr_act,
            "current_body_temp": curr_bt,
            "current_milk_temp": round(curr_bt - 0.2, 2),
            "current_scc": curr_scc,
            "current_ph": curr_ph,
            "baseline": {
                "milk_yield": b_yield,
                "conductivity": b_ec,
                "activity": b_act,
                "body_temperature": b_bt,
                "scc": b_scc,
                "ph": b_ph
            },
            "risk_score": risk,
            "risk_category": category,
            "forecast_horizon": "7–14 days",
            "last_updated": f"{random.randint(1, 12)} mins ago",
            "subclinical_warning": subclinical
        }
        DB["animals"].append(animal_dict)

        # 30-day synthetic history
        hist = []
        for d in range(30):
            dt = base_date + timedelta(days=d)
            # gradual progression if high risk
            progress = d / 29.0
            if category == "HIGH":
                d_yield = round(b_yield * (1.0 - 0.12 * progress) + random.uniform(-0.1, 0.1), 2)
                d_ec = round(b_ec * (1.0 + 0.18 * progress) + random.uniform(-0.05, 0.05), 2)
                d_risk = int(20 + (risk - 20) * progress)
            else:
                d_yield = round(curr_yield + random.uniform(-0.15, 0.15), 2)
                d_ec = round(curr_ec + random.uniform(-0.05, 0.05), 2)
                d_risk = int(max(5, min(95, risk + random.randint(-4, 4))))

            hist.append({
                "date": dt.strftime("%Y-%m-%d"),
                "day_label": f"Day -{29-d}" if d < 29 else "Today",
                "milk_yield": d_yield,
                "conductivity": d_ec,
                "activity": int(curr_act + random.randint(-3, 3)),
                "body_temp": round(curr_bt + random.uniform(-0.1, 0.1), 2),
                "milk_temp": 38.4,
                "scc": int(curr_scc + random.randint(-8000, 8000)),
                "ph": curr_ph,
                "risk_score": d_risk
            })
        DB["history"][c_id] = hist

    # Seed Initial Alerts
    DB["alerts"] = [
        {
            "id": "ALT-001",
            "animal_id": "COW001",
            "title": "HIGH MASTITIS RISK",
            "risk_score": 78,
            "risk_category": "HIGH",
            "reason": "Milk yield decreased (-10.3%) and conductivity increased (+15.2%) compared with individual baseline.",
            "action": "Monitor animal closely, isolate during milking, and seek veterinary confirmation.",
            "acknowledged": False,
            "assigned_vet": "Dr. Ramesh Sharma (B.V.Sc)",
            "timestamp": "Today, 06:30 AM"
        },
        {
            "id": "ALT-002",
            "animal_id": "COW007",
            "title": "ELEVATED CONDUCTIVITY & SCC",
            "risk_score": 82,
            "risk_category": "HIGH",
            "reason": "SCC spike above 280,000 cells/mL with persistent milk temp elevation.",
            "action": "Perform California Mastitis Test (CMT) and schedule veterinary inspection.",
            "acknowledged": False,
            "assigned_vet": "Dr. Ramesh Sharma (B.V.Sc)",
            "timestamp": "Today, 07:15 AM"
        },
        {
            "id": "ALT-003",
            "animal_id": "COW019",
            "title": "MODERATE RISK TRAJECTORY",
            "risk_score": 76,
            "risk_category": "HIGH",
            "reason": "Activity drop of 18% coupled with mild milk yield decline over 3 sessions.",
            "action": "Check teat condition and monitor evening milking flow.",
            "acknowledged": True,
            "assigned_vet": None,
            "timestamp": "Yesterday, 18:20 PM"
        },
        {
            "id": "ALT-004",
            "animal_id": "HERD",
            "title": "HERD-LEVEL RISK ALERT",
            "risk_score": 64,
            "risk_category": "MODERATE",
            "reason": "Herd risk trajectory shows high-risk count increasing from 4 to 9 animals over 3 weeks.",
            "action": "Review parlor disinfection procedures, teat-dip efficacy, and barn ventilation.",
            "acknowledged": False,
            "assigned_vet": "District Health Officer",
            "timestamp": "Today, 05:00 AM"
        }
    ]

# Automatically initialize seed data on module import
seed_synthetic_data()
