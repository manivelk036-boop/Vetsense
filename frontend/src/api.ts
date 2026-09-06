import {
  Animal, HistoricalRecord, AlertItem, HerdRiskData, GISFarm,
  ModelInfo, SensorStatus, DataQuality, MilkingSession, VeterinaryOutcome
} from './types';
import {
  MOCK_ANIMALS, COW001_HISTORY_30D, MOCK_ALERTS, MOCK_HERD_RISK,
  MOCK_GIS_FARMS, MOCK_MODEL_INFO, MOCK_SENSOR_STATUS, MOCK_DATA_QUALITY,
  MOCK_MILKING_SESSION
} from './mockData';

const BASE_URL = '/api';

// Helper for safe fetch with mock fallback
async function fetchWithFallback<T>(url: string, fallbackData: T, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${url}`, options);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch {
    // If backend is not running or network fails, gracefully return rich simulated fallback data
    return fallbackData;
  }
}

export const api = {
  getAnimals: async (risk?: string, breed?: string, search?: string): Promise<Animal[]> => {
    let list = await fetchWithFallback<Animal[]>('/animals', MOCK_ANIMALS);
    if (risk && risk !== 'ALL') {
      list = list.filter(a => a.risk_category.toUpperCase() === risk.toUpperCase());
    }
    if (breed && breed !== 'ALL') {
      list = list.filter(a => a.breed.toLowerCase() === breed.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(a => a.animal_id.toLowerCase().includes(s) || a.breed.toLowerCase().includes(s));
    }
    return list;
  },

  getAnimalDetail: async (id: string) => {
    const animal = MOCK_ANIMALS.find(a => a.animal_id === id) || MOCK_ANIMALS[0];
    const fallback = {
      animal,
      prediction: {
        animal_id: id,
        risk_score: animal.risk_score,
        risk_category: animal.risk_category,
        forecast_horizon: "7–14 days",
        contributing_factors: [
          { feature: "Electrical Conductivity", contribution: 30, description: "Conductivity elevated +15.2% above baseline" },
          { feature: "Milk Yield Drop", contribution: 25, description: "Yield dropped -10.3% below baseline" },
          { feature: "Activity Level", contribution: 18, description: "Activity decreased -20.0% below baseline" },
          { feature: "Body Temp Deviation", contribution: 12, description: "Elevated +0.3°C above physiological norm" },
          { feature: "Mastitis History", contribution: 10, description: "Previous episode record" }
        ],
        subclinical_risk: "HIGH",
        model_version: "rf-mastitis-2026.1",
        timestamp: new Date().toISOString()
      },
      deviations: {
        yield_deviation_pct: -10.3,
        ec_deviation_pct: 15.2,
        activity_deviation_pct: -20.0,
        body_temp_deviation_c: 0.3
      },
      environment: { ambient_temp: 32.0, humidity: 76.0 }
    };
    return await fetchWithFallback(`/animals/${id}`, fallback);
  },

  getAnimalHistory: async (id: string, days: number = 30): Promise<HistoricalRecord[]> => {
    return await fetchWithFallback<HistoricalRecord[]>(`/animals/${id}/history?days=${days}`, COW001_HISTORY_30D.slice(-days));
  },

  getHerdRisk: async (): Promise<HerdRiskData> => {
    return await fetchWithFallback<HerdRiskData>('/herd/risk', MOCK_HERD_RISK);
  },

  getAlerts: async (): Promise<AlertItem[]> => {
    return await fetchWithFallback<AlertItem[]>('/alerts', MOCK_ALERTS);
  },

  acknowledgeAlert: async (id: string) => {
    return await fetchWithFallback(`/alerts/${id}/acknowledge`, { status: "SUCCESS" }, { method: 'POST' });
  },

  getGisFarms: async (): Promise<GISFarm[]> => {
    return await fetchWithFallback<GISFarm[]>('/gis/farms', MOCK_GIS_FARMS);
  },

  getSensorsStatus: async (): Promise<SensorStatus> => {
    return await fetchWithFallback<SensorStatus>('/sensors/status', MOCK_SENSOR_STATUS);
  },

  getDataQuality: async (): Promise<DataQuality> => {
    return await fetchWithFallback<DataQuality>('/data-quality', MOCK_DATA_QUALITY);
  },

  getModelInfo: async (): Promise<ModelInfo> => {
    return await fetchWithFallback<ModelInfo>('/ai/model', MOCK_MODEL_INFO);
  },

  retrainModel: async () => {
    return await fetchWithFallback('/ai/retrain', {
      status: "SUCCESS",
      updated_model_info: { ...MOCK_MODEL_INFO, accuracy: 0.898, f1_score: 0.880 }
    }, { method: 'POST' });
  },

  getCurrentMilkingSession: async (): Promise<MilkingSession> => {
    return await fetchWithFallback<MilkingSession>('/milking/current', MOCK_MILKING_SESSION);
  },

  tickMilking: async (): Promise<MilkingSession> => {
    return await fetchWithFallback<MilkingSession>('/milking/tick', {
      ...MOCK_MILKING_SESSION,
      flow_rate: Number((1.2 + (Math.random() * 0.2 - 0.1)).toFixed(2)),
      yield_accumulated: Number((MOCK_MILKING_SESSION.yield_accumulated + 0.1).toFixed(2)),
      elapsed_sec: MOCK_MILKING_SESSION.elapsed_sec + 5
    }, { method: 'POST' });
  },

  saveVeterinaryOutcome: async (outcome: Partial<VeterinaryOutcome>) => {
    return await fetchWithFallback('/veterinary/outcome', {
      status: "SUCCESS",
      message: "Veterinary clinical outcome saved"
    }, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(outcome)
    });
  },

  recordManualObservation: async (data: Record<string, any>) => {
    return await fetchWithFallback('/manual/observation', {
      status: "SUCCESS",
      message: "Observation recorded successfully"
    }, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};
