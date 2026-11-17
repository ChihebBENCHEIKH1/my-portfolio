import hero from "../assets/hero.webp";
import ragAssistant from "../assets/rag-assistant.svg";
import ghostwire from "../assets/ghostwire.png";
import sentinel from "../assets/sentinel-dashboard.png";
import flowforge from "../assets/flowforge.png";
import ghostwatch from "../assets/ghostwatch.png";
export const textContent = {
  eng: {
    navBar: [
      "Home",
      "About",
      "Work Experience",
      "Projects",
      "Open Source",
      "Testimonials",
      "Contact",
    ],
    getInTouch: "GET IN TOUCH",
    name: "Chiheb BEN CHEIKH",
    email: "contact@chihebbencheikh.com",
    I: "I'm",
    qualities: [
      "Chiheb BEN CHEIKH",
      "a Software Engineer",
      "an LLM Builder",
      "Security-Minded",
      "Relentless",
    ],
    myInfo: "Founder · Software Architect",
    headerTitle:
      "I'm Chiheb Ben Cheikh, founder of BiancoToro Technologies. I work on product engineering, agentic AI and cloud architecture.",
    headerDescription:
      "I founded BiancoToro Technologies SUARL in Tunisia to offer product engineering, agentic AI and application security. My experience spans backend microservices, web frontends, Android applications and cloud operations, including principal engineering work at Offmon. I currently work on ControlResell with Guimauve Digital and also take on Shopify development projects. My open-source work includes merged fixes in Hugging Face, llama.cpp and Strawberry GraphQL.",
    aboutRole: "Founder & Software Architect",
    aboutFocus: "Product engineering & applied AI",
    educationLabel: "Research master’s",
    education: "Information System Techniques (IST), ENIT, University of Tunis El Manar. Program offered in cooperation with TU Braunschweig, Germany.",
    researchLabel: "Research in progress",
    researchTitle: "Beyond Teacher Imitation: Provenance-Partitioned Distillation of Vision-Language Models",
    researchDescription: "Distillation of vision-language models with field-level supervision from teacher outputs, verified ground truth and deterministic rules.",
    researchRole: "Co-author · Research and writing · Unpublished manuscript",
    businessLinkLabel: "Explore BiancoToro’s services",
    contactDescription: "For product engineering, agentic AI workflows or an architecture and security review, get in touch or start a conversation with BiancoToro.",
    businessContactLabel: "Discuss an architecture review",
    openSourceSummary: "contributions and projects",
    caseStudiesLabel: "Read the case studies",
    profileFacts: [{"value": "AI", "label": "Product engineering · BiancoToro", "color": "#00f0ff", "gauge": 4}, {"value": "IST", "label": "Research master’s · ENIT", "color": "#ff007f", "gauge": 5}, {"value": "OSS", "label": "Merged contributions", "color": "#ffb800", "gauge": 6}],
    caseStudies: [{"title": "Hugging Face filesystem caching", "url": "/case-studies/hugging-face-filesystem-cache/"}, {"title": "llama.cpp JSON Schema constraints", "url": "/case-studies/llama-cpp-json-schema/"}],
    headerSkills:
      "Python, TypeScript, Go, JavaScript, SQL, Node.js, Express, FastAPI, Socket.io, Next.js, React, Tailwind, React Flow, Docker, Kubernetes, Terraform, GitHub Actions, Nginx, ReAct Agents, RAG, LoRA/PEFT, LangGraph, Bandit, Semgrep, Trivy, SAST/DAST",
    cvDownload: "CV DOWNLOAD",
    moreInfo: "For more information check my CV in your preferred language:",
    portfolioTitle: "Projects",
    role: "Flagship & AI",

    projects: [
      {
        title: "Ghostwire — Live Visual API Builder",
        description:
          "Full-stack, real-time platform for designing API pipelines as node graphs (React Flow, Monaco) on Express + Socket.io, deployed to AWS ECS Fargate via Terraform with GitHub Actions CI/CD. Includes an agentic (ReAct) SRE loop that detects failures, pinpoints root cause, and auto-recovers pipelines.",
        technologies: ["Next.js", "Express", "Socket.io", "AWS ECS", "Terraform", "React Flow"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/ghostwire",
        preview: "ghostwire",
        image: ghostwire,
      },
      {
        title: "RAG + LoRA Assistant",
        description:
          "An SRE knowledge assistant combining a local Qwen2.5 model, LoRA fine-tuning and retrieval over runbooks.",
        technologies: ["Python", "Qwen2.5-3B", "LoRA / PEFT", "RAG", "LangGraph"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/rag-lora-sre-assistant",
        preview: "rag",
        image: ragAssistant,
      },
    ],
    backendProjectsList: [
      {
        title: "Motorcycle Dealership Platform",
        description:
          "Full-stack platform for managing dealership operations — OTP authentication, Stripe payments, automated invoicing, and modular architecture with CI/CD and end-to-end testing.",
        technologies: ["React", "Node.js", "Stripe", "Docker", "Cypress", "GitHub Actions"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/motorcycle-dealership",
        preview: "motorcycle",
        image: hero,
      },
      {
        title: "FlowForge — Workflow Automation Engine",
        description:
          "Workflow automation project (mini Zapier) — visual DAG builder, webhook/cron triggers, branching conditions, real-time execution monitoring, and Redis-backed queue processing.",
        technologies: ["Laravel", "Vue.js", "PostgreSQL", "Redis", "Tailwind"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/FlowForge",
        preview: "flowforge",
        image: flowforge,
      },
      {
        title: "GhostWatch — Incident Management Platform",
        description:
          "Event-driven incident management system with real-time Kanban board, RabbitMQ event bus, full-text search, WebSocket live updates, and Prometheus/Grafana observability stack.",
        technologies: ["Spring Boot", "Angular", "RabbitMQ", "PostgreSQL", "Docker"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/GhostWatch",
        preview: "ghostwatch",
        image: ghostwatch,
      },
    ],
    contactTitle: "GET IN TOUCH",
    codeProjects: "code projects",
    contactName: "Chiheb BEN CHEIKH",
    contactEmail: "contact@chihebbencheikh.com",
    technologies: "Technologies",
    skill: "Technical Expertise",
    Frontend:
      "Languages & Backend: Python, TypeScript, Go, Node.js, Express, FastAPI",
    Backend:
      "Frontend & AI: Next.js, React, Tailwind, React Flow · ReAct, RAG, LoRA/PEFT, LangGraph",
    "DevOps & Tools":
      "DevOps & Security: Docker, Kubernetes, Terraform, GitHub Actions, Bandit, Semgrep, Trivy, SAST/DAST",
    backendProjects: "Full-Stack Projects",
    devopsProjects: "DevOps & Security",
    workExperience: "Work Experience",
    workExperienceList: [
      {
        "img": "/logo.svg",
        "title": "Founder & Software Architect",
        "company": "BiancoToro Technologies",
        "description": "Founded BiancoToro Technologies SUARL in Tunisia. Offering product engineering, agentic AI workflows, application security and embedded engineering. Engagements start with a fixed-scope architecture and security review."
      },
      {
        "img": "/logo.svg",
        "title": "Software Engineering Consultant",
        "company": "Guimauve Digital · ControlResell",
        "description": "Hands-on software engineering for ControlResell, a SaaS product for second-hand resellers."
      },
      {
        "img": "/logo.svg",
        "title": "Principal Engineer",
        "company": "Offmon",
        "description": "Owned engineering across backend microservices, the web frontend, an Android application and cloud operations."
      },
      {
        "img": "/logo.svg",
        "title": "Software Engineer (Freelance)",
        "company": "K-tronik GmbH",
        "description": "Extended a Vue.js / Laravel system and added Cypress end-to-end and PHPUnit coverage."
      },
      {
        "img": "/logo.svg",
        "title": "Shopify Developer (Freelance)",
        "company": "Independent projects",
        "description": "Shopify development alongside product engineering and software architecture work."
      }
    ],
    testimonialsTitle: "Testimonials",
    testimonials: [
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo7tUBb6dq1l0_hXG2lh4C7wcYR-5VtwT7vw&s",
        name: "Tom Inglis",
        email: "tom.inglis@teomach.com",
        testimonial:
          "Chiheb is a confident and diligent software engineer who quickly adapts to complex codebases, delivering efficient, well-tested solutions with React, TypeScript, and Playwright",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6KXBwaj36H7Wvj4sUl09thy2jpdEx_g0QDA&s",
        name: "Mathias Molnar",
        email: "mathias.molnar@friends-in-flats.at",
        testimonial:
          "Chiheb is a talented and detail-oriented software engineer who excels at building performant, reliable systems with Next.js and modern JavaScript frameworks",
      },
    ],
    devopsProjectsList: [
      {
        title: "Sentinel-Remediator — AI Vulnerability Agent",
        description:
          "Autonomous agent that remediates container vulnerabilities end-to-end: a ReAct loop reads scan findings, patches files / Dockerfiles, then rebuilds and validates the image before opening a pull request.",
        technologies: ["Go", "LLM Agents", "ReAct Loop", "Docker", "Next.js"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/Sentinel-Remediator",
        preview: "sentinel",
        image: sentinel,
      },
    ],
    openSourceTitle: "Open Source",
    openSource: [
      {
        "name": "Hugging Face",
        "org": "huggingface_hub",
        "meta": "Filesystem caching",
        "badge": "Merged PR",
        "description": "Fixed duplicated and stale directory listings, including a file lookup that replaced its folder cache. Includes regression tests.",
        "tech": [
          "Python",
          "Caching",
          "Regression tests"
        ],
        "url": "https://github.com/huggingface/huggingface_hub/pull/5099"
      },
      {
        "name": "llama.cpp",
        "org": "ggml-org",
        "meta": "JSON Schema constraints",
        "badge": "Merged PR",
        "description": "Fixed escaped hyphens being rejected during JSON Schema conversion, which could silently discard a string pattern constraint.",
        "tech": [
          "C++",
          "JSON Schema",
          "GBNF"
        ],
        "url": "https://github.com/ggml-org/llama.cpp/pull/29127"
      },
      {
        "name": "Strawberry GraphQL",
        "org": "strawberry-graphql",
        "meta": "Async DataLoader",
        "badge": "Merged PR",
        "description": "Cancel the DataLoader dispatch task when all waiting futures are cancelled.",
        "tech": [
          "Python",
          "Async",
          "GraphQL"
        ],
        "url": "https://github.com/strawberry-graphql/strawberry/pull/4379"
      },
      {
        "name": "Next.js",
        "org": "Vercel",
        "meta": "Middleware matcher",
        "badge": "Open PR",
        "description": "Proposed template-literal support for middleware config.matcher analysis. The pull request is open.",
        "tech": [
          "TypeScript",
          "Middleware",
          "i18n"
        ],
        "url": "https://github.com/vercel/next.js/pull/93150"
      },
      {
        "name": "Bandit",
        "org": "PyCQA",
        "meta": "Python SAST",
        "badge": "Open PR",
        "description": "Proposed detection of locally defined Markup subclasses in the B704 security check. The pull request is open.",
        "tech": [
          "Python",
          "AST",
          "SAST"
        ],
        "url": "https://github.com/PyCQA/bandit/pull/1446"
      },
      {
        "name": "Swiftlet",
        "org": "npm",
        "meta": "Published package",
        "badge": "Author",
        "description": "Published a TypeScript web framework for Node.js with routing, request-body parsing and CORS.",
        "tech": [
          "Node.js",
          "TypeScript",
          "HTTP"
        ],
        "url": "https://www.npmjs.com/package/@chiheb_ben_cheikh/swiftlet"
      }
    ],
  },
  de: {
    navBar: [
      "Startseite",
      "Über uns",
      "Berufserfahrung",
      "Projekte",
      "Open Source",
      "Testimonials",
      "Kontakt",
    ],
    getInTouch: "KONTAKTIEREN SIE UNS",
    name: "Chiheb BEN CHEIKH",
    email: "contact@chihebbencheikh.com",
    I: "Ich bin ",
    qualities: [
      "Chiheb BEN CHEIKH",
      "ein Software Engineer",
      "ein LLM-Builder",
      "Sicherheitsbewusst",
      "Unermüdlich",
    ],
    myInfo: "Gründer · Softwarearchitekt",
    headerTitle:
      "Ich bin Chiheb Ben Cheikh, Gründer von BiancoToro Technologies. Mein Fokus liegt auf Produktentwicklung, agentischer KI und Cloud-Architektur.",
    headerDescription:
      "Ich habe BiancoToro Technologies SUARL in Tunesien gegründet und biete Produktentwicklung, agentische KI und Anwendungssicherheit an. Meine Erfahrung umfasst Backend-Microservices, Web-Frontends, Android-Anwendungen und Cloud-Betrieb, einschließlich einer Principal-Engineering-Rolle bei Offmon. Aktuell arbeite ich mit Guimauve Digital an ControlResell und übernehme auch Shopify-Entwicklungsprojekte. Zu meiner Open-Source-Arbeit gehören gemergte Fixes in Hugging Face, llama.cpp und Strawberry GraphQL.",
    aboutRole: "Gründer & Softwarearchitekt",
    aboutFocus: "Produktentwicklung & angewandte KI",
    educationLabel: "Forschungsmaster",
    education: "Information System Techniques (IST), ENIT, Universität Tunis El Manar. Das Programm wird in Zusammenarbeit mit der TU Braunschweig angeboten.",
    researchLabel: "Forschung in Arbeit",
    researchTitle: "Beyond Teacher Imitation: Provenance-Partitioned Distillation of Vision-Language Models",
    researchDescription: "Destillation von Vision-Language-Modellen mit feldweiser Supervision durch Lehrermodell-Ausgaben, verifizierte Referenzlabels und deterministische Regeln.",
    researchRole: "Mitautor · Forschung und Textarbeit · Unveröffentlichtes Manuskript",
    businessLinkLabel: "Leistungen von BiancoToro entdecken",
    contactDescription: "Für Produktentwicklung, agentische KI-Workflows oder eine Architektur- und Sicherheitsanalyse: Kontakt aufnehmen oder ein Gespräch mit BiancoToro beginnen.",
    businessContactLabel: "Eine Architekturanalyse besprechen",
    openSourceSummary: "Beiträge und Projekte",
    caseStudiesLabel: "Fallstudien lesen",
    profileFacts: [{"value": "AI", "label": "Produktentwicklung · BiancoToro", "color": "#00f0ff", "gauge": 4}, {"value": "IST", "label": "Forschungsmaster · ENIT", "color": "#ff007f", "gauge": 5}, {"value": "OSS", "label": "Gemergte Beiträge", "color": "#ffb800", "gauge": 6}],
    caseStudies: [{"title": "Hugging-Face-Dateisystem-Cache (Englisch)", "url": "/case-studies/hugging-face-filesystem-cache/"}, {"title": "llama.cpp: JSON-Schema-Constraints (Englisch)", "url": "/case-studies/llama-cpp-json-schema/"}],
    headerSkills:
      "Python, TypeScript, Go, JavaScript, SQL, Node.js, Express, FastAPI, Socket.io, Next.js, React, Tailwind, React Flow, Docker, Kubernetes, Terraform, GitHub Actions, Nginx, ReAct Agents, RAG, LoRA/PEFT, LangGraph, Bandit, Semgrep, Trivy, SAST/DAST",
    cvDownload: "Lebenslauf herunterladen",
    moreInfo:
      "Für weitere Informationen überprüfen Sie meinen Lebenslauf in Ihrer bevorzugten Sprache:",
    portfolioTitle: "Projekte",
    role: "Flagship & KI",
    projects: [
      {
        title: "Ghostwire — Live Visual API Builder",
        description:
          "Full-Stack-Echtzeitplattform zum Entwerfen von API-Pipelines als Knoten-Graphen (React Flow, Monaco) auf Express + Socket.io, per Terraform auf AWS ECS Fargate deployt mit GitHub-Actions-CI/CD. Enthält eine agentische (ReAct) SRE-Schleife, die Fehler erkennt, die Ursache lokalisiert und Pipelines automatisch wiederherstellt.",
        technologies: ["Next.js", "Express", "Socket.io", "AWS ECS", "Terraform", "React Flow"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/ghostwire",
        preview: "ghostwire",
        image: ghostwire,
      },
      {
        title: "RAG + LoRA Assistant",
        description:
          "Ein SRE-Wissensassistent mit einem lokalen Qwen2.5-Modell, LoRA-Feinabstimmung und Retrieval über Runbooks.",
        technologies: ["Python", "Qwen2.5-3B", "LoRA / PEFT", "RAG", "LangGraph"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/rag-lora-sre-assistant",
        preview: "rag",
        image: ragAssistant,
      },
    ],
    backendProjectsList: [
      {
        title: "Motorrad-Händler-Plattform",
        description:
          "Full-Stack-Plattform für den Händlerbetrieb — OTP-Authentifizierung, Stripe-Zahlungen, automatisierte Rechnungsstellung und modulare Architektur mit CI/CD und End-to-End-Tests.",
        technologies: ["React", "Node.js", "Stripe", "Docker", "Cypress", "GitHub Actions"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/motorcycle-dealership",
        preview: "motorcycle",
        image: hero,
      },
      {
        title: "FlowForge — Workflow-Automatisierungs-Engine",
        description:
          "Workflow-Automatisierungsprojekt (Mini-Zapier) — visueller DAG-Builder, Webhook-/Cron-Trigger, Verzweigungsbedingungen, Echtzeit-Ausführungsüberwachung und Redis-gestützte Queue-Verarbeitung.",
        technologies: ["Laravel", "Vue.js", "PostgreSQL", "Redis", "Tailwind"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/FlowForge",
        preview: "flowforge",
        image: flowforge,
      },
      {
        title: "GhostWatch — Incident-Management-Plattform",
        description:
          "Event-gesteuertes Incident-Management-System mit Echtzeit-Kanban-Board, RabbitMQ-Event-Bus, Volltextsuche, WebSocket-Live-Updates und Prometheus/Grafana-Observability-Stack.",
        technologies: ["Spring Boot", "Angular", "RabbitMQ", "PostgreSQL", "Docker"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/GhostWatch",
        preview: "ghostwatch",
        image: ghostwatch,
      },
    ],
    devopsProjectsList: [
      {
        title: "Sentinel-Remediator — KI-Schwachstellen-Agent",
        description:
          "Autonomer Agent, der Container-Schwachstellen End-to-End behebt: eine ReAct-Schleife liest Scan-Ergebnisse, patcht Dateien / Dockerfiles und baut das Image neu und validiert es, bevor ein Pull Request eröffnet wird.",
        technologies: ["Go", "LLM Agents", "ReAct Loop", "Docker", "Next.js"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/Sentinel-Remediator",
        preview: "sentinel",
        image: sentinel,
      },
    ],
    openSourceTitle: "Open Source",
    openSource: [
      {
        "name": "Hugging Face",
        "org": "huggingface_hub",
        "meta": "Dateisystem-Cache",
        "badge": "Gemergter PR",
        "description": "Doppelte und veraltete Verzeichniseinträge behoben, einschließlich eines Dateiabrufs, der den Ordner-Cache überschrieb. Mit Regressionstests.",
        "tech": [
          "Python",
          "Caching",
          "Regression tests"
        ],
        "url": "https://github.com/huggingface/huggingface_hub/pull/5099"
      },
      {
        "name": "llama.cpp",
        "org": "ggml-org",
        "meta": "JSON-Schema-Constraints",
        "badge": "Gemergter PR",
        "description": "Fehler bei maskierten Bindestrichen in der JSON-Schema-Konvertierung behoben, durch den eine String-Pattern-Bedingung unbemerkt entfallen konnte.",
        "tech": [
          "C++",
          "JSON Schema",
          "GBNF"
        ],
        "url": "https://github.com/ggml-org/llama.cpp/pull/29127"
      },
      {
        "name": "Strawberry GraphQL",
        "org": "strawberry-graphql",
        "meta": "Asynchroner DataLoader",
        "badge": "Gemergter PR",
        "description": "Den DataLoader-Dispatch-Task abbrechen, wenn alle wartenden Futures abgebrochen wurden.",
        "tech": [
          "Python",
          "Async",
          "GraphQL"
        ],
        "url": "https://github.com/strawberry-graphql/strawberry/pull/4379"
      },
      {
        "name": "Next.js",
        "org": "Vercel",
        "meta": "Middleware-Matcher",
        "badge": "Offener PR",
        "description": "Template-Literal-Unterstützung für die Analyse von middleware config.matcher vorgeschlagen. Der Pull Request ist offen.",
        "tech": [
          "TypeScript",
          "Middleware",
          "i18n"
        ],
        "url": "https://github.com/vercel/next.js/pull/93150"
      },
      {
        "name": "Bandit",
        "org": "PyCQA",
        "meta": "Python-SAST",
        "badge": "Offener PR",
        "description": "Erkennung lokal definierter Markup-Unterklassen im B704-Sicherheitscheck vorgeschlagen. Der Pull Request ist offen.",
        "tech": [
          "Python",
          "AST",
          "SAST"
        ],
        "url": "https://github.com/PyCQA/bandit/pull/1446"
      },
      {
        "name": "Swiftlet",
        "org": "npm",
        "meta": "Veröffentlichtes Paket",
        "badge": "Autor",
        "description": "Ein TypeScript-Web-Framework für Node.js mit Routing, Request-Body-Parsing und CORS veröffentlicht.",
        "tech": [
          "Node.js",
          "TypeScript",
          "HTTP"
        ],
        "url": "https://www.npmjs.com/package/@chiheb_ben_cheikh/swiftlet"
      }
    ],
    contactTitle: "KONTAKTIEREN SIE UNS",
    codeProjects: "Programmierprojekte",
    contactName: "Chiheb BEN CHEIKH",
    contactEmail: "contact@chihebbencheikh.com",
    technologies: "Technologien",
    skill: "Technische Expertise",
    Frontend:
      "Sprachen & Backend: Python, TypeScript, Go, Node.js, Express, FastAPI",
    Backend:
      "Frontend & KI: Next.js, React, Tailwind, React Flow · ReAct, RAG, LoRA/PEFT, LangGraph",
    "DevOps & Tools":
      "DevOps & Sicherheit: Docker, Kubernetes, Terraform, GitHub Actions, Bandit, Semgrep, Trivy, SAST/DAST",
    backendProjects: "Full-Stack-Projekte",
    devopsProjects: "DevOps & Sicherheit",
    workExperience: "Berufserfahrung",
    workExperienceList: [
      {
        "img": "/logo.svg",
        "title": "Gründer & Softwarearchitekt",
        "company": "BiancoToro Technologies",
        "description": "BiancoToro Technologies SUARL in Tunesien gegründet. Angeboten werden Produktentwicklung, agentische KI-Workflows, Anwendungssicherheit und eingebettete Engineering-Unterstützung. Der Einstieg ist eine klar abgegrenzte Architektur- und Sicherheitsanalyse."
      },
      {
        "img": "/logo.svg",
        "title": "Software Engineering Consultant",
        "company": "Guimauve Digital · ControlResell",
        "description": "Praktische Softwareentwicklung für ControlResell, ein SaaS-Produkt für Secondhand-Händler."
      },
      {
        "img": "/logo.svg",
        "title": "Principal Engineer",
        "company": "Offmon",
        "description": "Verantwortung für Backend-Microservices, das Web-Frontend, eine Android-Anwendung und den Cloud-Betrieb."
      },
      {
        "img": "/logo.svg",
        "title": "Software Engineer (Freelance)",
        "company": "K-tronik GmbH",
        "description": "Ein Vue.js-/Laravel-System erweitert und Cypress-End-to-End- sowie PHPUnit-Testabdeckung ergänzt."
      },
      {
        "img": "/logo.svg",
        "title": "Shopify-Entwickler (Freelance)",
        "company": "Eigenständige Projekte",
        "description": "Shopify-Entwicklung neben Produktentwicklung und Softwarearchitektur."
      }
    ],
    testimonials: [
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo7tUBb6dq1l0_hXG2lh4C7wcYR-5VtwT7vw&s",
        name: "Tom Inglis",
        email: "tom.inglis@teomach.com",
        testimonial:
          "Chiheb ist ein selbstbewusster und fleißiger Software Engineer, der sich schnell in komplexe Codebasen einarbeitet und effiziente, gut getestete Lösungen mit React, TypeScript und Playwright liefert.",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6KXBwaj36H7Wvj4sUl09thy2jpdEx_g0QDA&s",
        name: "Mathias Molnar",
        email: "mathias.molnar@friends-in-flats.at",
        testimonial:
          "Chiheb ist ein talentierter und detailorientierter Software Engineer, der sich darauf spezialisiert hat, performante und zuverlässige Systeme mit Next.js und modernen JavaScript-Frameworks zu erstellen.",
      },
    ],
    testimonialsTitle: "Testimonials",
  },
};
