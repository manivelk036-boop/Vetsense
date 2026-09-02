/* ============================================================
   VetSense AI — Main Router & App Shell
   ============================================================ */
const App = (function(){
  let currentView = 'overview';
  let currentUser = null;
  let liveInterval = null;

  const NAV_ITEMS = [
    {id:'overview',  icon:'🏠', label:'nav.overview',  section:'main',   roles:['farmer','vet','admin']},
    {id:'cows',      icon:'🐄', label:'nav.cows',      section:'main',   roles:['farmer','vet','admin']},
    {id:'iot',       icon:'📡', label:'nav.iot',       section:'main',   roles:['farmer','vet','admin']},
    {id:'farm',      icon:'📋', label:'nav.farm',      section:'farm',   roles:['farmer','admin']},
    {id:'vet',       icon:'🩺', label:'nav.vet',       section:'medical',roles:['vet','admin']},
    {id:'lab',       icon:'🧪', label:'nav.lab',       section:'medical',roles:['vet','admin']},
    {id:'ai',        icon:'🤖', label:'nav.ai',        section:'ai',     roles:['farmer','vet','admin']},
    {id:'alerts',    icon:'🔔', label:'nav.alerts',    section:'ai',     roles:['farmer','vet','admin'], badge:'alerts'},
    {id:'analytics', icon:'📊', label:'nav.analytics', section:'ai',     roles:['farmer','vet','admin']},
    {id:'recs',      icon:'💡', label:'nav.recs',      section:'ai',     roles:['farmer','vet','admin']},
    {id:'history',   icon:'📈', label:'nav.history',   section:'data',   roles:['farmer','vet','admin']}
  ];

  const VIEWS = {
    overview:   ()=>OverviewView.render(),
    cows:       ()=>CowsView.render(),
    iot:        ()=>IotView.render(),
    farm:       ()=>FarmDataView.render(),
    vet:        ()=>VetView.render(),
    lab:        ()=>LabView.render(),
    ai:         ()=>AiView.render(),
    alerts:     ()=>AlertsView.render(),
    analytics:  ()=>AnalyticsView.render(),
    recs:       ()=>RecsView.render(),
    history:    ()=>HistoricalView.render()
  };

  const VIEW_TITLES = {
    overview:'Dashboard Overview', cows:'Cow Management', iot:'IoT Monitoring',
    farm:'Manual Farm Data', vet:'Veterinarian Records', lab:'Laboratory Module',
    ai:'AI Forecasting Engine', alerts:'Alert System', analytics:'Herd Analytics',
    recs:'Recommendations', history:'Historical Data'
  };

  function init(){
    const sess = sessionStorage.getItem('vetsense_user');
    if(!sess){ window.location.href='index.html'; return; }
    currentUser = JSON.parse(sess);
    buildUserInfo();
    buildNav();
    navigate('overview');
    startLiveTicker();
  }

  function buildUserInfo(){
    document.getElementById('userAvatar').textContent = currentUser.avatar;
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role==='farmer'?'Dairy Farmer':currentUser.role==='vet'?'Veterinarian':'Administrator';
    const colors = {farmer:'var(--teal)',vet:'var(--primary)',admin:'var(--accent)'};
    document.getElementById('userAvatar').style.background = colors[currentUser.role] || 'var(--teal)';
  }

  function buildNav(){
    const nav = document.getElementById('sidebarNav');
    const sections = {};
    const labels = {main:'Core Modules',farm:'Farm Management',medical:'Clinical Modules',ai:'AI Intelligence',data:'Data & Reports'};
    const visible = NAV_ITEMS.filter(n=>n.roles.includes(currentUser.role));
    visible.forEach(item=>{
      if(!sections[item.section]) sections[item.section]=[];
      sections[item.section].push(item);
    });
    let html='';
    Object.keys(sections).forEach(sec=>{
      html+=`<div class="nav-section-label">${labels[sec]||sec}</div>`;
      sections[sec].forEach(item=>{
        const alertCount = item.badge==='alerts' ? VetData.alerts.filter(a=>!a.acknowledged).length : 0;
        const badge = alertCount>0 ? `<span class="nav-badge">${alertCount}</span>` : '';
        html+=`<div class="nav-item" id="nav-${item.id}" onclick="App.navigate('${item.id}')">
          <span class="nav-icon">${item.icon}</span>
          <span>${VetData.t(item.label)||item.label}</span>${badge}
        </div>`;
      });
    });
    nav.innerHTML = html;
  }

  function navigate(viewId){
    if(!VIEWS[viewId]) return;
    currentView = viewId;
    document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
    const navEl = document.getElementById('nav-'+viewId);
    if(navEl) navEl.classList.add('active');
    document.getElementById('topbarTitle').textContent = VIEW_TITLES[viewId] || viewId;
    const mc = document.getElementById('mainContent');
    mc.className = 'main-content fade-in';
    mc.innerHTML = VIEWS[viewId]();
    if(typeof window.lucide!=='undefined') lucide.createIcons();
    closeSidebar();
  }

  function startLiveTicker(){
    function updateTopbar(){
      const s = VetData.getHerdStats();
      const unack = VetData.alerts.filter(a=>!a.acknowledged).length;
      document.getElementById('notifCount').textContent = unack;
      document.getElementById('notifCount').style.display = unack>0?'flex':'none';
    }
    updateTopbar();
    liveInterval = setInterval(()=>{
      updateTopbar();
      if(typeof IotView!=='undefined' && currentView==='iot') IotView.refreshLive();
    }, 5000);
  }

  function openSidebar(){
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('active');
  }
  function closeSidebar(){
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
  }

  function toggleLang(){
    const l = VetData.getLang()==='en'?'ta':'en';
    VetData.setLang(l);
    buildNav();
    navigate(currentView);
    document.getElementById('langBtn').textContent = l==='ta'?'🌐 தமிழ் / EN':'🌐 EN / தமிழ்';
  }

  function logout(){
    if(liveInterval) clearInterval(liveInterval);
    sessionStorage.removeItem('vetsense_user');
    window.location.href='index.html';
  }

  function getUser(){ return currentUser; }

  return { init, navigate, openSidebar, closeSidebar, toggleLang, logout, getUser };
})();

document.addEventListener('DOMContentLoaded', ()=> App.init());
