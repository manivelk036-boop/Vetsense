from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class MilkSensorReading(BaseModel):
    animal_id: str
    flow_rate: float = Field(..., description="Flow rate in L/min")
    milk_temperature: float = Field(..., description="Milk temp in °C")
    conductivity: float = Field(..., description="Electrical conductivity in mS/cm")
    yield_accumulated: float = Field(..., description="Accumulated session yield in L")
    timestamp: Optional[datetime] = None

class WearableReading(BaseModel):
    animal_id: str
    activity_index: float = Field(..., description="Collar activity score 0-100")
    body_temperature: float = Field(..., description="Reticulorumen or body temp in °C")
    rumination_minutes: Optional[int] = Field(default=420, description="Daily rumination minutes")
    timestamp: Optional[datetime] = None

class EnvironmentReading(BaseModel):
    farm_id: str = "FARM_01"
    ambient_temperature: float = Field(..., description="Ambient temperature in °C")
    relative_humidity: float = Field(..., description="Relative humidity %")
    thi_index: Optional[float] = None
    timestamp: Optional[datetime] = None

class LabSCCReading(BaseModel):
    animal_id: str
    scc_count: int = Field(..., description="Somatic cell count cells/mL")
    test_method: str = "Optical Fluorescent Counter"
    timestamp: Optional[datetime] = None

class LabPHReading(BaseModel):
    animal_id: str
    ph_value: float = Field(..., description="Milk pH value (normally 6.5 - 6.7)")
    timestamp: Optional[datetime] = None

class ManualObservation(BaseModel):
    animal_id: str
    scc: Optional[int] = None
    ph: Optional[float] = None
    feed_change: bool = False
    housing_condition: str = "Good" # Good / Moderate / Poor
    hygiene_condition: str = "Good" # Good / Moderate / Poor
    milking_hygiene: str = "Good" # Good / Moderate / Poor
    udder_observation: str = "Normal" # Normal / Abnormal
    milk_appearance: str = "Normal" # Normal / Abnormal
    recent_treatment: bool = False
    notes: Optional[str] = None
    timestamp: Optional[datetime] = None

class AnimalBaseline(BaseModel):
    milk_yield: float
    conductivity: float
    activity: float
    body_temperature: float
    scc: int
    ph: float

class Animal(BaseModel):
    animal_id: str
    breed: str
    age: int
    lactation: int
    previous_mastitis: bool
    vaccination_status: str
    current_milk_yield: float
    current_ec: float
    current_activity: float
    current_body_temp: float
    current_milk_temp: float
    current_scc: int
    current_ph: float
    baseline: AnimalBaseline
    risk_score: int
    risk_category: str # "NO RISK", "LOW RISK", "MODERATE RISK", "HIGH RISK"
    forecast_horizon: str = "7-14 days"
    last_updated: str
    subclinical_warning: bool = False

class ContributingFactor(BaseModel):
    feature: str
    contribution: int # e.g. +30, -10
    description: str

class PredictionResult(BaseModel):
    animal_id: str
    risk_score: int
    risk_category: str
    forecast_horizon: str
    contributing_factors: List[ContributingFactor]
    model_version: str
    subclinical_risk: str
    timestamp: str

class AlertItem(BaseModel):
    id: str
    animal_id: str
    title: str
    risk_score: int
    risk_category: str
    reason: str
    action: str
    acknowledged: bool
    assigned_vet: Optional[str] = None
    timestamp: str

class VeterinaryOutcomeRequest(BaseModel):
    animal_id: str
    prediction_id: Optional[str] = None
    clinical_outcome: str # "Confirmed", "Not Confirmed", "Requires Follow-up"
    affected_quarters: List[str] = [] # RF, RR, LF, LR
    clinical_signs_present: bool = False
    treatment_recommendation: Optional[str] = None
    vet_notes: Optional[str] = None
    vet_id: str = "VET_DR_SHARMA"
    timestamp: Optional[datetime] = None

class MilkingSessionTick(BaseModel):
    session_id: str
    animal_id: str
    flow_rate: float
    milk_temperature: float
    conductivity: float
    yield_accumulated: float
    status: str # "IN_PROGRESS", "COMPLETED"

class ModelInfo(BaseModel):
    current_model: str
    model_version: str
    future_model: str
    training_dataset_size: int
    last_training_date: str
    validation_status: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    forecast_7d_accuracy: float
    forecast_14d_accuracy: float
    confusion_matrix: Dict[str, int]
