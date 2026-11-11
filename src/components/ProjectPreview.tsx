import "./ProjectPreview.css";

import type { PreviewKind } from "./projectPreviewData";
const NAMES: Record<PreviewKind, string> = {
  ghostwire: "ghostwire", rag: "local intelligence", motorcycle: "the dealership",
  flowforge: "flowforge", ghostwatch: "ghostwatch", sentinel: "sentinel",
};

function GraphNode({ x, y, title, detail, glyph, accent = false }: { x: number; y: number; title: string; detail: string; glyph: string; accent?: boolean }) {
  return <g className={accent ? "preview-node preview-node-accent" : "preview-node"} transform={`translate(${x} ${y})`}>
    <rect width="128" height="61" rx="10" />
    <rect className="preview-node-icon" x="10" y="15" width="28" height="28" rx="7" />
    <text className="preview-glyph" x="24" y="34" textAnchor="middle">{glyph}</text>
    <text className="preview-node-title" x="47" y="27">{title}</text>
    <text className="preview-node-detail" x="47" y="42">{detail}</text>
    <circle className="preview-port" cx="0" cy="30" r="3" /><circle className="preview-port" cx="128" cy="30" r="3" />
  </g>;
}

function Ghostwire({ de }: { de: boolean }) {
  return <div className="preview-stage preview-graph-stage">
    <div className="preview-workspace-label">API PIPELINE <span>React Flow / Socket.io</span></div>
    <svg viewBox="0 0 510 218" className="preview-graph" fill="none">
      <g className="preview-connections"><path d="M155 66H190Q207 66 207 88V135Q207 154 228 154H258" /><path d="M155 167H190Q208 167 208 158H258" /><path d="M385 154H408Q433 154 433 124V88" /></g>
      <g className="preview-packets"><path d="M155 66H190Q207 66 207 88V135Q207 154 228 154H258" /><path d="M155 167H190Q208 167 208 158H258" /></g>
      <GraphNode x={27} y={36} title="HTTP API" detail={de ? "Anfrage" : "Request"} glyph="↗" />
      <GraphNode x={27} y={137} title="Transform" detail="Pipeline" glyph="{ }" />
      <GraphNode x={258} y={124} title="Agent" detail="ReAct / SRE" glyph="✳" accent />
      <g transform="translate(362 26)"><rect className="preview-deploy" width="119" height="61" rx="10" /><text className="preview-node-title" x="17" y="26">Deploy ↗</text><text className="preview-node-detail" x="17" y="43">AWS Fargate</text></g>
    </svg>
    <div className="preview-terminal"><span>›</span>{de ? "Erkennen → analysieren → wiederherstellen" : "Detect → diagnose → recover"}<i /></div>
  </div>;
}

function Rag({ de }: { de: boolean }) {
  return <div className="preview-stage preview-rag-stage">
    <div className="preview-rag-docs"><div className="preview-paper preview-paper-back" /><div className="preview-paper"><span>⌘</span><b>{de ? "Wissensbasis" : "Knowledge base"}</b><i /><i /><i /><small>CONTEXT / RAG</small></div></div>
    <span className="preview-rag-link" />
    <div className="preview-model"><span>✳</span><strong>Qwen2.5</strong><small>LOCAL + LoRA</small></div>
    <div className="preview-answer"><span className="preview-answer-spark">✧</span><div><strong>{de ? "Antwort mit Kontext" : "Grounded answers"}</strong><p>{de ? "Eigene Quellen. Lokales Modell." : "Your sources. A local model."}</p></div><span className="preview-source-tag">RAG ↗</span></div>
  </div>;
}

function Motorcycle({ image, de }: { image: string; de: boolean }) {
  return <div className="preview-stage preview-commerce-stage">
    <div className="preview-store-window"><div className="preview-store-address"><span />dealership / showroom</div><img src={image} alt="" width="1840" height="961" loading="lazy" decoding="async" /></div>
    <div className="preview-checkout"><span className="preview-checkout-icon">↗</span><strong>{de ? "Vom Besuch zum Kauf" : "From visit to purchase"}</strong><div>{["OTP", "Stripe", de ? "Rechnung" : "Invoice"].map((label, index) => <span key={label}><i>{index+1}</i>{label}</span>)}</div></div>
  </div>;
}

function FlowForge({ de }: { de: boolean }) {
  return <div className="preview-stage preview-flow-stage">
    <div className="preview-flow-label"><span>↯</span><strong>{de ? "Verbinden. Verzweigen. Ausführen." : "Connect. Branch. Run."}</strong></div>
    <svg viewBox="0 0 510 200" className="preview-graph" fill="none">
      <g className="preview-connections"><path d="M146 99h34q18 0 18-20V54h36" /><path d="M146 99h34q18 0 18 20v25h36" /><path d="M363 54h18q20 0 20 20v25h46" /><path d="M363 144h18q20 0 20-20V99h46" /></g>
      <g className="preview-packets"><path d="M146 99h34q18 0 18-20V54h36" /><path d="M363 54h18q20 0 20 20v25h46" /></g>
      <GraphNode x={18} y={69} title="Webhook" detail="TRIGGER" glyph="↯" accent />
      <GraphNode x={235} y={24} title={de ? "Bedingung" : "Condition"} detail="BRANCH" glyph="◇" />
      <GraphNode x={235} y={114} title="Redis" detail="JOB QUEUE" glyph="≋" />
      <circle className="preview-flow-end" cx="459" cy="99" r="20" /><text className="preview-glyph" x="459" y="105" textAnchor="middle">↗</text>
    </svg>
    <div className="preview-flow-footer"><span>WEBHOOK / CRON</span><span>{de ? "Visuelle Workflows" : "Visual workflows"}</span></div>
  </div>;
}

function GhostWatch({ de }: { de: boolean }) {
  const columns = de ? ["Eingang", "In Arbeit", "Gelöst"] : ["Incoming", "Investigating", "Resolved"];
  const tasks = de ? [["API-Meldung", "Warteschlange"], ["Analyse"], ["Wiederherstellung"]] : [["API alert", "Queue event"], ["Investigation"], ["Recovery"]];
  return <div className="preview-stage preview-watch-stage">
    <div className="preview-watch-header"><span>INCIDENT BOARD</span><span>◉ WebSocket</span></div>
    <div className="preview-kanban">{columns.map((column, index) => <div className={`preview-kanban-column preview-kanban-${index}`} key={column}><div className="preview-kanban-heading"><i />{column}</div>{tasks[index].map((task, taskIndex) => <div className="preview-ticket" key={task}><span>{task}</span><i /><i /><div><b>{index === 2 ? "✓" : "·"}</b><span>{taskIndex === 0 ? "EVENT" : "QUEUE"}</span></div></div>)}</div>)}</div>
    <div className="preview-event-bus"><span>RabbitMQ</span><i /><span>{de ? "Ereignisse → Team" : "Events → team"}</span></div>
  </div>;
}

function Sentinel({ de }: { de: boolean }) {
  return <div className="preview-stage preview-sentinel-stage">
    <div className="preview-shield"><svg viewBox="0 0 100 120" fill="none"><path d="M50 7 88 22v33c0 27-16 45-38 58C28 100 12 82 12 55V22Z" /><path d="m34 58 12 12 23-27" /></svg><span>ReAct</span></div>
    <div className="preview-remediation"><div className="preview-remediation-head">SENTINEL / AGENT</div>{[de ? "Befunde lesen" : "Read scan findings", de ? "Dateien korrigieren" : "Patch source files", de ? "Build validieren" : "Validate the build"].map((step, index) => <div className="preview-remediation-step" key={step}><span>0{index+1}</span><strong>{step}</strong><i>✓</i></div>)}<div className="preview-pull-request"><span>⑂</span> {de ? "Pull Request öffnen" : "Open a pull request"} <b>↗</b></div></div>
  </div>;
}

export function ProjectPreview({ kind, image, de }: { kind: PreviewKind; image: string; de: boolean }) {
  return <div className={`project-preview preview-${kind}`} aria-hidden="true">
    <div className="preview-chrome"><span className="preview-window-dots"><i /><i /><i /></span><span>{NAMES[kind]}</span><span className="preview-concept-label">{de ? "KONZEPT" : "CONCEPT"}</span></div>
    {kind === "ghostwire" && <Ghostwire de={de} />}
    {kind === "rag" && <Rag de={de} />}
    {kind === "motorcycle" && <Motorcycle image={image} de={de} />}
    {kind === "flowforge" && <FlowForge de={de} />}
    {kind === "ghostwatch" && <GhostWatch de={de} />}
    {kind === "sentinel" && <Sentinel de={de} />}
  </div>;
}
