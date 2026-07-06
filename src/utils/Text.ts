import hero from "../assets/hero.png";
import ghostwire from "../assets/ghostwire.png";
import sentinel from "../assets/sentinel-dashboard.png";
import flowforge from "../assets/flowforge.png";
import ghostwatch from "../assets/ghostwatch.png";
import teomach from "../assets/teomach.png";
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
    myInfo: "Software Engineer · LLM & Secure Systems · Builder",
    headerTitle:
      "Hi, I'm Chiheb Ben Cheikh — a Software Engineer building LLM-powered, agentic AI systems and shipping them securely, end-to-end, from zero to production.",
    headerDescription:
      "I'm a Software Engineer focused on applied AI — I design LLM-powered, agentic systems (ReAct agents, RAG pipelines, LoRA / PEFT fine-tuning) and ship them as real products. I've built an autonomous agent that remediates container vulnerabilities end-to-end, an AI SRE loop that self-heals live pipelines, and a fine-tuned local Qwen assistant grounded with RAG. That AI work rides on a full production stack — Node.js / Express, FastAPI, Next.js / React — with security (SAST / DAST) and CI/CD built in. At Teomach I shipped real-time telemetry microservices on GCP handling thousands of events per minute, and I contribute to open source (Next.js, Bandit). Every system I build is designed for reliability, security, and velocity.",
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
        websiteURL: "https://github.com/ChihebBENCHEIKH1/The-Live-Visual-API-Builder",
        image: ghostwire,
      },
      {
        title: "RAG + LoRA Assistant",
        description:
          "Fine-tuned a local Qwen2.5-3B with LoRA (~1% of parameters) and paired it with RAG for grounded, domain-specific answers — delivering specialised performance at a fraction of full fine-tuning cost.",
        technologies: ["Python", "Qwen2.5-3B", "LoRA / PEFT", "RAG", "LangGraph"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1",
        image: hero,
      },
    ],
    backendProjectsList: [
      {
        title: "Motorcycle Dealership Platform",
        description:
          "Full-stack platform for managing dealership operations — OTP authentication, Stripe payments, automated invoicing, and modular architecture with CI/CD and end-to-end testing.",
        technologies: ["React", "Node.js", "Stripe", "Docker", "Cypress", "GitHub Actions"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/Motorcyle-dealership",
        image: hero,
      },
      {
        title: "FlowForge — Workflow Automation Engine",
        description:
          "Production-grade workflow automation platform (mini Zapier) — visual DAG builder, webhook/cron triggers, branching conditions, real-time execution monitoring, and Redis-backed queue processing.",
        technologies: ["Laravel", "Vue.js", "PostgreSQL", "Redis", "Tailwind"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/FlowForge",
        image: flowforge,
      },
      {
        title: "GhostWatch — Incident Management Platform",
        description:
          "Event-driven incident management system with real-time Kanban board, RabbitMQ event bus, full-text search, WebSocket live updates, and Prometheus/Grafana observability stack.",
        technologies: ["Spring Boot", "Angular", "RabbitMQ", "PostgreSQL", "Docker"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/GhostWatch",
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
        img: teomach,
        title: "Software Engineer",
        company: "Teomach",
        description:
          "Shipped real-time device-telemetry microservices on GCP (thousands of events/min, sub-second latency) with device-driven alerting and an Android companion app. Set up GitHub Actions CI/CD with automated AI code review and rebuilt the Cenefits React frontend in TypeScript. (2023–2025)",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIc86K_dp6Nk80hzIwl6G3tUjtz4iQBtVIxA&s",
        title: "Software Engineer (Freelance)",
        company: "K-tronik GmbH",
        description:
          "Extended a Vue.js / Laravel production system and added Cypress end-to-end and PHPUnit coverage to cut regressions. (2024–2025)",
      },
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
        image: sentinel,
      },
    ],
    openSourceTitle: "Open Source",
    openSource: [
      {
        name: "Next.js",
        org: "Vercel",
        meta: "139k★",
        badge: "Merged PR",
        description:
          "Contributed template-literal support to middleware config.matcher extraction, unlocking dynamic i18n matchers in one of the most-used React frameworks.",
        tech: ["TypeScript", "Middleware", "i18n"],
        url: "https://github.com/vercel/next.js/pull/93150",
      },
      {
        name: "Bandit",
        org: "PyCQA",
        meta: "Python SAST",
        badge: "Security Fix",
        description:
          "Extended the B704 check to catch locally-defined Markup subclasses, closing a false-negative linked to CVE-2025-54384.",
        tech: ["Python", "AST", "SAST"],
        url: "https://github.com/PyCQA/bandit",
      },
      {
        name: "Swiftlet",
        org: "npm",
        meta: "Published",
        badge: "Author",
        description:
          "Authored and published a typed, Jest-tested, zero-dependency Node.js web framework — routing, body parsing, and CORS built from pure Node HTTP.",
        tech: ["Node.js", "TypeScript", "Jest"],
        url: "https://www.npmjs.com/package/@chiheb_ben_cheikh/swiftlet",
      },
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
    myInfo: "Software Engineer · LLM & sichere Systeme · Builder",
    headerTitle:
      "Hallo, ich bin Chiheb Ben Cheikh — ein Software Engineer, der LLM-gestützte, agentische KI-Systeme baut und sie sicher End-to-End von null bis in die Produktion bringt.",
    headerDescription:
      "Ich bin ein Software Engineer mit Fokus auf angewandte KI — ich entwerfe LLM-gestützte, agentische Systeme (ReAct-Agenten, RAG-Pipelines, LoRA / PEFT-Feinabstimmung) und liefere sie als echte Produkte aus. Ich habe einen autonomen Agenten gebaut, der Container-Schwachstellen End-to-End behebt, eine KI-SRE-Schleife, die Live-Pipelines selbst heilt, und einen feinabgestimmten lokalen Qwen-Assistenten mit RAG. Diese KI-Arbeit läuft auf einem vollständigen Produktions-Stack — Node.js / Express, FastAPI, Next.js / React — mit Sicherheit (SAST / DAST) und CI/CD von Anfang an. Bei Teomach habe ich Echtzeit-Telemetrie-Microservices auf GCP ausgeliefert (Tausende Events pro Minute), und ich trage zu Open Source bei (Next.js, Bandit). Jedes System, das ich baue, ist auf Zuverlässigkeit, Sicherheit und Geschwindigkeit ausgelegt.",
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
        websiteURL: "https://github.com/ChihebBENCHEIKH1/The-Live-Visual-API-Builder",
        image: ghostwire,
      },
      {
        title: "RAG + LoRA Assistant",
        description:
          "Ein lokales Qwen2.5-3B mit LoRA (~1% der Parameter) feinabgestimmt und mit RAG kombiniert für fundierte, domänenspezifische Antworten — spezialisierte Leistung zu einem Bruchteil der Kosten eines vollständigen Fine-Tunings.",
        technologies: ["Python", "Qwen2.5-3B", "LoRA / PEFT", "RAG", "LangGraph"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1",
        image: hero,
      },
    ],
    backendProjectsList: [
      {
        title: "Motorrad-Händler-Plattform",
        description:
          "Full-Stack-Plattform für den Händlerbetrieb — OTP-Authentifizierung, Stripe-Zahlungen, automatisierte Rechnungsstellung und modulare Architektur mit CI/CD und End-to-End-Tests.",
        technologies: ["React", "Node.js", "Stripe", "Docker", "Cypress", "GitHub Actions"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/Motorcyle-dealership",
        image: hero,
      },
      {
        title: "FlowForge — Workflow-Automatisierungs-Engine",
        description:
          "Produktionsreife Workflow-Automatisierungsplattform (Mini-Zapier) — visueller DAG-Builder, Webhook-/Cron-Trigger, Verzweigungsbedingungen, Echtzeit-Ausführungsüberwachung und Redis-gestützte Queue-Verarbeitung.",
        technologies: ["Laravel", "Vue.js", "PostgreSQL", "Redis", "Tailwind"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/FlowForge",
        image: flowforge,
      },
      {
        title: "GhostWatch — Incident-Management-Plattform",
        description:
          "Event-gesteuertes Incident-Management-System mit Echtzeit-Kanban-Board, RabbitMQ-Event-Bus, Volltextsuche, WebSocket-Live-Updates und Prometheus/Grafana-Observability-Stack.",
        technologies: ["Spring Boot", "Angular", "RabbitMQ", "PostgreSQL", "Docker"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/GhostWatch",
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
        image: sentinel,
      },
    ],
    openSourceTitle: "Open Source",
    openSource: [
      {
        name: "Next.js",
        org: "Vercel",
        meta: "139k★",
        badge: "Gemergter PR",
        description:
          "Template-Literal-Unterstützung zur Extraktion von middleware config.matcher beigetragen und damit dynamische i18n-Matcher in einem der meistgenutzten React-Frameworks ermöglicht.",
        tech: ["TypeScript", "Middleware", "i18n"],
        url: "https://github.com/vercel/next.js/pull/93150",
      },
      {
        name: "Bandit",
        org: "PyCQA",
        meta: "Python SAST",
        badge: "Sicherheitsfix",
        description:
          "Den B704-Check erweitert, um lokal definierte Markup-Subklassen zu erkennen, und einen False-Negative im Zusammenhang mit CVE-2025-54384 geschlossen.",
        tech: ["Python", "AST", "SAST"],
        url: "https://github.com/PyCQA/bandit",
      },
      {
        name: "Swiftlet",
        org: "npm",
        meta: "Veröffentlicht",
        badge: "Autor",
        description:
          "Ein typisiertes, mit Jest getestetes, abhängigkeitsfreies Node.js-Web-Framework verfasst und veröffentlicht — Routing, Body-Parsing und CORS aus purem Node-HTTP.",
        tech: ["Node.js", "TypeScript", "Jest"],
        url: "https://www.npmjs.com/package/@chiheb_ben_cheikh/swiftlet",
      },
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
        img: teomach,
        title: "Software Engineer",
        company: "Teomach",
        description:
          "Echtzeit-Gerätetelemetrie-Microservices auf GCP ausgeliefert (Tausende Events/Min, Latenz unter einer Sekunde) mit gerätegesteuertem Alerting und einer Android-Begleit-App. GitHub-Actions-CI/CD mit automatisiertem KI-Code-Review aufgesetzt und das Cenefits-React-Frontend in TypeScript neu gebaut. (2023–2025)",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIc86K_dp6Nk80hzIwl6G3tUjtz4iQBtVIxA&s",
        title: "Software Engineer (Freelance)",
        company: "K-tronik GmbH",
        description:
          "Ein Vue.js- / Laravel-Produktionssystem erweitert und Cypress-End-to-End- sowie PHPUnit-Abdeckung ergänzt, um Regressionen zu reduzieren. (2024–2025)",
      },
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
