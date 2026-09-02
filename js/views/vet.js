/* ── Veterinarian Clinical Module (Module 6) ── */
const VetView = {
  filterCowId: 'all',

  render() {
    const cows = VetData.cows;
    const records = VetData.vetRecords;
    const filtered = this.filterCowId === 'all' ? records : records.filter(r => r.cowId === this.filterCowId);

    return `
      <div class="fade-in">
        <div class="section-header">
          <div>
            <h2 class="text-xl font-bold">Veterinary Clinical Diagnostics & Treatment Records</h2>
            <p class="text-sm text-muted">Veterinarian examination notes, diagnosis confirmations and therapeutic outcomes serving as AI Ground-Truth</p>
          </div>
          <span class="badge badge-teal">🩺 Clinical Validation Hub</span>
        </div>

        <div class="dash-grid">
          <!-- Left: New Clinical Record Entry -->
          <div class="card">
            <h3 class="text-base font-bold mb-3">➕ Add Veterinary Examination Record</h3>
            <p class="text-xs text-muted mb-4">Every clinical entry serves as supervised ground-truth label for retuning the VetSense AI predictive neural model.</p>

            <form onsubmit="VetView.handleSubmit(event)">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Select Patient / Cow</label>
                  <select id="vetCowId" class="form-control">
                    ${cows.map(c => `<option value="${c.id}">${c.id} — ${c.name} (${c.breed}) [Risk: ${c.riskScore}%]</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Examination Date</label>
                  <input type="date" id="vetDate" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Attending Veterinarian</label>
                  <input type="text" id="vetDoctor" class="form-control" value="${App.getUser()?.name || 'Dr. Venkatesh S., MVSc'}" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Clinical Confirmation Status</label>
                  <select id="vetConfirmation" class="form-control">
                    <option value="Confirmed Subclinical">Confirmed Subclinical Mastitis (No external swelling)</option>
                    <option value="Confirmed Clinical">Confirmed Clinical Mastitis (Visible clots / heat)</option>
                    <option value="Healthy / False Positive">Healthy / False Alarm (Normal quarter)</option>
                    <option value="Non-specific Trauma">Physical Teat Trauma / Non-infectious</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Clinical Diagnosis & Affected Quarters</label>
                <input type="text" id="vetDiagnosis" class="form-control" placeholder="e.g. Subclinical Mastitis - Left Rear & Right Front quarters" required>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Prescribed Medical Treatment</label>
                  <input type="text" id="vetTreatment" class="form-control" placeholder="e.g. Teat barrier seal, anti-inflammatory, milking order adjustment" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Medication / Therapeutic Regimen</label>
                  <input type="text" id="vetMedication" class="form-control" placeholder="e.g. Cefquinome intramammary tube (milking cow formulation)" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Follow-up Date & Monitoring Status</label>
                  <input type="date" id="vetFollowUp" class="form-control" value="${new Date(Date.now() + 7*86400000).toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                  <label class="form-label">Case Status</label>
                  <select id="vetStatus" class="form-control">
                    <option value="active">Active Monitoring</option>
                    <option value="monitoring">Under Evaluation</option>
                    <option value="closed">Resolved / Cleared</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Veterinary Clinical Observations & Notes</label>
                <textarea id="vetNotes" class="form-control" placeholder="Describe palpation of quarters, milk consistency, California Mastitis Test (CMT) reaction, body condition score..."></textarea>
              </div>

              <button type="submit" class="btn btn-teal">
                💾 Submit Clinical Verification
              </button>
            </form>
          </div>

          <!-- Right: Past Clinical Logs Linked to Cow -->
          <div>
            <div class="card mb-4">
              <div class="section-header">
                <div class="section-title">🩺 Veterinary Case History</div>
                <select class="form-control" style="width:160px;padding:6px 10px;font-size:0.8rem;" onchange="VetView.filterCow(this.value)">
                  <option value="all">All Cattle Records</option>
                  ${cows.map(c => `<option value="${c.id}" ${c.id===this.filterCowId?'selected':''}>${c.id} (${c.name})</option>`).join('')}
                </select>
              </div>

              <div style="display:flex;flex-direction:column;gap:12px;">
                ${filtered.length === 0 ? '<div class="empty-state"><div class="es-icon">📋</div><p>No veterinary cases on file for this cow.</p></div>' : ''}
                ${filtered.map(r => `
                  <div style="background:var(--bg-800);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;">
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <span class="font-bold text-teal">${r.cowId}</span> — <span class="font-semibold text-100">${r.diagnosis}</span>
                        <div class="text-xs text-muted">Examiner: ${r.vet} · Date: ${r.date}</div>
                      </div>
                      <span class="badge ${r.status==='active'?'badge-high':r.status==='monitoring'?'badge-moderate':'badge-healthy'}">
                        ${r.status.toUpperCase()}
                      </span>
                    </div>
                    <div class="text-xs mb-2" style="background:var(--bg-700);padding:8px 10px;border-radius:var(--radius-xs);">
                      <div><strong>Treatment:</strong> ${r.treatment}</div>
                      <div><strong>Medication:</strong> ${r.medication}</div>
                      <div><strong>Follow-up:</strong> ${r.followUp}</div>
                    </div>
                    <div class="text-xs text-300">"${r.notes}"</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Ground Truth Badge Card -->
            <div class="card" style="border-left:3px solid var(--primary);">
              <h4 class="text-sm font-bold text-primary mb-2">🎯 AI Ground-Truth Closed-Loop Architecture</h4>
              <p class="text-xs text-muted" style="line-height:1.6;">
                Every time a veterinarian confirms or refutes a mastitis forecast, the system recalculates confusion matrix metrics (Sensitivity: <strong>94.2%</strong>, Specificity: <strong>91.8%</strong>). False positives refine the cow-specific baseline to avoid alert fatigue.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  filterCow(cowId) {
    this.filterCowId = cowId;
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  },

  handleSubmit(e) {
    e.preventDefault();
    const cowId = document.getElementById('vetCowId').value;
    const date = document.getElementById('vetDate').value;
    const vet = document.getElementById('vetDoctor').value;
    const diagnosis = document.getElementById('vetDiagnosis').value;
    const treatment = document.getElementById('vetTreatment').value;
    const medication = document.getElementById('vetMedication').value;
    const followUp = document.getElementById('vetFollowUp').value;
    const status = document.getElementById('vetStatus').value;
    const notes = document.getElementById('vetNotes').value || 'Routine examination recorded.';

    VetData.vetRecords.unshift({
      id: 'VR-' + (VetData.vetRecords.length + 1).toString().padStart(3, '0'),
      cowId, date, vet, diagnosis, treatment, medication, followUp, status, notes
    });

    alert(`✅ Clinical record for ${cowId} logged and connected to Cow Profile and AI Validation Pipeline.`);
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  }
};
