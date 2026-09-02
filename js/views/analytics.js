/* ── Herd Analytics View (Module 11) ── */
const AnalyticsView = {
  render() {
    const s = VetData.getHerdStats();
    const cows = VetData.cows;
    const highCows = cows.filter(c => c.riskLevel === 'high');
    const modCows = cows.filter(c => c.riskLevel === 'moderate');

    setTimeout(() => {
      this.initCharts();
    }, 60);

    return `
      <div class="fade-in">
        <div class="section-header">
          <div>
            <h2 class="text-xl font-bold">Herd-Level Population Analytics</h2>
            <p class="text-sm text-muted">Aggregated epidemiological surveillance, subclinical incidence rates & economic milk loss modeling</p>
          </div>
          <span class="badge badge-teal">📊 Epidemiological Hub</span>
        </div>

        <!-- KPI Strip -->
        <div class="grid-4 mb-4">
          <div class="card">
            <div class="text-xs text-muted font-bold uppercase mb-1">Overall Herd Risk Index</div>
            <div class="text-3xl font-bold ${s.avgRisk>60?'text-danger':s.avgRisk>35?'text-warning':'text-success'}">${s.avgRisk}%</div>
            <div class="text-xs text-muted mt-1">Weighted herd mean</div>
          </div>
          <div class="card">
            <div class="text-xs text-muted font-bold uppercase mb-1">Subclinical Mastitis Attack Rate</div>
            <div class="text-3xl font-bold text-accent">${((s.high+s.moderate)/s.total*100).toFixed(0)}%</div>
            <div class="text-xs text-muted mt-1">National average: 38%</div>
          </div>
          <div class="card">
            <div class="text-xs text-muted font-bold uppercase mb-1">Estimated Milk Protected</div>
            <div class="text-3xl font-bold text-teal">+420 L</div>
            <div class="text-xs text-muted mt-1">Via 7-day early intervention</div>
          </div>
          <div class="card">
            <div class="text-xs text-muted font-bold uppercase mb-1">Antibiotic Cost Avoidance</div>
            <div class="text-3xl font-bold text-success">₹ 14,500</div>
            <div class="text-xs text-muted mt-1">Last 30-day savings</div>
          </div>
        </div>

        <!-- Charts Row 1 -->
        <div class="dash-grid mb-4">
          <div class="card">
            <div class="section-header">
              <div class="section-title">📈 Herd Risk Trend (30 Days)</div>
              <span class="badge badge-info">Time-Series Aggregation</span>
            </div>
            <div class="chart-container-md">
              <canvas id="herdTrendChart"></canvas>
            </div>
          </div>

          <div class="card">
            <div class="section-header">
              <div class="section-title">🎯 Risk Stratification</div>
              <span class="badge badge-teal">${s.total} Cattle Monitored</span>
            </div>
            <div class="chart-container-md">
              <canvas id="herdDistChart"></canvas>
            </div>
          </div>
        </div>

        <!-- High-Risk Cattle Table & Farm Health Summary -->
        <div class="dash-grid">
          <!-- High-Risk Cattle Details -->
          <div class="card">
            <div class="section-header">
              <div class="section-title">🚨 Cattle Requiring Priority Intervention</div>
              <span class="badge badge-high">${highCows.length} Urgent</span>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Cow ID & Name</th>
                    <th>Breed</th>
                    <th>Lactation</th>
                    <th>Risk Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${highCows.concat(modCows.slice(0,2)).map(c => `
                    <tr>
                      <td>
                        <div class="font-bold text-100">${c.name}</div>
                        <div class="text-xs text-muted">${c.id} · ${c.tag}</div>
                      </td>
                      <td>${c.breed}</td>
                      <td>#${c.lactation}</td>
                      <td>
                        <div class="flex items-center gap-2">
                          <span class="font-bold ${c.riskScore>=70?'text-danger':'text-warning'}">${c.riskScore}%</span>
                          <span class="badge ${c.riskScore>=70?'badge-high':'badge-moderate'}">${c.riskLevel.toUpperCase()}</span>
                        </div>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-ghost" onclick="App.navigate('ai'); setTimeout(()=>AiView.selectCow('${c.id}'),100)">Inspect AI</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Farm Health Summary -->
          <div class="card">
            <div class="section-header">
              <div class="section-title">📋 Farm Health Index Summary</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:14px;">
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-muted">Milking Hygiene Compliance</span>
                  <span class="font-bold text-teal">92%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:92%;background:var(--teal);"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-muted">Teat Disinfection Uniformity</span>
                  <span class="font-bold text-primary">88%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:88%;background:var(--primary);"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-muted">Barn Bedding Dryness Index</span>
                  <span class="font-bold text-accent">74%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:74%;background:var(--accent);"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-muted">IoT Sensor Data Telemetry Health</span>
                  <span class="font-bold text-success">96%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:96%;background:var(--green);"></div></div>
              </div>
            </div>

            <div class="alert-banner alert-banner-info mt-4" style="margin-bottom:0;">
              <strong>Summary:</strong> Overall herd health is favorable. However, cows <strong>COW-001</strong> and <strong>COW-002</strong> show distinct pre-mastitis conductivity divergence that requires prompt localized management to prevent cross-contamination in the parlour.
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initCharts() {
    const s = VetData.getHerdStats();
    const { labels, data } = VetData.genRiskHistory('COW-001', 30);
    const avgData = data.map(v => Math.max(10, Math.round(v * 0.75)));

    Charts.line('herdTrendChart', labels, [
      { label: 'Herd Average Mastitis Risk (%)', data: avgData, color: 'rgb(20,184,166)' }
    ]);

    Charts.doughnut('herdDistChart',
      ['High Risk (>70%)', 'Moderate Risk (40-69%)', 'Low Risk (20-39%)', 'Healthy (<20%)'],
      [s.high, s.moderate, s.low, s.healthy],
      ['#ef4444', '#eab308', '#86efac', '#22c55e']
    );
  }
};
