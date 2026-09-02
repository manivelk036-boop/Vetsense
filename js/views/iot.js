/* ── IoT Monitoring View (ESP32 Sensor Telemetry) ── */
const IotView = {
  selectedCowId: 'COW-001',

  render() {
    const cows = VetData.cows;
    const cow = cows.find(c => c.id === this.selectedCowId) || cows[0];
    const live = VetData.getLive(cow.id);
    const onlineSensors = Object.values(VetData.sensorOnline).filter(Boolean).length;

    setTimeout(() => {
      this.initCharts();
    }, 60);

    return `
      <div class="fade-in">
        <div class="section-header">
          <div>
            <h2 class="text-xl font-bold">Real-Time IoT Sensor Telemetry</h2>
            <p class="text-sm text-muted">Direct telemetry stream from collar, in-line milking unit & environmental ESP32 microcontrollers</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="badge ${live.online ? 'badge-online' : 'badge-offline'}">
              ${live.online ? '● ESP32 LINK ACTIVE (MQTT / REST)' : '○ ESP32 DISCONNECTED'}
            </span>
            <button class="btn btn-sm btn-ghost" onclick="IotView.simulateAnomaly('${cow.id}')">⚡ Trigger Anomaly Test</button>
          </div>
        </div>

        <!-- Cow Selector Tabs -->
        <div class="card card-sm mb-4 flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-2 overflow-x-auto" style="padding-bottom:4px;">
            <span class="text-xs font-semibold text-muted shrink-0">SELECT COW:</span>
            ${cows.map(c => `
              <button class="btn btn-sm ${c.id === cow.id ? 'btn-teal' : 'btn-ghost'}" onclick="IotView.selectCow('${c.id}')">
                ${c.id} (${c.name})
                <span class="badge ${c.riskLevel==='high'?'badge-high':c.riskLevel==='moderate'?'badge-moderate':'badge-healthy'}" style="margin-left:4px;font-size:0.6rem;">
                  ${c.riskScore}%
                </span>
              </button>
            `).join('')}
          </div>
          <div class="text-xs text-muted">Last sync: <span id="iotTimestamp" class="text-teal font-mono">${live.ts}</span></div>
        </div>

        <!-- Top Telemetry Cards -->
        <div class="grid-4 mb-4">
          <!-- Milk Yield -->
          <div class="sensor-card">
            <div class="sensor-header">
              <span class="sensor-name">Milk Yield (Per Milking)</span>
              <div class="sensor-icon" style="background:var(--teal-glow);color:var(--teal);">🥛</div>
            </div>
            <div class="flex items-baseline">
              <span class="sensor-value" id="valYield">${live.yield}</span>
              <span class="sensor-unit">Liters</span>
            </div>
            <div class="sensor-timestamp">In-line flow sensor (ESP32 Node-A)</div>
            <div class="sensor-delta ${live.yield < 9.5 ? 'down' : 'up'}" id="deltaYield">
              ${live.yield < 9.5 ? '▼ -18% vs 14-day normal' : '▲ Normal expected yield'}
            </div>
          </div>

          <!-- Milk Conductivity -->
          <div class="sensor-card">
            <div class="sensor-header">
              <span class="sensor-name">Milk Electrical Conductivity</span>
              <div class="sensor-icon" style="background:${live.conductivity>6.8?'var(--red-glow)':'var(--primary-glow)'};color:${live.conductivity>6.8?'var(--red)':'var(--primary)'};">⚡</div>
            </div>
            <div class="flex items-baseline">
              <span class="sensor-value ${live.conductivity>6.8?'text-danger':''}" id="valConductivity">${live.conductivity}</span>
              <span class="sensor-unit">mS/cm</span>
            </div>
            <div class="sensor-timestamp">4-electrode EC sensor in teat cup</div>
            <div class="sensor-delta ${live.conductivity > 6.8 ? 'down' : 'normal'}" id="deltaConductivity">
              ${live.conductivity > 6.8 ? '▲ CRITICAL: Ion leak detected' : '✓ Normal physiological range'}
            </div>
          </div>

          <!-- Milk & Body Temp -->
          <div class="sensor-card">
            <div class="sensor-header">
              <span class="sensor-name">Body / Milk Temperature</span>
              <div class="sensor-icon" style="background:var(--accent-glow);color:var(--accent);">🌡️</div>
            </div>
            <div class="flex items-baseline">
              <span class="sensor-value ${live.bodyTemp>38.8?'text-warning':''}" id="valBodyTemp">${live.bodyTemp}</span>
              <span class="sensor-unit">°C Body</span>
            </div>
            <div class="sensor-timestamp">Milk: <span id="valMilkTemp" class="font-semibold">${live.milkTemp}°C</span> (Reticular bolus)</div>
            <div class="sensor-delta ${live.bodyTemp > 38.8 ? 'down' : 'normal'}" id="deltaTemp">
              ${live.bodyTemp > 38.8 ? '▲ Low-grade thermal elevation' : '✓ Afebrile / Normal range'}
            </div>
          </div>

          <!-- Rumination & Activity -->
          <div class="sensor-card">
            <div class="sensor-header">
              <span class="sensor-name">Activity & Rumination</span>
              <div class="sensor-icon" style="background:var(--green-glow);color:var(--green);">🏃</div>
            </div>
            <div class="flex items-baseline">
              <span class="sensor-value ${live.activity<50?'text-danger':''}" id="valActivity">${live.activity}</span>
              <span class="sensor-unit">Index (0-100)</span>
            </div>
            <div class="sensor-timestamp">Tri-axial collar accelerometer</div>
            <div class="sensor-delta ${live.activity < 50 ? 'down' : 'normal'}" id="deltaActivity">
              ${live.activity < 50 ? '▼ Lethargy & reduced lying time' : '✓ Normal grazing & chewing index'}
            </div>
          </div>
        </div>

        <!-- Environmental & Edge Hardware Bar -->
        <div class="card card-sm mb-4">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted">Barn Temperature:</span>
                <span class="font-bold text-accent" id="valEnvTemp">${live.envTemp} °C</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted">Barn Humidity:</span>
                <span class="font-bold text-teal" id="valHumidity">${live.humidity} %</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted">THI (Temp-Humidity Index):</span>
                <span class="badge badge-warning">79.2 (Mild Heat Stress)</span>
              </div>
            </div>
            <div class="flex items-center gap-2 text-xs text-muted">
              <span>Edge Gateway: <strong>ESP32-S3-WROOM</strong></span>
              <span>· Protocol: <strong>MQTT / JSON</strong></span>
              <span>· Baud: <strong>115200</strong></span>
            </div>
          </div>
        </div>

        <!-- Real-Time Telemetry Stream Graphs -->
        <div class="dash-grid">
          <div class="card">
            <div class="section-header">
              <div class="section-title">🥛 Milk Yield & Electrical Conductivity Correlation</div>
              <span class="badge badge-info">14-Day Dual Axis</span>
            </div>
            <p class="text-xs text-muted mb-3">Notice: When conductivity spikes above 6.5 mS/cm, milk yield drops 7-10 days later — the key early warning signature.</p>
            <div class="chart-container-md">
              <canvas id="yieldCondChart"></canvas>
            </div>
          </div>

          <div class="card">
            <div class="section-header">
              <div class="section-title">🌡️ Cow Body Temp vs Activity Index</div>
              <span class="badge badge-teal">Behavioral Matrix</span>
            </div>
            <p class="text-xs text-muted mb-3">Reticular core temp versus 3D neck collar accelerometer readings.</p>
            <div class="chart-container-md">
              <canvas id="tempActivityChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  selectCow(id) {
    this.selectedCowId = id;
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  initCharts() {
    const histYield = VetData.genHistory(this.selectedCowId, 'yield', 14);
    const histCond = VetData.genHistory(this.selectedCowId, 'conductivity', 14);
    const histTemp = VetData.genHistory(this.selectedCowId, 'bodyTemp', 14);
    const histAct = VetData.genHistory(this.selectedCowId, 'activity', 14);

    Charts.line('yieldCondChart', histYield.labels, [
      { label: 'Milk Yield (L)', data: histYield.data, color: 'rgb(20,184,166)' },
      { label: 'Conductivity (mS/cm)', data: histCond.data, color: 'rgb(239,68,68)' }
    ]);

    Charts.line('tempActivityChart', histTemp.labels, [
      { label: 'Body Temp (°C)', data: histTemp.data, color: 'rgb(245,158,11)' },
      { label: 'Activity Index', data: histAct.data, color: 'rgb(14,165,233)' }
    ]);
  },

  refreshLive() {
    const live = VetData.getLive(this.selectedCowId);
    const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setTxt('iotTimestamp', live.ts);
    setTxt('valYield', live.yield);
    setTxt('valConductivity', live.conductivity);
    setTxt('valBodyTemp', live.bodyTemp);
    setTxt('valMilkTemp', live.milkTemp + '°C');
    setTxt('valActivity', live.activity);
    setTxt('valEnvTemp', live.envTemp + ' °C');
    setTxt('valHumidity', live.humidity + ' %');
  },

  simulateAnomaly(cowId) {
    const live = VetData.getLive(cowId);
    live.conductivity = 8.45;
    live.yield = 7.1;
    live.bodyTemp = 39.4;
    live.activity = 32;
    this.refreshLive();
    alert(`⚡ Simulated Mastitis Pre-Clinical Anomaly injected for ${cowId}!\n- Conductivity spiked to 8.45 mS/cm\n- Milk yield decreased to 7.1 L\n- Body temp elevated to 39.4°C\nAI Engine will flag high risk.`);
  }
};
