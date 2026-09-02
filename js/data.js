/* ============================================================
   VetSense AI — Mock Data & Simulation Engine
   ============================================================ */
window.VetData = (function(){
  /* ── Users ── */
  const users = [
    {id:'u1',username:'rajkumar',password:'farm123',role:'farmer',name:'Rajkumar M.',farm:'Kaveri Dairy Farm',avatar:'RK'},
    {id:'u2',username:'drvenkat',password:'vet456',role:'vet',name:'Dr. Venkatesh S.',farm:'Kaveri Dairy Farm',avatar:'DV'},
    {id:'u3',username:'admin',password:'admin789',role:'admin',name:'Farm Administrator',farm:'All Farms',avatar:'AD'}
  ];

  /* ── Cows ── */
  const cows = [
    {id:'COW-001',name:'Lakshmi',breed:'HF Cross',age:4,lactation:3,weight:420,tag:'TAG-L01',riskLevel:'high',riskScore:82,conductivityDeviation:true,yieldTrend:'down',activityLevel:'low',lastCalving:'2025-03-12',vaccinations:['FMD-2025','BQ-2025'],diseases:['Mastitis-2024'],farmId:'F1'},
    {id:'COW-002',name:'Kaveri',breed:'Jersey',age:5,lactation:4,weight:390,tag:'TAG-K02',riskLevel:'high',riskScore:76,conductivityDeviation:true,yieldTrend:'down',activityLevel:'reduced',lastCalving:'2025-01-20',vaccinations:['FMD-2025'],diseases:[],farmId:'F1'},
    {id:'COW-003',name:'Gomathi',breed:'Murrah Buffalo',age:3,lactation:2,weight:510,tag:'TAG-G03',riskLevel:'moderate',riskScore:58,conductivityDeviation:false,yieldTrend:'stable',activityLevel:'normal',lastCalving:'2025-06-05',vaccinations:['FMD-2025','HS-2025'],diseases:[],farmId:'F1'},
    {id:'COW-004',name:'Meena',breed:'Holstein Friesian',age:6,lactation:5,weight:440,tag:'TAG-M04',riskLevel:'moderate',riskScore:52,conductivityDeviation:false,yieldTrend:'slight-down',activityLevel:'slightly-reduced',lastCalving:'2025-04-18',vaccinations:['FMD-2025'],diseases:['Mastitis-2023'],farmId:'F1'},
    {id:'COW-005',name:'Priya',breed:'Jersey Cross',age:4,lactation:3,weight:405,tag:'TAG-P05',riskLevel:'moderate',riskScore:44,conductivityDeviation:false,yieldTrend:'stable',activityLevel:'normal',lastCalving:'2025-07-01',vaccinations:['FMD-2025','BQ-2025'],diseases:[],farmId:'F1'},
    {id:'COW-006',name:'Saraswathi',breed:'Holstein Friesian',age:3,lactation:2,weight:415,tag:'TAG-S06',riskLevel:'low',riskScore:22,conductivityDeviation:false,yieldTrend:'up',activityLevel:'high',lastCalving:'2025-08-10',vaccinations:['FMD-2025','BQ-2025','HS-2025'],diseases:[],farmId:'F1'},
    {id:'COW-007',name:'Sindhu',breed:'Jersey',age:5,lactation:4,weight:385,tag:'TAG-S07',riskLevel:'low',riskScore:18,conductivityDeviation:false,yieldTrend:'stable',activityLevel:'normal',lastCalving:'2025-05-25',vaccinations:['FMD-2025'],diseases:[],farmId:'F1'},
    {id:'COW-008',name:'Dharani',breed:'Murrah Buffalo',age:4,lactation:3,weight:505,tag:'TAG-D08',riskLevel:'healthy',riskScore:8,conductivityDeviation:false,yieldTrend:'up',activityLevel:'high',lastCalving:'2025-09-01',vaccinations:['FMD-2025','BQ-2025','HS-2025'],diseases:[],farmId:'F1'}
  ];

  /* ── Base sensor values per cow ── */
  const baseSensors = {
    'COW-001':{yield:8.2,conductivity:7.8,milkTemp:37.2,bodyTemp:39.1,activity:42,envTemp:31,humidity:72},
    'COW-002':{yield:9.1,conductivity:7.4,milkTemp:37.0,bodyTemp:38.9,activity:55,envTemp:31,humidity:72},
    'COW-003':{yield:10.5,conductivity:6.1,milkTemp:36.8,bodyTemp:38.5,activity:75,envTemp:31,humidity:72},
    'COW-004':{yield:11.2,conductivity:6.3,milkTemp:36.9,bodyTemp:38.6,activity:68,envTemp:31,humidity:72},
    'COW-005':{yield:9.8,conductivity:5.9,milkTemp:37.0,bodyTemp:38.4,activity:80,envTemp:31,humidity:72},
    'COW-006':{yield:12.4,conductivity:5.5,milkTemp:36.7,bodyTemp:38.3,activity:92,envTemp:31,humidity:72},
    'COW-007':{yield:10.8,conductivity:5.7,milkTemp:36.8,bodyTemp:38.4,activity:88,envTemp:31,humidity:72},
    'COW-008':{yield:13.1,conductivity:5.4,milkTemp:36.6,bodyTemp:38.2,activity:95,envTemp:31,humidity:72}
  };

  /* Current live sensor state (mutable) */
  const liveSensors = JSON.parse(JSON.stringify(baseSensors));
  const sensorTimestamps = {};
  const sensorOnline = {'COW-001':true,'COW-002':true,'COW-003':true,'COW-004':true,'COW-005':true,'COW-006':true,'COW-007':false,'COW-008':true};

  function now(){ return new Date().toLocaleTimeString('en-IN',{hour12:false}); }

  function tick(){
    const noise = (base,range,fixed=1)=>(base + (Math.random()-0.5)*range*2).toFixed(fixed)*1;
    Object.keys(liveSensors).forEach(id=>{
      const b = baseSensors[id]; const s = liveSensors[id];
      if(!sensorOnline[id]) return;
      s.yield = noise(b.yield, b.yield<10?0.3:0.2);
      s.conductivity = noise(b.conductivity, 0.15);
      s.milkTemp = noise(b.milkTemp, 0.1);
      s.bodyTemp = noise(b.bodyTemp, 0.05);
      s.activity = Math.max(0,Math.min(100,noise(b.activity, 4,0)));
      s.envTemp = noise(b.envTemp, 0.5);
      s.humidity = noise(b.humidity, 1,0);
      sensorTimestamps[id] = now();
    });
  }
  tick();
  setInterval(tick, 5000);

  function getLive(cowId){ return {...liveSensors[cowId], online:sensorOnline[cowId], ts:sensorTimestamps[cowId]||now()}; }

  /* ── Historical data generator ── */
  function genHistory(cowId, metric, days=30){
    const base = baseSensors[cowId]?.[metric] ?? 10;
    const trend = cows.find(c=>c.id===cowId)?.riskScore > 60 ? -0.05 : 0.01;
    const labels=[]; const data=[];
    for(let i=days;i>=0;i--){
      const d = new Date(); d.setDate(d.getDate()-i);
      labels.push(d.toLocaleDateString('en-IN',{month:'short',day:'numeric'}));
      const drift = trend*(days-i);
      data.push((base + drift + (Math.random()-0.5)*base*0.06).toFixed(2)*1);
    }
    return {labels,data};
  }

  function genRiskHistory(cowId,days=30){
    const base = cows.find(c=>c.id===cowId)?.riskScore || 20;
    const labels=[]; const data=[];
    for(let i=days;i>=0;i--){
      const d = new Date(); d.setDate(d.getDate()-i);
      labels.push(d.toLocaleDateString('en-IN',{month:'short',day:'numeric'}));
      const noise=(Math.random()-0.5)*8;
      const trend = base>60 ? (days-i)*0.8 : -(days-i)*0.3;
      data.push(Math.max(0,Math.min(100,(base*0.6 + trend + noise).toFixed(1)*1)));
    }
    return {labels,data};
  }

  /* ── Vet Records ── */
  const vetRecords = [
    {id:'VR-001',cowId:'COW-001',date:'2026-08-25',vet:'Dr. Venkatesh S.',diagnosis:'Subclinical Mastitis (early)',treatment:'Teat dipping, rest milking schedule',medication:'Intramammary infusion - Penicillin',followUp:'2026-09-05',status:'active',notes:'SCC elevated. Left rear quarter affected. No visual inflammation yet.'},
    {id:'VR-002',cowId:'COW-002',date:'2026-08-28',vet:'Dr. Venkatesh S.',diagnosis:'Watch - conductivity deviation',treatment:'Enhanced teat hygiene protocol',medication:'None prescribed',followUp:'2026-09-02',status:'monitoring',notes:'No clinical symptoms. AI flagged conductivity rise. Monitoring closely.'},
    {id:'VR-003',cowId:'COW-004',date:'2026-07-15',vet:'Dr. Venkatesh S.',diagnosis:'Mild mastitis - resolved',treatment:'Antibiotic therapy completed',medication:'Amoxicillin 10 days',followUp:'Closed',status:'closed',notes:'Fully recovered. SCC returned to normal. Watch for recurrence.'},
    {id:'VR-004',cowId:'COW-001',date:'2024-06-10',vet:'Dr. Ramesh K.',diagnosis:'Clinical Mastitis',treatment:'Emergency treatment - hospitalization',medication:'IV Antibiotics 5 days',followUp:'Closed',status:'historical',notes:'Severe case. Recovered after 2 weeks. First occurrence.'}
  ];

  /* ── Lab Records ── */
  const labRecords = [
    {id:'LR-001',cowId:'COW-001',date:'2026-08-30',testType:'SCC + Milk Culture',scc:485000,california:'Positive (3+)',ph:6.9,fat:3.2,protein:3.0,bacteriaCount:'Staphylococcus aureus detected',status:'critical',reportFile:null},
    {id:'LR-002',cowId:'COW-002',date:'2026-08-29',testType:'SCC Test',scc:310000,california:'Positive (2+)',ph:6.7,fat:3.5,protein:3.2,bacteriaCount:'None detected',status:'elevated',reportFile:null},
    {id:'LR-003',cowId:'COW-003',date:'2026-08-27',testType:'Routine SCC',scc:152000,california:'Trace',ph:6.5,fat:4.1,protein:3.4,bacteriaCount:'None detected',status:'normal',reportFile:null},
    {id:'LR-004',cowId:'COW-006',date:'2026-08-26',testType:'Routine SCC',scc:62000,california:'Negative',ph:6.4,fat:4.3,protein:3.6,bacteriaCount:'None detected',status:'normal',reportFile:null},
    {id:'LR-005',cowId:'COW-004',date:'2026-08-20',testType:'SCC Post-treatment',scc:185000,california:'Trace',ph:6.5,fat:3.8,protein:3.3,bacteriaCount:'None detected',status:'normal',reportFile:null}
  ];

  /* ── Alerts ── */
  const alerts = [
    {id:'ALT-001',cowId:'COW-001',cowName:'Lakshmi',riskScore:82,riskLevel:'high',timestamp:'2026-09-02 08:15',trust:'High',factors:['Milk yield decreased 18%','Conductivity abnormal (+28%)','Activity significantly reduced','Body temperature elevated 0.6°C'],action:'Inspect immediately and contact veterinarian.',acknowledged:false},
    {id:'ALT-002',cowId:'COW-002',cowName:'Kaveri',riskScore:76,riskLevel:'high',timestamp:'2026-09-02 09:30',trust:'High',factors:['Conductivity rising 3 consecutive days','Milk yield declining','SCC trending upward'],action:'Schedule veterinary inspection within 24 hours.',acknowledged:false},
    {id:'ALT-003',cowId:'COW-003',cowName:'Gomathi',riskScore:58,riskLevel:'moderate',timestamp:'2026-09-02 10:00',trust:'Medium',factors:['Mild yield reduction','Activity slightly reduced'],action:'Monitor closely. Improve hygiene protocol.',acknowledged:false},
    {id:'ALT-004',cowId:'COW-004',cowName:'Meena',riskScore:52,riskLevel:'moderate',timestamp:'2026-09-01 16:45',trust:'High',factors:['History of mastitis','Yield trending slightly down'],action:'Review milking procedure and hygiene.',acknowledged:true}
  ];

  /* ── AI Predictions ── */
  const aiPredictions = {
    'COW-001':{score:82,level:'high',confidence:91,trust:'High',window:'3-7 days',
      factors:[
        {text:'Milk yield decreased by 18% over 7 days',impact:'high'},
        {text:'Conductivity deviation +28% (Left rear quarter)',impact:'high'},
        {text:'Activity level reduced by 40% from baseline',impact:'high'},
        {text:'Body temperature elevated: 39.1°C vs 38.4°C baseline',impact:'moderate'},
        {text:'Somatic Cell Count: 485,000 cells/mL (critical)',impact:'high'}
      ],
      temporalPattern:[5,8,12,18,28,45,62,82],
      baselineDeviation:{yield:-18,conductivity:+28,activity:-40,bodyTemp:+1.8},
      farmFactors:['High ambient temp (31°C)','Elevated humidity (72%)'],
      trustDetails:{yield:'OK',conductivity:'OK',milkTemp:'OK',bodyTemp:'OK',activity:'OK',env:'OK'}
    },
    'COW-002':{score:76,level:'high',confidence:85,trust:'High',window:'5-10 days',
      factors:[
        {text:'Conductivity rising for 3 consecutive days',impact:'high'},
        {text:'Milk yield declining (trend)',impact:'high'},
        {text:'SCC elevated: 310,000 cells/mL',impact:'moderate'}
      ],
      temporalPattern:[4,6,10,16,25,40,58,76],
      baselineDeviation:{yield:-12,conductivity:+22,activity:-20,bodyTemp:+0.9},
      farmFactors:['High ambient temp (31°C)'],
      trustDetails:{yield:'OK',conductivity:'OK',milkTemp:'OK',bodyTemp:'OK',activity:'OK',env:'OK'}
    },
    'COW-003':{score:58,level:'moderate',confidence:74,trust:'Medium',window:'7-14 days',
      factors:[
        {text:'Mild yield reduction detected',impact:'moderate'},
        {text:'Activity slightly reduced from baseline',impact:'low'}
      ],
      temporalPattern:[2,3,5,8,15,25,38,58],
      baselineDeviation:{yield:-8,conductivity:+5,activity:-12,bodyTemp:+0.3},
      farmFactors:['High ambient temp','Pen density normal'],
      trustDetails:{yield:'OK',conductivity:'OK',milkTemp:'WARN',bodyTemp:'OK',activity:'OK',env:'OK'}
    },
    'COW-004':{score:52,level:'moderate',confidence:78,trust:'High',window:'10-14 days',
      factors:[
        {text:'Previous mastitis history increases risk',impact:'moderate'},
        {text:'Yield trending slightly downward',impact:'moderate'}
      ],
      temporalPattern:[1,2,3,6,12,22,36,52],
      baselineDeviation:{yield:-6,conductivity:+4,activity:-8,bodyTemp:+0.2},
      farmFactors:['History animal - elevated baseline risk'],
      trustDetails:{yield:'OK',conductivity:'OK',milkTemp:'OK',bodyTemp:'OK',activity:'OK',env:'OK'}
    },
    'COW-005':{score:44,level:'moderate',confidence:70,trust:'Medium',window:'10-14 days',
      factors:[{text:'Conductivity marginally elevated',impact:'low'},{text:'Mild activity reduction',impact:'low'}],
      temporalPattern:[1,2,3,5,10,18,30,44],
      baselineDeviation:{yield:-3,conductivity:+3,activity:-6,bodyTemp:+0.1},
      farmFactors:['Environmental temperature elevated'],
      trustDetails:{yield:'OK',conductivity:'WARN',milkTemp:'OK',bodyTemp:'OK',activity:'OK',env:'OK'}
    },
    'COW-006':{score:22,level:'low',confidence:88,trust:'High',window:'No imminent risk',
      factors:[{text:'All parameters within normal range',impact:'low'}],
      temporalPattern:[1,1,2,2,3,5,12,22],
      baselineDeviation:{yield:+2,conductivity:-1,activity:+3,bodyTemp:0},
      farmFactors:['Good hygiene conditions'],
      trustDetails:{yield:'OK',conductivity:'OK',milkTemp:'OK',bodyTemp:'OK',activity:'OK',env:'OK'}
    },
    'COW-007':{score:18,level:'low',confidence:62,trust:'Low',window:'No imminent risk',
      factors:[{text:'Sensor offline - limited data',impact:'low'}],
      temporalPattern:[1,1,1,2,3,5,10,18],
      baselineDeviation:{yield:0,conductivity:0,activity:0,bodyTemp:0},
      farmFactors:['Sensor offline'],
      trustDetails:{yield:'FAIL',conductivity:'FAIL',milkTemp:'FAIL',bodyTemp:'OK',activity:'FAIL',env:'OK'}
    },
    'COW-008':{score:8,level:'healthy',confidence:95,trust:'High',window:'No risk detected',
      factors:[{text:'All parameters optimal',impact:'low'}],
      temporalPattern:[0,1,1,1,2,3,5,8],
      baselineDeviation:{yield:+4,conductivity:-2,activity:+5,bodyTemp:-0.1},
      farmFactors:['Optimal conditions'],
      trustDetails:{yield:'OK',conductivity:'OK',milkTemp:'OK',bodyTemp:'OK',activity:'OK',env:'OK'}
    }
  };

  /* ── Farm / Manual Records ── */
  const farmRecords = [
    {id:'FM-001',date:'2026-09-01',type:'hygiene',milkingArea:'Clean',udderPreDip:'Yes',teatPostDip:'Yes',workerHygiene:'Good',penCleanliness:'Good',bedding:'Dry sand',waterAccess:'Ad lib',feedType:'TMR + Concentrate',feedFreq:'3x daily',notes:'Routine check - all normal.'},
    {id:'FM-002',date:'2026-08-28',type:'observation',milkingArea:'Fair',udderPreDip:'Yes',teatPostDip:'Yes',workerHygiene:'Fair',penCleanliness:'Fair',bedding:'Wet straw areas',waterAccess:'Ad lib',feedType:'TMR + Concentrate',feedFreq:'3x daily',notes:'Bedding wet in north pen. Corrected.'}
  ];

  /* ── Herd Stats ── */
  function getHerdStats(){
    const total = cows.length;
    const high = cows.filter(c=>c.riskLevel==='high').length;
    const moderate = cows.filter(c=>c.riskLevel==='moderate').length;
    const low = cows.filter(c=>c.riskLevel==='low').length;
    const healthy = cows.filter(c=>c.riskLevel==='healthy').length;
    const avgRisk = (cows.reduce((a,c)=>a+c.riskScore,0)/total).toFixed(0)*1;
    const onlineSensors = Object.values(sensorOnline).filter(Boolean).length;
    return {total,high,moderate,low,healthy,avgRisk,onlineSensors,totalSensors:cows.length};
  }

  /* ── Translations ── */
  const i18n = {
    en:{
      appName:'VetSense AI',tagline:'Intelligence Before Illness',
      nav:{overview:'Dashboard',cows:'Cow Management',iot:'IoT Monitoring',farm:'Farm Data',vet:'Veterinarian',lab:'Laboratory',ai:'AI Forecasting',alerts:'Alerts',analytics:'Herd Analytics',recs:'Recommendations',history:'Historical Data'},
      dashboard:{totalCows:'Total Cows',healthy:'Healthy',moderate:'Moderate Risk',high:'High Risk',herdRisk:'Herd Risk Score',recentAlerts:'Recent Alerts',iotStatus:'IoT Status',confidence:'AI Confidence'},
      login:{title:'Sign In to VetSense AI',username:'Username',password:'Password',role:'Select Role',farmer:'Dairy Farmer',vet:'Veterinarian',admin:'Administrator',signin:'Sign In',demo:'Demo Credentials'}
    },
    ta:{
      appName:'வெட்சென்ஸ் AI',tagline:'நோய்க்கு முன் அறிவுசார் எச்சரிக்கை',
      nav:{overview:'டாஷ்போர்டு',cows:'மாட்டு மேலாண்மை',iot:'IoT கண்காணிப்பு',farm:'பண்ணை தரவு',vet:'கால்நடை மருத்துவர்',lab:'ஆய்வகம்',ai:'AI முன்னறிவிப்பு',alerts:'எச்சரிக்கைகள்',analytics:'மந்தை பகுப்பாய்வு',recs:'பரிந்துரைகள்',history:'வரலாற்று தரவு'},
      dashboard:{totalCows:'மொத்த மாடுகள்',healthy:'ஆரோக்கியமான',moderate:'மிதமான ஆபத்து',high:'அதிக ஆபத்து',herdRisk:'மந்தை ஆபத்து',recentAlerts:'சமீபத்திய எச்சரிக்கைகள்',iotStatus:'IoT நிலை',confidence:'AI நம்பகத்தன்மை'},
      login:{title:'VetSense AI உள்நுழைய',username:'பயனர்பெயர்',password:'கடவுச்சொல்',role:'பங்கு தேர்ந்தெடு',farmer:'பால் விவசாயி',vet:'கால்நடை மருத்துவர்',admin:'நிர்வாகி',signin:'உள்நுழைய',demo:'டெமோ சான்றுகள்'}
    }
  };

  let lang = localStorage.getItem('vetsense_lang') || 'en';
  function t(key){ const parts=key.split('.'); let obj=i18n[lang]; for(const p of parts){obj=obj?.[p];} return obj||key; }
  function setLang(l){ lang=l; localStorage.setItem('vetsense_lang',l); }
  function getLang(){ return lang; }

  /* ── Public API ── */
  return { users, cows, labRecords, vetRecords, alerts, aiPredictions, farmRecords,
    getLive, getHerdStats, genHistory, genRiskHistory, t, setLang, getLang,
    sensorOnline, baseSensors
  };
})();
