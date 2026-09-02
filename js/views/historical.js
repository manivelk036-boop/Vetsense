/* ── Historical Data Visualization (Module 13) ── */
const HistoricalView = {
  selectedCowId: 'COW-001',
  selectedDays: 30,
  selectedFarm: 'F1',

  render() {
    const cows = VetData.cows;

    setTimeout(() => {
      this.initCharts();
    }, 60);

    return `
      <div class="fade-in">
        <div class="section-header">
          <div>
            <h2 class="text-xl font-bold">Historical Data & Longitudinal Trends</h2>
            <p class="text-sm text-muted">Deep analytics over 7, 14 and 30-day time horizons with multi-variable biological cross-correlation</p>
          </div>
          <button class="btn btn-sm btn-ghost" onclick="HistoricalView.exportData()">📥 Export CSV Dataset</button>
        </div>

        <!-- Filter Controls Bar -->
        <div class="card card-sm mb-4">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <!-- Filter by Cow -->
            <div class="flex items-center gap-2">
              <label class="text-xs font-semibold text-muted">SELECT COW:</label>
              <select class="form-control" style="width:200px;" onchange="HistoricalView.changeCow(this.value)">
                ${cows.map(c => `<option value="${c.id}" ${c.id===this.selectedCowId?'selected':''}>${c.id} — ${c.name} (${c.breed})</option>`).join('')}
              </select>
            </div>

            <!-- Filter by Date Range -->
            <div class="flex items-center gap-2">
              <label class="text-xs font-semibold text-muted">HORIZON:</label>
              <button class="btn btn-sm ${this.selectedDays===7?'btn-teal':'btn-ghost'}" onclick="HistoricalView.changeDays(7)">7 Days</button>
              <button class="btn btn-sm ${this.selectedDays===14?'btn-teal':'btn-ghost'}" onclick="HistoricalView.changeDays(14)">14 Days</button>
              <button class="btn btn-sm ${this.selectedDays===30?'btn-teal':'btn-ghost'}" onclick="HistoricalView.changeDays(30)">30 Days</button>
            </div>

            <!-- Filter by Farm -->
            <div class="flex items-center gap-2">
              <label class="text-xs font-semibold text-muted">FARM UNIT:</label>
              <select class="form-control" style="width:180px;" onchange="HistoricalView.changeFarm(this.value)">
                <option value="F1" ${this.selectedFarm==='F1'?'selected':''}>Kaveri Dairy Farm</option>
                <option value="F2" ${this.selectedFarm==='F2'?'selected':''}>Krishna Valley Dairy</option>
                <option value="F3" ${this.selectedFarm==='F3'?'selected':''}>Thanjavur Milk Union</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 6 Historical Visualization Panels -->
        <div class="dash-grid-3 mb-4">
          <!-- 1. Milk Yield Trend -->
          <div class="card">
            <div class="section-header mb-2">
              <div class="section-title text-sm">🥛 Milk Yield Trend (Liters)</div>
            </div>
            <div class="chart-container">
              <canvas id="histYieldChart"></canvas>
            </div>
          </div>

          <!-- 2. Conductivity Trend -->
          <div class="card">
            <div class="section-header mb-2">
              <div class="section-title text-sm">⚡ Electrical Conductivity (mS/cm)</div>
            </div>
            <div class="chart-container">
              <canvas id="histCondChart"></canvas>
            </div>
          </div>

          <!-- 3. Body Temperature Trend -->
          <div class="card">
            <div class="section-header mb-2">
              <div class="section-title text-sm">🌡️ Core Body Temp (°C)</div>
            </div>
            <div class="chart-container">
              <canvas id="histTempChart"></canvas>
            </div>
          </div>
        </div>

        <div class="dash-grid-3">
          <!-- 4. Activity & Rumination Trend -->
          <div class="card">
            <div class="section-header mb-2">
              <div class="section-title text-sm">🏃 Daily Activity & Grazing Index</div>
            </div>
            <div class="chart-container">
              <canvas id="histActivityChart"></canvas>
            </div>
          </div>

          <!-- 5. Risk Score Progression -->
          <div class="card">
            <div class="section-header mb-2">
              <div class="section-title text-sm">🤖 AI Mastitis Risk Score Curve</div>
            </div>
            <div class="chart-container">
              <canvas id="histRiskChart"></canvas>
            </div>
          </div>

          <!-- 6. Somatic Cell Count (SCC) -->
          <div class="card">
            <div class="section-header mb-2">
              <div class="section-title text-sm">🔬 Somatic Cell Count (SCC in cells/mL)</div>
            </div>
            <div class="chart-container">
              <canvas id="histSccChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  changeCow(id) {
    this.selectedCowId = id;
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  changeDays(days) {
    this.selectedDays = days;
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  changeFarm(farm) {
    this.selectedFarm = farm;
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  initCharts() {
    const d = this.selectedDays;
    const cowId = this.selectedCowId;

    const y = VetData.genHistory(cowId, 'yield', d);
    Charts.line('histYieldChart', y.labels, [{ label: 'Yield (L)', data: y.data, color: 'rgb(20,184,166)' }]);

    const c = VetData.genHistory(cowId, 'conductivity', d);
    Charts.line('histCondChart', c.labels, [{ label: 'Conductivity (mS/cm)', data: c.data, color: 'rgb(239,68,68)' }]);

    const t = VetData.genHistory(cowId, 'bodyTemp', d);
    Charts.line('histTempChart', t.labels, [{ label: 'Body Temp (°C)', data: t.data, color: 'rgb(245,158,11)' }]);

    const a = VetData.genHistory(cowId, 'activity', d);
    Charts.line('histActivityChart', a.labels, [{ label: 'Activity Index', data: a.data, color: 'rgb(14,165,233)' }]);

    const r = VetData.genRiskHistory(cowId, d);
    Charts.riskTrend('histRiskChart', r.labels, r.data);

    // Simulated SCC sequence
    const sccLabels = y.labels.filter((_, i) => i % 5 === 0);
    const sccBase = cowId === 'COW-001' ? 450000 : cowId === 'COW-002' ? 300000 : 120000;
    const sccData = sccLabels.map((_, i) => Math.round(sccBase * (0.8 + i * 0.08 + (Math.random() - 0.5) * 0.1)));
    Charts.bar('histSccChart', sccLabels, [{ label: 'SCC (cells/mL)', data: sccData, backgroundColor: 'rgba(168,85,247,0.7)' }]);
  },

  exportData() {
    const csvContent = "data:text/csv;charset=utf-8,Date,CowID,Yield_L,Conductivity_mS,BodyTemp_C,Activity,RiskScore\n" +
      "2026-08-25,COW-001,8.5,7.2,38.9,46,72\n" +
      "2026-08-26,COW-001,8.3,7.4,39.0,44,75\n" +
      "2026-08-27,COW-001,8.1,7.5,39.1,42,78\n" +
      "2026-08-28,COW-001,8.0,7.7,39.1,40,80\n" +
      "2026-08-29,COW-001,7.9,7.8,39.2,38,82\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VetSense_${this.selectedCowId}_historical.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
