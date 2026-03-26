// DATA.JS - All tool categories with FULL detail
const CATEGORIES = [
  { id:"ui", icon:"🎨", label:"UI Design Tools", color:"#8B5CF6",
    desc:"Figma AI, Uizard, Framer, Canva — How AI UI Tools Fit Into Your Product Lifecycle",
    rec:"Figma AI → Core UI (Web+App) | Uizard → Rapid Prototyping | Framer → Website | Canva → Reports",
    reality:"Your company needs UI for: Web dashboards (management analytics), Mobile apps (field engineers), Product websites, and Internal reports. The core problem is: slow validation, complex UI creation, design→code gap, and inconsistent UX across 4 products.",
    workflowStages:[
      {stage:"Idea", problem:"Slow validation", tool:"Uizard"},
      {stage:"Design", problem:"Complex UI creation", tool:"Figma AI"},
      {stage:"Development", problem:"Design → code gap", tool:"Figma Dev Mode"},
      {stage:"Website", problem:"Product showcase", tool:"Framer"},
      {stage:"Reporting", problem:"Internal communication", tool:"Canva"}
    ],
    businessImpact:"⏱ Development speed ↑ 30–50% | 💰 Cost reduction (wrong features avoided) | 📱 Better field usability | 📊 Better dashboards | 🧑‍💼 Better decision making",
    meetingLine:"\"Our core UI backbone should be Figma AI for both web and mobile products, supported by Uizard for rapid prototyping, while Framer and Canva will handle marketing and communication layers.\"",
    comparison:{ headers:["Category","Figma AI","Uizard","Framer","Canva"],
      rows:[["Web App UI","✅ BEST","❌","❌","❌"],["Mobile App UI","✅ BEST","⭐","❌","❌"],["Data Dashboard","✅ BEST","❌","❌","❌"],["Dev Integration","✅ BEST","❌","❌","❌"],["Speed (Idea)","⭐⭐⭐","⭐⭐⭐⭐⭐","⭐⭐","⭐"],["Website","⭐⭐","❌","✅ BEST","⭐"],["Reporting","❌","❌","❌","✅ BEST"]]
    }
  },
  { id:"backend", icon:"⚙️", label:"Backend Dev Tools", color:"#00D4AA",
    desc:"Cursor AI, Windsurf, Replit Agent, GitHub Copilot, Claude — Your backend builds APIs (blast, drone, safety), real-time dashboards, mobile+web sync, and data pipelines.",
    rec:"Cursor → Main Dev | Copilot → Daily Coding | Claude → Architecture | Windsurf → Speed | Replit → Prototyping",
    reality:"Your company is NOT a simple app. You are building: APIs (blast data, drone data, safety logs), Real-time dashboards, Mobile + web sync, Data pipelines (analytics). Backend/dev tools must support: Fast API development, Data handling (large + real-time), Code quality (critical systems), Team collaboration, Scalability.",
    businessImpact:"⏱ Dev speed ↑ 40–60% | 🧠 Better architecture decisions | 🐛 Faster debugging | 💰 Reduced dev cost",
    meetingLine:"\"For backend development, Cursor should be our primary AI development environment, supported by Copilot for productivity and Claude for architectural intelligence, while Windsurf and Replit accelerate experimentation and prototyping.\"",
    comparison:{ headers:["Tool","Role","Strength","Weakness"],
      rows:[["Cursor","Core Dev","Deep code understanding","Needs skill"],["Windsurf","Speed Dev","Automation","Less stable"],["Replit Agent","Prototype","Fast build","Not production"],["Copilot","Daily coding","Autocomplete","Limited intelligence"],["Claude","Architecture","Deep thinking","Not IDE"]]
    }
  },
  { id:"frontend", icon:"🖥", label:"Frontend Dev Tools", color:"#38BDF8",
    desc:"Vercel v0, Lovable, GitHub Copilot, ChatGPT, Claude — Your frontend: Web Dashboard (blast analytics, drone data, charts+maps) + Mobile App (field engineer, fast+simple UI).",
    rec:"Vercel v0 → UI Generation | Copilot → Daily Coding | ChatGPT → Debugging | Claude → Architecture | Lovable → MVP Only",
    reality:"Your frontend is NOT simple: 📊 Web Dashboard (blast analytics, drone data, charts + maps), 📱 Mobile App (field engineer usage, fast + simple UI). Key Requirements: ⚡ Speed (fast UI dev), 🧱 Maintainable code (VERY IMPORTANT), 🎯 Clean UX (critical for engineers), 🔗 Backend integration (APIs, real-time data).",
    businessImpact:"AI frontend tools are great for speed but NOT enough alone for production. Even devs say: 'AI frontend looks good but breaks at scale.'",
    meetingLine:"\"For frontend development, Vercel v0 should be used for rapid UI generation, supported by Copilot for coding and Claude for architecture, while Lovable should be limited to prototyping due to scalability concerns.\"",
    comparison:{ headers:["Factor","Vercel v0","Lovable","Copilot","ChatGPT","Claude"],
      rows:[["UI Generation","⭐⭐⭐⭐⭐","⭐⭐⭐⭐","❌","⭐⭐⭐","⭐⭐⭐"],["Code Quality","⭐⭐⭐⭐⭐","⭐⭐","⭐⭐⭐⭐","⭐⭐⭐","⭐⭐⭐⭐"],["Scalability","⭐⭐⭐⭐⭐","⭐⭐","⭐⭐⭐⭐","⭐⭐⭐","⭐⭐⭐⭐⭐"],["Speed","⭐⭐⭐⭐⭐","⭐⭐⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐"],["Dev Use","⭐⭐⭐⭐⭐","⭐⭐","⭐⭐⭐⭐⭐","⭐⭐⭐⭐⭐","⭐⭐⭐⭐"]]
    }
  },
  { id:"meeting", icon:"📋", label:"Meeting Tools", color:"#FF8C42",
    desc:"Fireflies.ai, tl;dv, Jamie, Otter.ai, MS Copilot — CRITICAL: Must support multi-language (Hindi+English), auto summaries, action items, easy sharing.",
    rec:"Fireflies.ai → Company-wide (Hindi+English) | tl;dv → Free backup | Jamie → Leadership only",
    reality:"Your company meeting requirements: 👨‍💻 IT Team needs accurate transcripts + architecture decisions. 👷 Non-IT Team (IMPORTANT): Engineers not fluent in English, need Hindi support, need simple summaries. 🚨 CRITICAL: Tool must support 🎤 Multi-language (Hindi + English), 🧠 Auto summaries, 📋 Action items extraction, 📊 Easy sharing.",
    businessImpact:"For Indian companies: Language support = most important factor. Fireflies wins because: Multi-language, Task automation, Integrations.",
    meetingLine:"\"For meeting management across a 30-person team, Fireflies.ai is the most suitable solution due to its strong multilingual support including Hindi, automatic action item extraction, and deep integrations with task management tools.\"",
    comparison:{ headers:["Factor","Fireflies","tl;dv","Jamie","Otter","Copilot"],
      rows:[["Hindi Support","⭐⭐⭐⭐⭐","⭐⭐⭐","⭐⭐⭐⭐","❌","⭐⭐⭐⭐"],["English","⭐⭐⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐⭐⭐","⭐⭐⭐⭐⭐","⭐⭐⭐⭐⭐"],["Notes+Tasks","⭐⭐⭐⭐⭐","⭐⭐⭐","⭐⭐⭐⭐⭐","⭐⭐⭐","⭐⭐⭐⭐"],["Ease of Use","⭐⭐⭐⭐","⭐⭐⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐⭐⭐","⭐⭐⭐"],["Cost (30 users)","$300-570","FREE-$540","~$750","~$510","~$900"],["Best For","Company-wide","Budget","Leadership","Individuals","Enterprise"]]
    }
  },
  { id:"task", icon:"✅", label:"Task Management", color:"#4ADE80",
    desc:"ClickUp, Jira, Notion, Monday, Asana, Trello — At 30 users, system must be scalable: multiple teams, cross-team dependency, reporting, cost-controlled.",
    rec:"ClickUp → Main System (IT + Non-IT + Management) at $210/mo | Jira → Only if separate IT system needed",
    reality:"At 5–10 users → any tool works. At 30 users → system must be scalable. 🚨 NEW CHALLENGES: Multiple teams (IT + Engineers + Management), Cross-team dependency (backend ↔ frontend ↔ field), Reporting needed (management dashboards), Cost increases fast (per-user pricing). At 25 users → cost already $175–$300/month. At 50 users → $350–$700/month. FINAL TRUTH: 'Teams switch tools due to complexity, not cost.'",
    businessImpact:"ClickUp provides best balance of cost ($210/mo), scalability, and usability across both IT and non-IT teams.",
    meetingLine:"\"For a 30-person team, ClickUp provides the best balance of cost, scalability, and usability across both IT and non-IT teams, while tools like Jira should remain limited to development workflows due to complexity.\"",
    costTable:[
      {tool:"ClickUp", perUser:"~$7", monthly:"~$210", yearly:"~$2,520"},
      {tool:"Jira", perUser:"~$8.15", monthly:"~$245", yearly:"~$2,940"},
      {tool:"Notion", perUser:"~$10", monthly:"~$300", yearly:"~$3,600"},
      {tool:"Asana", perUser:"~$10.99", monthly:"~$330", yearly:"~$3,960"},
      {tool:"Monday", perUser:"~$12", monthly:"~$360", yearly:"~$4,320"},
      {tool:"Trello", perUser:"~$5", monthly:"~$150", yearly:"~$1,800"}
    ],
    comparison:{ headers:["Factor","ClickUp","Jira","Notion","Monday","Asana","Trello"],
      rows:[["IT Team","⭐⭐⭐⭐⭐","⭐⭐⭐⭐⭐","⭐⭐","⭐⭐","⭐⭐⭐","⭐"],["Non-IT","⭐⭐⭐⭐","⭐","⭐⭐⭐⭐⭐","⭐⭐⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐"],["Scalability","⭐⭐⭐⭐⭐","⭐⭐⭐⭐⭐","⭐⭐","⭐⭐⭐⭐","⭐⭐⭐⭐","⭐"],["Cost (30)","⭐⭐⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐","⭐⭐","⭐⭐","⭐⭐⭐⭐⭐"],["All-in-one","⭐⭐⭐⭐⭐","⭐","⭐⭐⭐","⭐⭐⭐","⭐⭐⭐","⭐"]]
    }
  },
  { id:"docs", icon:"📄", label:"Docs & Presentation", color:"#FBBF24",
    desc:"Canva AI, Gamma AI, Figma AI, Claude — For internal reports, external presentations, and technical documentation.",
    rec:"Claude → Thinking+Content | Gamma → Fast PPT | Canva → Final Polish+Reports | Figma → Product Visuals",
    reality:"Your company needs 3 types of content systems: 📊 A. INTERNAL (TECH + MANAGEMENT): Reports (blast, safety, analytics), Strategy docs, Technical documentation. 📢 B. EXTERNAL (CLIENT + SALES): Product presentations, Demo decks, Pitch decks. 🧠 C. THINKING + PLANNING: Architecture docs, Product specs, AI workflows. Tools must solve: Speed, Quality, Technical depth, Collaboration.",
    realWorkflow:[
      {step:"STEP 1 → Thinking", tool:"Claude", desc:"Strategy, Content"},
      {step:"STEP 2 → PPT Generation", tool:"Gamma", desc:"Full draft"},
      {step:"STEP 3 → Design Polish", tool:"Canva", desc:"Final presentation"},
      {step:"STEP 4 → Product Visuals", tool:"Figma", desc:"UI screens, Architecture diagrams"}
    ],
    businessImpact:"No single tool is enough. Best companies use: Claude (brain), Gamma (speed), Canva (design), Figma (product visuals).",
    meetingLine:"\"For documentation and presentations, Claude should be used for content and strategy, Gamma for rapid deck generation, Canva for polished business communication, and Figma for product-level visuals and technical clarity.\"",
    comparison:{ headers:["Factor","Canva","Gamma","Figma","Claude"],
      rows:[["PPT Speed","⭐⭐⭐","⭐⭐⭐⭐⭐","⭐","⭐⭐⭐"],["Design Quality","⭐⭐⭐⭐","⭐⭐⭐","⭐⭐⭐⭐⭐","❌"],["Technical Depth","⭐⭐","⭐⭐","⭐⭐⭐⭐⭐","⭐⭐⭐⭐⭐"],["UI Mockups","❌","❌","⭐⭐⭐⭐⭐","❌"],["Reports","⭐⭐⭐⭐⭐","⭐⭐","⭐⭐","⭐⭐⭐"],["Strategy Docs","⭐⭐","⭐⭐","⭐⭐","⭐⭐⭐⭐⭐"]]
    }
  },
  { id:"email", icon:"📧", label:"Email & Communication", color:"#FF4D6A",
    desc:"ChatGPT + Claude — External emails (client onboarding, demos, sales), Internal emails (coordination, reports), Critical communication (safety, blast reports).",
    rec:"ChatGPT → Speed + Daily Emails | Claude → Quality + Critical Emails",
    reality:"Your company handles: 📧 A. EXTERNAL EMAILS: Client onboarding, Product demos, Issue resolution, Sales follow-ups. 📧 B. INTERNAL EMAILS: Team coordination, Technical discussions, Reports. 📧 C. CRITICAL COMMUNICATION: Safety issues, Blast reports, Data clarification. Tools must ensure: Accuracy (VERY IMPORTANT ⚠️), Clarity, Professional tone, Speed.",
    dailyFlow:[
      {type:"⚡ FAST RESPONSES", tool:"ChatGPT", use:"Quick replies, Support emails, Internal updates"},
      {type:"🧠 IMPORTANT EMAILS", tool:"Claude", use:"Client complaints, Proposals, Critical communication"}
    ],
    businessImpact:"⏱ Response time ↓ 50–70% | 📧 Email quality ↑ | 🤝 Client satisfaction ↑ | ⚠️ Miscommunication ↓",
    meetingLine:"\"For email and communication workflows, ChatGPT should be used for fast, structured responses, while Claude should handle high-stakes and detailed communication to ensure clarity and professionalism.\"",
    comparison:{ headers:["Factor","ChatGPT","Claude"],
      rows:[["Speed","⭐⭐⭐⭐⭐","⭐⭐⭐"],["Writing Quality","⭐⭐⭐⭐","⭐⭐⭐⭐⭐"],["Technical Explanation","⭐⭐⭐⭐⭐","⭐⭐⭐⭐"],["Client Handling","⭐⭐⭐⭐","⭐⭐⭐⭐⭐"],["Long Emails","⭐⭐⭐","⭐⭐⭐⭐⭐"],["Daily Use","⭐⭐⭐⭐⭐","⭐⭐⭐"]]
    }
  },
  { id:"knowledge", icon:"🧠", label:"NotebookLM / Knowledge", color:"#E879F9",
    desc:"NotebookLM — Source-based AI assistant. Upload PDFs, docs, meeting notes. It answers ONLY from your data — no hallucination. Supports Hindi + English + 50+ languages.",
    rec:"NotebookLM → Company Brain | Workflow: Fireflies → Notes → NotebookLM → ClickUp Tasks",
    reality:"Your company problem: ❌ Knowledge scattered, ❌ Engineers don't read docs, ❌ Management confused, ❌ Language barrier. NotebookLM solves ALL of this. It is a source-based AI assistant — you upload PDFs, Docs, Meeting notes, Reports, Links. It understands ONLY your data, answers based on your documents (no guessing). No hallucination like normal AI — more reliable for business use.",
    howItWorks:[
      {step:"STEP 1", action:"CREATE NOTEBOOK", example:"'Blast System Knowledge', 'Drone Analytics Docs'"},
      {step:"STEP 2", action:"ADD SOURCES", example:"Upload SOP docs, PDFs, Meeting notes, Excel/reports. Can read scanned documents using OCR."},
      {step:"STEP 3", action:"ASK QUESTIONS", example:"'Explain blast workflow in simple terms', 'Safety issue kya tha last meeting me?'"},
      {step:"STEP 4", action:"GET OUTPUT", example:"Summary, Answer, Audio explanation (podcast style)"},
      {step:"STEP 5", action:"SHARE WITH TEAM", example:"Share notebook, Everyone uses same knowledge"}
    ],
    businessImpact:"Companies fail because: Knowledge scattered, People don't read. NotebookLM solves this by: ✔ Making knowledge searchable, ✔ Making it understandable, ✔ Making it multilingual.",
    meetingLine:"\"NotebookLM should be implemented as a centralized company knowledge system, enabling both technical and non-technical teams to access, understand, and interact with organizational knowledge in both Hindi and English, significantly improving productivity and decision-making.\"",
    comparison:{ headers:["Function","Rating"],
      rows:[["Knowledge Base","⭐⭐⭐⭐⭐"],["Documentation","⭐⭐⭐⭐⭐"],["Training","⭐⭐⭐⭐⭐"],["Meeting Understanding","⭐⭐⭐⭐⭐"],["Data Analysis","❌"]]
    }
  }
];
