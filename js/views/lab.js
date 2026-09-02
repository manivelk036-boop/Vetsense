/* ── Laboratory Diagnostics Module (Module 7) ── */
const LabView = {
  selectedCowId: 'COW-001',

  render() {
    const cows = VetData.cows;
    const records = VetData.labRecords;
    const activeCowRecords = records.filter(r => r.cowId === this.selectedCowId);

    setTimeout(() => {
      this.initChart();
    }, 60);

    return `
      <div class="fade-in">
        <div class="section-header">
          <div>
            <h2 class="text-xl font-bold">Laboratory Milk Testing & Somatic Cell Counts (SCC)</h2>
            <p class="text-sm text-muted">Microbiological cultures, Somatic Cell Count (SCC), California Mastitis Test (CMT) & biochemical milk profiles</p>
          </div>
          <span class="badge badge-teal">🧪 Laboratory Reference Hub</span>
        </div>

        <div class="dash-grid">
          <!-- Left: New Lab Record Entry Form -->
          <div class="card">
            <h3 class="text-base font-bold mb-3">🔬 Enter New Milk Laboratory Analysis</h3>
            <p class="text-xs text-muted mb-4">Laboratory SCC counts correlate directly with subclinical inflammation before physical clots appear.</p>

            <form onsubmit="LabView.handleSubmit(event)">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Tested Cow</label>
                  <select id="labCowId" class="form-control" onchange="LabView.selectCow(this.value)">
                    ${cows.map(c => `<option value="${c.id}" ${c.id===this.selectedCowId?'selected':''}>${c.id} — ${c.name} (${c.breed})</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Sample Analysis Date</label>
                  <input type="date" id="labDate" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Somatic Cell Count (SCC in cells/mL)</label>
                  <input type="number" id="labScc" class="form-control" placeholder="e.g. 350000" min="10000" max="5000000" required>
                  <span class="form-hint">&lt;200,000 = Normal | 200k-400k = Suspect | &gt;400,000 = Subclinical Mastitis</span>
                </div>
                <div class="form-group">
                  <label class="form-label">California Mastitis Test (CMT)</label>
                  <select id="labCmt" class="form-control">
                    <option value="Negative">Negative (No gel formation)</option>
                    <option value="Trace">Trace (Slight slime visible)</option>
                    <option value="Positive (1+)">Positive 1+ (Distinct gel formation)</option>
                    <option value="Positive (2+)" selected>Positive 2+ (Immediate thickening)</option>
                    <option value="Positive (3+)">Positive 3+ (Heavy convex gel peak)</option>
                  </select>
                </div>
              </div>

              <div class="form-row-3">
                <div class="form-group">
                  <label class="form-label">Milk pH</label>
                  <input type="number" id="labPh" class="form-control" step="0.1" value="6.7" min="6.0" max="7.5">
                  <span class="form-hint">Normal: 6.4 - 6.6</span>
                </div>
                <div class="form-group">
                  <label class="form-label">Milk Fat %</label>
                  <input type="number" id="labFat" class="form-control" step="0.1" value="3.5" min="2.0" max="7.0">
                </div>
                <div class="form-group">
                  <label class="form-label">Milk Protein %</label>
                  <input type="number" id="labProtein" class="form-control" step="0.1" value="3.1" min="2.0" max="6.0">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Bacterial Culture & Antimicrobial Sensitivity</label>
                <input type="text" id="labBacteria" class="form-control" placeholder="e.g. Staphylococcus aureus / Streptococcus uberis / None detected">
              </div>

              <div class="form-group">
                <label class="form-label">Upload Lab Report Document / PDF (Optional)</label>
                <input type="file" id="labFile" class="form-control" accept=".pdf,.png,.jpg,.jpeg">
                <span class="form-hint">Simulated direct attachment linked to cow's permanent medical vault</span>
              </div>

              <button type="submit" class="btn btn-teal">
                💾 Save Laboratory Report
              </button>
            </form>
          </div>

          <!-- Right: SCC Historical Curve & Past Reports -->
          <div>
            <div class="card mb-4">
              <div class="section-header">
                <div class="section-title">📊 SCC Progression (${this.selectedCowId})</div>
                <span class="badge badge-info">Benchmark: 200k Threshold</span>
              </div>
              <div class="chart-container-md">
                <canvas id="labSccChart"></canvas>
              </div>
            </div>

            <!-- Lab Reports Table -->
            <div class="card">
              <div class="section-header">
                <div class="section-title">📑 Recent Lab Records</div>
                <span class="badge badge-teal">${records.length} Reports</span>
              </div>

              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date / ID</th>
                      <th>Cow</th>
                      <th>SCC</th>
                      <th>CMT</th>
                      <th>Pathogen</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${records.map(r => `
                      <tr>
                        <td>
                          <div class="font-bold text-100">${r.date}</div>
                          <div class="text-xs text-muted">${r.id}</div>
                        </td>
                        <td>
                          <span class="font-semibold text-teal">${r.cowId}</span>
                        </td>
                        <td>
                          <span class="font-bold ${r.scc>400000?'text-danger':r.scc>200000?'text-warning':'text-success'}">
                            ${r.scc.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span class="badge ${r.california.includes('Positive')?'badge-high':'badge-healthy'}">
                            ${r.california}
                          </span>
                        </td>
                        <td class="text-xs text-muted truncate" style="max-width:140px;" title="${r.bacteriaCount}">
                          ${r.bacteriaCount}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
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

  initChart() {
    const sccSamples = [
      { date: 'Aug 05', scc: 120000 },
      { date: 'Aug 12', scc: 165000 },
      { date: 'Aug 19', scc: 210000 },
      { date: 'Aug 26', scc: 340000 },
      { date: 'Sep 02', scc: 485000 }
    ];

    Charts.line('labSccChart', sccSamples.map(s => s.date), [
      { label: 'Somatic Cell Count (cells/mL)', data: sccSamples.map(s => s.scc), color: 'rgb(239,68,68)' }
    ]);
  },

  handleSubmit(e) {
    e.preventDefault();
    const cowId = document.getElementById('labCowId').value;
    const date = document.getElementById('labDate').value;
    const scc = parseInt(document.getElementById('labScc').value);
    const california = document.getElementById('labCmt').value;
    const ph = parseFloat(document.getElementById('labPh').value);
    const fat = parseFloat(document.getElementById('labFat').value);
    const protein = parseFloat(document.getElementById('labProtein').value);
    const bacteriaCount = document.getElementById('labBacteria').value || 'Culture clean - no pathogen';
    const fileInput = document.getElementById('labFile');
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'Digital_Report.pdf';

    VetData.labRecords.unshift({
      id: 'LR-' + (VetData.labRecords.length + 1).toString().padStart(3, '0'),
      cowId, date, testType: 'Field SCC & Culture', scc, california, ph, fat, protein,
      bacteriaCount, status: scc > 400000 ? 'critical' : scc > 200000 ? 'elevated' : 'normal',
      reportFile: fileName
    });

    alert(`✅ Laboratory findings recorded for ${cowId} (SCC: ${scc.toLocaleString()}). Data incorporated into AI predictive weights.`);
    this.selectedCowId = cowId;
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  }
};
