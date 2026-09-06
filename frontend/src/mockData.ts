import { Animal, HistoricalRecord, AlertItem, HerdRiskData, GISFarm, ModelInfo, SensorStatus, DataQuality, MilkingSession } from './types';

export const INITIAL_COW001: Animal = {
  animal_id: "COW001",
  breed: "Holstein Cross",
  age: 5,
  lactation: 3,
  previous_mastitis: true,
  vaccination_status: "Up to date",
  current_milk_yield: 5.2,
  current_ec: 6.8,
  current_activity: 68,
  current_body_temp: 38.7,
  current_milk_temp: 38.4,
  current_scc: 250000,
  current_ph: 6.65,
  baseline: {
    milk_yield: 5.8,
    conductivity: 5.9,
    activity: 85,
    body_temperature: 38.4,
    scc: 120000,
    ph: 6.55
  },
  risk_score: 78,
  risk_category: "HIGH RISK",
  forecast_horizon: "7–14 days",
  last_updated: "Just now",
  subclinical_warning: true
};

export const COW001_HISTORY_30D: HistoricalRecord[] = [
  ...Array.from({ length: 22 }).map((_, i) => ({
    date: `2026-08-${String(8 + i).padStart(2, '0')}`,
    day_label: `Day -${29 - i}`,
    milk_yield: Number((5.8 + (Math.sin(i) * 0.1)).toFixed(2)),
    conductivity: Number((5.9 + (Math.cos(i) * 0.08)).toFixed(2)),
    activity: Math.round(85 + (Math.sin(i) * 3)),
    body_temp: Number((38.4 + (Math.sin(i) * 0.05)).toFixed(2)),
    milk_temp: 38.3,
    scc: Math.round(118000 + (Math.cos(i) * 8000)),
    ph: 6.55,
    risk_score: Math.round(20 + (Math.sin(i) * 3))
  })),
  { date: "2026-08-30", day_label: "Day -7", milk_yield: 5.75, conductivity: 6.02, activity: 83, body_temp: 38.42, milk_temp: 38.3, scc: 140000, ph: 6.56, risk_score: 25 },
  { date: "2026-08-31", day_label: "Day -6", milk_yield: 5.68, conductivity: 6.11, activity: 81, body_temp: 38.45, milk_temp: 38.35, scc: 155000, ph: 6.58, risk_score: 29 },
  { date: "2026-09-01", day_label: "Day -5", milk_yield: 5.60, conductivity: 6.22, activity: 78, body_temp: 38.49, milk_temp: 38.4, scc: 170000, ph: 6.60, risk_score: 34 },
  { date: "2026-09-02", day_label: "Day -4", milk_yield: 5.50, conductivity: 6.35, activity: 76, body_temp: 38.54, milk_temp: 38.4, scc: 190000, ph: 6.62, risk_score: 43 },
  { date: "2026-09-03", day_label: "Day -3", milk_yield: 5.42, conductivity: 6.48, activity: 74, body_temp: 38.59, milk_temp: 38.4, scc: 210000, ph: 6.63, risk_score: 52 },
  { date: "2026-09-04", day_label: "Day -2", milk_yield: 5.32, conductivity: 6.62, activity: 71, body_temp: 38.64, milk_temp: 38.4, scc: 230000, ph: 6.64, risk_score: 64 },
  { date: "2026-09-05", day_label: "Day -1", milk_yield: 5.25, conductivity: 6.71, activity: 69, body_temp: 38.68, milk_temp: 38.4, scc: 242000, ph: 6.65, risk_score: 71 },
  { date: "2026-09-06", day_label: "Today",  milk_yield: 5.20, conductivity: 6.80, activity: 68, body_temp: 38.70, milk_temp: 38.4, scc: 250000, ph: 6.65, risk_score: 78 }
];

export const MOCK_ANIMALS: Animal[] = [
  INITIAL_COW001,
  {
    animal_id: "COW002",
    breed: "Jersey Cross",
    age: 4,
    lactation: 2,
    previous_mastitis: false,
    vaccination_status: "Up to date",
    current_milk_yield: 7.1,
    current_ec: 5.4,
    current_activity: 92,
    current_body_temp: 38.3,
    current_milk_temp: 38.2,
    current_scc: 95000,
    current_ph: 6.55,
    baseline: { milk_yield: 7.2, conductivity: 5.4, activity: 90, body_temperature: 38.3, scc: 90000, ph: 6.55 },
    risk_score: 14,
    risk_category: "NO RISK",
    forecast_horizon: "7–14 days",
    last_updated: "10 mins ago"
  },
  {
    animal_id: "COW003",
    breed: "Murrah Buffalo",
    age: 6,
    lactation: 3,
    previous_mastitis: false,
    vaccination_status: "Up to date",
    current_milk_yield: 8.4,
    current_ec: 5.5,
    current_activity: 88,
    current_body_temp: 38.4,
    current_milk_temp: 38.3,
    current_scc: 110000,
    current_ph: 6.55,
    baseline: { milk_yield: 8.5, conductivity: 5.5, activity: 88, body_temperature: 38.4, scc: 105000, ph: 6.55 },
    risk_score: 18,
    risk_category: "NO RISK",
    forecast_horizon: "7–14 days",
    last_updated: "5 mins ago"
  },
  {
    animal_id: "COW004",
    breed: "Gir",
    age: 4,
    lactation: 2,
    previous_mastitis: false,
    vaccination_status: "Up to date",
    current_milk_yield: 6.2,
    current_ec: 5.7,
    current_activity: 82,
    current_body_temp: 38.5,
    current_milk_temp: 38.3,
    current_scc: 155000,
    current_ph: 6.58,
    baseline: { milk_yield: 6.4, conductivity: 5.5, activity: 86, body_temperature: 38.4, scc: 120000, ph: 6.55 },
    risk_score: 36,
    risk_category: "LOW RISK",
    forecast_horizon: "7–14 days",
    last_updated: "12 mins ago"
  },
  {
    animal_id: "COW005",
    breed: "Sahiwal",
    age: 5,
    lactation: 3,
    previous_mastitis: false,
    vaccination_status: "Up to date",
    current_milk_yield: 6.8,
    current_ec: 5.8,
    current_activity: 79,
    current_body_temp: 38.5,
    current_milk_temp: 38.3,
    current_scc: 168000,
    current_ph: 6.59,
    baseline: { milk_yield: 7.2, conductivity: 5.5, activity: 84, body_temperature: 38.3, scc: 130000, ph: 6.55 },
    risk_score: 42,
    risk_category: "LOW RISK",
    forecast_horizon: "7–14 days",
    last_updated: "8 mins ago"
  },
  {
    animal_id: "COW006",
    breed: "Holstein Cross",
    age: 6,
    lactation: 4,
    previous_mastitis: true,
    vaccination_status: "Up to date",
    current_milk_yield: 7.4,
    current_ec: 6.2,
    current_activity: 73,
    current_body_temp: 38.6,
    current_milk_temp: 38.4,
    current_scc: 215000,
    current_ph: 6.62,
    baseline: { milk_yield: 8.2, conductivity: 5.6, activity: 85, body_temperature: 38.3, scc: 140000, ph: 6.55 },
    risk_score: 62,
    risk_category: "MODERATE RISK",
    forecast_horizon: "7–14 days",
    last_updated: "2 mins ago",
    subclinical_warning: true
  },
  {
    animal_id: "COW007",
    breed: "Holstein Cross",
    age: 5,
    lactation: 3,
    previous_mastitis: true,
    vaccination_status: "Up to date",
    current_milk_yield: 5.9,
    current_ec: 7.1,
    current_activity: 64,
    current_body_temp: 38.8,
    current_milk_temp: 38.5,
    current_scc: 310000,
    current_ph: 6.70,
    baseline: { milk_yield: 7.0, conductivity: 5.7, activity: 82, body_temperature: 38.4, scc: 130000, ph: 6.55 },
    risk_score: 84,
    risk_category: "HIGH RISK",
    forecast_horizon: "7–14 days",
    last_updated: "Just now",
    subclinical_warning: true
  },
  {
    animal_id: "COW008",
    breed: "Jersey Cross",
    age: 3,
    lactation: 1,
    previous_mastitis: false,
    vaccination_status: "Up to date",
    current_milk_yield: 6.5,
    current_ec: 5.3,
    current_activity: 94,
    current_body_temp: 38.3,
    current_milk_temp: 38.2,
    current_scc: 88000,
    current_ph: 6.55,
    baseline: { milk_yield: 6.6, conductivity: 5.3, activity: 95, body_temperature: 38.3, scc: 85000, ph: 6.55 },
    risk_score: 11,
    risk_category: "NO RISK",
    forecast_horizon: "7–14 days",
    last_updated: "15 mins ago"
  },
  // Auto-generate remaining 42 cows to reach exactly 50
  ...Array.from({ length: 42 }).map((_, i) => {
    const id = `COW${String(i + 9).padStart(3, '0')}`;
    const breeds = ["Holstein Cross", "Jersey Cross", "Murrah Buffalo", "Gir", "Sahiwal"];
    const b = breeds[i % breeds.length];
    // Distribute remaining: 2 High (COW019, COW034), 5 Moderate, 8 Low, 27 No Risk
    let cat: "NO RISK" | "LOW RISK" | "MODERATE RISK" | "HIGH RISK" = "NO RISK";
    let score = 15;
    if (i === 10 || i === 25) {
      cat = "HIGH RISK";
      score = 76 + (i % 8);
    } else if (i % 8 === 0) {
      cat = "MODERATE RISK";
      score = 55 + (i % 15);
    } else if (i % 4 === 0) {
      cat = "LOW RISK";
      score = 30 + (i % 14);
    } else {
      cat = "NO RISK";
      score = 10 + (i % 14);
    }

    const bYield = Number((6.0 + (i % 4)).toFixed(1));
    const yieldDrop = cat === "HIGH RISK" ? 0.88 : (cat === "MODERATE RISK" ? 0.94 : 0.99);
    const ecMult = cat === "HIGH RISK" ? 1.18 : (cat === "MODERATE RISK" ? 1.08 : 1.01);

    return {
      animal_id: id,
      breed: b,
      age: 3 + (i % 6),
      lactation: 1 + (i % 4),
      previous_mastitis: cat === "HIGH RISK",
      vaccination_status: "Up to date",
      current_milk_yield: Number((bYield * yieldDrop).toFixed(2)),
      current_ec: Number((5.5 * ecMult).toFixed(2)),
      current_activity: Math.round(85 * (cat === "HIGH RISK" ? 0.8 : 0.98)),
      current_body_temp: cat === "HIGH RISK" ? 38.7 : 38.4,
      current_milk_temp: 38.3,
      current_scc: cat === "HIGH RISK" ? 275000 : (cat === "MODERATE RISK" ? 190000 : 95000),
      current_ph: cat === "HIGH RISK" ? 6.66 : 6.55,
      baseline: {
        milk_yield: bYield,
        conductivity: 5.5,
        activity: 85,
        body_temperature: 38.4,
        scc: 110000,
        ph: 6.55
      },
      risk_score: score,
      risk_category: cat,
      forecast_horizon: "7–14 days",
      last_updated: `${(i % 25) + 2} mins ago`,
      subclinical_warning: cat === "HIGH RISK" || cat === "MODERATE RISK"
    };
  })
];

export const MOCK_ALERTS: AlertItem[] = [
  {
    id: "ALT-001",
    animal_id: "COW001",
    title: "HIGH MASTITIS RISK",
    risk_score: 78,
    risk_category: "HIGH RISK",
    reason: "Milk yield decreased (-10.3%) and conductivity increased (+15.2%) compared with individual baseline.",
    action: "Monitor animal closely, isolate during milking, and seek veterinary confirmation.",
    acknowledged: false,
    assigned_vet: "Dr. Ramesh Sharma (B.V.Sc)",
    timestamp: "Today, 06:30 AM"
  },
  {
    id: "ALT-002",
    animal_id: "COW007",
    title: "ELEVATED CONDUCTIVITY & SCC",
    risk_score: 84,
    risk_category: "HIGH RISK",
    reason: "SCC spike above 310,000 cells/mL with persistent milk temp elevation (+0.3°C).",
    action: "Perform California Mastitis Test (CMT) and schedule veterinary inspection.",
    acknowledged: false,
    assigned_vet: "Dr. Ramesh Sharma (B.V.Sc)",
    timestamp: "Today, 07:15 AM"
  },
  {
    id: "ALT-003",
    animal_id: "COW019",
    title: "MODERATE RISK TRAJECTORY",
    risk_score: 76,
    risk_category: "HIGH RISK",
    reason: "Activity drop of 18% coupled with mild milk yield decline over 3 sessions.",
    action: "Check teat condition and monitor evening milking flow.",
    acknowledged: true,
    assigned_vet: null,
    timestamp: "Yesterday, 18:20 PM"
  },
  {
    id: "ALT-004",
    animal_id: "HERD",
    title: "HERD-LEVEL RISK ALERT",
    risk_score: 64,
    risk_category: "MODERATE RISK",
    reason: "Herd risk trajectory shows high-risk count increasing from 4 to 14 animals over 4 weeks.",
    action: "Review parlor disinfection procedures, teat-dip efficacy, and barn ventilation.",
    acknowledged: false,
    assigned_vet: "District Health Officer",
    timestamp: "Today, 05:00 AM"
  }
];

export const MOCK_HERD_RISK: HerdRiskData = {
  total_animals: 50,
  breakdown: {
    no_risk: 30,
    low: 10,
    moderate: 6,
    high: 4
  },
  herd_risk_score: 64,
  herd_risk_category: "MODERATE / ELEVATED",
  herd_trend_alert: "Increasing herd-level risk trend detected over 4-week window",
  averages: {
    milk_yield: 6.8,
    conductivity: 5.75,
    activity: 83.4,
    scc: 142000
  },
  weekly_trend: [
    { week: "Week 1", high_risk_count: 4, avg_ec: 5.82, herd_risk_pct: 28 },
    { week: "Week 2", high_risk_count: 6, avg_ec: 5.95, herd_risk_pct: 39 },
    { week: "Week 3", high_risk_count: 9, avg_ec: 6.12, herd_risk_pct: 51 },
    { week: "Week 4", high_risk_count: 14, avg_ec: 6.34, herd_risk_pct: 64 }
  ]
};

export const MOCK_GIS_FARMS: GISFarm[] = [
  {
    id: "FARM_001",
    name: "Amul Cooperative Dairy #14, Anand",
    state: "Gujarat",
    district: "Anand",
    lat: 22.5645,
    lng: 72.9289,
    total_animals: 50,
    high_risk_count: 4,
    herd_risk_pct: 64,
    risk_status: "HIGH RISK",
    recent_alert: "COW001 +3 animals with elevated EC & yield drop"
  },
  {
    id: "FARM_002",
    name: "Bhavani Valley Dairy, Erode",
    state: "Tamil Nadu",
    district: "Erode",
    lat: 11.3410,
    lng: 77.7172,
    total_animals: 65,
    high_risk_count: 2,
    herd_risk_pct: 42,
    risk_status: "MODERATE RISK",
    recent_alert: "Minor heat stress warning; humidity > 80%"
  },
  {
    id: "FARM_003",
    name: "Karnal Green Milks, Karnal",
    state: "Haryana",
    district: "Karnal",
    lat: 29.6857,
    lng: 76.9905,
    total_animals: 80,
    high_risk_count: 1,
    herd_risk_pct: 22,
    risk_status: "LOW RISK",
    recent_alert: "All milking parlors sanitized"
  },
  {
    id: "FARM_004",
    name: "Malwa Heritage Dairy, Ludhiana",
    state: "Punjab",
    district: "Ludhiana",
    lat: 30.9010,
    lng: 75.8573,
    total_animals: 70,
    high_risk_count: 5,
    herd_risk_pct: 71,
    risk_status: "HIGH RISK",
    recent_alert: "Subclinical cluster suspected in Barn B"
  },
  {
    id: "FARM_005",
    name: "Kaveri Dairy Producers, Mysuru",
    state: "Karnataka",
    district: "Mysuru",
    lat: 12.2958,
    lng: 76.6394,
    total_animals: 45,
    high_risk_count: 0,
    herd_risk_pct: 14,
    risk_status: "NO RISK",
    recent_alert: "Stable baseline parameters"
  }
];

export const MOCK_MODEL_INFO: ModelInfo = {
  current_model: "Random Forest v1.0",
  model_version: "rf-mastitis-2026.1",
  future_model: "XGBoost v2.0 (Configured & Ready)",
  training_dataset_size: 15420,
  last_training_date: "2026-08-28",
  validation_status: "Time-based longitudinal split (7–14d horizon)",
  accuracy: 0.892,
  precision: 0.865,
  recall: 0.884,
  f1_score: 0.874,
  roc_auc: 0.931,
  forecast_7d_accuracy: 0.912,
  forecast_14d_accuracy: 0.854,
  confusion_matrix: {
    true_positive: 178,
    false_positive: 24,
    false_negative: 22,
    true_negative: 776
  }
};

export const MOCK_SENSOR_STATUS: SensorStatus = {
  esp32_gateway: { status: "ONLINE", last_reading: "Just now", battery: "100%", signal: "-62 dBm" },
  milk_flow_sensor: { status: "ONLINE", last_reading: "1.2 L/min", battery: "Mains", signal: "Strong" },
  milk_temp_sensor: { status: "ONLINE", last_reading: "38.4 °C", battery: "Mains", signal: "Strong" },
  conductivity_sensor: { status: "ONLINE", last_reading: "6.8 mS/cm", battery: "Mains", signal: "Strong" },
  wearable_collar: { status: "ONLINE", last_reading: "68 index", battery: "94%", signal: "-68 dBm" },
  body_temp_sensor: { status: "ONLINE", last_reading: "38.7 °C", battery: "91%", signal: "-70 dBm" },
  environment_station: { status: "ONLINE", last_reading: "32 °C / 76% RH", battery: "Solar / 98%", signal: "Strong" }
};

export const MOCK_DATA_QUALITY: DataQuality = {
  milk_sensor_validity: 98.4,
  wearable_validity: 95.2,
  scc_validity: 100.0,
  environment_validity: 99.1,
  missing_records_pct: 0.8,
  outlier_rate_pct: 1.2,
  sync_latency_ms: 140
};

export const MOCK_MILKING_SESSION: MilkingSession = {
  session_id: "SESS-20260906-01",
  animal_id: "COW001",
  status: "IN_PROGRESS",
  flow_rate: 1.2,
  milk_temperature: 38.4,
  conductivity: 6.8,
  yield_accumulated: 5.2,
  started_at: "18:42:10",
  elapsed_sec: 245
};
