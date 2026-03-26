// ================================================================
// APP LOGIC - Enhanced Rendering with full detail
// ================================================================
let activeCategory = null;
let activeTool = null;
let favorites = JSON.parse(localStorage.getItem('aiFavs') || '[]');

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryButtons();
  renderWorkflow();
  renderCostTable();
  renderImpact();
  renderRecommendations();
  renderTimeline();
  renderCharts();
  
  // Auth Check
  checkAuth();
  setup3DLoginCard(); // Initialize 3D Card Effect

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) document.getElementById('searchResults').classList.remove('show');
  });
});

// ===== 3D LOGIN CARD EFFECT =====
function setup3DLoginCard() {
  const overlay = document.getElementById('loginOverlay');
  const card = document.querySelector('.login-card');
  
  if (!overlay || !card) return;
  
  let isDragging = false;
  
  overlay.addEventListener('mousemove', (e) => {
    if (isDragging) return; // Pause tilt while grabbing
    
    // Get mouse position relative to the middle of the card
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Calculate rotation angles (max 15 degrees)
    const rotateX = (-y / (rect.height / 2)) * 10;
    const rotateY = (x / (rect.width / 2)) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  overlay.addEventListener('mouseleave', () => {
    if (isDragging) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
  
  // Add dragging simulation
  card.addEventListener('mousedown', () => { 
    isDragging = true; 
    card.style.transform = `perspective(1000px) rotateX(15deg) rotateY(0) scale3d(0.95, 0.95, 0.95)`;
  });
  
  window.addEventListener('mouseup', () => { 
    if (isDragging) {
      isDragging = false;
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
  });
}

// ===== AUTHENTICATION SYSTEM =====
function checkAuth() {
  const name = localStorage.getItem('authName');
  const avatar = localStorage.getItem('authAvatar');
  
  if (name) {
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('userProfile').style.display = 'flex';
    document.getElementById('userNameDisplay').textContent = name;
    if (avatar) document.getElementById('userAvatar').src = avatar;
    
    // Auto-fill voting name
    saveVoterName(name);
  } else {
    document.getElementById('loginOverlay').classList.remove('hidden');
    document.getElementById('userProfile').style.display = 'none';
  }
}

function loginCustom() {
  const emailInput = document.getElementById('userEmail');
  const nameInput = document.getElementById('userName');
  
  const email = emailInput.value.trim();
  const name = nameInput.value.trim();
  
  if (!email || !name) { 
    alert('Please enter both Email and Name'); 
    return; 
  }
  
  // Generate a beautiful avatar based on their name initials
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00D4AA&color=fff&bold=true&rounded=true`;
  
  localStorage.setItem('authName', name);
  localStorage.setItem('authEmail', email);
  localStorage.setItem('authAvatar', avatarUrl);
  
  checkAuth();
}

function logout() {
  localStorage.removeItem('authName');
  localStorage.removeItem('authEmail');
  localStorage.removeItem('authAvatar');
  localStorage.removeItem('aiVoterName');
  localStorage.removeItem('aiVotes'); // Optional: clear local votes
  checkAuth();
}

function renderCategoryButtons() {
  document.getElementById('catButtons').innerHTML = CATEGORIES.map(cat =>
    `<button class="cat-btn" data-id="${cat.id}" onclick="toggleCategory('${cat.id}')">
      <span>${cat.icon}</span> ${cat.label}
    </button>`
  ).join('');
}

function toggleCategory(id) {
  const contentDiv = document.getElementById('categoryContent');
  const buttons = document.querySelectorAll('.cat-btn');
  if (activeCategory === id) {
    activeCategory = null; activeTool = null;
    contentDiv.innerHTML = '';
    buttons.forEach(b => b.classList.remove('active'));
    return;
  }
  activeCategory = id; activeTool = null;
  buttons.forEach(b => b.classList.toggle('active', b.dataset.id === id));
  const cat = CATEGORIES.find(c => c.id === id);
  const tools = TOOLS[id] || [];

  let html = `<div class="cat-panel">`;

  // HEADER with reality
  html += `<div class="cat-header" style="border-left: 4px solid ${cat.color}">
    <h3>${cat.icon} ${cat.label}</h3>
    <p>${cat.desc}</p>
    <div class="rec-line">🏆 RECOMMENDED: ${cat.rec}</div>
  </div>`;

  // REALITY SECTION
  if (cat.reality) {
    html += `<div class="reality-box" style="background:var(--card);border:1px solid var(--border);border-left:4px solid ${cat.color};border-radius:12px;padding:1.5rem;margin-bottom:1.5rem">
      <h4 style="color:${cat.color};margin-bottom:0.8rem">📋 Your Company Reality</h4>
      <p style="font-size:0.9rem;color:var(--gray);line-height:1.7">${cat.reality}</p>
    </div>`;
  }

  // WORKFLOW STAGES (UI tools)
  if (cat.workflowStages) {
    html += `<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem">
      <h4 style="color:${cat.color};margin-bottom:1rem">🏗️ Real Workflow In Your Company</h4>
      <div class="cost-table-wrap"><table class="comp-table"><thead><tr><th>Stage</th><th>Problem</th><th>Tool Role</th></tr></thead><tbody>
      ${cat.workflowStages.map(s => `<tr><td><strong>${s.stage}</strong></td><td>${s.problem}</td><td style="color:${cat.color};font-weight:600">${s.tool}</td></tr>`).join('')}
      </tbody></table></div></div>`;
  }

  // REAL WORKFLOW (Docs)
  if (cat.realWorkflow) {
    html += `<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem">
      <h4 style="color:${cat.color};margin-bottom:1rem">🔥 Real Workflow (Your Company)</h4>
      <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
      ${cat.realWorkflow.map((s,i) => `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:1rem;min-width:180px;text-align:center">
        <div style="font-size:0.75rem;color:var(--mid)">${s.step}</div>
        <div style="font-size:1.1rem;font-weight:700;color:${cat.color};margin:0.3rem 0">👉 ${s.tool}</div>
        <div style="font-size:0.8rem;color:var(--gray)">${s.desc}</div>
      </div>${i < cat.realWorkflow.length-1 ? '<span style="font-size:1.2rem;color:var(--dim);font-weight:800">→</span>' : ''}`).join('')}
      </div></div>`;
  }

  // DAILY FLOW (Email)
  if (cat.dailyFlow) {
    html += `<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem">
      <h4 style="color:${cat.color};margin-bottom:1rem">📌 Daily Email Flow</h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem">
      ${cat.dailyFlow.map(d => `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:1.2rem">
        <div style="font-weight:700;color:var(--white);margin-bottom:0.5rem">${d.type}</div>
        <div style="color:${cat.color};font-weight:600;margin-bottom:0.3rem">👉 Use ${d.tool}</div>
        <div style="font-size:0.85rem;color:var(--gray)">${d.use}</div>
      </div>`).join('')}
      </div></div>`;
  }

  // HOW IT WORKS (NotebookLM)
  if (cat.howItWorks) {
    html += `<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem">
      <h4 style="color:${cat.color};margin-bottom:1rem">⚙️ How NotebookLM Works (Step-by-Step)</h4>
      ${cat.howItWorks.map(s => `<div style="display:flex;gap:1rem;align-items:flex-start;margin-bottom:1rem">
        <div style="background:${cat.color};color:var(--bg);font-weight:800;font-size:0.75rem;padding:4px 10px;border-radius:6px;white-space:nowrap">${s.step}</div>
        <div><div style="font-weight:700;color:var(--white);font-size:0.95rem">${s.action}</div>
        <div style="font-size:0.85rem;color:var(--gray);margin-top:0.2rem">${s.example}</div></div>
      </div>`).join('')}
    </div>`;
  }

  // COST TABLE (Task Management)
  if (cat.costTable) {
    html += `<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem">
      <h4 style="color:${cat.color};margin-bottom:1rem">💰 Real Cost Breakdown (30 Users)</h4>
      <div class="cost-table-wrap"><table class="comp-table"><thead><tr><th>Tool</th><th>Per User</th><th>30 Users Monthly</th><th>Yearly Cost</th></tr></thead><tbody>
      ${cat.costTable.map(r => `<tr><td><strong>${r.tool}</strong></td><td>${r.perUser}</td><td>${r.monthly}</td><td>${r.yearly}</td></tr>`).join('')}
      </tbody></table></div></div>`;
  }

  // TOOL BUTTONS
  html += `<h4 style="color:var(--white);margin-bottom:0.8rem">🔍 Click a tool below for full details:</h4>
    <div class="tool-buttons" id="toolButtons_${id}">
      ${tools.map((t, i) => `<button class="tool-btn" data-idx="${i}" style="--tool-color:${t.color}" onclick="showTool('${id}',${i})">
        ${t.icon} ${t.name} ${typeof getToolTag==='function'?getToolTag(t.name):''} <span class="role-badge">${t.role.split('(')[0].trim().substring(0,25)}</span>
      </button>`).join('')}
    </div>
    <div id="toolDetail_${id}"></div>`;

  // COMPARISON TABLE
  if (cat.comparison) {
    html += `<div style="margin-top:1.5rem"><h4 style="color:${cat.color};margin-bottom:0.5rem">⚔️ Final Deep Comparison</h4>
    <div class="cost-table-wrap"><table class="comp-table"><thead><tr>
      ${cat.comparison.headers.map(h => `<th>${h}</th>`).join('')}
    </tr></thead><tbody>
      ${cat.comparison.rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
    </tbody></table></div></div>`;
  }

  // BUSINESS IMPACT
  if (cat.businessImpact) {
    html += `<div style="background:rgba(0,212,170,0.06);border:1px solid rgba(0,212,170,0.2);border-radius:12px;padding:1.2rem;margin-top:1.5rem">
      <h4 style="color:var(--teal);margin-bottom:0.5rem">🧠 Business Impact</h4>
      <p style="font-size:0.9rem;color:var(--gray)">${cat.businessImpact}</p>
    </div>`;
  }

  // MEETING LINE
  if (cat.meetingLine) {
    html += `<div style="background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:1.2rem;margin-top:1rem">
      <h4 style="color:var(--purple);margin-bottom:0.5rem">🎯 Meeting-Ready Line (USE THIS) <button class="copy-btn" onclick="copyText(\`${cat.meetingLine.replace(/`/g,'')}\`, this)">📋 Copy</button></h4>
      <p style="font-size:0.9rem;color:var(--teal);font-style:italic">${cat.meetingLine}</p>
    </div>`;
  }

  html += `</div>`;
  contentDiv.innerHTML = html;
  contentDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showTool(catId, idx) {
  const tools = TOOLS[catId];
  const tool = tools[idx];
  const detailDiv = document.getElementById(`toolDetail_${catId}`);
  const btns = document.querySelectorAll(`#toolButtons_${catId} .tool-btn`);
  if (activeTool === `${catId}_${idx}`) {
    activeTool = null; detailDiv.innerHTML = '';
    btns.forEach(b => b.classList.remove('active'));
    return;
  }
  activeTool = `${catId}_${idx}`;
  btns.forEach((b, i) => b.classList.toggle('active', i === idx));

  let html = `<div class="tool-detail" style="border-top: 3px solid ${tool.color}">
    <h4>${tool.icon} ${tool.name}</h4>
    <div class="tool-role">🏆 FINAL ROLE: ${tool.role}</div>
    <h5 style="color:var(--white);margin-bottom:0.8rem">🔬 Company-Specific Use Cases</h5>
    <div class="use-cases">
      ${tool.useCases.map(uc => `
        <div class="use-case" style="--uc-color:${uc.color}">
          <h5>${uc.title}</h5>
          <p>${uc.desc}</p>
          <div class="impact"><p>👉 Business Impact: ${uc.impact}</p></div>
        </div>`).join('')}
    </div>
    <div class="detail-footer">
      <span class="detail-badge badge-price">💰 Pricing: ${tool.pricing}</span>
      ${tool.url ? `<a href="${tool.url}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;background:rgba(0,212,170,0.1);border:1px solid rgba(0,212,170,0.3);color:var(--teal);font-size:0.82rem;font-weight:600;text-decoration:none;transition:all 0.3s" onmouseover="this.style.background='rgba(0,212,170,0.2)'" onmouseout="this.style.background='rgba(0,212,170,0.1)'">🔗 Visit ${tool.name} Website →</a>` : ''}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem">
      <div style="background:rgba(74,222,128,0.04);border:1px solid rgba(74,222,128,0.15);border-radius:10px;padding:1rem">
        <h5 style="color:var(--green);margin-bottom:0.5rem">👍 Real Advantages</h5>
        ${tool.advantages.map(a => `<p style="font-size:0.85rem;margin-bottom:0.4rem;color:var(--gray)">✅ ${a}</p>`).join('')}
      </div>
      <div style="background:rgba(255,77,106,0.04);border:1px solid rgba(255,77,106,0.15);border-radius:10px;padding:1rem">
        <h5 style="color:var(--red);margin-bottom:0.5rem">❌ Real Limitations (IMPORTANT)</h5>
        ${tool.limitations.map(l => `<p style="font-size:0.85rem;margin-bottom:0.4rem;color:var(--gray)">⚠️ ${l}</p>`).join('')}
      </div>
    </div>
  </div>`;
  detailDiv.innerHTML = html;
  detailDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderWorkflow() {
  const steps = [
    { num:"1", icon:"💡", title:"IDEA", tools:"Uizard, Claude", desc:"Feature ideation, UI from prompt", color:"#FBBF24" },
    { num:"2", icon:"🎨", title:"DESIGN", tools:"Figma AI", desc:"UI components, Mobile + Web", color:"#8B5CF6" },
    { num:"3", icon:"🖥", title:"FRONTEND", tools:"Vercel v0, Copilot", desc:"React UI gen, Daily coding", color:"#38BDF8" },
    { num:"4", icon:"⚙️", title:"BACKEND", tools:"Cursor AI, Claude", desc:"API dev, Architecture", color:"#00D4AA" },
    { num:"5", icon:"📋", title:"MEETING", tools:"Fireflies, tl;dv", desc:"Auto notes, Hindi+English", color:"#FF8C42" },
    { num:"6", icon:"✅", title:"TASKS", tools:"ClickUp, Jira", desc:"Sprint tracking, Cross-team", color:"#4ADE80" },
    { num:"7", icon:"🧠", title:"KNOWLEDGE", tools:"NotebookLM", desc:"Company brain, Multilingual", color:"#FF4D6A" }
  ];
  document.getElementById('workflowFlow').innerHTML = steps.map((s, i) =>
    `<div class="wf-step" style="--wf-color:${s.color}">
      <div class="wf-num">${s.num}</div>
      <h4>${s.icon} ${s.title}</h4>
      <div class="wf-tools">${s.tools}</div>
      <div class="wf-desc">${s.desc}</div>
    </div>${i < 6 ? '<span class="wf-arrow">→</span>' : ''}`
  ).join('');
}

function renderCostTable() {
  const rows = [
    ["UI Design","Figma Pro","$12","$360","$4,320","Uizard $39/mo"],
    ["Backend Dev","Cursor Pro","$20","$600*","$7,200*","Copilot $300/mo"],
    ["Frontend","Vercel v0","Usage","~$200","~$2,400","Copilot (shared)"],
    ["Meetings","Fireflies Pro","$10","$300","$3,600","tl;dv FREE"],
    ["Task Mgmt","ClickUp","$7","$210","$2,520","Jira $245/mo"],
    ["Docs/PPT","Gamma+Canva","$18","~$100","~$1,200","Claude (shared)"],
    ["Email","ChatGPT+Claude","$40","~$120**","~$1,440**","—"],
    ["Knowledge","NotebookLM","$20","~$200***","~$2,400***","—"]
  ];
  document.getElementById('costTable').innerHTML = `
    <table class="comp-table">
      <thead><tr><th>Category</th><th>Primary Tool</th><th>Per User/Mo</th><th>30 Users/Mo</th><th>Yearly</th><th>Alt/Backup</th></tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
    <p style="font-size:0.8rem;color:var(--mid);margin-top:0.5rem">* Not all 30 users need every tool | ** Shared team accounts | *** Only key users on Pro</p>`;
}

function renderImpact() {
  const items = [
    { icon:"⏱", title:"Dev Speed", val:"↑ 40-60%", desc:"AI coding with Cursor + Copilot + v0", color:"#4ADE80" },
    { icon:"🎨", title:"UI Quality", val:"↑ 30-50%", desc:"Figma design system across products", color:"#8B5CF6" },
    { icon:"📧", title:"Response Time", val:"↓ 50-70%", desc:"ChatGPT + Claude email workflows", color:"#38BDF8" },
    { icon:"🧠", title:"Knowledge", val:"↑ 80%", desc:"NotebookLM (Hindi + English)", color:"#00D4AA" },
    { icon:"📋", title:"Meeting Efficiency", val:"↑ 60%", desc:"Fireflies auto notes + tasks", color:"#FF8C42" },
    { icon:"💰", title:"Cost Reduction", val:"↓ 30-40%", desc:"Fewer wrong features, less rework", color:"#FBBF24" },
    { icon:"📱", title:"Field Usability", val:"↑ Significant", desc:"Mobile-first, offline-friendly", color:"#4ADE80" },
    { icon:"🏢", title:"Decisions", val:"↑ Faster", desc:"Better dashboards + reporting", color:"#38BDF8" }
  ];
  document.getElementById('impactGrid').innerHTML = items.map(it =>
    `<div class="impact-card" style="--imp-color:${it.color}">
      <span class="imp-icon">${it.icon}</span><h4>${it.title}</h4>
      <div class="imp-val">${it.val}</div>
      <p>${it.desc}</p>
    </div>`
  ).join('');
}

function renderRecommendations() {
  const recs = [
    { title:"🎨 UI Design", items:["Figma AI → Core UI (Web + App)","Uizard → Rapid prototyping","Framer → Website & showcase","Canva → Reports & presentations"], color:"#8B5CF6" },
    { title:"⚙️ Backend", items:["Cursor → Main development","Copilot → Daily coding","Claude → Architecture & debugging","Windsurf/Replit → Experimentation"], color:"#00D4AA" },
    { title:"🖥 Frontend", items:["Vercel v0 → UI generation","GitHub Copilot → Coding","ChatGPT → Debugging","Claude → Architecture decisions"], color:"#38BDF8" },
    { title:"📋 Meetings", items:["Fireflies.ai → Company-wide","(Hindi + English support)","tl;dv → Free backup","Jamie → Leadership only"], color:"#FF8C42" },
    { title:"✅ Task Mgmt", items:["ClickUp → Main system","IT + Non-IT + Management","$210/month for 30 users","Best scalable option"], color:"#4ADE80" },
    { title:"📧 Email", items:["ChatGPT → Speed + daily","Claude → Quality + critical","Response time ↓ 50-70%","Client satisfaction ↑"], color:"#FBBF24" },
    { title:"📄 Docs & PPT", items:["Claude → Content strategy","Gamma → Fast PPT generation","Canva → Final design polish","Figma → Product visuals"], color:"#8B5CF6" },
    { title:"🧠 Knowledge", items:["NotebookLM → Company brain","Multilingual (Hindi+English)","Training system replacement","Centralized knowledge base"], color:"#E879F9" }
  ];
  document.getElementById('recGrid').innerHTML = recs.map(r =>
    `<div class="rec-card" style="--rec-color:${r.color}">
      <h4>${r.title}</h4>
      <div class="rec-divider"></div>
      ${r.items.map(it => `<p>${it}</p>`).join('')}
    </div>`
  ).join('');
}

// ===== FEATURE 1: SEARCH =====
function handleSearch(query) {
  const results = document.getElementById('searchResults');
  if (!query || query.length < 2) { results.classList.remove('show'); return; }
  const q = query.toLowerCase();
  let matches = [];
  Object.keys(TOOLS).forEach(catId => {
    const cat = CATEGORIES.find(c => c.id === catId);
    TOOLS[catId].forEach((tool, idx) => {
      const text = `${tool.name} ${tool.role} ${tool.useCases.map(u=>u.title+' '+u.desc).join(' ')}`.toLowerCase();
      if (text.includes(q)) matches.push({ catId, idx, tool, catLabel: cat.label });
    });
  });
  if (matches.length === 0) { results.innerHTML = '<div class="sr-item"><span class="sr-name">No results found</span></div>'; }
  else { results.innerHTML = matches.slice(0,8).map(m =>
    `<div class="sr-item" onclick="toggleCategory('${m.catId}');setTimeout(()=>showTool('${m.catId}',${m.idx}),300)">
      <span class="sr-cat">${m.catLabel}</span>
      <div><div class="sr-name">${m.tool.icon} ${m.tool.name}</div><div class="sr-role">${m.tool.role}</div></div>
    </div>`).join(''); }
  results.classList.add('show');
}

// ===== FEATURE 2: CHARTS =====
let _chartRetryCount = 0;
function renderCharts() {
  const ctx1 = document.getElementById('costChart');
  const ctx2 = document.getElementById('categoryChart');
  if (!ctx1 || !ctx2) {
    console.warn('Chart canvas elements not found');
    return;
  }

  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    _chartRetryCount++;
    if (_chartRetryCount <= 10) {
      console.warn('Chart.js not loaded yet, retrying in 500ms... (attempt ' + _chartRetryCount + ')');
      setTimeout(renderCharts, 500);
    } else {
      console.error('Chart.js failed to load after 10 retries. Charts will not render.');
      ctx1.parentElement.innerHTML = '<p style="color:#FF4D6A;text-align:center;padding:2rem;">⚠️ Chart.js failed to load. Check internet connection and refresh.</p>';
      ctx2.parentElement.innerHTML = '<p style="color:#FF4D6A;text-align:center;padding:2rem;">⚠️ Chart.js failed to load. Check internet connection and refresh.</p>';
    }
    return;
  }

  try {
    // Destroy existing charts if any (prevent "Canvas is already in use" error)
    const existingChart1 = Chart.getChart(ctx1);
    const existingChart2 = Chart.getChart(ctx2);
    if (existingChart1) existingChart1.destroy();
    if (existingChart2) existingChart2.destroy();

    new Chart(ctx1, { type:'bar', data:{
      labels:['Figma','Cursor','Vercel v0','Fireflies','ClickUp','Gamma+Canva','ChatGPT+Claude','NotebookLM'],
      datasets:[{label:'Monthly Cost (30 Users)',data:[360,600,200,300,210,100,120,200],
        backgroundColor:['#8B5CF6','#00D4AA','#38BDF8','#FF8C42','#4ADE80','#FBBF24','#FF4D6A','#E879F9'],
        borderRadius:6, borderSkipped:false }]
    }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:'#BBBBCC'}},title:{display:true,text:'Monthly Tool Costs (30 Users)',color:'#FFFFFF',font:{size:14}}},
      scales:{y:{ticks:{color:'#888899',callback:v=>'$'+v},grid:{color:'#333344'}},x:{ticks:{color:'#888899'},grid:{display:false}}} }});

    new Chart(ctx2, { type:'doughnut', data:{
      labels:['UI Design','Backend Dev','Frontend','Meetings','Task Mgmt','Docs/PPT','Email','Knowledge'],
      datasets:[{data:[360,600,200,300,210,100,120,200],
        backgroundColor:['#8B5CF6','#00D4AA','#38BDF8','#FF8C42','#4ADE80','#FBBF24','#FF4D6A','#E879F9'],
        borderWidth:2, borderColor:'#0D0D0D'}]
    }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'right',labels:{color:'#BBBBCC',padding:12,font:{size:11}}},
      title:{display:true,text:'Cost Distribution by Category',color:'#FFFFFF',font:{size:14}}} }});

    console.log('✅ Charts rendered successfully');
  } catch(e) {
    console.error('Chart rendering error:', e);
    ctx1.parentElement.innerHTML = `<p style="color:#FF4D6A;padding:1rem">Error: ${e.message}</p>`;
    // Retry once on error
//    if (_chartRetryCount < 3) {
//      _chartRetryCount++;
//      setTimeout(renderCharts, 1000);
//    }
  }
}

// ===== FEATURE 3: PDF EXPORT =====
function exportPDF() {
  const style = `<style>body{font-family:Arial,sans-serif;background:#fff;color:#333;padding:20px}h1,h2,h3{color:#1a1a2e}
  .no-print{display:none !important}table{border-collapse:collapse;width:100%;margin:1rem 0}th,td{border:1px solid #ddd;padding:8px;text-align:left}
  th{background:#f0f0f0;font-weight:bold}.cat{margin:2rem 0;page-break-inside:avoid}
  .tool{background:#f9f9f9;border:1px solid #ddd;border-radius:8px;padding:1rem;margin:1rem 0}</style>`;
  let html = `<!DOCTYPE html><html><head><title>AI Strategy - Mining SaaS</title>${style}</head><body>`;
  html += `<h1>AI Transformation Strategy</h1><p>Mining SaaS Company — 30 Users — ${new Date().toLocaleDateString()}</p><hr>`;
  CATEGORIES.forEach(cat => {
    html += `<div class="cat"><h2>${cat.icon} ${cat.label}</h2><p>${cat.desc}</p><p><strong>Recommendation:</strong> ${cat.rec}</p>`;
    if (cat.reality) html += `<p><em>${cat.reality}</em></p>`;
    (TOOLS[cat.id]||[]).forEach(tool => {
      html += `<div class="tool"><h3>${tool.name} — ${tool.role}</h3><p><strong>Pricing:</strong> ${tool.pricing}</p>`;
      html += `<p><strong>Advantages:</strong> ${tool.advantages.join(' | ')}</p>`;
      html += `<p><strong>Limitations:</strong> ${tool.limitations.join(' | ')}</p>`;
      if(tool.url) html += `<p><strong>Website:</strong> ${tool.url}</p>`;
      html += `</div>`;
    });
    if (cat.meetingLine) html += `<p><strong>Meeting Line:</strong> ${cat.meetingLine}</p>`;
    html += `</div>`;
  });
  html += `</body></html>`;
  const blob = new Blob([html], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'AI_Strategy_Mining_SaaS.html';
  a.click();
  alert('📥 Downloaded! Open the file and use Print → Save as PDF for best results.');
}

// ===== FEATURE 4: THEME TOGGLE =====
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.getElementById('themeBtn').textContent = next === 'dark' ? '🌗' : '☀️';
  localStorage.setItem('aiTheme', next);
}
// Restore theme
(function(){ const t = localStorage.getItem('aiTheme'); if(t) { document.documentElement.setAttribute('data-theme',t); }})();

// ===== FEATURE 5: FAVORITES =====
function toggleFavorite(catId, idx) {
  const key = `${catId}_${idx}`;
  const i = favorites.indexOf(key);
  if (i > -1) favorites.splice(i, 1); else favorites.push(key);
  localStorage.setItem('aiFavs', JSON.stringify(favorites));
  const star = document.querySelector(`[data-fav="${key}"]`);
  if (star) star.classList.toggle('active', favorites.includes(key));
}
function toggleFavorites() {
  const panel = document.getElementById('favPanel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) renderFavList();
}
function renderFavList() {
  const list = document.getElementById('favList');
  if (favorites.length === 0) { list.innerHTML = '<div class="fav-empty">No favorites yet.<br>Click ⭐ on any tool to add it.</div>'; return; }
  list.innerHTML = favorites.map(key => {
    const [catId, idx] = key.split('_');
    const tool = TOOLS[catId]?.[parseInt(idx)];
    if (!tool) return '';
    const cat = CATEGORIES.find(c => c.id === catId);
    return `<div class="fav-item"><div class="fav-info"><h4>${tool.icon} ${tool.name}</h4><p>${cat?.label || ''}</p></div>
      <button class="fav-remove" onclick="toggleFavorite('${catId}',${idx});renderFavList()">✕</button></div>`;
  }).join('');
}

// ===== FEATURE 6: TIMELINE =====
function renderTimeline() {
  const phases = [
    { phase:"WEEK 1-2", label:"Foundation", color:"#00D4AA",
      desc:"Setup core development tools, establish design system",
      tools:["Figma AI","GitHub Copilot","Cursor AI","ClickUp"] },
    { phase:"WEEK 3-4", label:"Communication", color:"#FF8C42",
      desc:"Deploy meeting and email tools across teams",
      tools:["Fireflies.ai","ChatGPT","Claude","tl;dv"] },
    { phase:"MONTH 2", label:"Development Boost", color:"#38BDF8",
      desc:"Frontend generation, backend AI, advanced coding",
      tools:["Vercel v0","Windsurf","Replit Agent"] },
    { phase:"MONTH 2-3", label:"Knowledge & Docs", color:"#8B5CF6",
      desc:"Company brain setup, documentation system, presentations",
      tools:["NotebookLM","Gamma AI","Canva AI"] },
    { phase:"MONTH 3", label:"Prototyping Layer", color:"#FBBF24",
      desc:"Rapid prototyping tools, MVP validation workflows",
      tools:["Uizard","Lovable","Framer"] },
    { phase:"MONTH 4+", label:"Optimization", color:"#4ADE80",
      desc:"Review ROI, optimize tool usage, scale successful workflows",
      tools:["All tools reviewed","Adjust licenses","Training completion"] }
  ];
  
  const container = document.getElementById('timelineContainer') || document.getElementById('implTimelineContent');
  if (!container) return;

  container.innerHTML = `<div class="timeline">${phases.map(p =>
    `<div class="timeline-item" style="--tl-color:${p.color}">
      <div class="tl-phase" style="background:${p.color}20;color:${p.color}">${p.phase} — ${p.label}</div>
      <h4>${p.label}</h4>
      <p class="tl-desc">${p.desc}</p>
      <div class="tl-tools">${p.tools.map(t => `<span class="tl-tool">${t}</span>`).join('')}</div>
    </div>`).join('')}</div>`;
}

// ===== FEATURE 7: ROLE FILTER =====
const ROLE_MAP = {
  cto: { label:"🧑‍💼 CTO / Management View", tools:["Claude","Figma AI","ClickUp","Fireflies.ai","NotebookLM","Gamma AI","Canva AI","ChatGPT"] },
  developer: { label:"👨‍💻 Developer View", tools:["Cursor AI","GitHub Copilot","Vercel v0","Windsurf","Claude","Replit Agent","ChatGPT","Lovable"] },
  engineer: { label:"👷 Field Engineer View", tools:["NotebookLM","ClickUp","Fireflies.ai","Uizard","Canva","ChatGPT"] },
  designer: { label:"🎨 Designer View", tools:["Figma AI","Uizard","Framer AI","Canva","Canva AI","Gamma AI"] }
};
function filterByRole(role) {
  const container = document.getElementById('roleFilterResults');
  if (role === 'all') { container.style.display = 'none'; return; }
  const rm = ROLE_MAP[role];
  if (!rm) return;
  let matchedTools = [];
  Object.keys(TOOLS).forEach(catId => {
    const cat = CATEGORIES.find(c => c.id === catId);
    TOOLS[catId].forEach((tool, idx) => {
      if (rm.tools.some(t => tool.name.includes(t))) matchedTools.push({ tool, catId, idx, catLabel: cat.label, catColor: cat.color });
    });
  });
  container.style.display = 'block';
  container.innerHTML = `<h2 class="section-title"><span class="accent-bar"></span>${rm.label}</h2>
    <p class="section-desc">Showing ${matchedTools.length} tools relevant to this role</p>
    <div class="cards-grid three-col">${matchedTools.map(m =>
      `<div class="product-card" style="--accent:${m.catColor};cursor:pointer" onclick="toggleCategory('${m.catId}');setTimeout(()=>showTool('${m.catId}',${m.idx}),300)">
        <div class="card-top"></div>
        <h3>${m.tool.icon} ${m.tool.name}</h3>
        <p style="font-size:0.8rem;color:var(--teal);margin-bottom:0.3rem">${m.catLabel}</p>
        <p>${m.tool.role}</p>
      </div>`).join('')}
    </div>`;
  container.scrollIntoView({ behavior: 'smooth' });
}

// ===== FEATURE: BUDGET CALCULATOR =====
function calcBudget(size) {
  size = parseInt(size);
  document.getElementById('teamSizeVal').textContent = size;
  const tools = [
    {name:'Figma Pro',rate:12},{name:'Cursor Pro',rate:20},{name:'Vercel v0',rate:7},
    {name:'Fireflies Pro',rate:10},{name:'ClickUp',rate:7},{name:'Gamma+Canva',rate:6},
    {name:'ChatGPT+Claude',rate:4},{name:'NotebookLM',rate:7}
  ];
  let total = 0;
  let html = tools.map(t => {
    const cost = t.rate * size;total += cost;
    return `<div class="calc-row"><span class="cr-label">${t.name} ($${t.rate}/user)</span><span class="cr-val">$${cost.toLocaleString()}/mo</span></div>`;
  }).join('');
  html += `<div class="calc-total"><p style="color:var(--gray);margin-bottom:0.3rem">Estimated Monthly Total</p><div class="ct-num">$${total.toLocaleString()}/mo</div><p style="color:var(--mid);font-size:0.85rem;margin-top:0.3rem">Yearly: $${(total*12).toLocaleString()} | Per user: $${(total/size).toFixed(0)}/mo</p></div>`;
  document.getElementById('calcResults').innerHTML = html;
}

// ===== FEATURE: ROI CALCULATOR =====
function calcROI() {
  const salary = parseInt(document.getElementById('roiSalary').value)||60000;
  const devs = parseInt(document.getElementById('roiDevs').value)||10;
  const boost = parseInt(document.getElementById('roiBoost').value)||50;
  const totalSalary = salary * devs;
  const savedValue = totalSalary * (boost/100);
  const toolCost = 73 * 30 * 12; // approx $73/user/mo * 30 users * 12 months
  const roi = ((savedValue - toolCost) / toolCost * 100).toFixed(0);
  const netSavings = savedValue - toolCost;
  document.getElementById('roiResults').innerHTML = `
    <div class="calc-row"><span class="cr-label">Total Dev Salary Cost</span><span class="cr-val">$${totalSalary.toLocaleString()}/year</span></div>
    <div class="calc-row"><span class="cr-label">Productivity Value Gained (${boost}%)</span><span class="cr-val">$${savedValue.toLocaleString()}/year</span></div>
    <div class="calc-row"><span class="cr-label">AI Tool Investment</span><span class="cr-val">$${toolCost.toLocaleString()}/year</span></div>
    <div class="calc-row"><span class="cr-label">Net Savings</span><span class="cr-val" style="color:${netSavings>0?'#4ADE80':'#FF4D6A'}">$${netSavings.toLocaleString()}/year</span></div>
    <div class="calc-total"><p style="color:var(--gray);margin-bottom:0.3rem">Return on Investment</p><div class="ct-num">${roi}% ROI</div>
    <p style="color:var(--mid);font-size:0.85rem;margin-top:0.3rem">Equivalent to saving ${(boost/100*devs).toFixed(1)} FTE salaries per year</p></div>`;
}

// ===== FEATURE: TOOL COMPARISON =====
function initCompare() {
  let allTools = [];
  Object.keys(TOOLS).forEach(catId => {
    const cat = CATEGORIES.find(c=>c.id===catId);
    TOOLS[catId].forEach((t,i) => allTools.push({catId,idx:i,name:t.name,catLabel:cat.label,tool:t}));
  });
  const opts = '<option value="">Select tool...</option>' + allTools.map((t,i) => `<option value="${i}">${t.name} (${t.catLabel})</option>`).join('');
  document.getElementById('compareSelectors').innerHTML = `
    <select id="cmp1" onchange="runCompare()">${opts}</select>
    <select id="cmp2" onchange="runCompare()">${opts}</select>
    <select id="cmp3" onchange="runCompare()">${opts}</select>`;
  window._allToolsFlat = allTools;
}
function runCompare() {
  const idxs = [document.getElementById('cmp1').value,document.getElementById('cmp2').value,document.getElementById('cmp3').value].filter(v=>v!=='').map(Number);
  if (idxs.length < 2) { document.getElementById('compareResult').innerHTML='<p style="color:var(--mid);padding:1rem">Select at least 2 tools to compare</p>'; return; }
  const tools = idxs.map(i => window._allToolsFlat[i]);
  const factors = ['Role','Pricing','Advantages','Limitations','Website'];
  let html = `<table class="comp-table"><thead><tr><th>Factor</th>${tools.map(t=>`<th>${t.tool.icon} ${t.name}</th>`).join('')}</tr></thead><tbody>`;
  factors.forEach(f => {
    html += '<tr><td><strong>'+f+'</strong></td>';
    tools.forEach(t => {
      let val = '';
      if(f==='Role') val=t.tool.role;
      else if(f==='Pricing') val=t.tool.pricing;
      else if(f==='Advantages') val=t.tool.advantages.map(a=>'✅ '+a).join('<br>');
      else if(f==='Limitations') val=t.tool.limitations.map(l=>'⚠️ '+l).join('<br>');
      else if(f==='Website') val=t.tool.url?`<a href="${t.tool.url}" target="_blank" style="color:var(--teal)">${t.tool.url}</a>`:'—';
      html += `<td style="font-size:0.82rem">${val}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  document.getElementById('compareResult').innerHTML = html;
}

// ===== FEATURE: DECISION MATRIX =====
const MATRIX_FACTORS = [
  {id:'cost',label:'💰 Cost',default:8},
  {id:'ease',label:'📱 Ease of Use',default:7},
  {id:'scale',label:'📈 Scalability',default:9},
  {id:'hindi',label:'🇮🇳 Hindi Support',default:8},
  {id:'integration',label:'🔗 Integration',default:7}
];
const MATRIX_TOOLS = [
  {name:'ClickUp',scores:{cost:9,ease:7,scale:9,hindi:5,integration:9}},
  {name:'Figma AI',scores:{cost:7,ease:8,scale:9,hindi:3,integration:8}},
  {name:'Cursor AI',scores:{cost:7,ease:6,scale:9,hindi:3,integration:8}},
  {name:'Fireflies',scores:{cost:8,ease:9,scale:8,hindi:9,integration:9}},
  {name:'NotebookLM',scores:{cost:9,ease:9,scale:7,hindi:10,integration:6}},
  {name:'ChatGPT',scores:{cost:8,ease:10,scale:8,hindi:8,integration:7}},
  {name:'Vercel v0',scores:{cost:7,ease:8,scale:9,hindi:3,integration:8}}
];
function initMatrix() {
  document.getElementById('matrixWeights').innerHTML = MATRIX_FACTORS.map(f =>
    `<div class="matrix-row"><label>${f.label}</label>
      <input type="range" min="1" max="10" value="${f.default}" id="mw_${f.id}" oninput="document.getElementById('mwv_${f.id}').textContent=this.value;calcMatrix()">
      <span class="mw-val" id="mwv_${f.id}">${f.default}</span></div>`
  ).join('');
  calcMatrix();
}
function calcMatrix() {
  const weights = {};
  MATRIX_FACTORS.forEach(f => weights[f.id] = parseInt(document.getElementById('mw_'+f.id).value));
  const totalWeight = Object.values(weights).reduce((a,b)=>a+b,0);
  let results = MATRIX_TOOLS.map(t => {
    let score = 0;
    MATRIX_FACTORS.forEach(f => score += (t.scores[f.id]||0) * weights[f.id]);
    return { name:t.name, score: (score/totalWeight).toFixed(1), raw:score };
  }).sort((a,b)=>b.raw-a.raw);
  const maxScore = results[0].raw;
  document.getElementById('matrixResults').innerHTML = `<h4 style="color:var(--white);margin:1.5rem 0 1rem">Ranked Results:</h4>` +
    results.map((r,i) => `<div class="matrix-result-bar">
      <span class="mr-name">${i===0?'🏆 ':''}${r.name}</span>
      <div class="mr-bar" style="width:${(r.raw/maxScore*300)}px;background:${i===0?'#4ADE80':i===1?'#00D4AA':'var(--teal)'}"></div>
      <span class="mr-score">${r.score}</span>
    </div>`).join('');
}

// ===== FEATURE: ENHANCED VOTING WITH REAL-TIME SYNC =====
let votes = JSON.parse(localStorage.getItem('aiVotes') || '{}');
let voterName = localStorage.getItem('aiVoterName') || '';
let wsConnection = null;
let isLiveMode = false;

// ---- WebSocket Connection ----
function connectWebSocket() {
  try {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${location.host}`;
    wsConnection = new WebSocket(wsUrl);

    wsConnection.onopen = () => {
      isLiveMode = true;
      console.log('🔗 WebSocket connected — Real-time voting active!');
      updateConnectionStatus(true);
      // Send join message if name is set
      if (voterName) {
        wsConnection.send(JSON.stringify({ type: 'join', name: voterName }));
      }
    };

    wsConnection.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case 'init':
            votes = msg.votes;
            localStorage.setItem('aiVotes', JSON.stringify(votes));
            updateOnlineUsers(msg.onlineCount, msg.onlineUsers);
            renderVotingGrid();
            break;
          case 'vote_update':
            votes = msg.votes;
            localStorage.setItem('aiVotes', JSON.stringify(votes));
            renderVotingGrid();
            if (msg.voter !== voterName) {
              showVoteToast(`🔔 ${msg.voter} ne ${msg.tool} ko ${msg.action === 'added' ? 'vote kiya!' : 'unvote kiya'}`, msg.action === 'added' ? 'var(--teal)' : 'var(--yellow)');
            }
            break;
          case 'user_joined':
            updateOnlineUsers(msg.onlineCount, msg.onlineUsers);
            if (msg.name !== voterName) {
              showVoteToast(`👋 ${msg.name} joined the dashboard`, 'var(--blue)');
            }
            break;
          case 'user_left':
            updateOnlineUsers(msg.onlineCount, msg.onlineUsers);
            break;
          case 'online_count':
            updateOnlineUsers(msg.count, msg.users);
            break;
        }
      } catch (e) { console.error('WS message parse error:', e); }
    };

    wsConnection.onclose = () => {
      isLiveMode = false;
      console.log('❌ WebSocket disconnected — falling back to local mode');
      updateConnectionStatus(false);
      // Reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    wsConnection.onerror = () => {
      isLiveMode = false;
      updateConnectionStatus(false);
    };
  } catch (e) {
    isLiveMode = false;
    console.log('ℹ️ WebSocket not available — using local storage mode');
  }
}

function updateConnectionStatus(connected) {
  const statusEl = document.getElementById('liveStatus');
  if (statusEl) {
    statusEl.innerHTML = connected
      ? '<span style="color:#4ADE80">🟢 LIVE — Real-time sync active</span>'
      : '<span style="color:var(--dim)">⚫ Offline — Local mode (start server for live sync)</span>';
  }
}

function updateOnlineUsers(count, users) {
  const el = document.getElementById('onlineUsers');
  if (el) {
    el.innerHTML = `<span style="color:var(--teal);font-weight:700">👥 ${count} online</span>` +
      (users && users.length ? ` — ${users.join(', ')}` : '');
  }
}

function saveVoterName(name) {
  voterName = name.trim();
  localStorage.setItem('aiVoterName', voterName);
  const status = document.getElementById('voterStatus');
  if (status) {
    status.textContent = voterName ? `✅ Voting as "${voterName}"` : '';
    status.style.color = voterName ? 'var(--teal)' : 'var(--dim)';
  }
  // Notify server
  if (isLiveMode && wsConnection && wsConnection.readyState === WebSocket.OPEN && voterName) {
    wsConnection.send(JSON.stringify({ type: 'join', name: voterName }));
  }
}

function initVoting() {
  // Restore voter name
  const nameInput = document.getElementById('voterName');
  if (nameInput && voterName) {
    nameInput.value = voterName;
    saveVoterName(voterName);
  }
  renderVotingGrid();
  // Try to connect WebSocket
  connectWebSocket();
}

function renderVotingGrid() {
  const topTools = ['Figma AI','Cursor AI','Vercel v0','Fireflies.ai','ClickUp','NotebookLM','ChatGPT','Claude','Gamma AI','GitHub Copilot'];
  const el = document.getElementById('votingGrid');
  if (!el) return;

  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
      <div id="liveStatus" style="font-size:0.82rem"></div>
      <div id="onlineUsers" style="font-size:0.82rem;color:var(--gray)"></div>
    </div>
    <div class="vote-grid">${topTools.map(name => {
    const votersList = votes['_voters_' + name] || [];
    const count = votersList.length;
    const currentUserVoted = voterName && votersList.some(v => v.name === voterName);

    return `<div class="vote-card">
      <h4>${name}</h4>
      <div class="vote-count">${count}</div>
      <button class="vote-btn ${currentUserVoted ? 'voted' : ''}" 
        onclick="castVote('${name}', this)">
        ${currentUserVoted ? '✅ Voted' : '👍 Vote'}
      </button>
      <div class="voter-tags">
        ${votersList.map(v => `<span class="voter-tag">
          👤 ${v.name}
          <span class="vt-remove" onclick="event.stopPropagation();removeVote('${name}','${v.name}')" title="Remove vote">✕</span>
        </span>`).join('')}
      </div>
      ${votersList.length > 0 ? `<div class="vote-time">Last: ${votersList[votersList.length-1].time || ''}</div>` : ''}
    </div>`;
  }).join('')}</div>`;

  // Update status
  updateConnectionStatus(isLiveMode);
}

function castVote(toolName, btn) {
  if (!voterName) {
    showVoteToast('⚠️ Pehle apna naam enter karo! 👆', 'var(--red)');
    document.getElementById('voterName')?.focus();
    return;
  }

  if (isLiveMode && wsConnection && wsConnection.readyState === WebSocket.OPEN) {
    // LIVE MODE: Send to server, server will broadcast to all
    wsConnection.send(JSON.stringify({ type: 'vote', tool: toolName, name: voterName }));
    
    // Optimistic local update
    const key = '_voters_' + toolName;
    if (!votes[key]) votes[key] = [];
    const existingIdx = votes[key].findIndex(v => v.name === voterName);
    if (existingIdx > -1) {
      votes[key].splice(existingIdx, 1);
      showVoteToast(`❌ ${voterName} ne ${toolName} ka vote remove kiya`, 'var(--red)');
    } else {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}) + ' ' + now.toLocaleDateString('en-IN', {day:'numeric',month:'short'});
      votes[key].push({ name: voterName, time: timeStr });
      showVoteToast(`✅ ${voterName} ne ${toolName} ko vote kiya! 🎉`, 'var(--teal)');
    }
    votes[toolName] = votes[key].length;
    renderVotingGrid();
  } else {
    // OFFLINE MODE: Local only
    const key = '_voters_' + toolName;
    if (!votes[key]) votes[key] = [];
    const existingIdx = votes[key].findIndex(v => v.name === voterName);
    if (existingIdx > -1) {
      votes[key].splice(existingIdx, 1);
      showVoteToast(`❌ ${voterName} ne ${toolName} ka vote remove kiya`, 'var(--red)');
    } else {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}) + ' ' + now.toLocaleDateString('en-IN', {day:'numeric',month:'short'});
      votes[key].push({ name: voterName, time: timeStr });
      showVoteToast(`✅ ${voterName} ne ${toolName} ko vote kiya! 🎉 (offline mode)`, 'var(--teal)');
    }
    votes[toolName] = votes[key].length;
    localStorage.setItem('aiVotes', JSON.stringify(votes));
    renderVotingGrid();
  }
}

function removeVote(toolName, targetName) {
  if (isLiveMode && wsConnection && wsConnection.readyState === WebSocket.OPEN) {
    wsConnection.send(JSON.stringify({ type: 'remove_vote', tool: toolName, targetName, name: voterName }));
  }
  // Also update locally
  const key = '_voters_' + toolName;
  if (votes[key]) {
    votes[key] = votes[key].filter(v => v.name !== targetName);
    votes[toolName] = votes[key].length;
    localStorage.setItem('aiVotes', JSON.stringify(votes));
    showVoteToast(`🗑 ${targetName} ka vote ${toolName} se remove hua`, 'var(--yellow)');
    renderVotingGrid();
  }
}

function showVoteToast(message, color) {
  const toast = document.getElementById('voteToast');
  if (!toast) return;
  toast.innerHTML = message;
  toast.style.borderColor = color;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== FEATURE: NOTES =====
function toggleNotes() {
  document.getElementById('notesPanel').classList.toggle('open');
  const area = document.getElementById('notesArea');
  area.value = localStorage.getItem('aiNotes') || '';
}
function saveNotes() { localStorage.setItem('aiNotes', document.getElementById('notesArea').value); }

// ===== FEATURE: COPY MEETING LINES =====
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent; btn.textContent = '✅ Copied!'; btn.style.color = '#4ADE80';
    setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 1500);
  });
}

// ===== FEATURE: TOOL TAGS =====
const TOOL_TAGS = {
  'Figma AI':'BEST|tag-best','ClickUp':'BEST|tag-best','Cursor AI':'BEST|tag-best',
  'Fireflies.ai':'RECOMMENDED|tag-recommended','NotebookLM':'RECOMMENDED|tag-recommended',
  'Vercel v0':'RECOMMENDED|tag-recommended','Claude':'RECOMMENDED|tag-recommended',
  'tl;dv':'FREE|tag-free','Replit Agent':'FREE TIER|tag-free',
  'Monday.com':'EXPENSIVE|tag-expensive','Otter.ai':'NOT RECOMMENDED|tag-not-rec',
  'Trello':'NOT RECOMMENDED|tag-not-rec','Jamie':'EXPENSIVE|tag-expensive'
};
function getToolTag(name) {
  const tag = TOOL_TAGS[name]; if (!tag) return '';
  const [label, cls] = tag.split('|');
  return `<span class="tool-tag ${cls}">${label}</span>`;
}

// INIT ALL NEW FEATURES ON LOAD
document.addEventListener('DOMContentLoaded', () => {
  calcBudget(30); calcROI(); initCompare(); initMatrix(); initVoting();
  renderWorkflowAuto(); renderOnboarding(); renderAutoReports();
  renderFigmaCode(); renderDesignSync(); renderAITesting();
  renderExecDashboard(); renderImplTimeline(); renderImpactSim();
  initSmartRec(); renderActionPlan();
  initMaturityAssessment(); renderIntegrationMap(); initScenarioPlanner();
  initRiskAssessment(); initAdoptionTracker(); initReadinessScorecard();
});

// ================================================================
// FEATURE: EXECUTIVE SUMMARY DASHBOARD
// ================================================================
function renderExecDashboard() {
  const el = document.getElementById('execGrid'); if (!el) return;
  const kpis = [
    { icon:'💰', label:'Monthly Investment', value:'$2,190', sub:'For 30 users across 8 tool categories', color:'#00D4AA', trend:'neutral', trendText:'Optimized budget', sparkData:[65,70,80,75,85,78,82,90,73,88,92,95] },
    { icon:'📈', label:'Estimated ROI', value:'5-10x', sub:'Based on 40-60% dev speed increase', color:'#8B5CF6', trend:'up', trendText:'+15% vs industry avg', sparkData:[30,40,50,55,60,58,65,70,72,80,85,90] },
    { icon:'⚡', label:'Dev Speed Boost', value:'+50%', sub:'AI-assisted coding with Cursor + Copilot + v0', color:'#38BDF8', trend:'up', trendText:'40-60% range', sparkData:[20,25,30,35,40,38,42,45,48,50,52,55] },
    { icon:'🧰', label:'Tools Analyzed', value:'30+', sub:'Across 8 categories for complete coverage', color:'#FF8C42', trend:'neutral', trendText:'Complete ecosystem', sparkData:[5,8,12,15,18,20,22,24,26,28,29,30] },
    { icon:'👥', label:'Team Coverage', value:'30', sub:'IT, Non-IT, and Management teams', color:'#4ADE80', trend:'up', trendText:'All roles covered', sparkData:[5,8,10,12,15,18,20,22,24,26,28,30] },
    { icon:'🕐', label:'Time Saved', value:'20+ hrs', sub:'Per week through workflow automation', color:'#FBBF24', trend:'up', trendText:'+5 hrs from meetings alone', sparkData:[3,5,7,8,10,12,14,15,16,17,19,22] },
    { icon:'🧠', label:'Knowledge Access', value:'+80%', sub:'NotebookLM: Hindi + English + 50 languages', color:'#E879F9', trend:'up', trendText:'vs scattered docs', sparkData:[10,15,20,30,35,42,50,55,62,68,75,80] },
    { icon:'🏆', label:'Competitive Edge', value:'3-5x', sub:'Faster feature delivery vs competitors', color:'#FF4D6A', trend:'up', trendText:'Leading market position', sparkData:[20,25,35,40,50,60,65,70,80,90,100,100] }
  ];

  const maxSpark = 100;
  el.innerHTML = kpis.map(k => {
    const bars = k.sparkData.map(v => `<div class="spark-bar" style="height:${(v/maxSpark)*100}%"></div>`).join('');
    return `<div class="exec-kpi" style="--kpi-color:${k.color}">
      <div class="kpi-icon">${k.icon}</div>
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>
      <div class="kpi-trend ${k.trend}">${k.trend==='up'?'↑':k.trend==='down'?'↓':'→'} ${k.trendText}</div>
      <div class="kpi-sparkline">${bars}</div>
    </div>`;
  }).join('');
}

// ================================================================
// FEATURE: IMPLEMENTATION TIMELINE TRACKER
// ================================================================
const IMPL_PHASES = [
  { id:'foundation', phase:'WEEK 1-2', label:'Foundation Setup', color:'#00D4AA',
    desc:'Setup core development tools, establish design system, onboard key users',
    tools:['Figma AI','GitHub Copilot','Cursor AI','ClickUp'],
    owner:'CTO + DevLead' },
  { id:'communication', phase:'WEEK 3-4', label:'Communication Layer', color:'#FF8C42',
    desc:'Deploy meeting and email AI tools across all teams, configure integrations',
    tools:['Fireflies.ai','ChatGPT','Claude','tl;dv'],
    owner:'IT Team' },
  { id:'devboost', phase:'MONTH 2', label:'Development Boost', color:'#38BDF8',
    desc:'Frontend generation, backend AI, advanced coding workflows activated',
    tools:['Vercel v0','Windsurf','Replit Agent'],
    owner:'DevLead' },
  { id:'knowledge', phase:'MONTH 2-3', label:'Knowledge & Docs', color:'#8B5CF6',
    desc:'Company brain setup, documentation system, presentation workflows',
    tools:['NotebookLM','Gamma AI','Canva AI'],
    owner:'All Teams' },
  { id:'prototyping', phase:'MONTH 3', label:'Prototyping Layer', color:'#FBBF24',
    desc:'Rapid prototyping tools, MVP validation workflows, design reviews',
    tools:['Uizard','Lovable','Framer'],
    owner:'Designer + PM' },
  { id:'optimization', phase:'MONTH 4+', label:'Optimization & Scale', color:'#4ADE80',
    desc:'Review ROI, optimize tool usage, scale successful workflows, training completion',
    tools:['All tools reviewed','Adjust licenses','Training'],
    owner:'CTO + Management' }
];

let implStatus = JSON.parse(localStorage.getItem('aiImplStatus') || '{}');

function renderImplTimeline() {
  const pbEl = document.getElementById('implProgressBar');
  const contentEl = document.getElementById('implTimelineContent');
  if (!pbEl || !contentEl) return;

  const statuses = ['not-started', 'in-progress', 'done'];
  const statusLabels = { 'not-started':'⬜ Not Started', 'in-progress':'🔶 In Progress', 'done':'✅ Done' };
  const doneCount = IMPL_PHASES.filter(p => (implStatus[p.id] || 'not-started') === 'done').length;
  const inProgressCount = IMPL_PHASES.filter(p => (implStatus[p.id] || 'not-started') === 'in-progress').length;
  const pct = Math.round(((doneCount + inProgressCount * 0.5) / IMPL_PHASES.length) * 100);

  pbEl.innerHTML = `<div class="impl-overall">
    <div class="impl-pct">${pct}%</div>
    <div style="flex:1">
      <div class="impl-bar-bg"><div class="impl-bar-fill" style="width:${pct}%"></div></div>
      <div class="impl-status" style="margin-top:0.4rem">${doneCount} of ${IMPL_PHASES.length} phases complete · ${inProgressCount} in progress</div>
    </div>
  </div>`;

  contentEl.innerHTML = `<div class="impl-phases">${IMPL_PHASES.map(p => {
    const st = implStatus[p.id] || 'not-started';
    return `<div class="impl-phase status-${st}" style="--ph-color:${p.color}" onclick="cyclePhaseStatus('${p.id}')">
      <div class="phase-header">
        <span class="phase-label" style="background:${p.color}20;color:${p.color}">${p.phase}</span>
        <span class="phase-status-badge ${st}">${statusLabels[st]}</span>
      </div>
      <h4>${p.label}</h4>
      <p class="phase-desc">${p.desc}</p>
      <div style="font-size:0.75rem;color:var(--mid);margin-bottom:0.5rem">👤 ${p.owner}</div>
      <div class="phase-tools">${p.tools.map(t => `<span class="ph-tool">${t}</span>`).join('')}</div>
      <div class="phase-click-hint">Click to change status →</div>
    </div>`;
  }).join('')}</div>`;
}

function cyclePhaseStatus(id) {
  const statuses = ['not-started', 'in-progress', 'done'];
  const current = implStatus[id] || 'not-started';
  const nextIdx = (statuses.indexOf(current) + 1) % statuses.length;
  implStatus[id] = statuses[nextIdx];
  localStorage.setItem('aiImplStatus', JSON.stringify(implStatus));
  renderImplTimeline();
  renderExecDashboard(); // refresh KPIs
}

// ================================================================
// FEATURE: BEFORE/AFTER IMPACT SIMULATOR
// ================================================================
function renderImpactSim() {
  const el = document.getElementById('impactSimContent'); if (!el) return;

  const scenarios = [
    { title:'🏗 Build New Safety Feature', icon:'🛡',
      metrics:[
        { label:'Design Time', before:5, after:1.5, unit:'days' },
        { label:'Frontend Dev', before:10, after:4, unit:'days' },
        { label:'Backend Dev', before:8, after:3, unit:'days' },
        { label:'Testing & QA', before:5, after:2, unit:'days' },
      ],
      costBefore: 15000, costAfter: 5500
    },
    { title:'📊 Create Blast Report', icon:'💥',
      metrics:[
        { label:'Data Collection', before:4, after:0.5, unit:'hours' },
        { label:'Report Writing', before:6, after:1, unit:'hours' },
        { label:'Design & Format', before:3, after:0.5, unit:'hours' },
        { label:'Review & Polish', before:2, after:0.5, unit:'hours' },
      ],
      costBefore: 800, costAfter: 150
    },
    { title:'👨‍🏫 Onboard New Engineer', icon:'🎓',
      metrics:[
        { label:'Doc Reading', before:40, after:4, unit:'hours' },
        { label:'Shadowing', before:20, after:2, unit:'hours' },
        { label:'System Setup', before:8, after:2, unit:'hours' },
        { label:'First Contribution', before:80, after:16, unit:'hours' },
      ],
      costBefore: 5000, costAfter: 800
    },
    { title:'📧 Handle Client Emails', icon:'📨',
      metrics:[
        { label:'Draft Time', before:25, after:5, unit:'min/email' },
        { label:'Review Cycles', before:3, after:1, unit:'rounds' },
        { label:'Response Time', before:4, after:1, unit:'hours' },
        { label:'Quality Score', before:70, after:92, unit:'%' },
      ],
      costBefore: 500, costAfter: 100
    }
  ];

  el.innerHTML = `<div class="sim-scenarios">${scenarios.map(s => {
    const maxVal = Math.max(...s.metrics.map(m => Math.max(m.before, m.after)));
    const saved = s.costBefore - s.costAfter;
    const savedPct = Math.round((saved / s.costBefore) * 100);

    return `<div class="sim-card">
      <h4>${s.title}</h4>
      <div class="sim-bars">
        ${s.metrics.map(m => {
          const bPct = (m.before / maxVal) * 100;
          const aPct = (m.after / maxVal) * 100;
          return `<div class="sim-bar-row">
            <div class="sim-bar-label"><span>${m.label}</span></div>
            <div class="sim-bar-track" style="margin-bottom:4px">
              <div class="sim-bar-fill before" style="width:${bPct}%">❌ ${m.before} ${m.unit}</div>
            </div>
            <div class="sim-bar-track">
              <div class="sim-bar-fill after" style="width:${Math.max(aPct,12)}%">✅ ${m.after} ${m.unit}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="sim-savings">
        <div class="savings-val">💰 Save $${saved.toLocaleString()} per occurrence</div>
        <div class="savings-sub">${savedPct}% cost reduction · AI tools handle the heavy lifting</div>
      </div>
    </div>`;
  }).join('')}</div>
  <div style="background:rgba(0,212,170,0.06);border:1px solid rgba(0,212,170,0.2);border-radius:12px;padding:1.5rem;margin-top:1.5rem;text-align:center">
    <h4 style="color:var(--teal);margin-bottom:0.5rem">🧠 Total Annual Impact Estimate</h4>
    <p style="font-size:1.5rem;font-weight:900;color:var(--white)">$150,000 — $300,000 saved/year</p>
    <p style="color:var(--gray);font-size:0.9rem;margin-top:0.5rem">Through faster development, automated reporting, streamlined onboarding, and AI-assisted communication</p>
  </div>`;
}

// ================================================================
// FEATURE: SMART RECOMMENDATIONS ENGINE
// ================================================================
const SMART_QUESTIONS = [
  { id:'budget', label:'💰 What is your monthly AI budget per user?',
    options:[ {text:'$0-20 (Tight)', val:'low'}, {text:'$20-50 (Moderate)', val:'mid'}, {text:'$50-100 (Flexible)', val:'high'}, {text:'$100+ (Enterprise)', val:'enterprise'} ]
  },
  { id:'teamSize', label:'👥 How big is your team?',
    options:[ {text:'5-10 people', val:'small'}, {text:'10-30 people', val:'medium'}, {text:'30-50 people', val:'large'}, {text:'50+ people', val:'enterprise'} ]
  },
  { id:'hindi', label:'🇮🇳 Do you need Hindi language support?',
    options:[ {text:'Critical (Most team speaks Hindi)', val:'critical'}, {text:'Important (Mixed team)', val:'important'}, {text:'Nice-to-have', val:'optional'}, {text:'Not needed', val:'no'} ]
  },
  { id:'techLevel', label:'🧑‍💻 What is the technical level of your team?',
    options:[ {text:'Mostly developers', val:'dev'}, {text:'Mixed IT & Non-IT', val:'mixed'}, {text:'Mostly non-technical', val:'nontech'} ]
  },
  { id:'priority', label:'🎯 What is your top priority?',
    options:[ {text:'⚡ Speed (ship faster)', val:'speed'}, {text:'🧠 Quality (better products)', val:'quality'}, {text:'💰 Cost Savings', val:'cost'}, {text:'🔗 Integration (connect everything)', val:'integration'} ]
  }
];

let smartAnswers = {};

function initSmartRec() {
  const el = document.getElementById('smartRecQuestions'); if (!el) return;
  el.innerHTML = SMART_QUESTIONS.map(q =>
    `<div class="smart-q">
      <label>${q.label}</label>
      <div class="smart-options">
        ${q.options.map(o => `<button class="smart-opt" data-qid="${q.id}" data-val="${o.val}" onclick="selectSmartOpt(this,'${q.id}','${o.val}')">${o.text}</button>`).join('')}
      </div>
    </div>`
  ).join('');
}

function selectSmartOpt(btn, qid, val) {
  document.querySelectorAll(`[data-qid="${qid}"]`).forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  smartAnswers[qid] = val;
}

function generateSmartRec() {
  const result = document.getElementById('smartRecResult');
  if (Object.keys(smartAnswers).length < 3) {
    result.innerHTML = '<p style="color:var(--red);padding:1rem;text-align:center">⚠️ Please answer at least 3 questions to get recommendations</p>';
    return;
  }

  // Build recommendation based on answers
  let stack = [];
  let totalCost = 0;
  const size = smartAnswers.teamSize === 'small' ? 10 : smartAnswers.teamSize === 'medium' ? 25 : smartAnswers.teamSize === 'large' ? 40 : 60;

  // Always recommend core tools
  stack.push({ icon:'🎨', name:'Figma AI', role:'Core UI Design', cost: Math.min(size, 15) * 12, reason:'Essential for any team doing product development' });
  stack.push({ icon:'✅', name:'ClickUp', role:'Task Management', cost: size * 7, reason:'Best cost/feature ratio for team coordination' });

  // Budget-aware recommendations
  if (smartAnswers.budget !== 'low') {
    stack.push({ icon:'⚙️', name:'Cursor AI', role:'Primary Dev IDE', cost: Math.min(size, 15) * 20, reason:'Deep codebase understanding for backend work' });
  }

  stack.push({ icon:'🤖', name:'GitHub Copilot', role:'Daily Coding', cost: Math.min(size, 20) * 10, reason:'Essential productivity boost for all developers' });

  // Hindi-aware
  if (smartAnswers.hindi === 'critical' || smartAnswers.hindi === 'important') {
    stack.push({ icon:'📋', name:'Fireflies.ai', role:'Meeting Notes (Hindi+EN)', cost: size * 10, reason:'Best Hindi support among meeting tools' });
    stack.push({ icon:'🧠', name:'NotebookLM', role:'Knowledge Base (Hindi+EN)', cost: Math.min(size, 10) * 20, reason:'Supports 50+ languages including Hindi' });
  } else {
    stack.push({ icon:'📋', name:'tl;dv', role:'Meeting Notes', cost: 0, reason:'Free and effective for English-primary teams' });
    stack.push({ icon:'🧠', name:'NotebookLM', role:'Knowledge Base', cost: Math.min(size, 5) * 20, reason:'Company brain for centralized knowledge' });
  }

  // Priority-specific
  if (smartAnswers.priority === 'speed') {
    stack.push({ icon:'🖥', name:'Vercel v0', role:'Fast UI Generation', cost: 40, reason:'60-70% faster frontend development' });
    stack.push({ icon:'⚡', name:'ChatGPT', role:'Speed Tool', cost: 20, reason:'Fastest AI for daily tasks and debugging' });
  } else if (smartAnswers.priority === 'quality') {
    stack.push({ icon:'🧠', name:'Claude', role:'Quality Thinking', cost: 20, reason:'Best reasoning for architecture and quality' });
    stack.push({ icon:'🖥', name:'Vercel v0', role:'Clean UI Generation', cost: 40, reason:'Production-ready React code output' });
  } else if (smartAnswers.priority === 'cost') {
    stack.push({ icon:'⚡', name:'ChatGPT Free', role:'Multi-purpose AI', cost: 0, reason:'Free tier covers most daily needs' });
  } else {
    stack.push({ icon:'🔗', name:'Zapier', role:'Automation', cost: 20, reason:'Connects all tools together automatically' });
    stack.push({ icon:'⚡', name:'ChatGPT', role:'Support Tool', cost: 20, reason:'Multi-purpose AI for daily work' });
  }

  // Tech level additions
  if (smartAnswers.techLevel === 'nontech') {
    stack.push({ icon:'📊', name:'Canva AI', role:'Easy Reports', cost: 13, reason:'Non-technical team can create professional content' });
  }

  totalCost = stack.reduce((sum, t) => sum + t.cost, 0);
  const roi = Math.round(((size * 5000 * 0.4) - totalCost * 12) / (totalCost * 12) * 100);

  result.innerHTML = `<div class="smart-result">
    <h3 style="color:var(--white);margin-bottom:0.5rem">🎯 Your Personalized AI Stack</h3>
    <p style="color:var(--gray);margin-bottom:1rem">Based on your answers: ${size}-person team, ${smartAnswers.priority || 'balanced'} priority</p>
    <div class="smart-stack">
      ${stack.map(t => `<div class="smart-stack-card">
        <div class="stack-icon">${t.icon}</div>
        <h4>${t.name}</h4>
        <div class="stack-role">${t.role}</div>
        <p style="font-size:0.78rem;color:var(--gray);margin-top:0.5rem">${t.reason}</p>
        <div class="stack-cost">💰 $${t.cost}/mo</div>
      </div>`).join('')}
    </div>
    <div class="smart-summary">
      <p style="color:var(--mid);font-size:0.85rem;margin-bottom:0.3rem">Estimated Monthly Investment</p>
      <div class="ss-cost">$${totalCost.toLocaleString()}/month</div>
      <p style="color:var(--gray);font-size:0.85rem;margin:0.3rem 0">$${(totalCost/size).toFixed(0)}/user · $${(totalCost*12).toLocaleString()}/year</p>
      <div class="ss-roi">${roi > 0 ? `${roi}% Estimated ROI` : 'Break-even in first quarter'}</div>
    </div>
  </div>`;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ================================================================
// FEATURE: ACTION PLAN GENERATOR
// ================================================================
let actionChecks = JSON.parse(localStorage.getItem('aiActionChecks') || '{}');

function renderActionPlan() {
  const el = document.getElementById('actionPlanContent'); if (!el) return;

  const weeks = [
    { week:'WEEK 1', label:'🏗 Foundation & Accounts', color:'#00D4AA', owner:'CTO + IT Lead',
      tasks:[
        { text:'Create Figma organization account, invite design + frontend team', link:'https://figma.com' },
        { text:'Setup Cursor AI licenses for backend developers (Pro plan)', link:'https://cursor.com' },
        { text:'Deploy GitHub Copilot for all developers ($10/user)', link:'https://github.com/features/copilot' },
        { text:'Create ClickUp workspace: Spaces for IT, Engineers, Management', link:'https://clickup.com' },
        { text:'Setup ClickUp integrations: Slack, GitHub, Email notifications' },
      ]
    },
    { week:'WEEK 2', label:'🎨 Design System Setup', color:'#8B5CF6', owner:'Designer + Frontend Lead',
      tasks:[
        { text:'Create Figma component library: Buttons, Cards, Forms, Tables, Charts' },
        { text:'Define design tokens: Colors, Spacing, Typography, Breakpoints' },
        { text:'Setup Figma Dev Mode and share with frontend team' },
        { text:'Create Vercel v0 account, test UI generation with your design tokens', link:'https://v0.dev' },
        { text:'Document design-to-code pipeline for the team' },
      ]
    },
    { week:'WEEK 3', label:'📋 Communication Layer', color:'#FF8C42', owner:'IT Team + All Managers',
      tasks:[
        { text:'Setup Fireflies.ai account, configure Hindi+English support', link:'https://fireflies.ai' },
        { text:'Run 3 test meetings with Fireflies → verify transcription quality' },
        { text:'Configure Fireflies → ClickUp integration (auto-create tasks from meetings)' },
        { text:'Setup ChatGPT Plus accounts for daily email users', link:'https://chat.openai.com' },
        { text:'Setup Claude account for CTO / architects / critical communication', link:'https://claude.ai' },
      ]
    },
    { week:'WEEK 4', label:'🧠 Knowledge System', color:'#E879F9', owner:'All Teams',
      tasks:[
        { text:'Create NotebookLM notebooks: "Blast System", "Safety", "Drone", "Architecture"', link:'https://notebooklm.google.com' },
        { text:'Upload all existing SOPs, API docs, safety protocols to NotebookLM' },
        { text:'Test Hindi queries: "Yeh system kaise kaam karta hai?"' },
        { text:'Setup Gamma AI for presentation generation', link:'https://gamma.app' },
        { text:'Create onboarding notebook for new employees' },
      ]
    },
    { week:'MONTH 2', label:'⚡ Advanced Workflows', color:'#38BDF8', owner:'DevLead + PM',
      tasks:[
        { text:'Train devs on Cursor AI multi-file editing and repo-wide code generation' },
        { text:'Setup Vercel v0 → Figma → Code pipeline for frontend team' },
        { text:'Configure Zapier/Make automations: Meeting→Tasks→Notifications', link:'https://zapier.com' },
        { text:'Run first auto-generated weekly sprint report using Claude + ClickUp' },
        { text:'Measure and document: tasks completed, time saved, bugs reduced' },
      ]
    },
    { week:'MONTH 3-4', label:'📊 Review & Optimize', color:'#4ADE80', owner:'CTO + Management',
      tasks:[
        { text:'Review tool usage analytics: which tools are actually being used?' },
        { text:'Calculate actual ROI: hours saved × hourly cost vs tool investment' },
        { text:'Collect team feedback survey: what works, what doesn\'t, what\'s missing?' },
        { text:'Adjust licenses: remove unused tools, upgrade heavily-used ones' },
        { text:'Create "AI Tool Best Practices" guide for the company' },
        { text:'Present results to management: Before/After metrics, ROI, next steps' },
      ]
    }
  ];

  el.innerHTML = `<div class="action-weeks">${weeks.map((w, wi) =>
    `<div class="action-week" style="--aw-color:${w.color}">
      <div class="action-week-header">
        <span class="aw-badge" style="background:${w.color}">${w.week}</span>
        <h4>${w.label}</h4>
        <span class="aw-owner">👤 ${w.owner}</span>
      </div>
      <div class="action-week-body">
        ${w.tasks.map((t, ti) => {
          const key = `${wi}_${ti}`;
          const checked = actionChecks[key] || false;
          return `<div class="action-task">
            <div class="at-check ${checked?'checked':''}" onclick="toggleActionCheck('${key}',this)">
              ${checked ? '✓' : ''}
            </div>
            <span class="at-text ${checked?'checked-text':''}">${t.text}</span>
            ${t.link ? `<a href="${t.link}" target="_blank" class="at-link">🔗 Open</a>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`
  ).join('')}</div>`;
}

function toggleActionCheck(key, el) {
  actionChecks[key] = !actionChecks[key];
  localStorage.setItem('aiActionChecks', JSON.stringify(actionChecks));
  el.classList.toggle('checked');
  el.innerHTML = actionChecks[key] ? '✓' : '';
  const textEl = el.nextElementSibling;
  if (textEl) textEl.classList.toggle('checked-text');
}

function exportActionPlan() {
  const weeks = document.querySelectorAll('.action-week');
  let html = `<!DOCTYPE html><html><head><title>AI Strategy - Action Plan</title>
  <style>body{font-family:Arial,sans-serif;max-width:900px;margin:0 auto;padding:2rem;background:#fff;color:#333}
  h1{color:#1a1a2e;border-bottom:3px solid #00D4AA;padding-bottom:0.5rem}
  h2{color:#00D4AA;margin-top:2rem}.week{margin:1.5rem 0;page-break-inside:avoid}
  .task{padding:6px 0;border-bottom:1px solid #eee;font-size:0.9rem}
  .owner{font-size:0.8rem;color:#888;margin-bottom:0.5rem}
  .checked{text-decoration:line-through;color:#aaa}</style></head><body>
  <h1>AI Transformation — Action Plan</h1>
  <p>Generated: ${new Date().toLocaleDateString()} · Mining SaaS Company</p>`;

  const weekData = [
    { week:'WEEK 1', label:'Foundation & Accounts' },
    { week:'WEEK 2', label:'Design System Setup' },
    { week:'WEEK 3', label:'Communication Layer' },
    { week:'WEEK 4', label:'Knowledge System' },
    { week:'MONTH 2', label:'Advanced Workflows' },
    { week:'MONTH 3-4', label:'Review & Optimize' }
  ];

  weeks.forEach((w, i) => {
    const tasks = w.querySelectorAll('.action-task');
    html += `<div class="week"><h2>${weekData[i]?.week} — ${weekData[i]?.label}</h2>`;
    tasks.forEach(t => {
      const text = t.querySelector('.at-text');
      const isChecked = t.querySelector('.at-check')?.classList.contains('checked');
      html += `<div class="task ${isChecked?'checked':''}">${isChecked?'✅':'☐'} ${text?.textContent || ''}</div>`;
    });
    html += `</div>`;
  });

  html += `</body></html>`;
  const blob = new Blob([html], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'AI_Strategy_Action_Plan.html';
  a.click();
  alert('📥 Action Plan exported! Open the file and Print → Save as PDF for best results.');
}


// ===== SECTION: WORKFLOW AUTOMATION =====
function renderWorkflowAuto() {
  const el = document.getElementById('workflowAutoContent'); if(!el) return;
  const flows = [
    {trigger:'📋 Meeting Ends (Fireflies)', actions:['Fireflies extracts action items','Zapier creates ClickUp tasks','Slack notifies assigned team members','Email summary sent to management'], time:'10+ hrs/week saved', color:'#FF8C42'},
    {trigger:'🐛 Bug Reported (ClickUp)', actions:['ClickUp triggers Zapier','Slack alerts dev team channel','Jira ticket auto-created (if using)','Priority label auto-assigned'], time:'3-4 hrs/week saved', color:'#FF4D6A'},
    {trigger:'📧 Client Email (Gmail)', actions:['ChatGPT drafts reply suggestion','Notification sent to account manager','ClickUp task created for follow-up','CRM updated automatically'], time:'5+ hrs/week saved', color:'#38BDF8'},
    {trigger:'🚀 Code Deployed (GitHub)', actions:['Slack notifies QA team','ClickUp status updated to "Testing"','Release notes auto-generated (Claude)','Client notification email queued'], time:'2-3 hrs/week saved', color:'#4ADE80'}
  ];
  el.innerHTML = `
    <div class="cards-grid two-col">${flows.map(f => `
      <div class="product-card" style="--accent:${f.color}"><div class="card-top"></div>
        <h3>${f.trigger}</h3>
        ${f.actions.map((a,i) => `<p style="font-size:0.85rem;color:var(--gray);margin:0.3rem 0">${i+1}. ${a}</p>`).join('')}
        <p style="color:var(--teal);font-weight:700;margin-top:0.8rem">⏱ ${f.time}</p>
      </div>`).join('')}
    </div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-top:1.5rem">
      <h4 style="color:var(--teal);margin-bottom:1rem">🛠 Recommended Tools</h4>
      <div class="cards-grid three-col">
        <div class="user-card" style="border-color:#FF8C42"><h3>Zapier</h3><p>$19.99/mo — 750 tasks/mo. Best for simple automations. No-code.</p><p style="color:var(--teal)">🔗 zapier.com</p></div>
        <div class="user-card" style="border-color:#4ADE80"><h3>n8n (Self-hosted)</h3><p>FREE — Unlimited. Best for complex workflows. Needs dev setup.</p><p style="color:var(--teal)">🔗 n8n.io</p></div>
        <div class="user-card" style="border-color:#8B5CF6"><h3>Make.com</h3><p>$9/mo — 10K ops. Best balance of power + ease.</p><p style="color:var(--teal)">🔗 make.com</p></div>
      </div>
    </div>
    <div style="background:rgba(0,212,170,0.06);border:1px solid rgba(0,212,170,0.2);border-radius:12px;padding:1.2rem;margin-top:1rem">
      <h4 style="color:var(--teal)">🧠 Business Impact</h4>
      <p style="color:var(--gray);font-size:0.9rem">⏱ 20+ hours/week saved across team | 📋 Zero missed tasks from meetings | 📧 50% faster client responses | 🔄 100% automated handoffs between teams</p>
    </div>`;
}

// ===== SECTION: AI ONBOARDING =====
function renderOnboarding() {
  const el = document.getElementById('onboardingContent'); if(!el) return;
  const steps = [
    {step:'1', title:'Upload All Company Docs', desc:'SOPs, API docs, Architecture diagrams, Safety protocols, Blast procedures → Upload to NotebookLM', icon:'📤', color:'#8B5CF6'},
    {step:'2', title:'Create Role-Based Notebooks', desc:'"Backend Developer Onboarding", "Field Engineer Training", "Management Overview" — separate notebooks per role', icon:'📚', color:'#00D4AA'},
    {step:'3', title:'New Employee Interacts', desc:'Day 1: Ask NotebookLM "Explain blast system architecture", "What are safety protocols?", "How does drone data flow?" — in Hindi OR English', icon:'💬', color:'#38BDF8'},
    {step:'4', title:'Audio Summaries', desc:'NotebookLM generates podcast-style audio explanations. New hire can LISTEN while commuting/traveling to mine site', icon:'🎧', color:'#FF8C42'},
    {step:'5', title:'Verify Understanding', desc:'Create quiz questions in NotebookLM. New hire answers → immediate feedback. Manager reviews progress in ClickUp', icon:'✅', color:'#4ADE80'}
  ];
  el.innerHTML = `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.5rem">
      ${steps.map(s => `<div style="display:flex;gap:1rem;align-items:flex-start;margin-bottom:1.5rem">
        <div style="background:${s.color};color:var(--bg);font-weight:800;font-size:0.8rem;padding:6px 12px;border-radius:8px;white-space:nowrap">STEP ${s.step}</div>
        <div><h4 style="color:var(--white);margin-bottom:0.3rem">${s.icon} ${s.title}</h4>
        <p style="font-size:0.85rem;color:var(--gray)">${s.desc}</p></div>
      </div>`).join('')}
    </div>
    <div class="cards-grid two-col" style="margin-top:1.5rem">
      <div class="total-card green"><h3>⏱ Before AI Onboarding</h3><p class="big-num">2-4 Weeks</p><p>Reading docs, shadowing, asking questions repeatedly</p></div>
      <div class="total-card purple"><h3>⚡ After AI Onboarding</h3><p class="big-num">2-4 Hours</p><p>Interactive Q&A with NotebookLM + audio summaries</p></div>
    </div>
    <div style="background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:1.2rem;margin-top:1rem">
      <h4 style="color:var(--purple)">🎯 Meeting-Ready Line <button class="copy-btn" onclick="copyText('NotebookLM should be our primary onboarding tool. New engineers can learn our entire blast system, safety protocols, and architecture in hours instead of weeks, in both Hindi and English.', this)">📋 Copy</button></h4>
      <p style="color:var(--teal);font-style:italic;font-size:0.9rem">"NotebookLM should be our primary onboarding tool. New engineers can learn our entire blast system, safety protocols, and architecture in hours instead of weeks, in both Hindi and English."</p>
    </div>`;
}

// ===== SECTION: AUTO REPORTS =====
function renderAutoReports() {
  const el = document.getElementById('reportsContent'); if(!el) return;
  const reports = [
    {name:'📊 Weekly Sprint Report', source:'ClickUp API', processor:'Claude AI', output:'PDF/Email summary', freq:'Every Friday', desc:'Tasks completed, blockers, velocity, next sprint goals'},
    {name:'💥 Blast Performance Report', source:'Blast Database', processor:'NotebookLM + Claude', output:'Dashboard + PDF', freq:'After each blast', desc:'Blast parameters, results, safety compliance, improvement suggestions'},
    {name:'🛰 Drone Analytics Report', source:'Drone Data Pipeline', processor:'Claude AI', output:'Visual PDF', freq:'Weekly', desc:'Survey coverage, volume calculations, site changes, anomaly detection'},
    {name:'🛡 Safety Compliance Report', source:'Safety Platform', processor:'NotebookLM', output:'Management PDF', freq:'Monthly', desc:'Incident log, compliance scores, training status, risk areas'},
    {name:'💰 Cost & Resource Report', source:'ClickUp + Finance', processor:'ChatGPT', output:'Email to C-suite', freq:'Monthly', desc:'Tool costs, team utilization, productivity metrics, ROI tracking'}
  ];
  el.innerHTML = `
    <div class="cost-table-wrap"><table class="comp-table"><thead><tr><th>Report</th><th>Data Source</th><th>AI Processor</th><th>Output</th><th>Frequency</th></tr></thead><tbody>
      ${reports.map(r => `<tr><td><strong>${r.name}</strong><br><span style="font-size:0.75rem;color:var(--mid)">${r.desc}</span></td><td>${r.source}</td><td>${r.processor}</td><td>${r.output}</td><td>${r.freq}</td></tr>`).join('')}
    </tbody></table></div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-top:1.5rem">
      <h4 style="color:var(--teal);margin-bottom:1rem">🔄 How It Works</h4>
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:1rem;text-align:center;min-width:150px"><div style="font-size:1.2rem">📊</div><strong>Data Source</strong><p style="font-size:0.8rem;color:var(--mid)">ClickUp, Database</p></div>
        <span style="font-size:1.2rem;color:var(--dim)">→</span>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:1rem;text-align:center;min-width:150px"><div style="font-size:1.2rem">🤖</div><strong>AI Processing</strong><p style="font-size:0.8rem;color:var(--mid)">Claude / NotebookLM</p></div>
        <span style="font-size:1.2rem;color:var(--dim)">→</span>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:1rem;text-align:center;min-width:150px"><div style="font-size:1.2rem">📄</div><strong>Auto Report</strong><p style="font-size:0.8rem;color:var(--mid)">PDF / Dashboard</p></div>
        <span style="font-size:1.2rem;color:var(--dim)">→</span>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:1rem;text-align:center;min-width:150px"><div style="font-size:1.2rem">📧</div><strong>Auto Delivery</strong><p style="font-size:0.8rem;color:var(--mid)">Email / Slack</p></div>
      </div>
    </div>
    <div style="background:rgba(0,212,170,0.06);border:1px solid rgba(0,212,170,0.2);border-radius:12px;padding:1.2rem;margin-top:1rem">
      <h4 style="color:var(--teal)">🧠 Impact: 15-20 hours/week saved</h4>
      <p style="color:var(--gray);font-size:0.9rem">No one writes reports manually. Management gets insights automatically. Data-driven decisions become the norm.</p>
    </div>`;
}

// ===== SECTION: FIGMA → CODE PIPELINE =====
function renderFigmaCode() {
  const el = document.getElementById('figmaCodeContent'); if(!el) return;
  const pipeline = [
    {step:'1', title:'Design in Figma AI', desc:'Create component library: Buttons, Cards, Charts, Tables, Forms. Use Auto Layout. Define spacing, colors, typography as design tokens.', tool:'Figma AI', color:'#8B5CF6'},
    {step:'2', title:'Export with Dev Mode', desc:'Figma Dev Mode → exact CSS properties, spacing values, color codes. Developers inspect without guessing. Export design tokens as JSON.', tool:'Figma Dev Mode', color:'#00D4AA'},
    {step:'3', title:'Generate with Vercel v0', desc:'"Create a mining dashboard card with blast metrics" → v0 generates React + Tailwind. Matches Figma design system. Production-ready code.', tool:'Vercel v0', color:'#38BDF8'},
    {step:'4', title:'Refine with Copilot', desc:'Copilot auto-completes components based on patterns. Consistent code style. Faster iteration. Inline suggestions match design tokens.', tool:'GitHub Copilot', color:'#4ADE80'},
    {step:'5', title:'Review with Claude', desc:'Claude reviews component architecture. Ensures scalability. Catches anti-patterns. Suggests performance optimizations.', tool:'Claude', color:'#FF8C42'}
  ];
  el.innerHTML = `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.5rem">
      ${pipeline.map((s,i) => `<div style="display:flex;gap:1rem;align-items:flex-start;margin-bottom:${i<4?'1.5rem':'0'}">
        <div style="background:${s.color};color:var(--bg);font-weight:800;font-size:0.75rem;padding:5px 10px;border-radius:6px;white-space:nowrap">STEP ${s.step}</div>
        <div style="flex:1"><h4 style="color:var(--white);margin-bottom:0.3rem">${s.title} <span style="color:${s.color};font-size:0.8rem">(${s.tool})</span></h4>
        <p style="font-size:0.85rem;color:var(--gray)">${s.desc}</p></div>
      </div>${i<4?'<div style="border-left:2px dashed var(--border);height:12px;margin-left:28px"></div>':''}`).join('')}
    </div>
    <div class="cards-grid two-col" style="margin-top:1.5rem">
      <div class="total-card green"><h3>⏱ Without Pipeline</h3><p class="big-num">5-7 days</p><p>Design → Handoff → Dev guesses → Back-and-forth → Finally coded</p></div>
      <div class="total-card purple"><h3>⚡ With Pipeline</h3><p class="big-num">1-2 days</p><p>Design → Tokens exported → v0 generates → Copilot refines → Done</p></div>
    </div>`;
}

// ===== SECTION: DESIGN TOKEN SYNC =====
function renderDesignSync() {
  const el = document.getElementById('designSyncContent'); if(!el) return;
  const tokens = [
    {category:'🎨 Colors', examples:'Primary: #00D4AA, Danger: #FF4D6A, Warning: #FBBF24', sync:'Figma → CSS Variables → All products'},
    {category:'📏 Spacing', examples:'xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px', sync:'Figma Auto Layout → Tailwind config'},
    {category:'🔤 Typography', examples:'H1: 32px/800, Body: 16px/400, Caption: 12px/500', sync:'Figma Text Styles → CSS font classes'},
    {category:'🧱 Components', examples:'Button, Card, Input, Modal, Table, Alert, Badge', sync:'Figma Component → React Component'},
    {category:'📐 Breakpoints', examples:'Mobile: 375px, Tablet: 768px, Desktop: 1280px', sync:'Figma Frames → Media queries'},
    {category:'🌓 Themes', examples:'Dark mode, Light mode, High contrast', sync:'Figma Variables → CSS :root / [data-theme]'}
  ];
  el.innerHTML = `
    <div class="cost-table-wrap"><table class="comp-table"><thead><tr><th>Token Category</th><th>Examples</th><th>Sync Flow</th></tr></thead><tbody>
      ${tokens.map(t => `<tr><td><strong>${t.category}</strong></td><td style="font-size:0.82rem">${t.examples}</td><td style="font-size:0.82rem;color:var(--teal)">${t.sync}</td></tr>`).join('')}
    </tbody></table></div>
    <div style="background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:1.2rem;margin-top:1.5rem">
      <h4 style="color:var(--purple)">🔥 Why This Matters for 4 Products</h4>
      <p style="color:var(--gray);font-size:0.9rem">Blasting Software, Drone Analytics, Safety Platform, Digital Mine — ALL share the same buttons, colors, fonts, spacing. One change in Figma → updates across ALL products. No inconsistency. No manual CSS updates. Brand identity guaranteed.</p>
    </div>`;
}

// ===== SECTION: AI UI TESTING =====
function renderAITesting() {
  const el = document.getElementById('aiTestingContent'); if(!el) return;
  const tests = [
    {type:'🖼 Visual Regression', tool:'Chromatic + Storybook', desc:'Captures UI screenshots before/after changes. AI detects visual differences automatically. Catches: broken layouts, color shifts, font changes, spacing issues.', impact:'Zero visual bugs reach production'},
    {type:'📱 Responsive Testing', tool:'Playwright + AI', desc:'Auto-tests on Mobile, Tablet, Desktop. AI checks if elements overlap, truncate, or break. Tests field engineer mobile app on different devices.', impact:'Perfect UI on all screen sizes'},
    {type:'♿ Accessibility Testing', tool:'axe-core + Claude', desc:'Auto-checks color contrast, aria labels, keyboard navigation. Claude generates accessibility improvement suggestions. Ensures miners with safety gear can use the app.', impact:'Compliant UI, better usability'},
    {type:'⚡ Performance Testing', tool:'Lighthouse CI', desc:'Auto-runs on every deploy. Checks: load time, largest contentful paint, cumulative layout shift. AI suggests optimizations. Critical for field engineers with slow connections.', impact:'Fast UI even on mine site 3G'}
  ];
  el.innerHTML = `
    <div class="cards-grid two-col">${tests.map(t => `
      <div class="product-card" style="--accent:var(--teal)"><div class="card-top"></div>
        <h3>${t.type}</h3>
        <p style="font-size:0.8rem;color:var(--teal);margin-bottom:0.5rem">Tool: ${t.tool}</p>
        <p style="font-size:0.85rem;color:var(--gray)">${t.desc}</p>
        <p style="color:#4ADE80;font-weight:600;margin-top:0.8rem;font-size:0.85rem">✅ ${t.impact}</p>
      </div>`).join('')}
    </div>
    <div style="background:rgba(0,212,170,0.06);border:1px solid rgba(0,212,170,0.2);border-radius:12px;padding:1.2rem;margin-top:1.5rem">
      <h4 style="color:var(--teal)">🧠 Business Impact</h4>
      <p style="color:var(--gray);font-size:0.9rem">🐛 90% fewer UI bugs in production | 📱 Perfect mobile experience for field engineers | ♿ Accessibility compliance | ⚡ 50% faster page loads | 💰 80% less QA rework</p>
    </div>`;
}

// ================================================================
// FEATURE: TOOL MATURITY ASSESSMENT (RADAR/SPIDER CHART)
// ================================================================
const MATURITY_CATEGORIES = [
  { id:'ui', label:'🎨 UI/Design', icon:'🎨', defaultCurrent:2, defaultTarget:4 },
  { id:'backend', label:'⚙️ Backend Dev', icon:'⚙️', defaultCurrent:3, defaultTarget:5 },
  { id:'frontend', label:'🖥 Frontend Dev', icon:'🖥', defaultCurrent:2, defaultTarget:4 },
  { id:'meetings', label:'📋 Meetings', icon:'📋', defaultCurrent:1, defaultTarget:4 },
  { id:'tasks', label:'✅ Task Mgmt', icon:'✅', defaultCurrent:3, defaultTarget:5 },
  { id:'docs', label:'📄 Docs/PPT', icon:'📄', defaultCurrent:2, defaultTarget:4 },
  { id:'email', label:'📧 Email', icon:'📧', defaultCurrent:2, defaultTarget:4 },
  { id:'knowledge', label:'🧠 Knowledge', icon:'🧠', defaultCurrent:1, defaultTarget:5 }
];

let maturityData = JSON.parse(localStorage.getItem('aiMaturity') || 'null') || MATURITY_CATEGORIES.map(c => ({ id:c.id, current:c.defaultCurrent, target:c.defaultTarget }));

function initMaturityAssessment() {
  const ctrlEl = document.getElementById('maturityControls');
  if (!ctrlEl) return;

  ctrlEl.innerHTML = MATURITY_CATEGORIES.map((cat, i) => {
    const d = maturityData[i];
    return `<div class="maturity-row">
      <div class="maturity-row-header">
        <label>${cat.label}</label>
        <div class="mr-vals">
          <span class="current-val" id="mc_${cat.id}">${d.current}/5</span>
          <span class="target-val" id="mt_${cat.id}">${d.target}/5</span>
        </div>
      </div>
      <div class="maturity-sliders">
        <div><label>❌ Current</label><input type="range" min="0" max="5" value="${d.current}" class="current-slider" oninput="updateMaturity('${cat.id}','current',this.value)"></div>
        <div><label>✅ Target</label><input type="range" min="0" max="5" value="${d.target}" class="target-slider" oninput="updateMaturity('${cat.id}','target',this.value)"></div>
      </div>
    </div>`;
  }).join('');

  renderRadarChart();
  renderGapAnalysis();
}

function updateMaturity(id, type, val) {
  val = parseInt(val);
  const idx = maturityData.findIndex(d => d.id === id);
  if (idx === -1) return;
  maturityData[idx][type] = val;
  localStorage.setItem('aiMaturity', JSON.stringify(maturityData));
  document.getElementById(`m${type[0]}_${id}`).textContent = `${val}/5`;
  renderRadarChart();
  renderGapAnalysis();
}

function renderRadarChart() {
  const el = document.getElementById('maturityRadar'); if (!el) return;
  const cx = 180, cy = 180, maxR = 140;
  const n = MATURITY_CATEGORIES.length;
  const angleStep = (2 * Math.PI) / n;

  function getPoint(i, val) {
    const angle = angleStep * i - Math.PI / 2;
    return { x: cx + (val / 5) * maxR * Math.cos(angle), y: cy + (val / 5) * maxR * Math.sin(angle) };
  }

  // Grid lines
  let gridLines = '';
  for (let level = 1; level <= 5; level++) {
    let points = [];
    for (let i = 0; i < n; i++) points.push(getPoint(i, level));
    gridLines += `<polygon points="${points.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="#333344" stroke-width="1" opacity="0.5"/>`;
  }

  // Axis lines and labels
  let axisLines = '';
  for (let i = 0; i < n; i++) {
    const end = getPoint(i, 5);
    const labelPt = getPoint(i, 5.7);
    axisLines += `<line x1="${cx}" y1="${cy}" x2="${end.x}" y2="${end.y}" stroke="#333344" stroke-width="1" opacity="0.5"/>`;
    axisLines += `<text x="${labelPt.x}" y="${labelPt.y}" text-anchor="middle" dominant-baseline="middle" fill="#888899" font-size="11" font-weight="600">${MATURITY_CATEGORIES[i].icon}</text>`;
  }

  // Current polygon
  let currentPts = maturityData.map((d, i) => getPoint(i, d.current));
  let currentPoly = `<polygon points="${currentPts.map(p => `${p.x},${p.y}`).join(' ')}" fill="rgba(255,77,106,0.15)" stroke="#FF4D6A" stroke-width="2"/>`;
  currentPts.forEach(p => { currentPoly += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#FF4D6A"/>`; });

  // Target polygon
  let targetPts = maturityData.map((d, i) => getPoint(i, d.target));
  let targetPoly = `<polygon points="${targetPts.map(p => `${p.x},${p.y}`).join(' ')}" fill="rgba(0,212,170,0.1)" stroke="#00D4AA" stroke-width="2" stroke-dasharray="6 3"/>`;
  targetPts.forEach(p => { targetPoly += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#00D4AA"/>` });

  el.innerHTML = `<div>
    <svg viewBox="0 0 360 360" width="340" height="340">${gridLines}${axisLines}${targetPoly}${currentPoly}</svg>
    <div class="maturity-legend">
      <span><div class="leg-dot leg-current"></div>Current State</span>
      <span><div class="leg-dot leg-target"></div>Target State</span>
    </div>
  </div>`;
}

function renderGapAnalysis() {
  const el = document.getElementById('maturityGap'); if (!el) return;
  const avgCurrent = maturityData.reduce((s,d)=>s+d.current,0) / maturityData.length;
  const avgTarget = maturityData.reduce((s,d)=>s+d.target,0) / maturityData.length;
  const overallGap = avgTarget - avgCurrent;

  // Sort by biggest gap
  const sorted = maturityData.map((d,i) => ({
    label: MATURITY_CATEGORIES[i].label,
    current: d.current,
    target: d.target,
    gap: d.target - d.current
  })).sort((a,b) => b.gap - a.gap);

  el.innerHTML = `<h4>📊 Gap Analysis — Biggest investment areas first</h4>
    <div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.5rem">
      <div style="background:var(--bg2);border-radius:10px;padding:1rem;flex:1;min-width:150px;text-align:center">
        <div style="font-size:0.75rem;color:var(--dim);text-transform:uppercase">Avg Current</div>
        <div style="font-size:1.5rem;font-weight:900;color:#FF4D6A">${avgCurrent.toFixed(1)}/5</div>
      </div>
      <div style="background:var(--bg2);border-radius:10px;padding:1rem;flex:1;min-width:150px;text-align:center">
        <div style="font-size:0.75rem;color:var(--dim);text-transform:uppercase">Avg Target</div>
        <div style="font-size:1.5rem;font-weight:900;color:#00D4AA">${avgTarget.toFixed(1)}/5</div>
      </div>
      <div style="background:var(--bg2);border-radius:10px;padding:1rem;flex:1;min-width:150px;text-align:center">
        <div style="font-size:0.75rem;color:var(--dim);text-transform:uppercase">Overall Gap</div>
        <div style="font-size:1.5rem;font-weight:900;color:${overallGap>2?'var(--red)':overallGap>1?'var(--yellow)':'var(--green)'}">${overallGap.toFixed(1)}</div>
      </div>
      <div style="background:var(--bg2);border-radius:10px;padding:1rem;flex:1;min-width:150px;text-align:center">
        <div style="font-size:0.75rem;color:var(--dim);text-transform:uppercase">Priority</div>
        <div style="font-size:1.5rem;font-weight:900;color:var(--purple)">${sorted[0].label.replace(/^.{2} /,'')}</div>
      </div>
    </div>
    ${sorted.map(s => `<div class="gap-row">
      <span class="gap-label">${s.label}</span>
      <div class="gap-bar-bg">
        <div class="gap-bar-current" style="width:${(s.current/5)*100}%"></div>
        <div class="gap-bar-target" style="width:${(s.target/5)*100}%"></div>
      </div>
      <span class="gap-val ${s.gap>0?'positive':'zero'}">+${s.gap}</span>
    </div>`).join('')}`;
}

// ================================================================
// FEATURE: INTEGRATION MAP (VISUAL NODE GRAPH)
// ================================================================
const INT_NODES = [
  { id:'figma', name:'Figma AI', icon:'🎨', color:'#8B5CF6', x:0.5, y:0.12, category:'Design' },
  { id:'cursor', name:'Cursor AI', icon:'⚙️', color:'#00D4AA', x:0.15, y:0.35, category:'Dev' },
  { id:'copilot', name:'Copilot', icon:'🤖', color:'#4ADE80', x:0.3, y:0.5, category:'Dev' },
  { id:'v0', name:'Vercel v0', icon:'🖥', color:'#38BDF8', x:0.7, y:0.35, category:'Dev' },
  { id:'fireflies', name:'Fireflies', icon:'📋', color:'#FF8C42', x:0.85, y:0.5, category:'Communication' },
  { id:'clickup', name:'ClickUp', icon:'✅', color:'#4ADE80', x:0.5, y:0.55, category:'Management' },
  { id:'chatgpt', name:'ChatGPT', icon:'⚡', color:'#FBBF24', x:0.2, y:0.72, category:'AI' },
  { id:'claude', name:'Claude', icon:'🧠', color:'#FF8C42', x:0.4, y:0.82, category:'AI' },
  { id:'notebooklm', name:'NotebookLM', icon:'📚', color:'#E879F9', x:0.65, y:0.78, category:'Knowledge' },
  { id:'gamma', name:'Gamma AI', icon:'📊', color:'#8B5CF6', x:0.82, y:0.72, category:'Docs' },
  { id:'slack', name:'Slack', icon:'💬', color:'#38BDF8', x:0.12, y:0.55, category:'Communication' },
  { id:'github', name:'GitHub', icon:'🐙', color:'#FFFFFF', x:0.35, y:0.32, category:'Dev' }
];

const INT_EDGES = [
  { from:'figma', to:'v0', label:'Design tokens → UI code', flow:'data' },
  { from:'figma', to:'copilot', label:'CSS/tokens for autocomplete', flow:'data' },
  { from:'cursor', to:'github', label:'Code push/pull', flow:'bidirectional' },
  { from:'copilot', to:'github', label:'Inline suggestions from repo', flow:'data' },
  { from:'v0', to:'github', label:'Generated code → repo', flow:'data' },
  { from:'fireflies', to:'clickup', label:'Action items → tasks', flow:'automation' },
  { from:'fireflies', to:'slack', label:'Meeting summaries', flow:'notification' },
  { from:'fireflies', to:'notebooklm', label:'Meeting notes → knowledge', flow:'data' },
  { from:'clickup', to:'slack', label:'Task notifications', flow:'notification' },
  { from:'clickup', to:'github', label:'Issue tracking sync', flow:'bidirectional' },
  { from:'chatgpt', to:'clickup', label:'Draft → task description', flow:'data' },
  { from:'claude', to:'cursor', label:'Architecture → implementation', flow:'data' },
  { from:'claude', to:'notebooklm', label:'Analysis → knowledge', flow:'data' },
  { from:'claude', to:'gamma', label:'Content → presentation', flow:'data' },
  { from:'notebooklm', to:'gamma', label:'Knowledge → reports', flow:'data' },
  { from:'chatgpt', to:'slack', label:'Draft responses', flow:'data' },
  { from:'github', to:'slack', label:'Deploy notifications', flow:'notification' },
  { from:'cursor', to:'copilot', label:'IDE suggestions sync', flow:'data' }
];

let intMapHighlighted = null;

function renderIntegrationMap() {
  const wrap = document.getElementById('intmapSvgWrap'); if (!wrap) return;
  const w = 800, h = 500;

  const nodes = INT_NODES.map(n => ({ ...n, px: n.x * w, py: n.y * h }));

  // Edges
  let edgeSvg = INT_EDGES.map((e,i) => {
    const from = nodes.find(n => n.id === e.from);
    const to = nodes.find(n => n.id === e.to);
    if (!from || !to) return '';
    const color = e.flow === 'automation' ? '#FF8C42' : e.flow === 'notification' ? '#38BDF8' : '#555566';
    return `<line class="intmap-edge" id="edge_${i}" x1="${from.px}" y1="${from.py}" x2="${to.px}" y2="${to.py}" stroke="${color}" stroke-width="1.5" opacity="0.3" data-from="${e.from}" data-to="${e.to}"/>`;
  }).join('');

  // Nodes
  let nodeSvg = nodes.map(n => `<g class="intmap-node" id="node_${n.id}" onclick="highlightNode('${n.id}')" onmouseenter="showIntTooltip(event,'${n.id}')" onmouseleave="hideIntTooltip()">
    <circle class="node-circle" cx="${n.px}" cy="${n.py}" r="28" fill="${n.color}22" stroke="${n.color}" stroke-width="2"/>
    <text x="${n.px}" y="${n.py-2}" text-anchor="middle" dominant-baseline="middle" font-size="18">${n.icon}</text>
    <text x="${n.px}" y="${n.py+18}" text-anchor="middle" font-size="9" fill="#BBBBCC" font-weight="600">${n.name}</text>
  </g>`).join('');

  wrap.innerHTML = `<svg viewBox="0 0 ${w} ${h}">${edgeSvg}${nodeSvg}</svg>`;
}

function highlightNode(id) {
  if (intMapHighlighted === id) { resetIntMap(); return; }
  intMapHighlighted = id;

  // Find connected edges and nodes
  const connectedNodes = new Set([id]);
  INT_EDGES.forEach((e,i) => {
    const edgeEl = document.getElementById(`edge_${i}`);
    if (e.from === id || e.to === id) {
      connectedNodes.add(e.from); connectedNodes.add(e.to);
      edgeEl?.classList.add('highlighted'); edgeEl?.classList.remove('dimmed');
    } else {
      edgeEl?.classList.remove('highlighted'); edgeEl?.classList.add('dimmed');
    }
  });

  INT_NODES.forEach(n => {
    const nodeEl = document.getElementById(`node_${n.id}`);
    if (connectedNodes.has(n.id)) {
      nodeEl?.classList.add('highlighted'); nodeEl?.classList.remove('dimmed');
    } else {
      nodeEl?.classList.remove('highlighted'); nodeEl?.classList.add('dimmed');
    }
  });
}

function resetIntMap() {
  intMapHighlighted = null;
  document.querySelectorAll('.intmap-node').forEach(n => { n.classList.remove('highlighted','dimmed'); });
  document.querySelectorAll('.intmap-edge').forEach(e => { e.classList.remove('highlighted','dimmed'); });
}

function showIntTooltip(event, id) {
  const tooltip = document.getElementById('intmapTooltip');
  const node = INT_NODES.find(n => n.id === id);
  if (!tooltip || !node) return;
  const connections = INT_EDGES.filter(e => e.from === id || e.to === id);
  tooltip.innerHTML = `<h4>${node.icon} ${node.name}</h4>
    <div style="font-size:0.75rem;color:var(--teal);margin-bottom:0.3rem">${node.category}</div>
    <div class="tip-integrations">
      ${connections.map(c => {
        const otherNode = INT_NODES.find(n => n.id === (c.from === id ? c.to : c.from));
        return `<div class="tip-int">${otherNode?.name}: ${c.label}</div>`;
      }).join('')}
    </div>`;
  const container = document.getElementById('intmapContainer');
  const rect = container.getBoundingClientRect();
  tooltip.style.left = (event.clientX - rect.left + 10) + 'px';
  tooltip.style.top = (event.clientY - rect.top - 10) + 'px';
  tooltip.classList.add('show');
}

function hideIntTooltip() {
  document.getElementById('intmapTooltip')?.classList.remove('show');
}

// ================================================================
// FEATURE: SCENARIO PLANNER (WHAT-IF ANALYSIS)
// ================================================================
const SCENARIO_TOOLS = [
  { id:'figma', icon:'🎨', name:'Figma AI', cost:360, category:'Design', productivityPct:15, deps:[], impact:'UI consistency across 4 products' },
  { id:'cursor', icon:'⚙️', name:'Cursor AI', cost:600, category:'Backend', productivityPct:20, deps:[], impact:'Deep codebase understanding for APIs' },
  { id:'copilot', icon:'🤖', name:'GitHub Copilot', cost:300, category:'Dev', productivityPct:12, deps:['cursor'], impact:'Daily coding speed for all developers' },
  { id:'v0', icon:'🖥', name:'Vercel v0', cost:200, category:'Frontend', productivityPct:10, deps:['figma'], impact:'60-70% faster frontend generation' },
  { id:'fireflies', icon:'📋', name:'Fireflies.ai', cost:300, category:'Meetings', productivityPct:8, deps:[], impact:'Hindi+English meeting transcription' },
  { id:'clickup', icon:'✅', name:'ClickUp', cost:210, category:'Tasks', productivityPct:10, deps:[], impact:'Cross-team task coordination' },
  { id:'chatgpt', icon:'⚡', name:'ChatGPT', cost:120, category:'Email', productivityPct:5, deps:[], impact:'Fast email drafting + debugging' },
  { id:'claude', icon:'🧠', name:'Claude', cost:60, category:'Strategy', productivityPct:7, deps:[], impact:'Architecture decisions + quality content' },
  { id:'notebooklm', icon:'📚', name:'NotebookLM', cost:200, category:'Knowledge', productivityPct:8, deps:[], impact:'Company brain (Hindi + English)' },
  { id:'gamma', icon:'📊', name:'Gamma+Canva', cost:100, category:'Docs', productivityPct:5, deps:[], impact:'Fast presentations + reports' }
];

const SCENARIO_PRESETS = [
  { name:'✅ Full Stack (Recommended)', tools: SCENARIO_TOOLS.map(t=>t.id) },
  { name:'💰 Budget Mode', tools:['copilot','clickup','chatgpt','notebooklm'] },
  { name:'👨‍💻 Dev Focus', tools:['figma','cursor','copilot','v0','clickup','claude'] },
  { name:'🧑‍💼 Management Focus', tools:['clickup','fireflies','chatgpt','gamma','notebooklm'] },
  { name:'🚀 Speed Max', tools:['cursor','copilot','v0','chatgpt','clickup','fireflies'] },
  { name:'❌ No AI (Baseline)', tools:[] }
];

let scenarioIncluded = new Set(SCENARIO_TOOLS.map(t=>t.id));

function initScenarioPlanner() {
  const presetsEl = document.getElementById('scenarioPresets'); if (!presetsEl) return;

  presetsEl.innerHTML = SCENARIO_PRESETS.map((p,i) =>
    `<button class="scenario-preset-btn ${i===0?'active':''}" onclick="applyScenarioPreset(${i},this)">${p.name}</button>`
  ).join('');

  renderScenarioGrid();
  updateScenarioImpact();
}

function applyScenarioPreset(idx, btn) {
  document.querySelectorAll('.scenario-preset-btn').forEach(b=>b.classList.remove('active'));
  btn?.classList.add('active');
  scenarioIncluded = new Set(SCENARIO_PRESETS[idx].tools);
  renderScenarioGrid();
  updateScenarioImpact();
}

function renderScenarioGrid() {
  const el = document.getElementById('scenarioToolGrid'); if (!el) return;
  el.innerHTML = SCENARIO_TOOLS.map(t => {
    const included = scenarioIncluded.has(t.id);
    const depNames = t.deps.map(d => SCENARIO_TOOLS.find(x=>x.id===d)?.name).filter(Boolean);
    return `<div class="scenario-tool-card ${included?'included':'excluded'}" onclick="toggleScenarioTool('${t.id}')">
      <div class="stc-status">${included?'✅':'❌'}</div>
      <div class="stc-icon">${t.icon}</div>
      <div class="stc-name">${t.name}</div>
      <div class="stc-cost">$${t.cost}/mo</div>
      ${depNames.length ? `<div class="stc-deps">Works best with: ${depNames.join(', ')}</div>` : ''}
    </div>`;
  }).join('');
}

function toggleScenarioTool(id) {
  document.querySelectorAll('.scenario-preset-btn').forEach(b=>b.classList.remove('active'));
  if (scenarioIncluded.has(id)) scenarioIncluded.delete(id);
  else scenarioIncluded.add(id);
  renderScenarioGrid();
  updateScenarioImpact();
}

function updateScenarioImpact() {
  const impactEl = document.getElementById('scenarioImpact');
  const warningsEl = document.getElementById('scenarioWarnings');
  if (!impactEl) return;

  const totalCost = SCENARIO_TOOLS.filter(t=>scenarioIncluded.has(t.id)).reduce((s,t)=>s+t.cost, 0);
  const fullCost = SCENARIO_TOOLS.reduce((s,t)=>s+t.cost, 0);
  const savings = fullCost - totalCost;
  const totalProductivity = SCENARIO_TOOLS.filter(t=>scenarioIncluded.has(t.id)).reduce((s,t)=>s+t.productivityPct, 0);
  const maxProductivity = SCENARIO_TOOLS.reduce((s,t)=>s+t.productivityPct, 0);
  const toolCount = scenarioIncluded.size;
  const coverage = Math.round((toolCount / SCENARIO_TOOLS.length) * 100);

  const costClass = totalCost < 800 ? 'good' : totalCost < 1500 ? 'warn' : 'bad';
  const prodClass = totalProductivity > 60 ? 'good' : totalProductivity > 30 ? 'warn' : 'bad';
  const covClass = coverage > 70 ? 'good' : coverage > 40 ? 'warn' : 'bad';

  // Estimate ROI
  const estSalaryValue = 30 * 60000 * (totalProductivity / 100);
  const roi = totalCost > 0 ? Math.round((estSalaryValue - totalCost * 12) / (totalCost * 12) * 100) : 0;
  const roiClass = roi > 200 ? 'good' : roi > 50 ? 'warn' : 'bad';

  impactEl.innerHTML = `
    <div class="scenario-impact-card"><div class="sic-label">Monthly Cost</div><div class="sic-value ${costClass}">$${totalCost.toLocaleString()}</div><div class="sic-sub">Yearly: $${(totalCost*12).toLocaleString()} · Save $${savings.toLocaleString()}/mo vs full</div></div>
    <div class="scenario-impact-card"><div class="sic-label">Productivity Boost</div><div class="sic-value ${prodClass}">${totalProductivity}%</div><div class="sic-sub">${totalProductivity}/${maxProductivity}% maximum potential</div></div>
    <div class="scenario-impact-card"><div class="sic-label">Tool Coverage</div><div class="sic-value ${covClass}">${coverage}%</div><div class="sic-sub">${toolCount} of ${SCENARIO_TOOLS.length} tools selected</div></div>
    <div class="scenario-impact-card"><div class="sic-label">Est. ROI</div><div class="sic-value ${roiClass}">${roi}%</div><div class="sic-sub">${roi > 0 ? 'Positive return on investment' : 'Need more tools for ROI'}</div></div>`;

  // Warnings
  let warnings = [];
  if (!scenarioIncluded.has('figma') && scenarioIncluded.has('v0'))
    warnings.push('Vercel v0 works best with Figma design tokens — without Figma, generated UI won\'t match your design system.');
  if (!scenarioIncluded.has('cursor') && scenarioIncluded.has('copilot'))
    warnings.push('GitHub Copilot provides inline suggestions, but without Cursor you lose deep codebase understanding and multi-file editing.');
  if (!scenarioIncluded.has('fireflies'))
    warnings.push('Without Fireflies, meeting action items must be tracked manually — teams lose 10+ hrs/week.');
  if (!scenarioIncluded.has('clickup'))
    warnings.push('No task management tool selected — cross-team coordination will break down at 30 users.');
  if (!scenarioIncluded.has('notebooklm'))
    warnings.push('Without NotebookLM, Hindi-speaking engineers lose access to knowledge in their language.');
  if (!scenarioIncluded.has('figma'))
    warnings.push('No design system tool — UI will be inconsistent across your 4 products (Blast, Drone, Safety, Digital Mine).');
  if (scenarioIncluded.size === 0)
    warnings.push('No AI tools selected! Your team will run 40-60% slower than competitors using AI.');
  if (!scenarioIncluded.has('cursor') && !scenarioIncluded.has('copilot'))
    warnings.push('No AI coding tools — developers will write all code manually, losing 30-50% potential speed.');

  // Removed tools impact
  SCENARIO_TOOLS.filter(t => !scenarioIncluded.has(t.id)).forEach(t => {
    if (t.productivityPct >= 10)
      warnings.push(`Removing ${t.name} loses ${t.productivityPct}% productivity: ${t.impact}`);
  });

  if (warnings.length > 0) {
    warningsEl.innerHTML = `<div class="scenario-warnings">
      <h4>⚠️ Impact Warnings (${warnings.length})</h4>
      ${warnings.map(w => `<div class="sw-item">${w}</div>`).join('')}
    </div>`;
  } else {
    warningsEl.innerHTML = `<div style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:1.2rem;text-align:center">
      <h4 style="color:var(--green);margin-bottom:0.3rem">✅ Full Coverage — No Gaps</h4>
      <p style="color:var(--gray);font-size:0.85rem">All tool categories covered. Maximum productivity and team capabilities.</p>
    </div>`;
  }
}

// ================================================================
// FEATURE: RISK ASSESSMENT MATRIX
// ================================================================
const RISK_FACTORS = [
  { id:'security', label:'🔒 Data Security', weight:9 },
  { id:'lockin', label:'🔗 Vendor Lock-in', weight:7 },
  { id:'scalability', label:'📈 Scalability Risk', weight:8 },
  { id:'compliance', label:'📋 Compliance', weight:6 },
  { id:'downtime', label:'⏱ Downtime Risk', weight:5 }
];

const RISK_TOOLS = [
  { name:'Figma AI', icon:'🎨', security:2, lockin:3, scalability:1, compliance:2, downtime:2 },
  { name:'Cursor AI', icon:'⚙️', security:3, lockin:2, scalability:1, compliance:2, downtime:2 },
  { name:'GitHub Copilot', icon:'🤖', security:2, lockin:1, scalability:1, compliance:2, downtime:1 },
  { name:'Vercel v0', icon:'🖥', security:2, lockin:3, scalability:2, compliance:2, downtime:2 },
  { name:'Fireflies.ai', icon:'📋', security:4, lockin:2, scalability:1, compliance:3, downtime:2 },
  { name:'ClickUp', icon:'✅', security:2, lockin:3, scalability:2, compliance:2, downtime:2 },
  { name:'ChatGPT', icon:'⚡', security:3, lockin:1, scalability:1, compliance:3, downtime:2 },
  { name:'Claude', icon:'🧠', security:3, lockin:1, scalability:1, compliance:3, downtime:1 },
  { name:'NotebookLM', icon:'📚', security:2, lockin:2, scalability:2, compliance:2, downtime:2 },
  { name:'Gamma+Canva', icon:'📊', security:1, lockin:2, scalability:1, compliance:1, downtime:1 }
];

let riskWeights = {};
RISK_FACTORS.forEach(f => riskWeights[f.id] = f.weight);

function initRiskAssessment() {
  const weightsEl = document.getElementById('riskWeights'); if (!weightsEl) return;

  weightsEl.innerHTML = RISK_FACTORS.map(f =>
    `<div class="risk-weight-card">
      <label>${f.label} <span class="rw-val" id="rw_${f.id}">${riskWeights[f.id]}/10</span></label>
      <input type="range" min="1" max="10" value="${riskWeights[f.id]}" class="rw-slider slider"
        oninput="riskWeights['${f.id}']=parseInt(this.value);document.getElementById('rw_${f.id}').textContent=this.value+'/10';renderRiskGrid()">
    </div>`
  ).join('');

  renderRiskGrid();
}

function renderRiskGrid() {
  const gridEl = document.getElementById('riskGrid');
  const summaryEl = document.getElementById('riskSummary');
  if (!gridEl) return;

  const totalWeight = Object.values(riskWeights).reduce((a,b)=>a+b,0);

  // Calculate weighted scores
  const results = RISK_TOOLS.map(tool => {
    let weighted = 0;
    RISK_FACTORS.forEach(f => {
      weighted += (tool[f.id] || 0) * riskWeights[f.id];
    });
    const score = (weighted / totalWeight).toFixed(1);
    return { ...tool, weightedScore: parseFloat(score), rawScore: weighted };
  }).sort((a,b) => a.rawScore - b.rawScore);

  const maxRaw = Math.max(...results.map(r => r.rawScore));

  function riskClass(val) { return val <= 2 ? 'risk-low' : val <= 3 ? 'risk-medium' : 'risk-high'; }
  function riskLabel(val) { return val <= 2 ? 'Low' : val <= 3 ? 'Med' : 'High'; }

  gridEl.innerHTML = `<table>
    <thead><tr><th>Tool</th>${RISK_FACTORS.map(f=>`<th>${f.label}</th>`).join('')}<th>Weighted Risk</th></tr></thead>
    <tbody>${results.map(t => `<tr>
      <td style="text-align:left"><strong>${t.icon} ${t.name}</strong></td>
      ${RISK_FACTORS.map(f => `<td><span class="risk-cell ${riskClass(t[f.id])}">${riskLabel(t[f.id])}</span></td>`).join('')}
      <td><div class="risk-score-bar">
        <div class="rsb-fill" style="width:${Math.max((t.rawScore/maxRaw)*120, 20)}px"></div>
        <span class="rsb-val" style="color:${t.weightedScore<=2?'#4ADE80':t.weightedScore<=3?'#FBBF24':'#FF4D6A'}">${t.weightedScore}</span>
      </div></td>
    </tr>`).join('')}</tbody></table>`;

  // Summary
  const avgRisk = (results.reduce((s,r)=>s+r.weightedScore,0)/results.length).toFixed(1);
  const highRiskTools = results.filter(r => r.weightedScore > 2.5);
  const lowestRisk = results[0];
  const highestRisk = results[results.length-1];

  summaryEl.innerHTML = `<h4>📊 Risk Overview</h4>
    <div class="risk-summary-grid">
      <div class="risk-summary-item"><div class="rsi-label">Average Risk</div><div class="rsi-value" style="color:${avgRisk<=2?'#4ADE80':avgRisk<=3?'#FBBF24':'#FF4D6A'}">${avgRisk}/5</div><div class="rsi-desc">Across all 10 tools</div></div>
      <div class="risk-summary-item"><div class="rsi-label">Lowest Risk</div><div class="rsi-value" style="color:#4ADE80">${lowestRisk.icon} ${lowestRisk.name}</div><div class="rsi-desc">Score: ${lowestRisk.weightedScore}/5</div></div>
      <div class="risk-summary-item"><div class="rsi-label">Highest Risk</div><div class="rsi-value" style="color:#FF4D6A">${highestRisk.icon} ${highestRisk.name}</div><div class="rsi-desc">Score: ${highestRisk.weightedScore}/5</div></div>
      <div class="risk-summary-item"><div class="rsi-label">Action Items</div><div class="rsi-value" style="color:#FBBF24">${highRiskTools.length}</div><div class="rsi-desc">Tools needing mitigation</div></div>
    </div>
    ${highRiskTools.length ? `<div style="background:rgba(255,77,106,0.06);border:1px solid rgba(255,77,106,0.2);border-radius:10px;padding:1rem;margin-top:1rem">
      <h5 style="color:var(--red);margin-bottom:0.5rem">⚠️ Mitigation Required</h5>
      ${highRiskTools.map(t => `<p style="font-size:0.85rem;color:var(--gray);margin-bottom:0.3rem">${t.icon} <strong>${t.name}</strong> (${t.weightedScore}/5) — Review ${t.security>=3?'data security policies':'vendor alternatives'} and establish fallback procedures</p>`).join('')}
    </div>` : `<div style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.2);border-radius:10px;padding:1rem;margin-top:1rem;text-align:center">
      <h5 style="color:var(--green)">✅ All tools within acceptable risk thresholds</h5>
    </div>`}`;
}

// ================================================================
// FEATURE: ADOPTION TRACKER
// ================================================================
const ADOPTION_DATA = [
  { id:'figma', icon:'🎨', name:'Figma AI', color:'#8B5CF6', status:'active', adoption:75,
    teams:{ it:true, nonit:false, mgmt:true },
    satisfaction:4.2, frequency:'Daily', users:12, target:15, notes:'Design team fully adopted' },
  { id:'cursor', icon:'⚙️', name:'Cursor AI', color:'#00D4AA', status:'active', adoption:85,
    teams:{ it:true, nonit:false, mgmt:false },
    satisfaction:4.6, frequency:'Daily', users:8, target:10, notes:'Backend devs primary IDE' },
  { id:'copilot', icon:'🤖', name:'GitHub Copilot', color:'#4ADE80', status:'active', adoption:90,
    teams:{ it:true, nonit:false, mgmt:false },
    satisfaction:4.4, frequency:'Daily', users:10, target:10, notes:'All developers using' },
  { id:'v0', icon:'🖥', name:'Vercel v0', color:'#38BDF8', status:'trial', adoption:40,
    teams:{ it:true, nonit:false, mgmt:false },
    satisfaction:3.8, frequency:'Weekly', users:4, target:8, notes:'Frontend team in trial' },
  { id:'fireflies', icon:'📋', name:'Fireflies.ai', color:'#FF8C42', status:'active', adoption:65,
    teams:{ it:true, nonit:true, mgmt:true },
    satisfaction:4.0, frequency:'Daily', users:20, target:30, notes:'All meeting users' },
  { id:'clickup', icon:'✅', name:'ClickUp', color:'#4ADE80', status:'active', adoption:80,
    teams:{ it:true, nonit:true, mgmt:true },
    satisfaction:3.9, frequency:'Daily', users:25, target:30, notes:'Company-wide adoption' },
  { id:'chatgpt', icon:'⚡', name:'ChatGPT', color:'#FBBF24', status:'active', adoption:70,
    teams:{ it:true, nonit:false, mgmt:true },
    satisfaction:4.3, frequency:'Daily', users:15, target:20, notes:'Email + debugging' },
  { id:'claude', icon:'🧠', name:'Claude', color:'#FF8C42', status:'trial', adoption:35,
    teams:{ it:true, nonit:false, mgmt:true },
    satisfaction:4.5, frequency:'Weekly', users:5, target:10, notes:'Architecture + strategy' },
  { id:'notebooklm', icon:'📚', name:'NotebookLM', color:'#E879F9', status:'planned', adoption:15,
    teams:{ it:false, nonit:false, mgmt:true },
    satisfaction:0, frequency:'Not started', users:3, target:20, notes:'Pilot with management' },
  { id:'gamma', icon:'📊', name:'Gamma+Canva', color:'#8B5CF6', status:'active', adoption:55,
    teams:{ it:false, nonit:false, mgmt:true },
    satisfaction:4.1, frequency:'Weekly', users:8, target:10, notes:'Presentations + reports' }
];

let adoptionState = JSON.parse(localStorage.getItem('aiAdoption') || 'null') || ADOPTION_DATA.map(d => ({ id:d.id, adoption:d.adoption, status:d.status }));

function initAdoptionTracker() {
  renderAdoptionOverview();
  renderAdoptionGrid();
}

function renderAdoptionOverview() {
  const el = document.getElementById('adoptionOverview'); if (!el) return;

  const activeCount = adoptionState.filter(a => a.status === 'active').length;
  const trialCount = adoptionState.filter(a => a.status === 'trial').length;
  const plannedCount = adoptionState.filter(a => a.status === 'planned').length;
  const avgAdoption = Math.round(adoptionState.reduce((s,a) => s+a.adoption, 0) / adoptionState.length);
  const totalUsers = ADOPTION_DATA.reduce((s,d) => s+d.users, 0);
  const avgSatisfaction = (ADOPTION_DATA.filter(d=>d.satisfaction>0).reduce((s,d)=>s+d.satisfaction,0) / ADOPTION_DATA.filter(d=>d.satisfaction>0).length).toFixed(1);

  el.innerHTML = `<h4 style="color:var(--white);margin-bottom:1rem">📊 Adoption Overview</h4>
    <div class="adoption-stats">
      <div class="adoption-stat">
        <div class="as-circle" style="--as-color:#4ADE80;--as-pct:${avgAdoption}">
          <span class="as-circle-val">${avgAdoption}%</span>
        </div>
        <div class="as-label">Avg Adoption</div>
      </div>
      <div class="adoption-stat">
        <div class="as-circle" style="--as-color:#00D4AA;--as-pct:${(activeCount/ADOPTION_DATA.length)*100}">
          <span class="as-circle-val">${activeCount}</span>
        </div>
        <div class="as-label">Active Tools</div>
      </div>
      <div class="adoption-stat">
        <div class="as-circle" style="--as-color:#FBBF24;--as-pct:${(trialCount/ADOPTION_DATA.length)*100}">
          <span class="as-circle-val">${trialCount}</span>
        </div>
        <div class="as-label">In Trial</div>
      </div>
      <div class="adoption-stat">
        <div class="as-circle" style="--as-color:#38BDF8;--as-pct:${(plannedCount/ADOPTION_DATA.length)*100}">
          <span class="as-circle-val">${plannedCount}</span>
        </div>
        <div class="as-label">Planned</div>
      </div>
      <div class="adoption-stat">
        <div class="as-circle" style="--as-color:#8B5CF6;--as-pct:${(totalUsers/110)*100}">
          <span class="as-circle-val">${totalUsers}</span>
        </div>
        <div class="as-label">Total Licenses</div>
      </div>
      <div class="adoption-stat">
        <div class="as-circle" style="--as-color:#E879F9;--as-pct:${(avgSatisfaction/5)*100}">
          <span class="as-circle-val">${avgSatisfaction}</span>
        </div>
        <div class="as-label">Avg Satisfaction</div>
        <div class="as-team">out of 5.0</div>
      </div>
    </div>`;
}

function renderAdoptionGrid() {
  const el = document.getElementById('adoptionGrid'); if (!el) return;

  el.innerHTML = ADOPTION_DATA.map((d,i) => {
    const state = adoptionState.find(a => a.id === d.id) || { adoption: d.adoption, status: d.status };
    const statusLabel = state.status === 'active' ? '✅ Active' : state.status === 'trial' ? '🔶 Trial' : '📋 Planned';
    const statusClass = state.status === 'active' ? 'adopt-active' : state.status === 'trial' ? 'adopt-trial' : 'adopt-planned';

    return `<div class="adoption-card" style="--adopt-color:${d.color}" onclick="cycleAdoptionStatus('${d.id}')">
      <div class="ac-header">
        <div class="ac-name">${d.icon} ${d.name}</div>
        <span class="ac-badge ${statusClass}">${statusLabel}</span>
      </div>
      <div class="ac-bar-bg"><div class="ac-bar-fill" style="width:${state.adoption}%"></div></div>
      <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--mid)">
        <span>Adoption: ${state.adoption}%</span>
        <span>${d.users}/${d.target} users</span>
      </div>
      <div class="ac-metrics">
        <div class="ac-metric">Satisfaction<span>${d.satisfaction > 0 ? '⭐ '+d.satisfaction+'/5' : '—'}</span></div>
        <div class="ac-metric">Frequency<span>${d.frequency}</span></div>
      </div>
      <div class="ac-teams">
        <span class="ac-team-tag ${d.teams.it?'active':''}">👨‍💻 IT</span>
        <span class="ac-team-tag ${d.teams.nonit?'active':''}">👷 Non-IT</span>
        <span class="ac-team-tag ${d.teams.mgmt?'active':''}">🧑‍💼 Mgmt</span>
      </div>
      <div style="font-size:0.72rem;color:var(--dim);margin-top:0.5rem;text-align:center">Click to cycle status →</div>
    </div>`;
  }).join('');
}

function cycleAdoptionStatus(id) {
  const statuses = ['planned', 'trial', 'active'];
  const state = adoptionState.find(a => a.id === id);
  if (!state) return;
  const nextIdx = (statuses.indexOf(state.status) + 1) % statuses.length;
  state.status = statuses[nextIdx];
  // Adjust adoption based on status
  if (state.status === 'planned') state.adoption = Math.min(state.adoption, 20);
  else if (state.status === 'trial') state.adoption = Math.max(state.adoption, 30);
  else state.adoption = Math.max(state.adoption, 60);
  localStorage.setItem('aiAdoption', JSON.stringify(adoptionState));
  renderAdoptionOverview();
  renderAdoptionGrid();
}

// ================================================================
// FEATURE: AI READINESS SCORECARD
// ================================================================
const READINESS_DIMENSIONS = [
  { id:'infrastructure', label:'🏗 Infrastructure', icon:'🏗',
    question:'How would you rate your current IT infrastructure?',
    desc:'Network, hardware, cloud setup, development environment',
    options:[
      { text:'Basic — mostly on-premise, limited cloud', val:1 },
      { text:'Developing — some cloud, basic CI/CD', val:2 },
      { text:'Modern — cloud-first, containerized', val:3 },
      { text:'Advanced — fully cloud-native, microservices', val:4 }
    ],
    recs: {
      1: 'Start with cloud migration. Setup AWS/GCP accounts. Deploy basic CI/CD pipeline.',
      2: 'Expand cloud usage. Implement container orchestration. Standardize dev environments.',
      3: 'Add AI-specific infra (GPU instances, ML pipelines). Optimize for scale.',
      4: 'Infrastructure ready. Focus on tool integration and automation.'
    }
  },
  { id:'skills', label:'💡 Team Skills', icon:'💡',
    question:'What is your team\'s AI/ML skill level?',
    desc:'Programming proficiency, AI awareness, willingness to learn',
    options:[
      { text:'Beginner — limited AI exposure', val:1 },
      { text:'Aware — understands concepts, some usage', val:2 },
      { text:'Capable — actively uses AI tools daily', val:3 },
      { text:'Expert — building custom AI integrations', val:4 }
    ],
    recs: {
      1: 'Start with ChatGPT/Claude training. Run "AI Day" workshops. Assign AI champions per team.',
      2: 'Introduce Copilot for devs, Fireflies for meetings. Hands-on tool trials.',
      3: 'Deploy advanced tools (Cursor, v0). Create internal best practices guide.',
      4: 'Build custom workflows. Create AI-powered automation. Share knowledge org-wide.'
    }
  },
  { id:'data', label:'📊 Data Maturity', icon:'📊',
    question:'How organized is your company data?',
    desc:'Data quality, accessibility, documentation, governance',
    options:[
      { text:'Scattered — data in silos, no documentation', val:1 },
      { text:'Partially organized — some docs, basic access', val:2 },
      { text:'Well organized — documented APIs, clean data', val:3 },
      { text:'Excellent — centralized, governed, API-first', val:4 }
    ],
    recs: {
      1: 'Document all data sources. Create data catalog. Establish naming conventions.',
      2: 'Build API layer for data access. Implement data validation. Start using NotebookLM.',
      3: 'Add AI-driven analytics. Implement automated reporting. Build knowledge base.',
      4: 'Data ready for AI. Deploy predictive analytics. Build custom dashboards.'
    }
  },
  { id:'culture', label:'🧠 Culture & Leadership', icon:'🧠',
    question:'How supportive is leadership toward AI adoption?',
    desc:'Management buy-in, innovation culture, change management',
    options:[
      { text:'Resistant — skeptical about AI value', val:1 },
      { text:'Open — willing to explore, needs convincing', val:2 },
      { text:'Supportive — actively promoting AI adoption', val:3 },
      { text:'Champion — AI-first strategy from top down', val:4 }
    ],
    recs: {
      1: 'Build ROI case with this dashboard. Show competitor analysis. Start small pilot.',
      2: 'Run pilot projects with quick wins. Share success metrics. Get budget approved.',
      3: 'Scale adoption across teams. Establish AI governance. Create AI roadmap.',
      4: 'Culture ready. Focus on execution speed and continuous improvement.'
    }
  },
  { id:'process', label:'⚙️ Process Maturity', icon:'⚙️',
    question:'How standardized are your workflows?',
    desc:'SOPs, project management, code review, deployment pipelines',
    options:[
      { text:'Ad hoc — no standard processes', val:1 },
      { text:'Basic — some SOPs, manual workflows', val:2 },
      { text:'Standardized — documented processes, some automation', val:3 },
      { text:'Optimized — fully automated, continuously improved', val:4 }
    ],
    recs: {
      1: 'Document core workflows. Setup ClickUp/task management. Define team roles.',
      2: 'Automate repetitive tasks (Zapier/n8n). Standardize code review with AI.',
      3: 'Add AI-powered QA testing. Implement automated reporting. Optimize sprint flow.',
      4: 'Processes optimized. Focus on innovation and experimentation with new AI tools.'
    }
  },
  { id:'budget', label:'💰 Budget & Resources', icon:'💰',
    question:'What budget is available for AI tools?',
    desc:'Monthly AI tool budget, dedicated AI time, training budget',
    options:[
      { text:'Minimal — < $500/month for team', val:1 },
      { text:'Moderate — $500-1,500/month', val:2 },
      { text:'Good — $1,500-3,000/month', val:3 },
      { text:'Generous — $3,000+/month', val:4 }
    ],
    recs: {
      1: 'Start with free tools: NotebookLM, tl;dv, ChatGPT free. Prioritize highest ROI.',
      2: 'Add Copilot ($10/user) + ClickUp ($7/user). Use free tiers strategically.',
      3: 'Full recommended stack is within budget. Deploy all core tools.',
      4: 'Budget allows premium tiers + experimentation. Add Cursor Pro, Fireflies Business.'
    }
  }
];

let readinessAnswers = {};

function initReadinessScorecard() {
  const el = document.getElementById('readinessQuestions'); if (!el) return;

  el.innerHTML = `<h4 style="color:var(--white);margin-bottom:1.5rem">📋 Rate Your Organization Across 6 Dimensions</h4>` +
    READINESS_DIMENSIONS.map(d =>
      `<div class="readiness-q">
        <label>${d.label}: ${d.question}</label>
        <div class="rq-desc">${d.desc}</div>
        <div class="readiness-options">
          ${d.options.map(o => `<button class="readiness-opt" data-dim="${d.id}" data-val="${o.val}"
            onclick="selectReadiness(this,'${d.id}',${o.val})">${o.text}</button>`).join('')}
        </div>
      </div>`
    ).join('') +
    `<div style="text-align:center;margin-top:1.5rem">
      <button class="vote-btn" style="padding:14px 40px;font-size:1rem" onclick="generateReadiness()">🏅 Generate Readiness Score</button>
    </div>`;
}

function selectReadiness(btn, dim, val) {
  document.querySelectorAll(`[data-dim="${dim}"]`).forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  readinessAnswers[dim] = val;
}

function generateReadiness() {
  const result = document.getElementById('readinessResult');
  if (Object.keys(readinessAnswers).length < 4) {
    result.innerHTML = '<p style="color:var(--red);padding:1rem;text-align:center">⚠️ Please answer at least 4 dimensions to get your readiness score</p>';
    return;
  }

  // Calculate overall score
  const answered = READINESS_DIMENSIONS.filter(d => readinessAnswers[d.id] !== undefined);
  const totalScore = answered.reduce((s,d) => s + readinessAnswers[d.id], 0);
  const maxPossible = answered.length * 4;
  const pct = Math.round((totalScore / maxPossible) * 100);
  const grade = pct >= 85 ? 'A' : pct >= 70 ? 'B' : pct >= 55 ? 'C' : pct >= 40 ? 'D' : 'F';
  const gradeColor = pct >= 85 ? '#4ADE80' : pct >= 70 ? '#00D4AA' : pct >= 55 ? '#FBBF24' : pct >= 40 ? '#FF8C42' : '#FF4D6A';
  const ringGradient = `conic-gradient(${gradeColor} ${pct}%, var(--bg2) ${pct}%)`;
  const readinessLevel = pct >= 85 ? 'AI-Ready' : pct >= 70 ? 'Nearly Ready' : pct >= 55 ? 'Developing' : pct >= 40 ? 'Early Stage' : 'Not Ready';

  // Dimension breakdown
  const dimResults = READINESS_DIMENSIONS.map(d => {
    const val = readinessAnswers[d.id] || 0;
    const dimPct = (val / 4) * 100;
    const dimColor = dimPct >= 75 ? '#4ADE80' : dimPct >= 50 ? '#FBBF24' : '#FF4D6A';
    return { ...d, val, dimPct, dimColor, rec: d.recs[val] || d.recs[1] };
  });

  // Sort by lowest score for priority
  const priorities = [...dimResults].sort((a,b) => a.val - b.val);
  const topPriorities = priorities.filter(p => p.val > 0 && p.val <= 2);
  const strengths = priorities.filter(p => p.val >= 3);

  result.innerHTML = `<div class="readiness-result">
    <div style="text-align:center;margin-bottom:1.5rem">
      <div class="readiness-score-ring" style="background:${ringGradient}">
        <div class="rsr-val" style="color:${gradeColor}">${grade}</div>
      </div>
      <div style="font-size:1.5rem;font-weight:900;color:var(--white)">${readinessLevel}</div>
      <div style="font-size:0.9rem;color:var(--gray);margin-top:0.3rem">${pct}% overall readiness · ${totalScore}/${maxPossible} points</div>
    </div>

    <h4 style="color:var(--white);margin-bottom:1rem">📊 Dimension Breakdown</h4>
    <div class="readiness-dimensions">
      ${dimResults.filter(d => d.val > 0).map(d => `<div class="readiness-dim">
        <h5>${d.label}</h5>
        <div class="rd-bar-bg"><div class="rd-bar-fill" style="width:${d.dimPct}%;background:${d.dimColor}"></div></div>
        <div class="rd-score" style="color:${d.dimColor}">${d.val}/4 — ${d.dimPct >= 75 ? 'Strong' : d.dimPct >= 50 ? 'Developing' : 'Needs Work'}</div>
        <div class="rd-rec">💡 ${d.rec}</div>
      </div>`).join('')}
    </div>

    <h4 style="color:var(--white);margin:1.5rem 0 1rem">🎯 Action Items</h4>
    <div class="readiness-summary-boxes">
      ${topPriorities.length ? topPriorities.map(p => `<div class="readiness-box priority-high">
        <h5>🔴 ${p.label}</h5>
        <p>${p.rec}</p>
      </div>`).join('') : ''}
      ${dimResults.filter(d => d.val === 3).map(p => `<div class="readiness-box priority-medium">
        <h5>🟡 ${p.label}</h5>
        <p>${p.rec}</p>
      </div>`).join('')}
      ${strengths.filter(d => d.val >= 4).map(p => `<div class="readiness-box priority-low">
        <h5>🟢 ${p.label}</h5>
        <p>${p.rec}</p>
      </div>`).join('')}
    </div>

    <div style="background:rgba(0,212,170,0.06);border:1px solid rgba(0,212,170,0.2);border-radius:12px;padding:1.5rem;margin-top:1.5rem;text-align:center">
      <h4 style="color:var(--teal);margin-bottom:0.5rem">🎯 Meeting-Ready Summary</h4>
      <p style="color:var(--teal);font-style:italic;font-size:0.9rem">"Our AI readiness score is ${pct}% (Grade ${grade}, ${readinessLevel}). ${topPriorities.length > 0 ? `Top priority: ${topPriorities[0].label.replace(/^.{2} /,'')}. ` : ''}${strengths.length > 0 ? `Strengths: ${strengths.map(s=>s.label.replace(/^.{2} /,'')).join(', ')}. ` : ''}We recommend a phased ${pct >= 70 ? 'aggressive' : pct >= 50 ? 'moderate' : 'foundational'} rollout starting with ${pct >= 70 ? 'full stack deployment' : pct >= 50 ? 'core tools first' : 'infrastructure and skills building'}."</p>
      <button class="copy-btn" style="margin-top:0.8rem" onclick="copyText('Our AI readiness score is ${pct}% (Grade ${grade}). ${topPriorities.length > 0 ? 'Top priority: '+topPriorities[0].label.replace(/^.{2} /,'')+'. ' : ''}We recommend a phased ${pct >= 70 ? 'aggressive' : pct >= 50 ? 'moderate' : 'foundational'} rollout.', this)">📋 Copy Summary</button>
    </div>
  </div>`;

  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

