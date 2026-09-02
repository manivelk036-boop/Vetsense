/* ── Manual Farm Data View (Farmer & Administrator Data Entry) ── */
const FarmDataView = {
  render() {
    const records = VetData.farmRecords;

    return `
      <div class="fade-in">
        <div class="section-header">
          <div>
            <h2 class="text-xl font-bold">Manual Farm & Management Observations</h2>
            <p class="text-sm text-muted">Periodic farm hygiene, milking procedures, housing conditions and feeding logs that feed into the Farm-Adaptive AI Layer</p>
          </div>
          <span class="badge badge-teal">Adaptive Input Layer</span>
        </div>

        <div class="dash-grid">
          <!-- Left: New Entry Form -->
          <div class="card">
            <h3 class="text-base font-bold mb-3">📝 Log New Management / Hygiene Record</h3>
            <p class="text-xs text-muted mb-4">You do not need to log daily. Log weekly or upon key events (e.g. bedding change, worker rotation, extreme rain).</p>

            <form onsubmit="FarmDataView.handleSubmit(event)">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Record Date & Time</label>
                  <input type="date" id="fdDate" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Record Category / Event Type</label>
                  <select id="fdType" class="form-control">
                    <option value="routine">Routine Weekly Assessment</option>
                    <option value="weather">Extreme Weather Event (Heat / Rain)</option>
                    <option value="bedding">Bedding & Barn Renovation</option>
                    <option value="milking_change">Milking Protocol Adjustment</option>
                    <option value="feed_change">Ration / Feed Composition Change</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Milking Area Cleanliness</label>
                  <select id="fdMilkingArea" class="form-control">
                    <option value="Excellent">Excellent (Disinfected, dry floor)</option>
                    <option value="Clean" selected>Clean (Washed, minimal pooling)</option>
                    <option value="Fair">Fair (Minor organic debris)</option>
                    <option value="Poor">Poor (Slurry / mud accumulation)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Worker Hygiene Assessment</label>
                  <select id="fdWorkerHygiene" class="form-control">
                    <option value="Good" selected>Good (Gloves worn, sanitizing hands)</option>
                    <option value="Fair">Fair (Gloves not consistently used)</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Pre-Milking Teat Dip Applied?</label>
                  <select id="fdPreDip" class="form-control">
                    <option value="Yes" selected>Yes (Iodine / Chlorhexidine pre-dip with 30s contact)</option>
                    <option value="No">No (Teats washed with water only)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Post-Milking Teat Sealant / Dip?</label>
                  <select id="fdPostDip" class="form-control">
                    <option value="Yes" selected>Yes (Barrier disinfectant dip immediately after detachment)</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Barn Bedding Condition</label>
                  <select id="fdBedding" class="form-control">
                    <option value="Dry Sand" selected>Dry Sand / Fine Dust (Low bacterial load)</option>
                    <option value="Dry Straw / Sawdust">Dry Straw / Sawdust</option>
                    <option value="Damp Bedding">Damp / Wet Bedding (Requires prompt replacement)</option>
                    <option value="Bare Concrete">Bare Concrete (High abrasive trauma risk)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Feed Management & Clean Water</label>
                  <select id="fdFeed" class="form-control">
                    <option value="TMR + Mineral Mix" selected>TMR + Mineral Pre-mix + Ad lib water</option>
                    <option value="Green Fodder + Bran">Green Fodder + Rice Bran</option>
                    <option value="Grazing + Supplement">Pasture Grazing + Dairy Concentrate</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Additional Farm & Herd Health Observations</label>
                <textarea id="fdNotes" class="form-control" placeholder="Note any mastitis flareups, flies in barn, machine vacuum fluctuations, wet patches in stalls..."></textarea>
              </div>

              <button type="submit" class="btn btn-teal">
                💾 Submit Farm Assessment Log
              </button>
            </form>
          </div>

          <!-- Right: Past Audit History -->
          <div>
            <div class="card mb-4">
              <div class="section-header">
                <div class="section-title">📋 Historical Farm Audits</div>
                <span class="badge badge-info">${records.length} Logs Stored</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:12px;">
                ${records.map(r => `
                  <div style="background:var(--bg-800);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;">
                    <div class="flex justify-between items-center mb-2">
                      <span class="font-bold text-teal">${r.date} · ${r.type.toUpperCase()}</span>
                      <span class="badge ${r.milkingArea==='Clean'||r.milkingArea==='Excellent'?'badge-healthy':'badge-moderate'}">${r.milkingArea} Parlour</span>
                    </div>
                    <div class="text-xs text-muted mb-2">
                      Bedding: <strong class="text-200">${r.bedding}</strong> | Dip: <strong class="text-200">Pre: ${r.udderPreDip} / Post: ${r.teatPostDip}</strong>
                    </div>
                    <div class="text-xs text-300">"${r.notes}"</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Farm-Adaptive AI Multiplier Card -->
            <div class="card" style="border-left:3px solid var(--accent);">
              <h4 class="text-sm font-bold text-accent mb-2">🤖 How Farm Data Calibrates the AI:</h4>
              <p class="text-xs text-muted" style="line-height:1.6;">
                The <strong>Farm-Adaptive AI Engine</strong> adjusts individual cow vulnerability thresholds based on your housing cleanliness and teat dip scores. For instance, damp straw bedding lowers the conductivity threshold by 12% to trigger earlier alerts before environmental pathogens like <em>E. coli</em> establish infection.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  handleSubmit(e) {
    e.preventDefault();
    const date = document.getElementById('fdDate').value;
    const type = document.getElementById('fdType').value;
    const milkingArea = document.getElementById('fdMilkingArea').value;
    const workerHygiene = document.getElementById('fdWorkerHygiene').value;
    const udderPreDip = document.getElementById('fdPreDip').value;
    const teatPostDip = document.getElementById('fdPostDip').value;
    const bedding = document.getElementById('fdBedding').value;
    const feed = document.getElementById('fdFeed').value;
    const notes = document.getElementById('fdNotes').value || 'Routine update submitted by farm operator.';

    VetData.farmRecords.unshift({
      id: 'FM-' + (VetData.farmRecords.length + 1).toString().padStart(3, '0'),
      date, type, milkingArea, udderPreDip, teatPostDip, workerHygiene,
      penCleanliness: milkingArea, bedding, waterAccess: 'Ad lib',
      feedType: feed, feedFreq: '3x daily', notes
    });

    alert('✅ Farm observation log successfully recorded and synchronized into AI training baseline.');
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = this.render();
  }
};
