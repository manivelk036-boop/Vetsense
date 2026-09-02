/* ── Recommendation Engine (Module 12) ── */
const RecsView = {
  render() {
    return `
      <div class="fade-in">
        <div class="section-header">
          <div>
            <h2 class="text-xl font-bold">Preventive Action & Herd Care Recommendations</h2>
            <p class="text-sm text-muted">AI-derived non-pharmaceutical management strategies tailored to current herd biometric vulnerabilities</p>
          </div>
          <span class="badge badge-teal">💡 Decision Support</span>
        </div>

        <!-- Mandatory Veterinary Disclaimer Banner -->
        <div class="alert-banner alert-banner-info mb-4" style="border-left-color:var(--accent);background:rgba(245,158,11,0.08);color:#fde68a;">
          <div class="flex items-center gap-2 mb-1">
            <span style="font-size:1.1rem;">⚠️</span>
            <strong class="text-100">CLINICAL NOTICE & PHARMACEUTICAL DISCLAIMER:</strong>
          </div>
          <div class="text-xs" style="color:var(--text-200);line-height:1.6;">
            VetSense AI is a predictive forecasting and herd management advisory tool. <strong>This system strictly does not dispense automated prescription medications or antibiotic regimens.</strong> All therapeutic interventions, antimicrobials, intramammary infusions and diagnoses must be officially evaluated and prescribed by a licensed veterinarian.
          </div>
        </div>

        <div class="dash-grid">
          <!-- Main Recommendations Feed -->
          <div style="display:flex;flex-direction:column;gap:16px;">
            <!-- 1. Milking Hygiene -->
            <div class="rec-card">
              <div class="rec-icon" style="background:var(--primary-glow);color:var(--primary);">🧴</div>
              <div class="rec-content">
                <div class="flex justify-between items-start">
                  <div class="rec-title">Milking Hygiene & Cluster Detachment Protocol</div>
                  <span class="rec-priority high">High Priority</span>
                </div>
                <div class="rec-desc">
                  Subclinical cows (e.g. COW-001 & COW-002) must be milked <strong>last in sequence</strong> using dedicated or sanitized cluster units. Ensure automatic cluster removal (ACR) vacuum does not exceed 42 kPa to avoid hyperkeratosis of the teat end sphincter.
                </div>
                <div class="mt-3 flex gap-2">
                  <span class="badge badge-teal">Milking Parlour</span>
                  <span class="badge badge-info">Vacuum: 40-42 kPa</span>
                </div>
              </div>
            </div>

            <!-- 2. Udder Hygiene -->
            <div class="rec-card">
              <div class="rec-icon" style="background:var(--teal-glow);color:var(--teal);">🧼</div>
              <div class="rec-content">
                <div class="flex justify-between items-start">
                  <div class="rec-title">Pre-Dip & Post-Milking Teat Barrier Dip</div>
                  <span class="rec-priority high">High Priority</span>
                </div>
                <div class="rec-desc">
                  Apply a 0.5% available iodine or chlorhexidine foaming dip before attachment (allow 30 seconds kill time before wiping with individual clean cloth). Immediately apply a film-forming thick barrier sealant upon cluster detachment.
                </div>
                <div class="mt-3 flex gap-2">
                  <span class="badge badge-teal">Barrier Dip</span>
                  <span class="badge badge-info">30s Contact Time</span>
                </div>
              </div>
            </div>

            <!-- 3. Housing Cleanliness -->
            <div class="rec-card">
              <div class="rec-icon" style="background:var(--accent-glow);color:var(--accent);">🧹</div>
              <div class="rec-content">
                <div class="flex justify-between items-start">
                  <div class="rec-title">Housing Cleanliness & Cubicle Bedding Refresh</div>
                  <span class="rec-priority moderate">Moderate Priority</span>
                </div>
                <div class="rec-desc">
                  Replace damp straw or sawdust in high-density stalls with dry inorganic sand. Ensure alleys are scraped clean twice daily. Cows should remain standing for at least 45 minutes post-milking by offering fresh feed at the feed bunk.
                </div>
                <div class="mt-3 flex gap-2">
                  <span class="badge badge-warning">Barn Hygiene</span>
                  <span class="badge badge-teal">Dry Sand Bedding</span>
                </div>
              </div>
            </div>

            <!-- 4. Environmental Stress Management -->
            <div class="rec-card">
              <div class="rec-icon" style="background:var(--yellow-glow);color:var(--yellow);">🌤️</div>
              <div class="rec-content">
                <div class="flex justify-between items-start">
                  <div class="rec-title">Environmental Heat Stress & Ventilation Control</div>
                  <span class="rec-priority moderate">Moderate Priority</span>
                </div>
                <div class="rec-desc">
                  Current barn THI is 79.2 (Mild-to-moderate thermal stress). Activate misting fans and circulation blowers in waiting yard and loafing sheds to reduce respiration rates and bolster innate udder immune defenses.
                </div>
                <div class="mt-3 flex gap-2">
                  <span class="badge badge-warning">THI Alert: 79.2</span>
                  <span class="badge badge-info">Circulation Fans Active</span>
                </div>
              </div>
            </div>

            <!-- 5. Feeding Management -->
            <div class="rec-card">
              <div class="rec-icon" style="background:var(--green-glow);color:var(--green);">🌾</div>
              <div class="rec-content">
                <div class="flex justify-between items-start">
                  <div class="rec-title">Immuno-Nutritional Feeding & Clean Water Supply</div>
                  <span class="rec-priority low">Preventive</span>
                </div>
                <div class="rec-desc">
                  Supplement dairy ration with Vitamin E (1,000 IU/cow/day) and organic selenium to enhance polymorphonuclear neutrophil (PMN) leukocyte migration into the mammary gland. Ensure ad-libitum clean drinking water.
                </div>
                <div class="mt-3 flex gap-2">
                  <span class="badge badge-healthy">Nutrition</span>
                  <span class="badge badge-teal">Vit E + Selenium</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Priority Action Check & Vet Dispatch -->
          <div>
            <div class="card mb-4" style="border-top:3px solid var(--red);">
              <div class="section-header mb-3">
                <div class="section-title">🩺 Veterinary Consultation Action Hub</div>
              </div>
              <p class="text-xs text-muted mb-3">
                Whenever risk score surpasses 70%, trigger the clinical alert workflow to request physical inspection.
              </p>
              <div style="background:var(--bg-800);padding:14px;border-radius:var(--radius-sm);margin-bottom:14px;">
                <div class="font-bold text-100 text-sm">Assigned Veterinarian:</div>
                <div class="text-xs text-teal font-semibold mt-1">Dr. Venkatesh S., MVSc (Large Animal Medicine)</div>
                <div class="text-xs text-muted">Clinic: Kaveri Veterinary Hospital & Mobile Ambulatory</div>
                <div class="text-xs text-muted">Direct Line: +91 98401 22334</div>
              </div>
              <button class="btn btn-teal w-full justify-center" onclick="alert('Veterinary consultation request sent for COW-001 & COW-002 with complete 14-day telemetry package.')">
                📞 Request Urgent Vet Inspection
              </button>
            </div>

            <div class="card">
              <h4 class="text-sm font-bold mb-3">📋 Daily Farmer Hygiene Checklist</h4>
              <div style="display:flex;flex-direction:column;gap:10px;font-size:0.8rem;">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked style="accent-color:var(--teal);">
                  <span>Teat pre-dipped and individual towel dried</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked style="accent-color:var(--teal);">
                  <span>Post-milking barrier dip applied immediately</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked style="accent-color:var(--teal);">
                  <span>High-risk cows (COW-001, 002) milked last</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" style="accent-color:var(--teal);">
                  <span>Clean dry sand added to cubicle beds</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" style="accent-color:var(--teal);">
                  <span>Water troughs scrubbed & flushed</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
