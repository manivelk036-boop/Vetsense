/* ── Cows View (Cow Management & Individual Health Profiles) ── */
const CowsView = {
  selectedCowId: 'COW-001',
  filterRisk: 'all',
  searchQuery: '',

  render() {
    const cows = VetData.cows;
    const filtered = cows.filter(c => {
      const matchRisk = this.filterRisk === 'all' || c.riskLevel === this.filterRisk;
      const matchQuery = c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                         c.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                         c.breed.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchRisk && matchQuery;
    });

    const activeCow = cows.find(c => c.id === this.selectedCowId) || cows[0];
    const live = VetData.getLive(activeCow.id);
    const pred = VetData.aiPredictions[activeCow.id] || { score: activeCow.riskScore, level: activeCow.riskLevel, confidence: 80, window: '7-14 days' };
    const vetHist = VetData.vetRecords.filter(v => v.cowId === activeCow.id);
    const labHist = VetData.labRecords.filter(l => l.cowId === activeCow.id);

    const cardsHtml = filtered.map(c => {
      const isSel = c.id === activeCow.id;
      const rClass = c.riskLevel === 'high' ? 'high' : c.riskLevel === 'moderate' ? 'moderate' : 'healthy';
      const badgeClass = c.riskLevel === 'high' ? 'badge-high' : c.riskLevel === 'moderate' ? 'badge-moderate' : 'badge-healthy';
      return `
        <div class="cow-card ${isSel ? 'border-primary' : ''}" style="${isSel ? 'border-color:var(--primary);box-shadow:0 0 0 2px var(--primary-glow);' : ''}" onclick="CowsView.selectCow('${c.id}')">
          <div class="cow-card-header">
            <div class="cow-avatar ${rClass}">🐄</div>
            <div style="flex:1;min-width:0;">
              <div class="cow-name truncate">${c.name}</div>
              <div class="cow-id">${c.id} · ${c.tag}</div>
            </div>
            <span class="badge ${badgeClass}">${c.riskLevel.toUpperCase()}</span>
          </div>
          <div class="cow-details">
            <div class="cow-detail-item">
              <span class="cow-detail-label">Breed</span>
              <span class="cow-detail-value">${c.breed}</span>
            </div>
            <div class="cow-detail-item">
              <span class="cow-detail-label">Age / Lactation</span>
              <span class="cow-detail-value">${c.age} yrs / #${c.lactation}</span>
            </div>
          </div>
          <div class="cow-risk">
            <span class="cow-risk-score-label">Forecast Risk:</span>
            <div class="progress-bar" style="flex:1">
              <div class="progress-fill" style="width:${c.riskScore}%;background:${c.riskLevel==='high'?'var(--red)':c.riskLevel==='moderate'?'var(--yellow)':'var(--green)'}"></div>
            </div>
            <span class="cow-risk-score ${rClass}">${c.riskScore}%</span>
          </div>
        </div>
      `;
    }).join('');

    setTimeout(() => {
      const hist = VetData.genHistory(activeCow.id, 'yield', 14);
      Charts.line('cowProfileYieldChart', hist.labels.slice(-10), [
        { label: 'Daily Yield (L)', data: hist.data.slice(-10), color: 'rgb(20,184,166)' }
      ]);
    }, 60);

    return `
      <div class="fade-in">
        <div class="section-header">
          <div>
            <h2 class="text-xl font-bold">Cow Profile Management & Health Records</h2>
            <p class="text-sm text-muted">Individual cattle records, historical treatments, vaccinations and real-time biometric indicators</p>
          </div>
          <button class="btn btn-primary" onclick="CowsView.openAddModal()">➕ Register New Cow</button>
        </div>

        <!-- Filters Bar -->
        <div class="card card-sm mb-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-muted">RISK FILTER:</span>
            <button class="btn btn-sm ${this.filterRisk === 'all' ? 'btn-teal' : 'btn-ghost'}" onclick="CowsView.setFilter('all')">All (${cows.length})</button>
            <button class="btn btn-sm ${this.filterRisk === 'high' ? 'btn-danger' : 'btn-ghost'}" onclick="CowsView.setFilter('high')">High Risk (${cows.filter(c=>c.riskLevel==='high').length})</button>
            <button class="btn btn-sm ${this.filterRisk === 'moderate' ? 'btn-accent' : 'btn-ghost'}" onclick="CowsView.setFilter('moderate')">Moderate (${cows.filter(c=>c.riskLevel==='moderate').length})</button>
            <button class="btn btn-sm ${this.filterRisk === 'healthy' ? 'btn-primary' : 'btn-ghost'}" onclick="CowsView.setFilter('healthy')">Low / Healthy</button>
          </div>
          <div style="width:260px;">
            <input type="text" class="form-control" placeholder="Search by name, ID, breed..." value="${this.searchQuery}" oninput="CowsView.setSearch(this.value)">
          </div>
        </div>

        <div class="dash-grid">
          <!-- Left: Cattle Grid -->
          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:14px;align-content:start;">
            ${cardsHtml}
          </div>

          <!-- Right: Active Cow Detailed Health Profile -->
          <div>
            <div class="card" style="position:sticky;top:80px;">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="cow-avatar ${activeCow.riskLevel}" style="width:54px;height:54px;font-size:1.8rem;">🐄</div>
                  <div>
                    <h3 class="text-lg font-bold">${activeCow.name} (${activeCow.id})</h3>
                    <div class="text-xs text-muted">Tag: ${activeCow.tag} · ${activeCow.breed} · Calved: ${activeCow.lastCalving}</div>
                  </div>
                </div>
                <span class="badge ${activeCow.riskLevel === 'high' ? 'badge-high' : activeCow.riskLevel === 'moderate' ? 'badge-moderate' : 'badge-healthy'}">
                  ${activeCow.riskLevel.toUpperCase()} RISK
                </span>
              </div>

              <!-- Biometric Quick Snapshot -->
              <div class="grid-4 mb-4">
                <div style="background:var(--bg-800);padding:10px;border-radius:var(--radius-sm);text-align:center;">
                  <div class="text-xs text-muted">Live Yield</div>
                  <div class="font-bold text-teal">${live.yield} L</div>
                </div>
                <div style="background:var(--bg-800);padding:10px;border-radius:var(--radius-sm);text-align:center;">
                  <div class="text-xs text-muted">Conductivity</div>
                  <div class="font-bold ${live.conductivity>7?'text-danger':'text-primary'}">${live.conductivity} mS</div>
                </div>
                <div style="background:var(--bg-800);padding:10px;border-radius:var(--radius-sm);text-align:center;">
                  <div class="text-xs text-muted">Body Temp</div>
                  <div class="font-bold ${live.bodyTemp>39?'text-danger':'text-100'}">${live.bodyTemp} °C</div>
                </div>
                <div style="background:var(--bg-800);padding:10px;border-radius:var(--radius-sm);text-align:center;">
                  <div class="text-xs text-muted">Activity</div>
                  <div class="font-bold text-warning">${live.activity} %</div>
                </div>
              </div>

              <!-- AI Early Warning Box -->
              <div class="alert-banner ${activeCow.riskLevel === 'high' ? 'alert-banner-high' : activeCow.riskLevel === 'moderate' ? 'alert-banner-moderate' : 'alert-banner-low'} mb-4">
                <div class="font-bold mb-1">🤖 AI Early Mastitis Forecast: ${pred.score}% (Window: ${pred.window})</div>
                <div class="text-xs">Predictive Confidence: ${pred.confidence}% · Trust Level: ${pred.trust}</div>
                <div class="mt-2 text-xs">
                  <a href="javascript:void(0)" onclick="App.navigate('ai'); setTimeout(()=>AiView.selectCow('${activeCow.id}'),100)" class="text-primary font-semibold">
                    Open Deep AI Diagnostic Fingerprint →
                  </a>
                </div>
              </div>

              <!-- 10-Day Yield Trend Mini Chart -->
              <div class="mb-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-semibold text-muted">10-DAY MILK YIELD CURVE</span>
                  <span class="text-xs text-teal">Sensor: ESP32-CH3</span>
                </div>
                <div class="chart-container" style="height:150px;">
                  <canvas id="cowProfileYieldChart"></canvas>
                </div>
              </div>

              <!-- Vaccination & History Badges -->
              <div class="mb-4">
                <div class="text-xs font-semibold text-muted mb-2">VACCINATION & HEALTH HISTORY</div>
                <div class="flex flex-wrap gap-2">
                  ${activeCow.vaccinations.map(v => `<span class="badge badge-teal">💉 ${v}</span>`).join('')}
                  ${activeCow.diseases.length ? activeCow.diseases.map(d => `<span class="badge badge-high">⚠️ ${d}</span>`).join('') : '<span class="badge badge-healthy">No Prior Chronic Illness</span>'}
                </div>
              </div>

              <!-- Veterinary & Lab Quick History -->
              <div class="border-top pt-3">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-semibold text-muted">CLINICAL & LAB INTERVENTIONS</span>
                  <span class="text-xs text-primary cursor-pointer" onclick="App.navigate('vet')">Full History →</span>
                </div>
                ${vetHist.length ? `
                  <div style="font-size:0.8rem;background:var(--bg-800);padding:8px 12px;border-radius:var(--radius-sm);margin-bottom:6px;">
                    <div class="font-semibold text-100">${vetHist[0].date} — ${vetHist[0].diagnosis}</div>
                    <div class="text-muted text-xs">${vetHist[0].treatment} | Dr: ${vetHist[0].vet}</div>
                  </div>
                ` : '<div class="text-xs text-muted">No recent veterinary intervention.</div>'}

                ${labHist.length ? `
                  <div style="font-size:0.8rem;background:var(--bg-800);padding:8px 12px;border-radius:var(--radius-sm);">
                    <div class="font-semibold text-100">${labHist[0].date} — SCC: ${labHist[0].scc.toLocaleString()} cells/mL (${labHist[0].california})</div>
                    <div class="text-muted text-xs">Pathogen: ${labHist[0].bacteriaCount}</div>
                  </div>
                ` : ''}
              </div>

              <div class="mt-4 flex gap-2">
                <button class="btn btn-sm btn-teal flex-1 justify-center" onclick="CowsView.openActionModal('${activeCow.id}')">📝 Record Observation</button>
                <button class="btn btn-sm btn-ghost flex-1 justify-center" onclick="App.navigate('iot')">📡 Live Telemetry</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Cow Modal Container -->
        <div id="cowModalContainer"></div>
      </div>
    `;
  },

  selectCow(id) {
    this.selectedCowId = id;
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  setFilter(risk) {
    this.filterRisk = risk;
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  setSearch(q) {
    this.searchQuery = q;
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  openAddModal() {
    const container = document.getElementById('cowModalContainer');
    container.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target===this) CowsView.closeModal()">
        <div class="modal">
          <div class="modal-header">
            <h3>Register New Cow</h3>
            <button class="modal-close" onclick="CowsView.closeModal()">&times;</button>
          </div>
          <form onsubmit="CowsView.handleAddCow(event)">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Cow ID</label>
                <input type="text" id="newCowId" class="form-control" value="COW-00${VetData.cows.length+1}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Tag ID</label>
                <input type="text" id="newCowTag" class="form-control" placeholder="TAG-XXX" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Cow Name</label>
                <input type="text" id="newCowName" class="form-control" placeholder="e.g. Kamadhenu" required>
              </div>
              <div class="form-group">
                <label class="form-label">Breed</label>
                <select id="newCowBreed" class="form-control">
                  <option>Holstein Friesian</option>
                  <option>Jersey</option>
                  <option>HF Cross</option>
                  <option>Jersey Cross</option>
                  <option>Murrah Buffalo</option>
                  <option>Gir</option>
                  <option>Sahiwal</option>
                </select>
              </div>
            </div>
            <div class="form-row-3">
              <div class="form-group">
                <label class="form-label">Age (years)</label>
                <input type="number" id="newCowAge" class="form-control" value="3" min="1" max="15">
              </div>
              <div class="form-group">
                <label class="form-label">Lactation Number</label>
                <input type="number" id="newCowLact" class="form-control" value="2" min="1" max="10">
              </div>
              <div class="form-group">
                <label class="form-label">Weight (kg)</label>
                <input type="number" id="newCowWeight" class="form-control" value="420" min="200" max="900">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Vaccination History</label>
              <input type="text" id="newCowVac" class="form-control" value="FMD-2025, BQ-2025">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" onclick="CowsView.closeModal()">Cancel</button>
              <button type="submit" class="btn btn-teal">Save Cow Profile</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  handleAddCow(e) {
    e.preventDefault();
    const id = document.getElementById('newCowId').value;
    const tag = document.getElementById('newCowTag').value;
    const name = document.getElementById('newCowName').value;
    const breed = document.getElementById('newCowBreed').value;
    const age = parseInt(document.getElementById('newCowAge').value);
    const lactation = parseInt(document.getElementById('newCowLact').value);
    const weight = parseInt(document.getElementById('newCowWeight').value);
    const vac = document.getElementById('newCowVac').value.split(',').map(s=>s.trim());

    VetData.cows.push({
      id, tag, name, breed, age, lactation, weight,
      riskLevel: 'healthy', riskScore: 12,
      conductivityDeviation: false, yieldTrend: 'stable', activityLevel: 'high',
      lastCalving: new Date().toISOString().split('T')[0],
      vaccinations: vac, diseases: [], farmId: 'F1'
    });

    VetData.baseSensors[id] = { yield: 11.5, conductivity: 5.6, milkTemp: 36.8, bodyTemp: 38.4, activity: 85, envTemp: 31, humidity: 72 };
    VetData.sensorOnline[id] = true;
    this.selectedCowId = id;
    this.closeModal();
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  openActionModal(cowId) {
    alert(`Quick observation note recorded for ${cowId}. You can enter full detailed observation in the "Manual Farm Data" or "Veterinarian" module.`);
  },

  closeModal() {
    const container = document.getElementById('cowModalContainer');
    if (container) container.innerHTML = '';
  }
};
