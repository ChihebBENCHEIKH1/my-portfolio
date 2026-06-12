import hero from "../assets/hero.png";
import ghostwire from "../assets/ghostwire.png";
import swifltet from "../assets/swifltet.jpeg";
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
      "Testimonials",
      "Contact",
    ],
    getInTouch: "GET IN TOUCH",
    name: "Chiheb BEN CHEIKH",
    email: "contact@chihebbencheikh.com",
    I: "I'm",
    qualities: [
      "Chiheb BEN CHEIKH",
      "a Full-Stack Engineer",
      "a Problem Solver",
      "Detail-Oriented",
      "Relentless",
    ],
    myInfo: "Full-Stack Engineer · Problem Solver · Builder",
    headerTitle:
      "Hi, I'm Chiheb Ben Cheikh — I architect distributed systems and ship production-grade platforms. I thrive where reliability, scale, and velocity intersect",
    headerDescription:
      "I design and build the systems behind the interface — from high-concurrency monitoring engines on GCP handling real-time telemetry across distributed microservices, to AI-powered remediation agents that autonomously fix container vulnerabilities. My work spans the full stack: React and Next.js frontends, FastAPI and Spring Boot backends, event-driven pipelines with RabbitMQ, and production infrastructure orchestrated with Docker, Kubernetes, and Terraform. I've engineered CI/CD pipelines that cut release cycles, delivered cross-platform mobile solutions with 99.9% uptime visibility, and built visual workflow engines from scratch. Every system I touch is designed for resilience, observability, and zero-downtime operation",
    headerSkills:
      "TypeScript, React, Next.js, Vue.js, Angular, React Native, Node.js, FastAPI, Spring Boot, Go, Laravel, Docker, Kubernetes, Terraform, GCP, RabbitMQ, WebSockets, CI/CD, GitHub Actions, Cypress, Playwright",
    cvDownload: "CV DOWNLOAD",
    moreInfo: "For more information check my CV in your preferred language:",
    portfolioTitle: "Projects",
    role: "Systems & Platform",

    projects: [
      {
        title: "Ghostwire — Visual API Pipeline Builder",
        description:
          "Full-stack DevOps platform where you visually design API pipelines as node graphs, deploy them to real Docker infrastructure, stream logs live via WebSocket, and use an AI agent (ReAct loop) to automatically diagnose and remediate failures.",
        technologies: ["React", "Node.js", "Docker", "WebSocket", "AI Agent"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/The-Live-Visual-API-Builder",
        image: ghostwire,
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
        title: "Swiftlet — Zero-Dep Node.js Web Framework",
        description:
          "Minimalist web framework built from scratch with pure Node.js. Dynamic routing, body parsing, and CORS — zero dependencies. Published on npm.",
        technologies: ["Node.js", "HTTP", "Routing", "npm Package"],
        websiteURL: "https://www.npmjs.com/package/@chiheb_ben_cheikh/swiftlet",
        image: swifltet,
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
      "Production Stack: Go, Node.js, TypeScript, Next.js, Docker",
    Backend:
      "Ecosystem Polyglot: Python (FastAPI/Django), PHP (Laravel), Java (Spring Boot)",
    "DevOps & Tools":
      "Cloud & DevOps: GCP, Kubernetes, Terraform, GitHub Actions, CI/CD",
    backendProjects: "Full-Stack projects",
    devopsProjects: "DevOps & Security",
    workExperience: "Work Experience",
    workExperienceList: [
      {
        img: teomach,
        title: "Full Stack Engineer",
        company: "Teomach Limited",
        description:
          "Architected a high-concurrency monitoring engine on GCP using FastAPI, handling real-time telemetry from distributed microservices. Delivered cross-platform React Native solutions with 99.9% uptime visibility",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIc86K_dp6Nk80hzIwl6G3tUjtz4iQBtVIxA&s",
        title: "Full Stack Developer",
        company: "K-tronik GmbH",
        description:
          "Maintained and extended an Application Management System with Laravel and Vue.js. Engineered automated processing features while ensuring zero-regression through PHPUnit and Cypress testing",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoRKIXkbvCRWNgWBm5pfWeLrhu1mfOQ-hrCiS8Zc1kIw7QxcHwAWAwY7x6uR_7nPjvD28&usqp=CAU",
        title: "Full Stack Developer",
        company: "Friends in flat",
        description:
          "Built Next.js interfaces with Prisma ORM for database management, improving user experience and data layer architecture",
      },
    ],
    testimonialsTitle: "Testimonials",
    testimonials: [
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo7tUBb6dq1l0_hXG2lh4C7wcYR-5VtwT7vw&s",
        name: "Tom Inglis",
        email: "tom.inglis@toemach.com",
        testimonial:
          "Chiheb is a confident and diligent developer who quickly adapts to complex codebases, delivering efficient frontend solutions with React, TypeScript, and Playwright",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6KXBwaj36H7Wvj4sUl09thy2jpdEx_g0QDA&s",
        name: "Mathias Molnar",
        email: "mathias.molnar@friends-in-flats.at",
        testimonial:
          "Chiheb is a talented and detail-oriented developer who excels in building performant, user-friendly interfaces with Next.js and modern JavaScript frameworks",
      },
    ],
    devopsProjectsList: [
      {
        title: "Sentinel-Remediator — AI Vulnerability Agent",
        description:
          "Autonomous AI agent that ingests container vulnerability scans, generates fixes via a ReAct reasoning loop, verifies them through local Docker builds, and creates pull requests for human review.",
        technologies: ["Go", "Next.js", "Docker", "AI Agent", "ReAct Loop"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/Sentinel-Remediator",
        image: sentinel,
      },
    ],
  },
  de: {
    navBar: [
      "Startseite",
      "Über uns",
      "Berufserfahrung",
      "Projekte",
      "Testimonials",
      "Kontakt",
    ],
    getInTouch: "KONTAKTIEREN SIE UNS",
    name: "Chiheb BEN CHEIKH",
    email: "contact@chihebbencheikh.com",
    I: "Ich bin ",
    qualities: [
      "Chiheb BEN CHEIKH",
      "ein Full-Stack Engineer",
      "ein Problemlöser",
      "Detailorientiert",
      "Unermüdlich",
    ],
    myInfo: "Full-Stack Engineer · Problemlöser · Builder",
    headerTitle:
      "Hallo, ich bin Chiheb Ben Cheikh — Ich entwerfe verteilte Systeme und liefere produktionsreife Plattformen. Ich gedeihe dort, wo Zuverlässigkeit, Skalierung und Geschwindigkeit zusammentreffen",
    headerDescription:
      "Ich entwerfe und baue die Systeme hinter der Oberfläche — von hochparallelen Monitoring-Engines auf GCP, die Echtzeit-Telemetrie aus verteilten Microservices verarbeiten, bis hin zu KI-gestützten Remediations-Agenten, die Container-Schwachstellen autonom beheben. Meine Arbeit erstreckt sich über den gesamten Stack: React- und Next.js-Frontends, FastAPI- und Spring-Boot-Backends, Event-Driven-Pipelines mit RabbitMQ und Produktionsinfrastruktur orchestriert mit Docker, Kubernetes und Terraform. Jedes System, das ich berühre, ist auf Resilienz, Observability und Zero-Downtime-Betrieb ausgelegt",
    headerSkills:
      "TypeScript, React, Next.js, Vue.js, Angular, React Native, Node.js, FastAPI, Spring Boot, Go, Laravel, Docker, Kubernetes, Terraform, GCP, RabbitMQ, WebSockets, CI/CD, GitHub Actions, Cypress, Playwright",
    cvDownload: "Lebenslauf herunterladen",
    moreInfo:
      "Für weitere Informationen überprüfen Sie meinen Lebenslauf in Ihrer bevorzugten Sprache:",
    portfolioTitle: "Projekte",
    role: "Systeme & Plattformen",
    projects: [
      {
        title: "Ghostwire — Visueller API-Pipeline-Builder",
        description:
          "Full-Stack-DevOps-Plattform, auf der API-Pipelines als Knoten-Graphen visuell entworfen, auf echte Docker-Infrastruktur deployt, Logs live via WebSocket gestreamt und Fehler durch einen KI-Agenten (ReAct-Loop) automatisch diagnostiziert und behoben werden.",
        technologies: ["React", "Node.js", "Docker", "WebSocket", "AI Agent"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/The-Live-Visual-API-Builder",
        image: ghostwire,
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
        title: "Swiftlet — Zero-Dep Node.js Web-Framework",
        description:
          "Minimalistisches Web-Framework von Grund auf mit purem Node.js gebaut. Dynamisches Routing, Body-Parsing und CORS — ohne Abhängigkeiten. Auf npm veröffentlicht.",
        technologies: ["Node.js", "HTTP", "Routing", "npm Package"],
        websiteURL: "https://www.npmjs.com/package/@chiheb_ben_cheikh/swiftlet",
        image: swifltet,
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
          "Autonomer KI-Agent, der Container-Schwachstellenscans aufnimmt, Fixes über eine ReAct-Reasoning-Schleife generiert, sie durch lokale Docker-Builds verifiziert und Pull Requests zur menschlichen Überprüfung erstellt.",
        technologies: ["Go", "Next.js", "Docker", "AI Agent", "ReAct Loop"],
        websiteURL: "https://github.com/ChihebBENCHEIKH1/Sentinel-Remediator",
        image: sentinel,
      },
    ],
    contactTitle: "KONTAKTIEREN SIE UNS",
    codeProjects: "Programmierprojekte",
    contactName: "Chiheb BEN CHEIKH",
    contactEmail: "contact@chihebbencheikh.com",
    technologies: "Technologien",
    skill: "Technische Expertise",
    Frontend:
      "Production Stack: Go, Node.js, TypeScript, Next.js, Docker",
    Backend:
      "Ecosystem Polyglot: Python (FastAPI/Django), PHP (Laravel), Java (Spring Boot)",
    "DevOps & Tools":
      "Cloud & DevOps: GCP, Kubernetes, Terraform, GitHub Actions, CI/CD",
    backendProjects: "Full-Stack-Projekte",
    devopsProjects: "DevOps & Sicherheit",
    workExperience: "Berufserfahrung",
    workExperienceList: [
      {
        img: teomach,
        title: "Full Stack Engineer",
        company: "Teomach Limited",
        description:
          "Architektur einer hochparallelen Monitoring-Engine auf GCP mit FastAPI, Verarbeitung von Echtzeit-Telemetrie aus verteilten Microservices. Lieferung plattformübergreifender React-Native-Lösungen mit 99,9% Uptime-Sichtbarkeit",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIc86K_dp6Nk80hzIwl6G3tUjtz4iQBtVIxA&s",
        title: "Full Stack Developer",
        company: "K-tronik GmbH",
        description:
          "Wartung und Erweiterung eines Application Management Systems mit Laravel und Vue.js. Entwicklung automatisierter Verarbeitungsfunktionen bei Zero-Regression durch PHPUnit- und Cypress-Tests",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoRKIXkbvCRWNgWBm5pfWeLrhu1mfOQ-hrCiS8Zc1kIw7QxcHwAWAwY7x6uR_7nPjvD28&usqp=CAU",
        title: "Full Stack Developer",
        company: "Friends in flat",
        description:
          "Entwicklung von Next.js-Interfaces mit Prisma ORM für Datenbankmanagement, Verbesserung der Benutzererfahrung und Datenschicht-Architektur",
      },
    ],
    testimonials: [
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo7tUBb6dq1l0_hXG2lh4C7wcYR-5VtwT7vw&s",
        name: "Tom Inglis",
        email: "tom.inglis@toemach.com",
        testimonial:
          "Chiheb ist ein selbstbewusster und fleißiger Entwickler, der sich schnell in komplexe Codebasen einarbeitet und effiziente Frontend-Lösungen mit React, TypeScript und Playwright liefert.",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6KXBwaj36H7Wvj4sUl09thy2jpdEx_g0QDA&s",
        name: "Mathias Molnar",
        email: "mathias.molnar@friends-in-flats.at",
        testimonial:
          "Chiheb ist ein talentierter und detailorientierter Entwickler, der sich darauf spezialisiert hat, performante und benutzerfreundliche Oberflächen mit Next.js und modernen JavaScript-Frameworks zu erstellen.",
      },
    ],
    testimonialsTitle: "Testimonials",
  },
};
