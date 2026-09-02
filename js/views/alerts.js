/* ── Alert System (Module 10) ── */
const AlertsView = {
  filterLevel: 'all',

  render() {
    const alerts = VetData.alerts;
    const filtered = alerts.filter(a => this.filterLevel === 'all' || a.riskLevel === this.filterLevel);
    const unack = alerts.filter(a => !a.acknowledged).length;

    return `
      <div class="fade-in">
        <div class="section-header">
          <div>
            <h2 class="text-xl font-bold">Intelligent Risk Alert Center</h2>
            <p class="text-sm text-muted">Automated pre-clinical alerts dispatched when individual cow risk exceeds safety thresholds</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge ${unack>0?'badge-high':'badge-healthy'}">${unack} Unacknowledged Alerts</span>
            <button class="btn btn-sm btn-ghost" onclick="AlertsView.ackAll()">✓ Acknowledge All</button>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="card card-sm mb-4 flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-muted">FILTER LEVEL:</span>
            <button class="btn btn-sm ${this.filterLevel==='all'?'btn-teal':'btn-ghost'}" onclick="AlertsView.setFilter('all')">All Alerts (${alerts.length})</button>
            <button class="btn btn-sm ${this.filterLevel==='high'?'btn-danger':'btn-ghost'}" onclick="AlertsView.setFilter('high')">High Risk (${alerts.filter(a=>a.riskLevel==='high').length})</button>
            <button class="btn btn-sm ${this.filterLevel==='moderate'?'btn-accent':'btn-ghost'}" onclick="AlertsView.setFilter('moderate')">Moderate (${alerts.filter(a=>a.riskLevel==='moderate').length})</button>
          </div>
          <span class="text-xs text-muted">Auto-refreshed every 5 seconds via ESP32 sensor stream</span>
        </div>

        <!-- Prominent High Alert Banner for User Prompt Example -->
        <div class="alert-banner alert-banner-high mb-4" style="border-width:2px;padding:20px;">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="badge badge-high" style="font-size:0.8rem;">🚨 HIGH MASTITIS RISK DETECTED</span>
                <span class="badge badge-teal">Prediction Trust: High</span>
              </div>
              <h3 class="text-lg font-bold text-100">Cow ID: COW-001 (Lakshmi) · Risk Score: 82%</h3>
              <div class="text-xs text-muted mt-1">Forecast Window: 3–7 Days in Advance (Subclinical Stage)</div>
            </div>
            <button class="btn btn-sm btn-danger" onclick="App.navigate('ai'); setTimeout(()=>AiView.selectCow('COW-001'),100)">
              Inspect AI Diagnostics →
            </button>
          </div>

          <div class="divider" style="margin:12px 0;"></div>

          <div class="grid-2" style="font-size:0.85rem;color:var(--text-200);">
            <div>
              <strong>Key Biometric Signals Triggering Alarm:</strong>
              <ul style="margin:6px 0 0 18px;font-size:0.8rem;line-height:1.6;">
                <li>Milk yield decreased by 18% over consecutive milkings</li>
                <li>Conductivity abnormal deviation (+28% in left rear quarter)</li>
                <li>Activity & rumination reduced by 40% (early discomfort)</li>
                <li>Bolus temperature elevated (+0.6°C mild inflammatory response)</li>
              </ul>
            </div>
            <div>
              <strong>Recommended Immediate Preventive Action:</strong>
              <div style="background:rgba(0,0,0,0.3);padding:10px 14px;border-radius:var(--radius-sm);font-size:0.8rem;margin-top:6px;border:1px solid rgba(239,68,68,0.2);">
                ⚠️ <strong>Action Required:</strong> Separate cow at next milking, perform California Mastitis Test (CMT), inspect udder for heat, and consult the farm veterinarian before administering any antibiotics.
              </div>
            </div>
          </div>
        </div>

        <!-- Alert Cards Feed -->
        <div style="display:flex;flex-direction:column;gap:14px;">
          ${filtered.map(a => `
            <div class="alert-card ${a.riskLevel}" style="background:var(--bg-card);border:1px solid var(--border);border-left:4px solid ${a.riskLevel==='high'?'var(--red)':a.riskLevel==='moderate'?'var(--yellow)':'var(--green)'};">
              <div class="alert-icon ${a.riskLevel}">
                ${a.riskLevel==='high'?'🚨':a.riskLevel==='moderate'?'⚠️':'ℹ️'}
              </div>
              <div class="alert-info">
                <div class="flex items-center gap-2">
                  <span class="alert-cow-id">${a.cowId} — ${a.cowName}</span>
                  <span class="badge ${a.riskLevel==='high'?'badge-high':'badge-moderate'}">${a.riskLevel.toUpperCase()}</span>
                  <span class="badge badge-info">Trust: ${a.trust}</span>
                  ${a.acknowledged ? '<span class="badge badge-healthy">✓ Acknowledged</span>' : '<span class="badge badge-warning">Action Pending</span>'}
                </div>
                <div class="alert-desc font-medium text-100" style="margin-top:6px;">
                  ${a.action}
                </div>
                <div class="text-xs text-300 mt-1">
                  <strong>Contributing Factors:</strong> ${a.factors.join(' · ')}
                </div>
                <div class="alert-meta">
                  ⏱️ Dispatched: ${a.timestamp} · Target: Kaveri Dairy Farm Milking Parlour #1
                </div>
              </div>

              <div style="text-align:right;flex-shrink:0;">
                <div class="alert-score ${a.riskLevel}">${a.riskScore}%</div>
                <div class="text-xs text-muted">Risk Prob.</div>
                <div class="mt-3 flex gap-2">
                  ${!a.acknowledged ? `
                    <button class="btn btn-sm btn-ghost" onclick="AlertsView.ackAlert('${a.id}')">✓ Ack</button>
                  ` : ''}
                  <button class="btn btn-sm btn-teal" onclick="AlertsView.consultVet('${a.cowId}')">🩺 Call Vet</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  setFilter(level) {
    this.filterLevel = level;
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  ackAlert(id) {
    const a = VetData.alerts.find(x => x.id === id);
    if (a) a.acknowledged = true;
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  ackAll() {
    VetData.alerts.forEach(a => a.acknowledged = true);
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  consultVet(cowId) {
    alert(`Veterinary dispatch request sent for ${cowId} to Dr. Venkatesh S. (Tel: +91 98401 22334). Consultation log scheduled.`);
  }
};
