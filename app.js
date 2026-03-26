// TOOLS - Detailed info for each tool within categories
const TOOLS = {
  ui: [
    { name:"Figma AI", icon:"🟦", color:"#8B5CF6", role:"CORE DESIGN + DEVELOPMENT TOOL (NON-NEGOTIABLE)", url:"https://www.figma.com",
      useCases:[
        { title:"🖥 Web Dashboard (Management)", desc:"Blast analytics, Drone reports, Safety KPIs. Create reusable dashboard components: Charts, Filters, Tables. AI helps generate layout faster.", impact:"Faster dashboard rollout. Consistent UX across all products. Easier training for management.", color:"#38BDF8" },
        { title:"📱 Mobile App (Field Engineers)", desc:"Quick input (blast data, safety checks). Large buttons, minimal UI. Offline-friendly design patterns. Design mobile-first UI. Simulate real device flows. Test usability before development.", impact:"Reduced errors in field. Faster task completion. Better adoption by engineers.", color:"#4ADE80" },
        { title:"👨‍💻 Dev Pipeline (CRITICAL)", desc:"Current problem: Designers → Dev mismatch. Figma Dev Mode: Exact spacing, colors, typography. Export CSS / design tokens directly.", impact:"30–50% faster frontend dev. Reduced rework. Better UI accuracy.", color:"#8B5CF6" },
        { title:"🧱 Design System (Multi-Product)", desc:"Multiple products → same users. Central UI library: Buttons, Forms, Cards, Alerts. Uniform experience across Blasting, Safety, Drone products.", impact:"Faster feature development. Brand consistency. Scalable UI system.", color:"#FF8C42" }
      ],
      pricing:"Pro: ~$12/user/month | Org: ~$45/user/month | Team of 10: ~$120–450/month",
      advantages:["Best for Web App UI, Mobile UI, Dashboards","Dev Mode for exact CSS/tokens export","Central design system across all products","AI-powered layout generation"],
      limitations:["Requires design skill for initial setup","Learning curve for non-designers"]
    },
    { name:"Uizard", icon:"🟪", color:"#FBBF24", role:"IDEATION + PROTOTYPING TOOL ONLY", url:"https://uizard.io",
      useCases:[
        { title:"⚡ Feature Ideation (VERY IMPORTANT)", desc:"Example: New feature 'Real-time blast monitoring'. Without Uizard: Design delay → dev delay. With Uizard: Prompt → UI in minutes.", impact:"Faster product cycles. Competitive advantage.", color:"#FBBF24" },
        { title:"👷 Field Feedback Loop", desc:"Real Problem: Engineers can't explain UI properly. Uizard: Sketch → UI conversion. Captures field requirements visually.", impact:"Real-world usability improves. Less redesign after deployment.", color:"#FF8C42" },
        { title:"🧪 MVP Validation", desc:"Before coding: Test UI with users. Create clickable prototypes. Validate features before investment.", impact:"Avoid building wrong features. Save development cost.", color:"#4ADE80" }
      ],
      pricing:"Pro: ~$12/month | Business: ~$39/month",
      advantages:["Fastest UI from prompt","Great for non-designer ideation","Sketch to UI conversion","MVP validation before coding"],
      limitations:["Not for final UI","Cannot handle complex analytics dashboards","No dev-level precision","Not suitable for production design"]
    },
    { name:"Framer AI", icon:"🟨", color:"#38BDF8", role:"MARKETING / WEBSITE TOOL", url:"https://www.framer.com",
      useCases:[
        { title:"🌐 Company Website", desc:"Product pages, Service pages. AI-powered website builder. Modern, responsive designs.", impact:"Strong brand presence. Better first impression for clients.", color:"#38BDF8" },
        { title:"📈 Sales Support", desc:"Demo landing pages. Feature showcase pages. Product comparison pages.", impact:"Higher conversion rate. Better sales enablement.", color:"#4ADE80" }
      ],
      pricing:"~$20–40/month",
      advantages:["Beautiful websites quickly","AI-powered design","Good for marketing pages"],
      limitations:["Not for SaaS product UI","No backend logic","Not used by dev team","Limited to marketing/website only"]
    },
    { name:"Canva", icon:"🟩", color:"#4ADE80", role:"COMMUNICATION TOOL", url:"https://www.canva.com",
      useCases:[
        { title:"📊 Management Reporting", desc:"Blast performance reports. Safety metric visualizations. Drone analytics summaries.", impact:"Better decision clarity. Professional internal communication.", color:"#4ADE80" },
        { title:"📢 Client Presentation", desc:"Product feature showcases. Data insight presentations. Professional branded materials.", impact:"Professional communication. Improved client trust.", color:"#38BDF8" }
      ],
      pricing:"~$10/month",
      advantages:["Very easy to use","Huge template library","Works for non-designers","Brand kit consistency"],
      limitations:["No product development impact","Not for technical diagrams","Limited to communication/reporting"]
    }
  ],
  backend: [
    { name:"Cursor AI", icon:"🟦", color:"#00D4AA", role:"PRIMARY BACKEND AI TOOL", url:"https://www.cursor.com",
      useCases:[
        { title:"⚙️ API Development (CRITICAL)", desc:"Blast data API, Drone analytics API. Understands entire repo. Writes API endpoints. Refactors existing code intelligently.", impact:"🚀 Faster backend development. Cleaner architecture.", color:"#00D4AA" },
        { title:"🔧 Debugging Complex Systems", desc:"Your system: Data pipelines + APIs. Cursor finds bugs across files. Suggests fixes with full context understanding.", impact:"Reduced downtime. Faster issue resolution.", color:"#FF8C42" },
        { title:"🧱 Large Codebase Management", desc:"Works across full repo context. Understands relationships between files. Helps navigate complex codebases.", impact:"Easy onboarding of new devs. Better maintainability.", color:"#8B5CF6" }
      ],
      pricing:"Free | Pro ~$20/month",
      advantages:["Deep code understanding","Strong for backend systems","Best for serious dev teams","Full repo context awareness"],
      limitations:["Needs good developers","Not beginner-friendly","Requires coding expertise to leverage fully"]
    },
    { name:"Windsurf", icon:"🟪", color:"#8B5CF6", role:"SECONDARY AI IDE (INNOVATION + SPEED)", url:"https://windsurf.com",
      useCases:[
        { title:"🚀 Full Feature Development", desc:"Can build features end-to-end autonomously. Flow-based development approach.", impact:"Faster feature delivery.", color:"#8B5CF6" },
        { title:"🔄 Multi-File Editing", desc:"Works across Backend and Frontend simultaneously. Autonomous coding capabilities.", impact:"Full-stack development speed.", color:"#38BDF8" }
      ],
      pricing:"Free + paid tiers (~$10–15/month)",
      advantages:["Faster than traditional IDE","Strong automation","End-to-end feature building"],
      limitations:["Less mature than Cursor","Can make mistakes in complex logic","Less stable for production code"]
    },
    { name:"Replit Agent", icon:"🟨", color:"#FBBF24", role:"PROTOTYPE + INTERNAL TOOL BUILDER", url:"https://replit.com",
      useCases:[
        { title:"🧪 Rapid Prototyping", desc:"Build demo APIs, proof of concepts from prompts. Instant deployment and testing.", impact:"Faster experimentation. Quick validation of ideas.", color:"#FBBF24" },
        { title:"🧠 Internal Tools", desc:"Build admin tools, internal dashboards. Quick utility apps for team use.", impact:"Saves dev time on non-critical tools.", color:"#4ADE80" }
      ],
      pricing:"~$20/month",
      advantages:["Build apps from prompt","Instant deployment","Great for internal tools"],
      limitations:["Not production-grade","Limited scalability","Not suitable for critical systems"]
    },
    { name:"GitHub Copilot", icon:"🟩", color:"#4ADE80", role:"BASELINE PRODUCTIVITY TOOL", url:"https://github.com/features/copilot",
      useCases:[
        { title:"⚡ Daily Coding", desc:"Write functions faster. AI suggests logic completions. Inline code suggestions.", impact:"Faster day-to-day coding.", color:"#4ADE80" },
        { title:"📦 Standard Tasks", desc:"CRUD APIs, Database queries. Boilerplate code generation. Repetitive pattern completion.", impact:"Saves time on repetitive work.", color:"#38BDF8" }
      ],
      pricing:"~$10/month",
      advantages:["Stable and widely used","Excellent autocomplete","Low cost","Works in any IDE"],
      limitations:["No deep codebase understanding","Limited architecture support","Suggests code line-by-line only"]
    },
    { name:"Claude", icon:"🟥", color:"#FF8C42", role:"CTO-LEVEL THINKING ASSISTANT", url:"https://claude.ai",
      useCases:[
        { title:"🧠 System Design", desc:"Design backend architecture. Plan data flow and API structure. Make architectural decisions.", impact:"Better system decisions. Stronger architecture.", color:"#FF8C42" },
        { title:"📊 Complex Debugging", desc:"Analyze logs and code. Understand complex error chains. Deep reasoning about system behavior.", impact:"Solve hard problems faster.", color:"#FF4D6A" },
        { title:"📚 Documentation", desc:"Generate technical docs. API documentation. System architecture documents.", impact:"Better team understanding. Knowledge preservation.", color:"#8B5CF6" }
      ],
      pricing:"~$20/month",
      advantages:["Deep reasoning capability","Large context window","Best for complex analysis","Excellent documentation"],
      limitations:["Not an IDE","No direct coding integration","Requires copy-paste workflow"]
    }
  ],
  frontend: [
    { name:"Vercel v0", icon:"🟦", color:"#00D4AA", role:"PRIMARY FRONTEND GENERATION TOOL", url:"https://v0.dev",
      useCases:[
        { title:"📊 Dashboard UI Generation", desc:"Example: 'Create mining analytics dashboard with charts + filters'. Generates React + Tailwind UI. Clean, production-ready structure.", impact:"⚡ 60–70% faster UI development.", color:"#00D4AA" },
        { title:"🔗 Backend Integration", desc:"Works with APIs, AI SDK, Next.js. Vercel provides full AI infra + deployment layer.", impact:"Faster deployment. Scalable frontend.", color:"#38BDF8" },
        { title:"⚡ Speed + Iteration", desc:"Instant preview + code output. Rapid UI iteration. Prompt-based refinement.", impact:"Rapid UI prototyping to production.", color:"#FBBF24" }
      ],
      pricing:"Free (limited) | Paid usage-based + hosting",
      advantages:["Clean React code output","Best for modern SaaS UI","Strong deployment ecosystem","Production-ready components"],
      limitations:["Requires dev integration","Not full backend solution","Usage-based pricing can scale"]
    },
    { name:"Lovable", icon:"🟪", color:"#8B5CF6", role:"MVP + PROTOTYPING TOOL ONLY", url:"https://lovable.dev",
      useCases:[
        { title:"⚡ Rapid MVP Building", desc:"Generates UI + Backend + Database from prompt. Build complete product prototypes in days.", impact:"Extremely fast product validation.", color:"#8B5CF6" },
        { title:"🧠 Product Team Usage", desc:"Non-devs can build functional UI. Democratizes product development.", impact:"Faster innovation cycles.", color:"#4ADE80" }
      ],
      pricing:"Usage-based plans",
      advantages:["Full stack from text prompt","Non-developers can build","Extremely fast MVP creation"],
      limitations:["AI frontend looks good but BREAKS AT SCALE","No design system support","Hard to scale to production","Messy code output","NOT for production use"]
    },
    { name:"GitHub Copilot", icon:"🟨", color:"#4ADE80", role:"MANDATORY FOR ALL DEVELOPERS", url:"https://github.com/features/copilot",
      useCases:[
        { title:"⚙️ Component Development", desc:"React components, Forms, UI logic. Copilot suggests JSX, hooks, Tailwind patterns.", impact:"Consistent component quality.", color:"#4ADE80" },
        { title:"⚡ Daily Dev Speed", desc:"Reduces manual coding significantly. Context-aware suggestions. Pattern recognition.", impact:"30–40% faster frontend development.", color:"#38BDF8" }
      ],
      pricing:"~$10/month",
      advantages:["Best daily coding assistant","Pattern recognition","Low cost","Universal IDE support"],
      limitations:["No full UI generation","No architectural guidance","Line-by-line suggestions only"]
    },
    { name:"ChatGPT", icon:"🟩", color:"#FBBF24", role:"SUPPORT TOOL (DAILY DEV USE)", url:"https://chat.openai.com",
      useCases:[
        { title:"🧠 UI Logic + Debugging", desc:"Fix UI bugs. Explain errors. Debug React component issues.", impact:"Faster bug resolution.", color:"#FBBF24" },
        { title:"🎨 UI Generation", desc:"Generate components and layouts on demand. Quick code snippets.", impact:"Supplementary UI development.", color:"#FF8C42" }
      ],
      pricing:"Free + $20/month (Plus)",
      advantages:["Flexible problem solver","Multi-purpose","Fast responses","Good for debugging"],
      limitations:["Not IDE-integrated","Requires copy-paste","Can produce inconsistent code"]
    },
    { name:"Claude", icon:"🟥", color:"#FF8C42", role:"CTO-LEVEL FRONTEND THINKING TOOL", url:"https://claude.ai",
      useCases:[
        { title:"🧱 Frontend Architecture", desc:"Design component structure. Plan state management. Define folder organization.", impact:"Better long-term code maintainability.", color:"#FF8C42" },
        { title:"🔧 Complex Debugging", desc:"Analyze large UI issues. Debug complex state problems. Performance optimization.", impact:"Solve architectural UI problems.", color:"#FF4D6A" }
      ],
      pricing:"~$20/month",
      advantages:["Deep reasoning about architecture","Handles complex analysis","Best for system-level decisions"],
      limitations:["Not fast for quick tasks","No IDE integration","Requires detailed prompting"]
    }
  ],
  meeting: [
    { name:"Fireflies.ai", icon:"🟩", color:"#4ADE80", role:"MAIN MEETING TOOL (RECOMMENDED)", url:"https://fireflies.ai",
      useCases:[
        { title:"🌍 Language Support (MOST IMPORTANT)", desc:"Supports 60–100+ languages including Hindi, English, and mixed conversations. Perfect for your team where engineers speak Hindi and management speaks English.", impact:"Bridge between Hindi-speaking engineers and English-speaking management.", color:"#4ADE80" },
        { title:"📋 Auto Notes + Action Items", desc:"Automatically extracts: Tasks, Decisions, Key points from every meeting. No manual note-taking required.", impact:"No manual notes. Clear accountability. Nothing gets missed.", color:"#00D4AA" },
        { title:"🔗 Integrations (VERY IMPORTANT)", desc:"Connects with Notion, ClickUp, Slack. Meeting outcomes automatically flow to task management.", impact:"Meeting → Task directly. Zero manual transfer.", color:"#38BDF8" },
        { title:"📊 Meeting Analytics", desc:"Tracks who spoke, time spent on topics, key discussion points. Meeting effectiveness metrics.", impact:"Better meeting culture. Data-driven improvements.", color:"#8B5CF6" }
      ],
      pricing:"Free | Pro: ~$10/user/month | Business: ~$19/user/month | 30 users: $300–570/month",
      advantages:["Best language support (60-100+ languages)","Hindi + English + mixed support","Auto task extraction","Deep integrations (ClickUp, Slack, Notion)","Meeting analytics dashboard"],
      limitations:["Pro plan needed for full features","Bot joins meeting (visible to participants)"]
    },
    { name:"tl;dv", icon:"🟦", color:"#38BDF8", role:"BUDGET-FRIENDLY BACKUP TOOL", url:"https://tldv.io",
      useCases:[
        { title:"🌍 Language Support", desc:"~30+ languages supported. Hindi partially supported. Good for English-primary meetings.", impact:"Adequate for most meeting types.", color:"#38BDF8" },
        { title:"💰 Free Recordings", desc:"Free unlimited recordings. Basic transcription included. Highlights and clips feature.", impact:"Zero cost for basic meeting recording.", color:"#4ADE80" }
      ],
      pricing:"Free (unlimited recordings) | Paid plans available",
      advantages:["Free unlimited recordings","Simple and fast to use","Good clip/highlight feature"],
      limitations:["Less accurate than Fireflies","Limited analytics","Hindi support is partial","Fewer integrations"]
    },
    { name:"Jamie", icon:"🟨", color:"#FBBF24", role:"PREMIUM TOOL (LEADERSHIP/MANAGEMENT ONLY)", url:"https://www.meetjamie.ai",
      useCases:[
        { title:"🔒 Privacy-First", desc:"No bot joins the meeting. Works in background. Audio processed locally. Maximum privacy for sensitive discussions.", impact:"Perfect for confidential leadership meetings.", color:"#FBBF24" },
        { title:"📋 Clean Output", desc:"Summary + tasks generated within minutes. Clean, structured notes. Handles multilingual meetings well.", impact:"Professional meeting documentation.", color:"#4ADE80" }
      ],
      pricing:"~€24/month (~$25) per user | 30 users: ~$750/month",
      advantages:["No bot visible in meeting","Best privacy","Clean and accurate notes","Good multilingual support"],
      limitations:["No real-time transcription","No mobile app","EXPENSIVE at scale ($750/mo for 30 users)","Limited to post-meeting summaries"]
    },
    { name:"Otter.ai", icon:"🟥", color:"#FF4D6A", role:"❌ NOT RECOMMENDED FOR YOUR COMPANY", url:"https://otter.ai",
      useCases:[
        { title:"📝 Simple Transcription", desc:"Basic meeting transcription. Works well for English-only meetings. Simple interface.", impact:"Limited to English-speaking teams only.", color:"#FF4D6A" }
      ],
      pricing:"Free (300 min) | ~$17/month",
      advantages:["Simple to use","Good English transcription"],
      limitations:["CRITICAL: Only ~3 languages (mainly English)","NOT suitable for Hindi users","No Hindi support at all","Very limited for your multilingual team"]
    },
    { name:"MS Copilot", icon:"🟪", color:"#8B5CF6", role:"ENTERPRISE-LEVEL (OPTIONAL)", url:"https://www.microsoft.com/en-us/microsoft-copilot",
      useCases:[
        { title:"📊 Meeting Summary", desc:"Auto notes and action items within Microsoft Teams. Integrates with Microsoft 365 ecosystem.", impact:"Seamless if already using Microsoft stack.", color:"#8B5CF6" },
        { title:"🌍 Language Support", desc:"Supports multiple languages (depends on Teams settings). Works within existing Microsoft infrastructure.", impact:"No additional tool needed if on Microsoft.", color:"#38BDF8" }
      ],
      pricing:"~$30/user/month | 30 users: ~$900/month",
      advantages:["Deep Microsoft ecosystem integration","Enterprise-grade security","Combined with other M365 tools"],
      limitations:["Very expensive ($900/mo for 30 users)","Only useful if using Microsoft ecosystem","Overkill for most mining SaaS needs"]
    }
  ],
  task: [
    { name:"ClickUp", icon:"🟩", color:"#4ADE80", role:"BEST SINGLE TOOL FOR 30-PERSON COMPANY", url:"https://clickup.com",
      useCases:[
        { title:"🔧 Multi-Team Structure", desc:"Workspace → Spaces → Lists → Tasks hierarchy. Perfect for IT team, Field engineers, and Management all in one system.", impact:"All teams visible in one place. Cross-team coordination.", color:"#4ADE80" },
        { title:"📊 Cross-Team Visibility", desc:"Backend team tasks, Frontend team tasks, Engineer tasks — all visible in one unified view. Dashboards for management.", impact:"Complete project visibility. Better resource allocation.", color:"#00D4AA" },
        { title:"💰 Cost Advantage", desc:"~$210/month for 30 users (~$7/user). Cheapest scalable solution among all options analyzed.", impact:"Best value for money. Significant savings vs alternatives.", color:"#FBBF24" },
        { title:"⚡ Feature Coverage", desc:"Sprint + bug tracking. Built-in Docs (replace Notion). Management dashboards. Time tracking. Goals.", impact:"All-in-one solution. Fewer tools needed.", color:"#8B5CF6" }
      ],
      pricing:"~$7/user/month | 30 users: ~$210/month | Yearly: ~$2,520",
      advantages:["Best balance of cost + features","Multi-team support","Built-in docs (replace Notion)","Management dashboards","Cheapest scalable option"],
      limitations:["Overwhelming UI initially","Needs proper setup and configuration","'Powerful but overwhelming' - user feedback","Training required for optimal use"]
    },
    { name:"Jira", icon:"🟦", color:"#38BDF8", role:"IT TEAM ONLY — BEST AGILE TOOL", url:"https://www.atlassian.com/software/jira",
      useCases:[
        { title:"👨‍💻 IT Team (ONLY)", desc:"Backend, Frontend, DevOps workflows. Best agile/scrum tool in the market. Sprint planning, bug tracking.", impact:"Best-in-class development workflow.", color:"#38BDF8" },
        { title:"🚨 Problem at 30 Users", desc:"Non-IT team (engineers, management) CANNOT use Jira easily. Requires significant training. High onboarding cost.", impact:"Creates division between IT and Non-IT teams.", color:"#FF4D6A" }
      ],
      pricing:"~$8.15/user/month | 30 users: ~$245/month | Yearly: ~$2,940",
      advantages:["Best agile tool","Excellent for dev teams","Strong sprint/bug tracking","Industry standard for software teams"],
      limitations:["Non-IT team cannot use easily","Requires training for non-technical users","High onboarding cost","ONLY suitable for IT team, not company-wide"]
    },
    { name:"Notion", icon:"🟪", color:"#8B5CF6", role:"DOCUMENT SYSTEM — NOT TASK SYSTEM", url:"https://www.notion.so",
      useCases:[
        { title:"📄 Documentation Best", desc:"SOPs, Knowledge base, Documentation wiki. Best-in-class document management.", impact:"Excellent knowledge organization.", color:"#8B5CF6" },
        { title:"❌ Weak Task Tracking", desc:"Not scalable for operations. Limited project management features. 'Weak for complex workflows' - confirmed.", impact:"Must be paired with another tool for tasks.", color:"#FF4D6A" }
      ],
      pricing:"~$10/user/month | 30 users: ~$300/month | Yearly: ~$3,600",
      advantages:["Best documentation tool","Beautiful wiki/knowledge base","Flexible page structure"],
      limitations:["Weak task tracking","Not scalable for operations","Cannot handle complex project management","Must use with another tool"]
    },
    { name:"Monday.com", icon:"🟨", color:"#FBBF24", role:"EASY BUT EXPENSIVE", url:"https://monday.com",
      useCases:[
        { title:"👷 Non-IT Team Friendly", desc:"Very easy visual interface. Drag-and-drop dashboards. Minimal training required.", impact:"Quick adoption by non-technical users.", color:"#FBBF24" },
        { title:"💰 Scaling Problem", desc:"~$360/month for 30 users. Gets expensive fast. Manual setup increases over time.", impact:"Cost becomes prohibitive at scale.", color:"#FF4D6A" }
      ],
      pricing:"~$12/user/month | 30 users: ~$360/month | Yearly: ~$4,320",
      advantages:["Very easy to use","Visual dashboards","Great for non-IT teams"],
      limitations:["Expensive scaling ($360/mo for 30)","Manual setup increases over time","Limited customization for IT workflows"]
    },
    { name:"Asana", icon:"🟥", color:"#FF8C42", role:"STRUCTURED ORGS — NOT FLEXIBLE ENOUGH", url:"https://asana.com",
      useCases:[
        { title:"📊 Management + Project Tracking", desc:"Clean UI. Good project structure. Timeline and board views.", impact:"Works for structured workflows.", color:"#FF8C42" }
      ],
      pricing:"~$10.99/user/month | 30 users: ~$330/month | Yearly: ~$3,960",
      advantages:["Clean UI","Good project structure","Nice timeline view"],
      limitations:["Expensive","Limited customization","Not flexible enough for mixed IT + Non-IT teams"]
    },
    { name:"Trello", icon:"🟧", color:"#FF4D6A", role:"❌ NOT SUITABLE FOR YOUR COMPANY", url:"https://trello.com",
      useCases:[
        { title:"❌ BREAKS AT 30 USERS", desc:"Good for small teams only. No structure at scale. No reporting. No advanced features. 'Trello works until complexity increases.'", impact:"Cannot support a 30-person company.", color:"#FF4D6A" }
      ],
      pricing:"~$5/user/month | 30 users: ~$150/month | Yearly: ~$1,800",
      advantages:["Cheapest option","Simple kanban board","Easy for tiny teams"],
      limitations:["No structure at scale","No reporting","No scaling capability","Breaks with team complexity","NOT SUITABLE for 30-person mixed teams"]
    }
  ],
  docs: [
    { name:"Canva AI", icon:"🟦", color:"#00D4AA", role:"COMMUNICATION + REPORTING LAYER", url:"https://www.canva.com",
      useCases:[
        { title:"📊 Management Reports", desc:"Blast performance, Safety metrics, Drone analytics reports. Ready templates. AI design suggestions.", impact:"Faster decision making. Better clarity.", color:"#00D4AA" },
        { title:"📢 Client Presentation", desc:"Product features, Data insights. Professional branded materials.", impact:"More professional look. Better client trust.", color:"#38BDF8" },
        { title:"📈 Brand Consistency", desc:"Brand kit: Colors, Fonts, Logo. Same identity across all documents.", impact:"Professional brand presence.", color:"#8B5CF6" }
      ],
      pricing:"Free | Pro ~$10–15/month",
      advantages:["Very easy to use","Huge template library","Works for non-designers","Brand kit feature"],
      limitations:["Not technical","Weak for complex architecture diagrams","Not for product-level UI"]
    },
    { name:"Gamma AI", icon:"🟪", color:"#8B5CF6", role:"PRESENTATION GENERATOR (SPEED TOOL)", url:"https://gamma.app",
      useCases:[
        { title:"⚡ Fast PPT Creation", desc:"Input: 'Mining analytics dashboard presentation'. Output: Full deck in seconds. Saves hours of manual work.", impact:"Fastest PPT creation tool available.", color:"#8B5CF6" },
        { title:"📊 Sales & Demo Decks", desc:"Investor decks, Client demos. Quick turnaround for sales team.", impact:"Faster sales cycle.", color:"#4ADE80" },
        { title:"🧠 Content Structure", desc:"AI creates better storytelling flow. Clean, logical structure automatically.", impact:"Better presentation quality.", color:"#FBBF24" }
      ],
      pricing:"Free | $8–$40/month depending on plan",
      advantages:["Fastest PPT tool","AI-first approach","Good structure and storytelling","Multiple export formats"],
      limitations:["Less design control than Canva","Branding limitations","Feels like web page, not pure PPT","Reddit: 'looks modern, but feels like a web doc'"]
    },
    { name:"Figma AI", icon:"🟨", color:"#FBBF24", role:"PRODUCT VISUALIZATION ENGINE", url:"https://www.figma.com",
      useCases:[
        { title:"📱 UI Mockups for PPT", desc:"Dashboard UI screenshots, Mobile app screens. Real product visualization in presentations.", impact:"Authentic product visuals.", color:"#FBBF24" },
        { title:"🧠 Technical Presentations", desc:"System diagrams, UX flows. Architecture visualizations.", impact:"CTO-level visual clarity.", color:"#FF8C42" },
        { title:"📊 Design System Visualization", desc:"Component systems showcase. Design token documentation.", impact:"Professional engineering presentation.", color:"#8B5CF6" }
      ],
      pricing:"Free + Pro plans",
      advantages:["Best for product visuals","Precise design control","Developer alignment","Real UI screenshots"],
      limitations:["Not fast for full PPT creation","Needs design skill","Steep learning curve for non-designers"]
    },
    { name:"Claude", icon:"🟥", color:"#FF8C42", role:"BRAIN OF YOUR CONTENT SYSTEM", url:"https://claude.ai",
      useCases:[
        { title:"🧠 Technical Documents", desc:"System architecture docs. API documentation. Technical specifications.", impact:"Better engineering clarity.", color:"#FF8C42" },
        { title:"📊 Strategy Documents", desc:"Product strategy. AI roadmap. Business analysis.", impact:"Better strategic planning.", color:"#8B5CF6" },
        { title:"🧾 PPT Content Generation", desc:"Slide content writing. Talking points. Presentation scripts.", impact:"Faster presentation preparation.", color:"#00D4AA" }
      ],
      pricing:"~$20/month",
      advantages:["Deep reasoning capability","Handles complex content","Best for long-form documents","Strategic thinking"],
      limitations:["No design output","No visual creation","Text-only output"]
    }
  ],
  email: [
    { name:"ChatGPT", icon:"🟦", color:"#4ADE80", role:"PRIMARY EMAIL DRAFTING TOOL", url:"https://chat.openai.com",
      useCases:[
        { title:"📧 Client Emails (Sales + Support)", desc:"Example: Client asking about drone analytics feature. Creates structured, clear replies. Explains features professionally.", impact:"Faster response. Better professionalism. Higher conversion.", color:"#4ADE80" },
        { title:"⚙️ Technical Explanations", desc:"API explanation emails. Feature clarification. Technical support responses.", impact:"Clear communication between teams.", color:"#38BDF8" },
        { title:"📊 Report Emails", desc:"Summary emails. Status updates. Weekly reports.", impact:"Saves time for managers.", color:"#FBBF24" },
        { title:"⚡ Speed (BIGGEST ADVANTAGE)", desc:"Very fast generation. Handle multiple emails quickly. Structured output every time.", impact:"Handle more emails. Faster support response.", color:"#00D4AA" }
      ],
      pricing:"Free + $20/month (Plus/Team)",
      advantages:["Multi-purpose (email + docs + code)","Fastest response generation","Structured replies every time","Great for daily email volume"],
      limitations:["Sometimes generic tone","Needs prompt tuning for best results","May lack nuance for sensitive topics"]
    },
    { name:"Claude", icon:"🟥", color:"#8B5CF6", role:"HIGH-QUALITY COMMUNICATION TOOL", url:"https://claude.ai",
      useCases:[
        { title:"📧 High-Stakes Client Emails", desc:"Complaint from mining client. Contract discussions. Sensitive negotiations. Writes polite, detailed, human tone.", impact:"Better client trust. Reduced conflict.", color:"#8B5CF6" },
        { title:"🧠 Complex Explanations", desc:"Safety issue explanation. Data discrepancies. Technical clarifications for non-technical stakeholders.", impact:"Clear understanding. Less confusion.", color:"#FF8C42" },
        { title:"📄 Long Emails / Proposals", desc:"Detailed project proposals. Multi-page email responses. Structured long-form communication.", impact:"Professional, thorough communication.", color:"#00D4AA" }
      ],
      pricing:"~$20/month",
      advantages:["Best writing quality of any AI","Natural, human-like tone","Handles long context beautifully","Nuanced and empathetic"],
      limitations:["Slightly slower than ChatGPT","Not as structured for quick replies","Better for quality over quantity"]
    }
  ],
  knowledge: [
    { name:"NotebookLM", icon:"🧠", color:"#E879F9", role:"COMPANY BRAIN — CENTRALIZED KNOWLEDGE SYSTEM", url:"https://notebooklm.google.com",
      useCases:[
        { title:"🌍 Multilingual Support (GAME CHANGER)", desc:"Supports Hindi + English + 50+ languages. Upload Hindi+English mixed documents. Ask in Hindi, get answer in English (or vice versa). Audio summaries in multiple languages. Engineers → Hindi, Management → English. NotebookLM = bridge between both.", impact:"Breaks language barrier across entire organization.", color:"#E879F9" },
        { title:"👨‍💻 IT Team Usage", desc:"Upload: API docs, Backend architecture, Logs, Error docs. Ask: 'Explain API flow', 'Where is bug in logic?', 'Why this error happening?' New developer joins → Instead of reading 100 pages, ask NotebookLM.", impact:"Faster onboarding. Instant technical knowledge access.", color:"#00D4AA" },
        { title:"👷 Non-IT Team (MOST IMPORTANT)", desc:"Engineers: Upload field reports, Safety SOP. Ask in Hindi: 'Yeh process simple batao'. Management: Upload reports, meeting notes. Ask: 'Key insights kya hai?' Operations: Daily updates, summaries.", impact:"Better understanding for everyone. No need to read long documents.", color:"#FF8C42" },
        { title:"🎧 Audio Overview (UNDERRATED)", desc:"Converts notes → podcast format. Listen instead of reading. Works in 50+ languages including Hindi. Engineers can listen during travel or fieldwork.", impact:"Knowledge consumption becomes effortless.", color:"#FBBF24" },
        { title:"📊 Meeting → Knowledge System", desc:"Flow: Fireflies → meeting notes → Upload to NotebookLM. Ask: 'Last meeting decisions kya the?' All meeting knowledge becomes searchable.", impact:"Zero knowledge loss from meetings.", color:"#38BDF8" },
        { title:"📂 Company Knowledge Base", desc:"Create notebooks: Blast system, Safety system, Drone analytics. Multi-doc analysis: Upload 10 reports, ask 'Common issue kya hai?' Training system: Replace training sessions.", impact:"All knowledge centralized. Searchable. Understandable. Multilingual.", color:"#8B5CF6" }
      ],
      pricing:"Free plan available | Pro: ~$20/month | 30 users (key users only): ~$600/month",
      advantages:["Source-based AI — NO hallucination","Answers ONLY from your uploaded data","50+ language support including Hindi","Audio podcast feature","OCR for scanned documents","Free plan available"],
      limitations:["NOT for heavy data analysis/datasets","Output language sometimes defaults to English","Depends on input quality — garbage in, garbage out","Not a replacement for proper databases"]
    }
  ]
};
