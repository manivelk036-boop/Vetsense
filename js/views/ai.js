/* ── AI Forecasting Engine & 4 Intelligence Layers (Modules 8 & 9) ── */
const AiView = {
  selectedCowId: 'COW-001',

  render() {
    const cows = VetData.cows;
    const cow = cows.find(c => c.id === this.selectedCowId) || cows[0];
    const pred = VetData.aiPredictions[cow.id] || VetData.aiPredictions['COW-001'];
    const live = VetData.getLive(cow.id);

    const scoreColor = pred.score >= 70 ? 'var(--red)' : pred.score >= 40 ? 'var(--yellow)' : 'var(--green)';
    const categoryLabel = pred.score >= 70 ? 'HIGH RISK' : pred.score >= 40 ? 'MODERATE RISK' : pred.score >= 20 ? 'LOW RISK' : 'NO RISK';
    const badgeClass = pred.score >= 70 ? 'badge-high' : pred.score >= 40 ? 'badge-moderate' : 'badge-healthy';

    setTimeout(() => {
      this.initCharts(cow, pred);
    }, 60);

    return `
      <div class="fade-in">
        <!-- Page Header -->
        <div class="section-header">
          <div>
            <h2 class="text-xl font-bold">AI Predictive Forecasting Engine</h2>
            <p class="text-sm text-muted">Bovine Mastitis Early Forecasting System · 7–14 Day Pre-Clinical Early Warning Window</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge badge-teal">⚡ Neural Multi-Layer Architecture</span>
            <span class="badge ${pred.trust==='High'?'badge-healthy':pred.trust==='Medium'?'badge-moderate':'badge-high'}">Trust: ${pred.trust}</span>
          </div>
        </div>

        <!-- Cow Selector Bar -->
        <div class="card card-sm mb-4 flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-2 overflow-x-auto" style="padding-bottom:4px;">
            <span class="text-xs font-semibold text-muted shrink-0">ANALYZE COW:</span>
            ${cows.map(c => `
              <button class="btn btn-sm ${c.id === cow.id ? 'btn-teal' : 'btn-ghost'}" onclick="AiView.selectCow('${c.id}')">
                ${c.id} (${c.name})
                <span class="badge ${c.riskLevel==='high'?'badge-high':c.riskLevel==='moderate'?'badge-moderate':'badge-healthy'}" style="margin-left:4px;font-size:0.65rem;">
                  ${c.riskScore}%
                </span>
              </button>
            `).join('')}
          </div>
          <div class="text-xs text-muted">Model Version: <strong class="text-primary">VetSense-BovNet-v4.2</strong> (Trained on 45,000 lactations)</div>
        </div>

        <!-- Top Forecast Core Matrix -->
        <div class="grid-4 mb-4">
          <!-- A. Risk Score -->
          <div class="card flex flex-col items-center justify-center text-center" style="position:relative;overflow:hidden;">
            <div class="text-xs text-muted font-bold uppercase tracking-wider mb-2">Mastitis Risk Score</div>
            <div style="font-family:var(--font-display);font-size:3rem;font-weight:800;color:${scoreColor};line-height:1;">
              ${pred.score}%
            </div>
            <div class="mt-2">
              <span class="badge ${badgeClass}">${categoryLabel}</span>
            </div>
            <div class="text-xs text-muted mt-2">Baseline threshold: 45%</div>
          </div>

          <!-- B. Early Forecast Window -->
          <div class="card flex flex-col justify-between">
            <div>
              <div class="text-xs text-muted font-bold uppercase tracking-wider mb-2">Early Warning Window</div>
              <div class="text-2xl font-bold text-accent">${pred.window}</div>
              <div class="text-xs text-300 mt-2">
                Estimated onset of observable clinical signs if unmitigated.
              </div>
            </div>
            <div class="alert-banner alert-banner-info" style="margin-bottom:0;padding:8px 12px;font-size:0.75rem;">
              ⏳ Pre-clinical window active. Intervene now to avoid antibiotic discard.
            </div>
          </div>

          <!-- C. Confidence & Data Trust -->
          <div class="card flex flex-col justify-between">
            <div>
              <div class="text-xs text-muted font-bold uppercase tracking-wider mb-2">Prediction Confidence</div>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-teal">${pred.confidence}%</span>
                <span class="text-xs text-muted">Model certainty</span>
              </div>
              <div class="progress-bar mt-2">
                <div class="progress-fill" style="width:${pred.confidence}%;background:var(--teal);"></div>
              </div>
            </div>
            <div class="flex items-center justify-between border-top pt-2">
              <span class="text-xs text-muted">Data Trust Intelligence:</span>
              <span class="badge ${pred.trust==='High'?'badge-healthy':pred.trust==='Medium'?'badge-moderate':'badge-high'}">
                ${pred.trust} Trust
              </span>
            </div>
          </div>

          <!-- D. Recommended Rapid Action -->
          <div class="card flex flex-col justify-between" style="border-left:3px solid ${scoreColor};">
            <div>
              <div class="text-xs text-muted font-bold uppercase tracking-wider mb-2">Clinical Protocol</div>
              <div class="font-bold text-100 text-sm">
                ${pred.score >= 70 ? '🚨 Immediate Quarter Isolation & Vet Exam' : pred.score >= 40 ? '⚠️ High Hygiene & Teat Barrier Dipping' : '✓ Standard Milking Routine'}
              </div>
              <p class="text-xs text-muted mt-2">
                ${pred.score >= 70 ? 'Perform California Mastitis Test (CMT) within 6 hours.' : 'Continue continuous IoT telemetry surveillance.'}
              </p>
            </div>
            <button class="btn btn-sm btn-ghost w-full justify-center mt-2" onclick="App.navigate('recs')">
              View Detailed Action Plan →
            </button>
          </div>
        </div>

        <!-- Contributing Factors Box -->
        <div class="card mb-4">
          <div class="section-header mb-3">
            <div class="section-title">
              🔍 Root Contributing Biometric Factors (SHAP Explainability)
            </div>
            <span class="text-xs text-muted">Ranked by feature importance weight</span>
          </div>
          <div class="grid-2">
            ${pred.factors.map(f => `
              <div class="factor-item">
                <div class="factor-dot ${f.impact}"></div>
                <div class="factor-text">${f.text}</div>
                <span class="factor-impact ${f.impact}">${f.impact.toUpperCase()} IMPACT</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ============================================================
             SECTION: THE 4 UNIQUE AI INTELLIGENCE LAYERS
             ============================================================ -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-bold">Four Proprietary AI Intelligence Layers</h3>
            <span class="badge badge-info">Multi-Modal Fusion Architecture</span>
          </div>

          <div class="grid-2" style="gap:20px;">
            <!-- LAYER A: Pre-Mastitis Temporal Fingerprint -->
            <div class="ai-layer-card temporal">
              <div class="ai-layer-header">
                <div class="ai-layer-icon" style="background:var(--primary-glow);color:var(--primary);">🧬</div>
                <div>
                  <div class="ai-layer-title">Layer 1: Pre-Mastitis Temporal Fingerprint</div>
                  <div class="ai-layer-subtitle">Time-series sequence recognition across 14-day temporal vectors</div>
                </div>
              </div>
              <p class="text-xs text-muted" style="line-height:1.6;">
                Identifies micro-cascades before inflammation manifests: <em>1) Sub-acute conductivity rise → 2) Rumination decrease (-12%) → 3) Evening milk yield dip (-1.5L) → 4) Transient bolus thermal blip (+0.4°C)</em>.
              </p>
              <div class="chart-container" style="height:180px;">
                <canvas id="temporalFingerprintChart"></canvas>
              </div>
            </div>

            <!-- LAYER B: Cow-Specific Personalized Baseline -->
            <div class="ai-layer-card baseline">
              <div class="ai-layer-header">
                <div class="ai-layer-icon" style="background:var(--teal-glow);color:var(--teal);">🎯</div>
                <div>
                  <div class="ai-layer-title">Layer 2: Cow-Specific Personalized Baseline</div>
                  <div class="ai-layer-subtitle">Dynamic normal profile relative to lactation stage, breed & parity</div>
                </div>
              </div>
              <p class="text-xs text-muted" style="line-height:1.6;">
                Instead of fixed population cutoffs, VetSense AI builds a personalized biometric envelope for <strong>${cow.name} (${cow.breed}, Lactation #${cow.lactation})</strong>.
              </p>
              <div class="chart-container" style="height:180px;">
                <canvas id="baselineRadarChart"></canvas>
              </div>
            </div>

            <!-- LAYER C: Farm-Adaptive AI -->
            <div class="ai-layer-card farm">
              <div class="ai-layer-header">
                <div class="ai-layer-icon" style="background:var(--accent-glow);color:var(--accent);">🌾</div>
                <div>
                  <div class="ai-layer-title">Layer 3: Farm-Adaptive Environmental AI</div>
                  <div class="ai-layer-subtitle">Calibrates risks based on pen hygiene, humidity & monsoon stress</div>
                </div>
              </div>
              <p class="text-xs text-muted" style="line-height:1.6;">
                Dynamically adjusts mathematical weighting to compensate for ambient Indian dairy conditions (high THI, tropical humidity, mud exposure during rainy season).
              </p>
              <div style="background:var(--bg-800);padding:12px;border-radius:var(--radius-sm);display:flex;flex-direction:column;gap:8px;">
                <div class="flex justify-between text-xs">
                  <span class="text-muted">Barn Temperature & Humidity Index:</span>
                  <strong class="text-accent">THI 79.2 (Mild Thermal Stress)</strong>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-muted">Housing & Bedding Hygiene Multiplier:</span>
                  <strong class="text-teal">1.08x (Clean Sand Baseline)</strong>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-muted">Regional Heat Stress Dampening:</span>
                  <strong class="text-success">Active (Filters false-positive temp spikes)</strong>
                </div>
              </div>
            </div>

            <!-- LAYER D: Data Trust Intelligence -->
            <div class="ai-layer-card trust">
              <div class="ai-layer-header">
                <div class="ai-layer-icon" style="background:var(--green-glow);color:var(--green);">🛡️</div>
                <div>
                  <div class="ai-layer-title">Layer 4: Data Trust Intelligence (Sanity Sentinel)</div>
                  <div class="ai-layer-subtitle">Real-time sensor telemetry validation & outlier rejection</div>
                </div>
              </div>
              <p class="text-xs text-muted" style="line-height:1.6;">
                Detects sensor dislodgment, packet dropout, dead batteries, and impossible readings (e.g. body temp &gt; 44°C) before triggering false alarms.
              </p>

              <!-- Trust breakdown for active cow -->
              <div class="trust-indicator">
                <div class="trust-sensor-row">
                  <span class="trust-sensor-name">Milk Flow Meter (ESP32-A)</span>
                  <span class="badge ${pred.trustDetails.yield==='OK'?'badge-healthy':'badge-high'}">${pred.trustDetails.yield}</span>
                </div>
                <div class="trust-sensor-row">
                  <span class="trust-sensor-name">Conductivity Probe (Teat Cup)</span>
                  <span class="badge ${pred.trustDetails.conductivity==='OK'?'badge-healthy':pred.trustDetails.conductivity==='WARN'?'badge-moderate':'badge-high'}">${pred.trustDetails.conductivity}</span>
                </div>
                <div class="trust-sensor-row">
                  <span class="trust-sensor-name">Bolus Body Thermometer</span>
                  <span class="badge ${pred.trustDetails.bodyTemp==='OK'?'badge-healthy':'badge-high'}">${pred.trustDetails.bodyTemp}</span>
                </div>
                <div class="trust-sensor-row">
                  <span class="trust-sensor-name">Neck Collar Accelerometer</span>
                  <span class="badge ${pred.trustDetails.activity==='OK'?'badge-healthy':'badge-high'}">${pred.trustDetails.activity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Forecast 14-Day Timeline Projection Bar -->
        <div class="card">
          <div class="section-header mb-2">
            <div class="section-title">📅 14-Day Early Warning Progression Simulation</div>
            <span class="badge badge-teal">Daily Forecasted Trajectory</span>
          </div>
          <p class="text-xs text-muted mb-4">Risk probability if management does not apply preventative teat dipping or milking order adjustments:</p>
          
          <div class="forecast-timeline">
            ${[
              { day: 'Day -14', pct: 15, col: 'var(--green)' },
              { day: 'Day -10', pct: 28, col: 'var(--green)' },
              { day: 'Day -7',  pct: 45, col: 'var(--yellow)' },
              { day: 'Day -5',  pct: 62, col: 'var(--yellow)' },
              { day: 'Day -3',  pct: 74, col: 'var(--red)' },
              { day: 'Day -1',  pct: 82, col: 'var(--red)' },
              { day: 'Today',   pct: pred.score, col: scoreColor }
            ].map(d => `
              <div class="forecast-day">
                <span class="forecast-day-label">${d.day}</span>
                <div class="forecast-bar">
                  <div class="forecast-fill" style="width:${d.pct}%;background:${d.col};"></div>
                </div>
                <span class="forecast-pct" style="color:${d.col}">${d.pct}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  selectCow(cowId) {
    this.selectedCowId = cowId;
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  initCharts(cow, pred) {
    // Temporal Fingerprint Chart (Risk Curve)
    const days = ['Day -7', 'Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Day -1', 'Today'];
    Charts.line('temporalFingerprintChart', days, [
      { label: 'Risk Probability (%)', data: pred.temporalPattern || [10, 15, 25, 40, 55, 70, 78, 82], color: 'rgb(14,165,233)' }
    ]);

    // Baseline Radar Chart
    const dev = pred.baselineDeviation || { yield: -15, conductivity: +25, activity: -30, bodyTemp: +1.5 };
    Charts.radar('baselineRadarChart',
      ['Milk Yield', 'Electrical Conductivity', 'Activity Index', 'Core Body Temp', 'Rumination Hours'],
      [
        {
          label: `${cow.name} 30-Day Normal Baseline`,
          data: [100, 100, 100, 100, 100],
          borderColor: 'rgba(20,184,166,0.8)',
          backgroundColor: 'rgba(20,184,166,0.15)'
        },
        {
          label: 'Current Real-Time Vector',
          data: [
            Math.max(20, 100 + dev.yield),
            Math.max(20, 100 + dev.conductivity),
            Math.max(20, 100 + dev.activity),
            Math.min(150, 100 + dev.bodyTemp * 15),
            Math.max(30, 100 + dev.activity * 0.8)
          ],
          borderColor: pred.score >= 70 ? 'rgba(239,68,68,0.9)' : 'rgba(234,179,8,0.9)',
          backgroundColor: pred.score >= 70 ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)'
        }
      ]
    );
  }
};
