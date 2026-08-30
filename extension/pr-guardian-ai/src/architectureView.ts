import * as vscode from "vscode";

export function openArchitectureView(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "repoArchitecture",
    "Repository Architecture",
    vscode.ViewColumn.Two,
    { enableScripts: true }
  );

  panel.webview.html = getWebviewContent();
}

function getWebviewContent(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Repository Architecture</title>

<style>
*{margin:0;padding:0;box-sizing:border-box;}

body{
  background:#0B1220;
  color:white;
  font-family:'Segoe UI',sans-serif;
  padding:28px;
}

.header h1{
  color:#7DD3FC;
  font-size:30px;
}

.header p{
  color:#94A3B8;
  margin:8px 0 28px;
}

.pipeline{
  display:flex;
  flex-direction:column;
  gap:16px;
}

.step{
  display:flex;
  align-items:center;
  gap:16px;
  padding:16px;
  background:#111827;
  border:1px solid #1F2937;
  border-radius:18px;
  transition:0.3s ease;
}

.step.active{
  background:#172554;
  border-color:#2563EB;
  box-shadow:0 0 18px rgba(37,99,235,.25);
}

.circle{
  width:48px;
  height:48px;
  border-radius:50%;
  background:#2563EB;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:22px;
}

.arrow{
  text-align:center;
  color:#60A5FA;
  font-size:20px;
}

.buttons{
  display:flex;
  justify-content:space-between;
  margin:28px 0;
}

button{
  background:#2563EB;
  color:white;
  border:none;
  padding:12px 20px;
  border-radius:12px;
  cursor:pointer;
  font-weight:600;
}

button:hover{background:#1D4ED8;}

.section{margin-top:38px;}

.cards{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:16px;
}

.card{
  background:#111827;
  border:1px solid #1F2937;
  border-radius:14px;
  padding:16px;
}

.card h3{color:#60A5FA;margin-bottom:8px;}

.badge{
  display:inline-block;
  background:#1E40AF;
  color:#DBEAFE;
  padding:8px 14px;
  border-radius:999px;
  margin:6px 6px 0 0;
  font-size:13px;
}

.file{
  background:#111827;
  border-left:4px solid #10B981;
  padding:14px;
  border-radius:10px;
  margin-bottom:12px;
}

.progress-item{margin-top:18px;}

.bar{
  height:8px;
  background:#1F2937;
  border-radius:999px;
  overflow:hidden;
  margin-top:6px;
}

.fill{
  height:100%;
  width:0%;
  background:linear-gradient(90deg,#2563EB,#7C3AED);
  transition:width .4s ease;
}

input{
  width:100%;
  padding:14px;
  border-radius:10px;
  border:1px solid #334155;
  background:#111827;
  color:white;
  font-size:14px;
  margin-top:14px;
}

.answer{
  display:none;
  background:#172554;
  border-left:4px solid #38BDF8;
  padding:16px;
  border-radius:10px;
  margin-top:16px;
}
/* ========== PR DOCUMENT UNDERSTANDING ========== */

.pr-card{
  background:#111827;
  border:1px solid #1F2937;
  border-radius:16px;
  padding:20px;
}

.pr-subtitle{
  color:#94A3B8;
  font-size:13px;
  margin:8px 0 16px;
}

.pr-textarea{
  width:100%;
  min-height:150px;
  background:#0F172A;
  border:1px solid #334155;
  border-radius:10px;
  color:white;
  padding:14px;
  font-size:13px;
  resize:vertical;
  margin-bottom:16px;
}

.pr-result{
  display:none;
  background:#172554;
  border-left:4px solid #38BDF8;
  padding:16px;
  border-radius:10px;
  margin-top:18px;
  white-space:pre-wrap;
  color:#DBEAFE;
  line-height:1.6;
}

.footer{
  margin-top:40px;
  padding:20px;
  border-radius:18px;
  background:linear-gradient(90deg,#2563EB,#7C3AED);
}

/* ========= Replay AI Review ========= */

#replayBtn{
  background:linear-gradient(90deg,#2563EB,#7C3AED);
  transition:0.3s ease;
  box-shadow:0 0 15px rgba(59,130,246,.25);
}

#replayBtn:hover{
  transform:translateY(-2px);
  box-shadow:0 0 25px rgba(124,58,237,.45);
}

.replay-card{
  display:none;
  background:#111827;
  border:1px solid #1E293B;
  border-radius:20px;
  padding:20px;
  overflow:hidden;
}

.status-chip{
  background:#1E40AF;
  color:#DBEAFE;
  padding:6px 12px;
  border-radius:999px;
  font-size:12px;
  transition:.4s ease;
}

.replay-progress{
  height:8px;
  background:#1F2937;
  border-radius:999px;
  overflow:hidden;
  margin:18px 0;
}

.replay-fill{
  width:0%;
  height:100%;
  background:linear-gradient(90deg,#38BDF8,#7C3AED);
  transition:width .8s ease;
}

.replay-step{
  opacity:0;
  transform:translateX(-30px);
  background:#0F172A;
  border:1px solid #1E293B;
  border-radius:14px;
  padding:14px 16px;
  margin-bottom:12px;
  transition:.5s ease;
}

.replay-step.show{
  opacity:1;
  transform:translateX(0);
}

.replay-icon{
  display:inline-flex;
  width:30px;
  justify-content:center;
  margin-right:10px;
  font-size:18px;
}

.thinking{
  display:inline-flex;
  gap:6px;
  align-items:center;
}

.thinking span{
  width:8px;
  height:8px;
  border-radius:50%;
  background:#60A5FA;
  animation:bobPulse 1s infinite ease-in-out;
}

.thinking span:nth-child(2){
  animation-delay:.2s;
}

.thinking span:nth-child(3){
  animation-delay:.4s;
}

@keyframes bobPulse{
  0%,80%,100%{
    transform:scale(.6);
    opacity:.4;
  }
  40%{
    transform:scale(1.2);
    opacity:1;
  }
}

.result-card{
  display:none;
  margin-top:20px;
  background:linear-gradient(180deg,#172554,#0F172A);
  border-left:5px solid #22C55E;
  border-radius:16px;
  padding:18px;
  animation:fadeUp .7s ease;
}

.counter{
  font-size:32px;
  color:#4ADE80;
  font-weight:bold;
}

.metric-row{
  display:flex;
  justify-content:space-between;
  margin-top:10px;
  color:#CBD5E1;
}

@keyframes fadeUp{
  from{
    opacity:0;
    transform:translateY(20px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}
/* ===== Floating AI Animation ===== */

.ai-stage{
  margin:25px 0;
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.files-zone{
  display:flex;
  flex-direction:column;
  gap:12px;
}

.file-chip{
  background:#172554;
  border:1px solid #2563EB;
  color:#DBEAFE;
  padding:10px 14px;
  border-radius:999px;
  width:max-content;
  transform:translateX(0);
  opacity:0;
  transition:all .8s ease;
}

.file-chip.fly{
  transform:translateX(180px);
  opacity:1;
}

.granite-orb{
  width:90px;
  height:90px;
  border-radius:50%;
  background:radial-gradient(circle,#2563EB,#7C3AED);
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:34px;
  box-shadow:0 0 20px rgba(59,130,246,.35);
  transition:.6s ease;
}

.granite-orb.active{
  animation:orbPulse 1s infinite;
}

@keyframes orbPulse{
  0%{
    transform:scale(1);
    box-shadow:0 0 18px #2563EB;
  }
  50%{
    transform:scale(1.08);
    box-shadow:0 0 35px #7C3AED;
  }
  100%{
    transform:scale(1);
    box-shadow:0 0 18px #2563EB;
  }
}

/* ===== Cinematic Finish ===== */

.result-card.flash{
  animation:successFlash 1s ease;
}

@keyframes successFlash{
  0%{
    transform:scale(.95);
    box-shadow:0 0 0 rgba(34,197,94,0);
  }

  50%{
    transform:scale(1.02);
    box-shadow:0 0 35px rgba(34,197,94,.6);
  }

  100%{
    transform:scale(1);
    box-shadow:0 0 12px rgba(34,197,94,.25);
  }
}

/* ================= CODE IMPACT MAP ================= */

.impact-map{
  display:flex;
  gap:30px;
  align-items:center;
  justify-content:space-between;
  margin-bottom:24px;
}

.impact-left{
  display:flex;
  flex-direction:column;
  gap:14px;
  min-width:180px;
}

.node-btn{
  background:#111827;
  color:#CBD5E1;
  border:1px solid #334155;
  border-radius:12px;
  padding:12px 16px;
  cursor:pointer;
  text-align:left;
  transition:.3s ease;
  font-weight:600;
}

.node-btn:hover{
  border-color:#60A5FA;
  transform:translateX(4px);
}

.active-node{
  background:linear-gradient(90deg,#2563EB,#7C3AED);
  border-color:#60A5FA;
  color:white;
  box-shadow:0 0 20px rgba(96,165,250,.35);
}

.impact-center{
  flex:1;
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:20px;
  position:relative;
}

.impact-node{
  background:#0F172A;
  border:2px solid #1E293B;
  border-radius:18px;
  padding:18px;
  text-align:center;
  font-weight:700;
  color:#CBD5E1;
  transition:.35s ease;
  position:relative;
  overflow:hidden;
}

/* Different colors for each layer */

.frontend-node{ border-color:#2563EB; }
.backend-node{ border-color:#10B981; }
.ai-node{ border-color:#A855F7; }
.parser-node{ border-color:#F59E0B; }

.impact-node.active{
  transform:scale(1.05);
  color:white;
}

.frontend-node.active{
  background:#1E3A8A;
  box-shadow:0 0 25px rgba(37,99,235,.5);
}

.backend-node.active{
  background:#064E3B;
  box-shadow:0 0 25px rgba(16,185,129,.5);
}

.ai-node.active{
  background:#581C87;
  box-shadow:0 0 25px rgba(168,85,247,.6);
}

.parser-node.active{
  background:#78350F;
  box-shadow:0 0 25px rgba(245,158,11,.5);
}

/* Pulsing glow */

.impact-node.active::after{
  content:"";
  position:absolute;
  inset:-40%;
  background:radial-gradient(circle,rgba(255,255,255,.18),transparent 70%);
  animation:nodePulse 2s infinite;
}

@keyframes nodePulse{
  from{
    transform:scale(.8);
    opacity:.7;
  }
  to{
    transform:scale(1.4);
    opacity:0;
  }
}

/* Info card */

.impact-info{
  background:#111827;
  border:1px solid #312E81;
  border-radius:18px;
  padding:18px;
}

.impact-info h3{
  color:#7DD3FC;
  margin-bottom:10px;
}

.impact-info p{
  color:#CBD5E1;
  line-height:1.5;
}

.impact-tags{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:14px;
}

.impact-tag{
  background:#1E3A8A;
  color:#DBEAFE;
  padding:8px 12px;
  border-radius:999px;
  font-size:12px;
  transition:.3s;
}

.impact-tag:hover{
  background:#2563EB;
}
/* ===== Animated Connection Lines ===== */

.impact-center{
  position:relative;
  min-height:320px;
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:30px;
  align-items:center;
}

.flow-line{
  position:absolute;
  height:2px;
  background:linear-gradient(90deg,#2563EB,#7C3AED);
  opacity:.35;
  overflow:hidden;
  border-radius:999px;
}

.line1{
  width:120px;
  top:72px;
  left:120px;
  transform:rotate(18deg);
}

.line2{
  width:120px;
  top:158px;
  left:120px;
  transform:rotate(-18deg);
}

.line3{
  width:120px;
  top:158px;
  right:120px;
  transform:rotate(18deg);
}

.line4{
  width:120px;
  top:72px;
  right:120px;
  transform:rotate(-18deg);
}

.flow-dot{
  width:10px;
  height:10px;
  border-radius:50%;
  background:#7DD3FC;
  box-shadow:0 0 12px #60A5FA;
  animation:dataFlow 2.4s linear infinite;
}

@keyframes dataFlow{
  from{
    transform:translateX(-10px);
    opacity:0;
  }

  20%{
    opacity:1;
  }

  80%{
    opacity:1;
  }

  to{
    transform:translateX(125px);
    opacity:0;
  }
}

/* Floating glow behind active node */

.impact-node.active{
  transform:scale(1.06);
}

.impact-node.active::before{
  content:"";
  position:absolute;
  inset:-30%;
  background:radial-gradient(circle,rgba(96,165,250,.18),transparent 70%);
  animation:orbitGlow 2s infinite;
}

@keyframes orbitGlow{
  from{
    transform:rotate(0deg) scale(.8);
  }

  to{
    transform:rotate(360deg) scale(1.15);
  }
}

</style>
</head>

<body>

<div class="header">
  <h1>Repository Intelligence Dashboard</h1>
  <p style="color:#60A5FA; margin-top:6px; font-weight:600;">
    Powered by IBM Bob + PR Guardian AI
  </p>
  <p style="color:#94A3B8; margin-top:12px;">
    Understand any GitHub repository through AI-powered architecture analysis, tech stack detection, and interactive repository Q&A.
  </p>
</div>

<div id="pipeline" class="pipeline"></div>

<div class="buttons">
  <button id="prevBtn">← Previous</button>
  <button id="nextBtn">Next Step →</button>
</div><!-- ================= REPLAY AI REVIEW ================= -->

<div class="section">

  <h2 style="color:#38BDF8;margin-bottom:18px;">
    🎬 Replay AI Review
  </h2>

  <p style="color:#94A3B8;margin-bottom:16px;">
    Watch how IBM Bob analyzes a GitHub repository step-by-step before generating the final PR review.
  </p>

  <button id="replayBtn" style="width:100%;margin-bottom:20px;">
    ▶ Replay AI Review
  </button>

  <div id="replayCard" class="replay-card">

    <div style="display:flex;justify-content:space-between;align-items:center;">

      <div>
        <h3 style="color:#7DD3FC;">github.com/username/project</h3>
        <p style="color:#64748B;font-size:13px;">
          IBM Granite Repository Review Replay
        </p>
      </div>

      <div id="statusBadge" class="status-chip">
        Waiting...
      </div>

    </div>

    <div class="replay-progress">
        <div id="replayFill" class="replay-fill"></div>
    </div>

    <!-- AI Animation Area -->
    <div class="ai-stage">

    <div class="files-zone">

        <div class="file-chip" id="chip1">README.md</div>
        <div class="file-chip" id="chip2">package.json</div>
        <div class="file-chip" id="chip3">auth.py</div>
        <div class="file-chip" id="chip4">routes.py</div>

    </div>

    <div class="granite-orb" id="graniteOrb">
        🧠
    </div>

    </div>


    <div id="replaySteps"></div>

    <div id="thinkingBox" style="display:none;margin-top:20px;">

      <p id="typingText" style="margin-bottom:10px;color:#A5F3FC;font-weight:600;">
        🧠
      </p>

      <div class="thinking">
        <span></span>
        <span></span>
        <span></span>
      </div>

    </div>

    <div id="resultCard" class="result-card">

      <h3 style="color:#4ADE80;margin-bottom:14px;">
        ✅ Repository Review Complete
      </h3>

      <div class="counter" id="confidenceCounter">
        0%
      </div>

      <p style="color:#A5F3FC;margin-top:6px;">
        AI Review Confidence
      </p>

      <div class="metric-row">
        <span>Files Analyzed</span>
        <strong>47</strong>
      </div>

      <div class="metric-row">
        <span>Architecture Detected</span>
        <strong>React + FastAPI</strong>
      </div>

      <div class="metric-row">
        <span>Review Duration</span>
        <strong>8.2 seconds</strong>
      </div>

      <div class="metric-row">
        <span>AI Suggestions Generated</span>
        <strong>6</strong>
      </div>

    </div>

  </div>

</div>

<!-- =================================================== -->
<!-- ============== PR DOCUMENT UNDERSTANDING ============== -->

<div class="section">

  <h2 style="color:#22D3EE;margin-bottom:18px;">
    📄 PR Document Understanding
  </h2>

  <div class="pr-card">

    <p class="pr-subtitle">
      IBM Bob compares the Pull Request description with the implementation
      and tells reviewers whether the PR requirements are satisfied.
    </p>

    <textarea
      id="prDescription"
      class="pr-textarea"
      placeholder="Paste a GitHub Pull Request description here..."
    ></textarea>

    <button id="analyzeRequirementsBtn" style="width:100%;">
      🤖 Analyze PR Requirements
    </button>

    <div id="requirementsResult" class="pr-result"></div>

  </div>

</div>

<!-- ====================================================== -->



<div class="section">
  <h2 style="color:#A78BFA;">Repository Analysis Progress</h2>

  <div class="progress-item">
    <p>Fetching Repository</p>
    <div class="bar"><div id="p1" class="fill"></div></div>
  </div>

  <div class="progress-item">
    <p>Parsing Source Code</p>
    <div class="bar"><div id="p2" class="fill"></div></div>
  </div>

  <div class="progress-item">
    <p>Detecting Architecture</p>
    <div class="bar"><div id="p3" class="fill"></div></div>
  </div>

  <div class="progress-item">
    <p>Generating AI Explanation</p>
    <div class="bar"><div id="p4" class="fill"></div></div>
  </div>
</div>

<div class="section">
  <h2 style="color:#60A5FA; margin-bottom:16px;">Detected Technology Stack</h2>

  <span class="badge">React</span>
  <span class="badge">FastAPI</span>
  <span class="badge">Python</span>
  <span class="badge">Tailwind CSS</span>
  <span class="badge">REST API</span>
  <span class="badge">GitHub API</span>
</div>

<!-- ================= CODE IMPACT MAP ================= -->

<div class="section">

  <h2 style="color:#A855F7;margin-bottom:18px;">
    🕸️ Interactive Code Impact Map
  </h2>

  <p style="color:#94A3B8;margin-bottom:20px;">
    Visualize how PR Guardian AI understands the repository architecture.
    Click any layer to highlight its connected files.
  </p>

  <div class="impact-map">

    <div class="impact-left">

      <button class="node-btn active-node" id="frontendBtn">
        🖥️ Frontend
      </button>

      <button class="node-btn" id="backendBtn">
        ⚙️ Backend
      </button>

      <button class="node-btn" id="aiBtn">
        🧠 AI Layer
      </button>

      <button class="node-btn" id="parserBtn">
        📂 Repository Parser
      </button>

    </div>

    <div class="impact-center">

  <!-- Animated connection lines -->
  <div class="flow-line line1">
    <div class="flow-dot"></div>
  </div>

  <div class="flow-line line2">
    <div class="flow-dot"></div>
  </div>

  <div class="flow-line line3">
    <div class="flow-dot"></div>
  </div>

  <div class="flow-line line4">
    <div class="flow-dot"></div>
  </div>

  <!-- Nodes -->
  <div class="impact-node frontend-node active" id="frontendNode">
    🖥️ Frontend
  </div>

  <div class="impact-node backend-node" id="backendNode">
    ⚙️ Backend
  </div>

  <div class="impact-node ai-node" id="aiNode">
    🧠 IBM Granite AI
  </div>

  <div class="impact-node parser-node" id="parserNode">
    📂 Repository Parser
  </div>

</div>

  </div>

  <div id="impactInfo" class="impact-info">

    <h3>🖥️ Frontend Layer</h3>

    <p>
      Handles the VS Code extension interface, repository input,
      replay animation, and AI review dashboard.
    </p>

    <div class="impact-tags">

      <span class="impact-tag">extension.ts</span>
      <span class="impact-tag">sidebarProvider.ts</span>
      <span class="impact-tag">architectureView.ts</span>

    </div>

  </div>

</div>

<!-- ================================================ -->

<div class="section">
  <h2 style="color:#C084FC; margin-bottom:16px;">Repository Insights</h2>

  <div class="cards">
    <div class="card">
      <h3>Frontend</h3>
      <p>React + VS Code Webview</p>
    </div>

    <div class="card">
      <h3>Backend</h3>
      <p>FastAPI REST APIs</p>
    </div>

    <div class="card">
      <h3>Repository Parser</h3>
      <p>README, package.json, requirements.txt and source files.</p>
    </div>

    <div class="card">
      <h3>AI Layer</h3>
      <p>IBM Granite Repository Intelligence</p>
    </div>
  </div>
</div>

<div class="section">
  <h2 style="color:#34D399; margin-bottom:16px;">Files Used by AI</h2>

  <div class="file">
    <strong>README.md</strong><br>
    Installation guide and project overview.
  </div>

  <div class="file">
    <strong>package.json</strong><br>
    Detects frontend dependencies and scripts.
  </div>

  <div class="file">
    <strong>requirements.txt</strong><br>
    Detects backend libraries and frameworks.
  </div>

  <div class="file">
    <strong>app.py</strong><br>
    Detects API entry point and application architecture.
  </div>
</div>

<div class="section">
  <h2 style="color:#38BDF8; margin-bottom:16px;">Interactive Repository Q&A</h2>

  <input
    id="questionInput"
    type="text"
    placeholder="Ask about this repository... (Example: Explain architecture or How do I setup this repo?)"
  />

  <button id="askBtn" style="width:100%; margin-top:14px;">
    Ask AI
  </button>

  <div id="answerBox" class="answer">
    <h3 style="color:#7DD3FC; margin-bottom:10px;">AI Answer</h3>
    <p id="answerText"></p>
  </div>
</div>

<div class="footer">
  <h2>AI Generated Output</h2>
  <p>Repository Summary • Architecture • Tech Stack • Setup Guide • Interactive Repository Q&A</p>
</div>

<script>

const stages = [
  ["🔗","GitHub Repository URL","User pastes a public GitHub repository URL."],
  ["💻","Frontend Validation","VS Code extension validates the repository URL and sends it to FastAPI."],
  ["⚙️","FastAPI Backend","Backend fetches repository metadata and important files."],
  ["📂","Repository Parser","Reads README, folder structure, package.json and requirements.txt."],
  ["🧠","Repository Intelligence","Identifies architecture, APIs, tech stack and important modules."],
  ["✨","IBM Granite AI","Generates a grounded repository explanation and setup guide."]
];

let active = 0;

function renderPipeline(){
  const pipeline = document.getElementById("pipeline");
  pipeline.innerHTML = "";

  stages.forEach((stage,index)=>{
    const step = document.createElement("div");
    step.className = "step" + (index <= active ? " active" : "");

    step.innerHTML =
      '<div class="circle">'+stage[0]+'</div>' +
      '<div><h3>'+stage[1]+'</h3><p>'+
      (index <= active ? stage[2] : "Waiting for analysis...")+
      '</p></div>';

    pipeline.appendChild(step);

    if(index < stages.length-1){
      const arrow = document.createElement("div");
      arrow.className = "arrow";
      arrow.textContent = "↓";
      pipeline.appendChild(arrow);
    }
  });

  updateProgress();
}

function updateProgress(){
  document.getElementById("p1").style.width = active >= 1 ? "100%" : "20%";
  document.getElementById("p2").style.width = active >= 2 ? "100%" : active === 1 ? "50%" : "0%";
  document.getElementById("p3").style.width = active >= 4 ? "100%" : active === 3 ? "70%" : "0%";
  document.getElementById("p4").style.width = active === 5 ? "100%" : active === 4 ? "60%" : "0%";
}

// Buttons

document.getElementById("nextBtn").addEventListener("click",()=>{
  if(active < stages.length-1){
    active++;
    renderPipeline();
  }
});

document.getElementById("prevBtn").addEventListener("click",()=>{
  if(active > 0){
    active--;
    renderPipeline();
  }
});

// Interactive Q&A
const sampleAnswers = {
  architecture:
    "This repository follows a modular architecture: React frontend → FastAPI backend → Repository Parser → Repository Intelligence Layer → IBM Granite AI.",

  setup:
    "Clone the repository, install Python dependencies from requirements.txt, install frontend packages from package.json, then run the FastAPI backend followed by the frontend.",

  authentication:
    "Authentication logic is implemented in auth.py where JWT tokens are validated before protected API routes are accessed.",

  api:
    "The backend exposes REST API endpoints through FastAPI, which process repository metadata before sending context to the AI layer.",

  parser:
    "The Repository Parser extracts README.md, folder hierarchy, package.json, requirements.txt, and important source files for analysis.",

  tech:
    "Detected technologies include React, FastAPI, Python, Tailwind CSS, REST APIs, and GitHub API integration."
};

document.getElementById("askBtn").addEventListener("click",()=>{
  const question = document.getElementById("questionInput").value.toLowerCase().trim();

  let answer = "This is where the RAG pipeline will answer questions about the repository using retrieved code context.";

  Object.keys(sampleAnswers).forEach((key)=>{
    if(question.includes(key)){
      answer = sampleAnswers[key];
    }
  });

  document.getElementById("answerBox").style.display = "block";
  document.getElementById("answerText").innerText = answer;
});

// ======================= REPLAY AI REVIEW =======================

const replayTimeline = [
  { icon:"📥", text:"Fetching GitHub repository...", badge:"Fetching", progress:15 },
  { icon:"📄", text:"README.md detected.", badge:"Parsing", progress:30 },
  { icon:"📦", text:"package.json detected.", badge:"Parsing", progress:45 },
  { icon:"📂", text:"Scanning backend and frontend folders...", badge:"Analyzing", progress:58 },
  { icon:"🔐", text:"Authentication logic found in auth.py.", badge:"Analyzing", progress:70 },
  { icon:"🧠", text:"IBM Granite is understanding project architecture...", badge:"Reasoning", progress:82 },
  { icon:"⚠️", text:"Potential performance improvement detected.", badge:"Reviewing", progress:92 },
  { icon:"💡", text:"Generated AI code review suggestions.", badge:"Completed", progress:100 }
];

const replayBtn = document.getElementById("replayBtn");
const replayCard = document.getElementById("replayCard");
const replaySteps = document.getElementById("replaySteps");
const replayFill = document.getElementById("replayFill");
const statusBadge = document.getElementById("statusBadge");
const thinkingBox = document.getElementById("thinkingBox");
const resultCard = document.getElementById("resultCard");
const confidenceCounter = document.getElementById("confidenceCounter");

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}
const typingText = document.getElementById("typingText");

async function typeSentence(sentence){

  typingText.innerText = "🧠 ";

  for(const char of sentence){
    typingText.innerText += char;
    await sleep(35);
  }

}

replayBtn.addEventListener("click", async () => {

  // Reset replay
  replayCard.style.display = "block";
  replaySteps.innerHTML = "";
  replayFill.style.width = "0%";
  resultCard.style.display = "none";
  thinkingBox.style.display = "none";
  statusBadge.innerText = "Starting...";
  confidenceCounter.innerText = "0%";
  // Reset floating files
    ["chip1", "chip2", "chip3", "chip4"].forEach((id) => {
        document.getElementById(id)?.classList.remove("fly");
    });

    document.getElementById("graniteOrb")?.classList.remove("active");

  // Animate steps
  for(const step of replayTimeline){

    statusBadge.innerText = step.badge;
    replayFill.style.width = step.progress + "%";

    const item = document.createElement("div");
    item.className = "replay-step";

    item.innerHTML =
    '<span class="replay-icon">' + step.icon + '</span>' +
    '<strong>' + step.text + '</strong>';

    replaySteps.appendChild(item);
    if(step.progress===30){
        document.getElementById("chip1").classList.add("fly");
    }

    if(step.progress===45){
        document.getElementById("chip2").classList.add("fly");
    }

    if(step.progress===70){
        document.getElementById("chip3").classList.add("fly");
    }

    if(step.progress===82){
        document.getElementById("chip4").classList.add("fly");
        document.getElementById("graniteOrb").classList.add("active");
    }

    // Slide animation
    requestAnimationFrame(()=>{
      item.classList.add("show");
    });

    // Show IBM Granite thinking only during reasoning stage
    if(step.badge === "Reasoning"){
      thinkingBox.style.display = "block";

    await typeSentence(
        "IBM Granite is understanding project architecture..."
    );
}

    await sleep(850);
  }

  thinkingBox.style.display = "none";

  // Show final review card
  resultCard.style.display = "block";
  resultCard.classList.add("flash");

    setTimeout(()=>{
    resultCard.classList.remove("flash");
    },1200);

  let score = 0;

  const counter = setInterval(()=>{
    score += 3;

    confidenceCounter.innerText = score + "%";

    if(score >= 96){
      confidenceCounter.innerText = "96%";
      clearInterval(counter);
    }
  },40);

});

// ===============================================================
// ================= CODE IMPACT MAP =================

const impactInfo = document.getElementById("impactInfo");

const buttons = {
  frontend: document.getElementById("frontendBtn"),
  backend: document.getElementById("backendBtn"),
  ai: document.getElementById("aiBtn"),
  parser: document.getElementById("parserBtn")
};

const nodes = {
  frontend: document.getElementById("frontendNode"),
  backend: document.getElementById("backendNode"),
  ai: document.getElementById("aiNode"),
  parser: document.getElementById("parserNode")
};

const impactData = {
  frontend: {
    title: "🖥️ Frontend Layer",
    desc: "Handles the VS Code extension UI, repository dashboard, replay animation and developer interactions.",
    tags: ["extension.ts","sidebarProvider.ts","architectureView.ts"]
  },

  backend: {
    title: "⚙️ Backend Layer",
    desc: "Processes GitHub repositories, APIs, services, review logic and repository analysis requests.",
    tags: ["app.py","services/","agents/","models/"]
  },

  ai: {
    title: "🧠 IBM Granite AI Layer",
    desc: "Uses IBM Granite prompts and AI reasoning to generate repository summaries, code reviews and suggestions.",
    tags: ["granite.py","prompts/","reviewAgent.py","repositoryAnalyzer.py"]
  },

  parser: {
    title: "📂 Repository Parser",
    desc: "Reads README, package.json, requirements.txt and project structure before sending context to AI.",
    tags: ["README.md","package.json","requirements.txt","folder tree"]
  }
};

function updateImpact(layer){

  // Remove active styles
  Object.values(buttons).forEach(function(btn){
    btn.classList.remove("active-node");
  });

  Object.values(nodes).forEach(function(node){
    node.classList.remove("active");
  });

  // Activate selected layer
  buttons[layer].classList.add("active-node");
  nodes[layer].classList.add("active");
  // Restart flowing dots whenever a new layer is selected.
    document.querySelectorAll(".flow-dot").forEach(function(dot){
    dot.style.animation = "none";
    dot.offsetHeight;
    dot.style.animation = "dataFlow 2.4s linear infinite";
    });

  // Update info card
  const data = impactData[layer];

  let tagsHTML = "";

  data.tags.forEach(function(tag){
    tagsHTML += '<span class="impact-tag">' + tag + '</span>';
  });

  impactInfo.innerHTML =
    "<h3>" + data.title + "</h3>" +
    "<p>" + data.desc + "</p>" +
    '<div class="impact-tags">' + tagsHTML + "</div>";

}

// Button listeners
buttons.frontend.addEventListener("click", function(){
  updateImpact("frontend");
});

buttons.backend.addEventListener("click", function(){
  updateImpact("backend");
});

buttons.ai.addEventListener("click", function(){
  updateImpact("ai");
});

buttons.parser.addEventListener("click", function(){
  updateImpact("parser");
});

// Default highlighted layer
updateImpact("frontend");

// ================================================
// ================= PR DOCUMENT UNDERSTANDING =================

const analyzeRequirementsBtn =
  document.getElementById("analyzeRequirementsBtn");

const requirementsResult =
  document.getElementById("requirementsResult");

analyzeRequirementsBtn.addEventListener("click", () => {

  const description =
    document.getElementById("prDescription").value.trim();

  requirementsResult.style.display = "block";

  if (!description) {
    requirementsResult.innerHTML =
      "❌ Please paste a PR description first.";
    return;
  }

  requirementsResult.innerHTML =
    "📄 IBM Bob PR Document Understanding\\n\\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\\n" +

    "### Feature Summary\\n" +
    "This pull request introduces Replay AI Review and an Interactive Code Impact Map to enhance PR Guardian AI's repository intelligence dashboard.\\n\\n" +

    "### Developer Intent\\n" +
    "Improve pull request reviews by combining IBM Bob AI, security analysis, replay visualization, and repository architecture understanding.\\n\\n" +

    "### Requirements Covered\\n" +
    "✅ Replay AI Review workflow implemented.\\n" +
    "✅ Interactive Code Impact Map added.\\n" +
    "✅ Repository Intelligence Dashboard enhanced.\\n" +
    "✅ AI-powered repository insights integrated.\\n\\n" +

    "### Missing Requirements\\n" +
    "⚠ UI accessibility testing is not included.\\n" +
    "⚠ Performance benchmarks for large repositories are missing.\\n" +
    "⚠ Deployment validation steps are not documented.\\n\\n" +

    "### Security Review\\n" +
    "🛡 No hardcoded secrets detected in the PR description.\\n" +
    "🛡 Backend endpoints should validate repository input before processing.\\n" +
    "🛡 Environment variables are recommended for API credentials.\\n\\n" +

    "### Testing Suggestions\\n" +
    "🧪 Verify Replay AI animation completion.\\n" +
    "🧪 Validate Code Impact Map node interactions.\\n" +
    "🧪 Test Repository Dashboard rendering.\\n" +
    "🧪 Test FastAPI integration with IBM Bob responses.\\n\\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\\n" +

    "🚀 Merge Readiness: 92% READY TO MERGE\\n\\n" +

    "IBM Bob recommends merging this PR after adding UI regression tests and deployment validation.";

});
renderPipeline();

</script>

</body>
</html>
`;
}