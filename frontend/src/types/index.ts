export type UserRole = 'FARMER' | 'VETERINARIAN' | 'ADMIN';

export type Language = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml';

export type RiskCategory = 'NO RISK' | 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK';

export interface AnimalBaseline {
  milk_yield: number;
  conductivity: number;
  activity: number;
  body_temperature: number;
  scc: number;
  ph: number;
}

export interface Animal {
  animal_id: string;
  breed: string;
  age: number;
  lactation: number;
  previous_mastitis: boolean;
  vaccination_status: string;
  current_milk_yield: number;
  current_ec: number;
  current_activity: number;
  current_body_temp: number;
  current_milk_temp: number;
  current_scc: number;
  current_ph: number;
  baseline: AnimalBaseline;
  risk_score: number;
  risk_category: RiskCategory;
  forecast_horizon: string;
  last_updated: string;
  subclinical_warning?: boolean;
}

export interface HistoricalRecord {
  date: string;
  day_label: string;
  milk_yield: number;
  conductivity: number;
  activity: number;
  body_temp: number;
  milk_temp: number;
  scc: number;
  ph: number;
  risk_score: number;
}

export interface ContributingFactor {
  feature: string;
  contribution: number;
  description: string;
}

export interface PredictionResult {
  animal_id: string;
  risk_score: number;
  risk_category: RiskCategory;
  forecast_horizon: string;
  contributing_factors: ContributingFactor[];
  subclinical_risk: string;
  model_version: string;
  timestamp: string;
}

export interface AlertItem {
  id: string;
  animal_id: string;
  title: string;
  risk_score: number;
  risk_category: RiskCategory;
  reason: string;
  action: string;
  acknowledged: boolean;
  assigned_vet?: string | null;
  timestamp: string;
}

export interface VeterinaryOutcome {
  id: string;
  animal_id: string;
  clinical_outcome: 'Confirmed' | 'Not Confirmed' | 'Requires Follow-up';
  affected_quarters: string[];
  clinical_signs_present: boolean;
  treatment_recommendation?: string;
  vet_notes?: string;
  vet_id: string;
  timestamp: string;
}

export interface GISFarm {
  id: string;
  name: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  total_animals: number;
  high_risk_count: number;
  herd_risk_pct: number;
  risk_status: RiskCategory;
  recent_alert: string;
}

export interface HerdWeeklyTrend {
  week: string;
  high_risk_count: number;
  avg_ec: number;
  herd_risk_pct: number;
}

export interface HerdRiskData {
  total_animals: number;
  breakdown: {
    no_risk: number;
    low: number;
    moderate: number;
    high: number;
  };
  herd_risk_score: number;
  herd_risk_category: string;
  herd_trend_alert: string;
  averages: {
    milk_yield: number;
    conductivity: number;
    activity: number;
    scc: number;
  };
  weekly_trend: HerdWeeklyTrend[];
}

export interface MilkingSession {
  session_id: string;
  animal_id: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  flow_rate: number;
  milk_temperature: number;
  conductivity: number;
  yield_accumulated: number;
  started_at: string;
  elapsed_sec: number;
}

export interface ModelInfo {
  current_model: string;
  model_version: string;
  future_model: string;
  training_dataset_size: number;
  last_training_date: string;
  validation_status: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  forecast_7d_accuracy: number;
  forecast_14d_accuracy: number;
  confusion_matrix: {
    true_positive: number;
    false_positive: number;
    false_negative: number;
    true_negative: number;
  };
}

export interface SensorStatus {
  [key: string]: {
    status: string;
    last_reading: string;
    battery: string;
    signal: string;
  };
}

export interface DataQuality {
  milk_sensor_validity: number;
  wearable_validity: number;
  scc_validity: number;
  environment_validity: number;
  missing_records_pct: number;
  outlier_rate_pct: number;
  sync_latency_ms: number;
}
