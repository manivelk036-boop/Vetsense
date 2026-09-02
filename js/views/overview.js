/* ── Overview / Main Dashboard View ── */
const OverviewView = {
  render(){
    const s = VetData.getHerdStats();
    const highCows = VetData.cows.filter(c=>c.riskLevel==='high');
    const recentAlerts = VetData.alerts.slice(0,3);
    const riskColor = s.avgRisk>=70?'var(--red)':s.avgRisk>=40?'var(--yellow)':'var(--green)';

    const kpiCards = `
    <div class="kpi-grid fade-in">
      <div class="kpi-card kpi-primary">
        <div class="kpi-header"><div class="kpi-icon">🐄</div><div class="kpi-trend text-primary">↑ Active</div></div>
        <div class="kpi-value">${s.total}</div>
        <div class="kpi-label">Total Cows Monitored</div>
      </div>
      <div class="kpi-card kpi-green">
        <div class="kpi-header"><div class="kpi-icon">✅</div><div class="kpi-trend text-success">Good</div></div>
        <div class="kpi-value">${s.healthy+s.low}</div>
        <div class="kpi-label">Healthy / Low Risk</div>
      </div>
      <div class="kpi-card kpi-yellow">
        <div class="kpi-header"><div class="kpi-icon">⚠️</div><div class="kpi-trend text-warning">Watch</div></div>
        <div class="kpi-value">${s.moderate}</div>
        <div class="kpi-label">Moderate Risk</div>
      </div>
      <div class="kpi-card kpi-red">
        <div class="kpi-header"><div class="kpi-icon">🚨</div><div class="kpi-trend text-danger">Alert!</div></div>
        <div class="kpi-value">${s.high}</div>
        <div class="kpi-label">High Risk — Needs Attention</div>
      </div>
      <div class="kpi-card kpi-teal">
        <div class="kpi-header"><div class="kpi-icon">📊</div><div class="kpi-trend" style="color:${riskColor}">${s.avgRisk>=70?'High':s.avgRisk>=40?'Moderate':'Good'}</div></div>
        <div class="kpi-value" style="color:${riskColor}">${s.avgRisk}%</div>
        <div class="kpi-label">Overall Herd Risk Score</div>
      </div>
      <div class="kpi-card kpi-primary">
        <div class="kpi-header"><div class="kpi-icon">📡</div><span class="badge badge-online">● Live</span></div>
        <div class="kpi-value">${s.onlineSensors}<span style="font-size:1rem;color:var(--text-400)">/${s.totalSensors}</span></div>
        <div class="kpi-label">IoT Sensors Online</div>
      </div>
      <div class="kpi-card kpi-accent">
        <div class="kpi-header"><div class="kpi-icon">🤖</div><span class="badge badge-teal">HIGH</span></div>
        <div class="kpi-value">87%</div>
        <div class="kpi-label">AI Prediction Confidence</div>
      </div>
      <div class="kpi-card kpi-teal">
        <div class="kpi-header"><div class="kpi-icon">🔔</div><div class="kpi-trend text-danger">${VetData.alerts.filter(a=>!a.acknowledged).length} New</div></div>
        <div class="kpi-value">${VetData.alerts.length}</div>
        <div class="kpi-label">Active Alerts Today</div>
      </div>
    </div>`;

    const alertsHtml = recentAlerts.map(a=>`
    <div class="alert-card ${a.riskLevel}" onclick="App.navigate('alerts')" style="cursor:pointer;margin-bottom:10px;">
      <div class="alert-icon ${a.riskLevel}">${a.riskLevel==='high'?'🚨':a.riskLevel==='moderate'?'⚠️':'ℹ️'}</div>
      <div class="alert-info">
        <div class="alert-cow-id">${a.cowId} — ${a.cowName}</div>
        <div class="alert-desc">${a.factors[0]}</div>
        <div class="alert-meta">⏱️ ${a.timestamp} · Trust: ${a.trust}</div>
      </div>
      <div class="alert-score ${a.riskLevel}">${a.riskScore}%</div>
    </div>`).join('');

    const highCowsHtml = highCows.map(c=>{
      const pred = VetData.aiPredictions[c.id];
      return `
      <div class="cow-card" onclick="App.navigate('cows')" style="cursor:pointer;margin-bottom:10px;">
        <div class="cow-card-header">
          <div class="cow-avatar high">🐄</div>
          <div style="flex:1">
            <div class="cow-name">${c.name}</div>
            <div class="cow-id">${c.id} · ${c.breed}</div>
          </div>
          <span class="badge badge-high">HIGH</span>
        </div>
        <div class="cow-risk">
          <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${c.riskScore}%;background:var(--red)"></div></div>
          <div class="cow-risk-score high">${c.riskScore}%</div>
        </div>
        <div style="font-size:0.78rem;color:var(--text-400)">⏰ Forecast: ${pred?.window||'N/A'} · Conf: ${pred?.confidence||'N/A'}%</div>
      </div>`;
    }).join('');

    const riskDistHtml = `
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${[{l:'High Risk',c:s.high,color:'var(--red)',pct:s.high/s.total*100},{l:'Moderate Risk',c:s.moderate,color:'var(--yellow)',pct:s.moderate/s.total*100},{l:'Low Risk',c:s.low,color:'#86efac',pct:s.low/s.total*100},{l:'Healthy',c:s.healthy,color:'var(--green)',pct:s.healthy/s.total*100}].map(r=>`
      <div>
        <div class="flex justify-between mb-1"><span style="font-size:0.8rem;color:var(--text-300)">${r.l}</span><span style="font-size:0.8rem;font-weight:700;color:${r.color}">${r.c} cows</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${r.pct.toFixed(0)}%;background:${r.color}"></div></div>
      </div>`).join('')}
    </div>`;

    setTimeout(()=>{
      const {labels,data} = VetData.genRiskHistory('COW-001',14);
      Charts.line('overviewRiskChart',[...labels].slice(-7),[{label:'Herd Avg Risk',data:[...data].slice(-7).map(v=>v*0.8),color:'rgb(14,165,233)'}]);
      Charts.doughnut('riskDistChart',['High','Moderate','Low','Healthy'],[s.high,s.moderate,s.low,s.healthy],['#ef4444','#eab308','#86efac','#22c55e']);
    },50);

    return `
    ${kpiCards}
    <div class="dash-grid" style="margin-top:4px;">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="card">
          <div class="section-header">
            <div class="section-title">🔔 Recent Alerts</div>
            <button class="btn btn-sm btn-ghost" onclick="App.navigate('alerts')">View All →</button>
          </div>
          ${alertsHtml}
        </div>
        <div class="card">
          <div class="section-header">
            <div class="section-title">📈 14-Day Risk Trend</div>
            <span class="badge badge-info">Herd Average</span>
          </div>
          <div class="chart-container"><canvas id="overviewRiskChart"></canvas></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="card">
          <div class="section-header">
            <div class="section-title">🎯 Risk Distribution</div>
          </div>
          <div class="chart-container"><canvas id="riskDistChart"></canvas></div>
          <div class="divider"></div>
          ${riskDistHtml}
        </div>
        <div class="card">
          <div class="section-header">
            <div class="section-title">🚨 High-Risk Cows</div>
            <button class="btn btn-sm btn-ghost" onclick="App.navigate('cows')">Manage →</button>
          </div>
          ${highCowsHtml}
        </div>
      </div>
    </div>`;
  }
};
