import { useState, useEffect, useRef } from "react";

// ─── DESIGN SYSTEM ───────────────────────────────────────────────────────────
// Aesthetic: Dark editorial ops center — think Bloomberg terminal meets Figma
// Palette: Near-black base, amber accents, soft jade for success, crimson for alerts
// Typography: Departure Mono (code feel for precision) + Libre Baskerville (editorial authority)

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@300;400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0b0d;
    --bg-2: #0f1114;
    --bg-3: #141720;
    --bg-4: #1a1f2e;
    --border: rgba(255,255,255,0.06);
    --border-bright: rgba(255,255,255,0.12);
    --text: #e8e9eb;
    --text-dim: #7a7f8a;
    --text-muted: #454a56;
    --amber: #f5a623;
    --amber-dim: rgba(245,166,35,0.15);
    --amber-glow: rgba(245,166,35,0.4);
    --jade: #1db97b;
    --jade-dim: rgba(29,185,123,0.12);
    --crimson: #e84040;
    --crimson-dim: rgba(232,64,64,0.12);
    --blue: #4a9eff;
    --blue-dim: rgba(74,158,255,0.12);
    --purple: #9b6dff;
    --purple-dim: rgba(155,109,255,0.1);
  }

  html, body, #root { height: 100%; background: var(--bg); color: var(--text); }
  
  body {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .app {
    display: grid;
    grid-template-rows: 52px 1fr;
    grid-template-columns: 220px 1fr;
    height: 100vh;
    overflow: hidden;
  }

  /* ── TOPBAR ── */
  .topbar {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-2);
    gap: 16px;
    position: relative;
    z-index: 100;
  }

  .topbar-logo {
    font-family: 'Libre Baskerville', serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .topbar-logo .logo-dot {
    width: 7px; height: 7px;
    background: var(--amber);
    border-radius: 50%;
    animation: pulse-amber 2.5s ease-in-out infinite;
  }

  @keyframes pulse-amber {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .topbar-sep { width: 1px; height: 20px; background: var(--border); }

  .topbar-session {
    font-size: 11px;
    color: var(--text-muted);
    display: flex; align-items: center; gap: 6px;
  }

  .session-badge {
    background: var(--bg-4);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 2px 6px;
    font-size: 10px;
    color: var(--text-dim);
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .topbar-right {
    margin-left: auto;
    display: flex; align-items: center; gap: 10px;
  }

  .mode-selector {
    display: flex;
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .mode-btn {
    padding: 4px 10px;
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s;
  }

  .mode-btn.active {
    background: var(--amber-dim);
    color: var(--amber);
  }

  .mode-btn:hover:not(.active) { background: rgba(255,255,255,0.04); color: var(--text-dim); }

  .e-stop {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 12px;
    background: var(--crimson-dim);
    border: 1px solid rgba(232,64,64,0.3);
    border-radius: 4px;
    color: var(--crimson);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'JetBrains Mono', monospace;
  }
  .e-stop:hover { background: rgba(232,64,64,0.25); border-color: rgba(232,64,64,0.5); }
  .e-stop-dot { width: 6px; height: 6px; background: var(--crimson); border-radius: 50%; }

  .avatar {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, var(--purple), var(--amber));
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white;
    cursor: pointer;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    background: var(--bg-2);
    border-right: 1px solid var(--border);
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
  }

  .sidebar-section {
    padding: 10px 16px 4px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .nav-item {
    display: flex; align-items: center;
    padding: 8px 16px;
    gap: 10px;
    cursor: pointer;
    transition: all 0.12s;
    font-size: 12px;
    color: var(--text-dim);
    border-left: 2px solid transparent;
    position: relative;
  }

  .nav-item:hover { background: rgba(255,255,255,0.03); color: var(--text); }

  .nav-item.active {
    background: var(--amber-dim);
    color: var(--amber);
    border-left-color: var(--amber);
  }

  .nav-icon { font-size: 14px; width: 16px; text-align: center; flex-shrink: 0; }

  .nav-badge {
    margin-left: auto;
    background: var(--crimson);
    color: white;
    font-size: 9px;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 8px;
    min-width: 16px;
    text-align: center;
  }

  .nav-badge.soft { background: var(--blue); }
  .nav-badge.pending { background: var(--amber); color: #1a1200; }

  .sidebar-bottom {
    margin-top: auto;
    padding: 12px;
    border-top: 1px solid var(--border);
  }

  .health-score {
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 12px;
  }

  .health-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 6px;
    display: flex; justify-content: space-between;
  }

  .health-number {
    font-size: 22px; font-weight: 700;
    font-family: 'Libre Baskerville', serif;
    color: var(--jade);
    line-height: 1;
  }

  .health-bar {
    height: 3px; background: var(--bg-4);
    border-radius: 2px; margin-top: 6px; overflow: hidden;
  }

  .health-fill {
    height: 100%; background: var(--jade);
    border-radius: 2px;
    transition: width 0.8s ease;
  }

  /* ── MAIN CONTENT ── */
  .main {
    overflow-y: auto;
    background: var(--bg);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ── PANELS ── */
  .panel {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .panel-header {
    display: flex; align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    gap: 10px;
  }

  .panel-title {
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--text-dim);
  }

  .panel-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--jade);
    animation: pulse-jade 3s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes pulse-jade { 0%,100%{opacity:1}50%{opacity:0.4} }

  .panel-header-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }

  /* ── PIPELINE STATUS ── */
  .pipeline-stages {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .stage-row {
    display: flex; align-items: center; gap: 12px;
    font-size: 11px;
  }

  .stage-num {
    width: 22px; height: 22px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700;
    flex-shrink: 0;
  }

  .stage-num.done { background: var(--jade-dim); color: var(--jade); border: 1px solid rgba(29,185,123,0.3); }
  .stage-num.active { background: var(--amber-dim); color: var(--amber); border: 1px solid var(--amber-glow); animation: pulse-amber 1.5s ease-in-out infinite; }
  .stage-num.pending { background: var(--bg-3); color: var(--text-muted); border: 1px solid var(--border); }
  .stage-num.gate { background: var(--crimson-dim); color: var(--crimson); border: 1px solid rgba(232,64,64,0.3); }

  .stage-name { flex: 1; color: var(--text); }
  .stage-name.dim { color: var(--text-muted); }

  .stage-status {
    font-size: 10px; padding: 2px 8px; border-radius: 3px;
    font-weight: 600; letter-spacing: 0.04em;
  }

  .stage-status.done { background: var(--jade-dim); color: var(--jade); }
  .stage-status.active { background: var(--amber-dim); color: var(--amber); }
  .stage-status.pending { background: var(--bg-3); color: var(--text-muted); }
  .stage-status.gate-hard { background: var(--crimson-dim); color: var(--crimson); }
  .stage-status.gate-soft { background: var(--blue-dim); color: var(--blue); }

  .stage-connector {
    width: 1px; height: 8px;
    background: var(--border);
    margin-left: 10px;
  }

  /* ── CONFIDENCE METERS ── */
  .metrics-row {
    padding: 12px 16px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    border-top: 1px solid var(--border);
  }

  .metric-card {
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px;
  }

  .metric-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 4px;
  }

  .metric-value {
    font-size: 20px; font-weight: 700;
    font-family: 'Libre Baskerville', serif;
    line-height: 1.1;
  }

  .metric-value.amber { color: var(--amber); }
  .metric-value.jade { color: var(--jade); }
  .metric-value.blue { color: var(--blue); }
  .metric-value.crimson { color: var(--crimson); }

  .metric-sub { font-size: 10px; color: var(--text-muted); margin-top: 2px; }

  /* ── GATE QUEUE ── */
  .gate-list { padding: 12px; display: flex; flex-direction: column; gap: 8px; }

  .gate-card {
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
    transition: border-color 0.15s;
  }

  .gate-card:hover { border-color: var(--border-bright); }

  .gate-card.hard { border-left: 3px solid var(--amber); }
  .gate-card.soft { border-left: 3px solid var(--blue); }
  .gate-card.emergency { border-left: 3px solid var(--crimson); animation: flash-emergency 1s ease-in-out infinite; }

  @keyframes flash-emergency {
    0%, 100% { border-color: var(--crimson); }
    50% { border-color: rgba(232,64,64,0.3); }
  }

  .gate-header {
    padding: 10px 12px;
    display: flex; align-items: center; gap: 8px;
  }

  .gate-type-badge {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 2px 7px; border-radius: 3px;
    flex-shrink: 0;
  }

  .gate-type-badge.hard { background: var(--amber-dim); color: var(--amber); }
  .gate-type-badge.soft { background: var(--blue-dim); color: var(--blue); }
  .gate-type-badge.emergency { background: var(--crimson-dim); color: var(--crimson); }

  .gate-agent { font-size: 11px; color: var(--text); flex: 1; }
  .gate-stage { font-size: 10px; color: var(--text-muted); }

  .gate-body { padding: 0 12px 10px; }

  .gate-summary {
    font-size: 11px; color: var(--text-dim);
    line-height: 1.5; margin-bottom: 8px;
  }

  .gate-preview {
    background: var(--bg-4);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 8px 10px;
    font-size: 11px;
    color: var(--text-dim);
    font-style: italic;
    margin-bottom: 8px;
    border-left: 2px solid var(--amber);
    line-height: 1.5;
  }

  .gate-actions {
    display: flex; gap: 6px;
    align-items: center;
  }

  .btn {
    padding: 5px 12px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    cursor: pointer; border: 1px solid;
    transition: all 0.12s;
  }

  .btn-approve { background: var(--jade-dim); border-color: rgba(29,185,123,0.35); color: var(--jade); }
  .btn-approve:hover { background: rgba(29,185,123,0.25); }

  .btn-edit { background: var(--amber-dim); border-color: rgba(245,166,35,0.35); color: var(--amber); }
  .btn-edit:hover { background: rgba(245,166,35,0.25); }

  .btn-reject { background: var(--crimson-dim); border-color: rgba(232,64,64,0.3); color: var(--crimson); }
  .btn-reject:hover { background: rgba(232,64,64,0.2); }

  .btn-ghost { background: transparent; border-color: var(--border); color: var(--text-dim); }
  .btn-ghost:hover { border-color: var(--border-bright); color: var(--text); }

  .gate-timer {
    margin-left: auto;
    font-size: 10px; font-weight: 700;
    color: var(--text-muted);
    display: flex; align-items: center; gap: 4px;
  }

  .gate-timer.urgent { color: var(--crimson); }

  /* ── INPUT INTERFACE ── */
  .input-section {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .input-modes {
    display: flex;
    border-bottom: 1px solid var(--border);
  }

  .input-mode-tab {
    flex: 1; padding: 10px 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    background: transparent; border: none;
    cursor: pointer; color: var(--text-muted);
    border-bottom: 2px solid transparent;
    transition: all 0.15s; display: flex;
    align-items: center; justify-content: center; gap: 6px;
  }

  .input-mode-tab:hover { color: var(--text-dim); background: rgba(255,255,255,0.02); }
  .input-mode-tab.active { color: var(--amber); border-bottom-color: var(--amber); }

  .input-body { padding: 16px; }

  .brief-box {
    width: 100%; min-height: 80px;
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; color: var(--text);
    resize: none; outline: none;
    transition: border-color 0.15s;
    line-height: 1.6;
  }

  .brief-box:focus { border-color: var(--amber-glow); }
  .brief-box::placeholder { color: var(--text-muted); }

  .input-footer {
    display: flex; align-items: center;
    gap: 8px; margin-top: 10px;
  }

  .readiness-bar {
    flex: 1; height: 4px;
    background: var(--bg-4); border-radius: 2px; overflow: hidden;
  }

  .readiness-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, var(--amber), var(--jade));
    transition: width 0.5s ease;
  }

  .readiness-label { font-size: 10px; color: var(--text-muted); white-space: nowrap; }

  .btn-primary {
    padding: 7px 18px;
    background: var(--amber);
    border: 1px solid var(--amber);
    border-radius: 4px;
    color: #1a1200;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .btn-primary:hover { background: #f7b93a; border-color: #f7b93a; }

  /* ── CONFIRMATION CARD ── */
  .confirm-card {
    background: var(--bg-2);
    border: 1px solid var(--amber-glow);
    border-radius: 8px;
    overflow: hidden;
  }

  .confirm-header {
    padding: 12px 16px;
    background: var(--amber-dim);
    border-bottom: 1px solid rgba(245,166,35,0.2);
    display: flex; align-items: center; gap: 10px;
  }

  .confirm-title {
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--amber);
  }

  .readiness-score-badge {
    margin-left: auto;
    background: var(--jade);
    color: #001a0d;
    font-size: 11px; font-weight: 800;
    padding: 3px 10px; border-radius: 20px;
  }

  .confirm-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }

  .confirm-intent {
    font-family: 'Libre Baskerville', serif;
    font-size: 13px; line-height: 1.5;
    color: var(--text); font-style: italic;
    padding: 10px 12px;
    background: var(--bg-3);
    border-radius: 5px;
    border-left: 2px solid var(--amber);
  }

  .fields-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .field-item {
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 7px 9px;
  }

  .field-key {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 2px;
  }

  .field-val {
    font-size: 11px; color: var(--text);
  }

  .field-source {
    font-size: 9px;
    margin-top: 2px;
  }

  .field-source.stated { color: var(--jade); }
  .field-source.inferred { color: var(--amber); }
  .field-source.default { color: var(--text-muted); }

  .gate-sensitivity {
    display: flex; align-items: center; gap: 8px;
  }

  .gate-sens-label { font-size: 10px; color: var(--text-muted); }

  .gate-sens-options {
    display: flex;
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .gate-sens-btn {
    padding: 4px 10px; font-size: 10px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    background: transparent; border: none;
    cursor: pointer; color: var(--text-muted);
    transition: all 0.12s; letter-spacing: 0.04em;
  }

  .gate-sens-btn.active { background: var(--amber-dim); color: var(--amber); }
  .gate-sens-btn:hover:not(.active) { background: rgba(255,255,255,0.03); color: var(--text-dim); }

  .confirm-actions { display: flex; gap: 8px; padding-top: 4px; }

  /* ── PERFORMANCE ── */
  .perf-grid {
    padding: 14px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .perf-stat {
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px;
  }

  .perf-stat-val {
    font-size: 26px; font-weight: 700;
    font-family: 'Libre Baskerville', serif;
    line-height: 1;
  }

  .perf-stat-label {
    font-size: 10px; color: var(--text-muted);
    margin-top: 4px;
  }

  .perf-trend {
    font-size: 10px; margin-top: 3px;
    display: flex; align-items: center; gap: 3px;
  }

  .trend-up { color: var(--jade); }
  .trend-down { color: var(--crimson); }

  /* ── MINI CHART BARS ── */
  .sparkbar {
    display: flex; align-items: flex-end; gap: 2px;
    height: 30px; margin-top: 6px;
  }

  .spark-col {
    flex: 1; border-radius: 2px 2px 0 0;
    background: var(--amber-dim);
    transition: background 0.15s;
  }

  .spark-col:hover { background: var(--amber-glow); }
  .spark-col.peak { background: var(--amber); }

  /* ── MAS SYSTEM STATUS ── */
  .mas-grid {
    padding: 12px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .mas-item {
    display: flex; align-items: center;
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 8px 10px;
    gap: 8px;
    font-size: 11px;
  }

  .mas-status-dot {
    width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
  }

  .mas-status-dot.idle { background: var(--text-muted); }
  .mas-status-dot.running { background: var(--jade); animation: pulse-jade 1.5s infinite; }
  .mas-status-dot.gate { background: var(--amber); animation: pulse-amber 1.5s infinite; }
  .mas-status-dot.standby { background: var(--blue); }

  .mas-name { flex: 1; color: var(--text-dim); }
  .mas-score { font-size: 10px; color: var(--text-muted); }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

  /* ── TWO COLUMN LAYOUT ── */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* ── SECTION TITLE ── */
  .section-title {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }

  .section-title::after {
    content: '';
    flex: 1; height: 1px; background: var(--border);
  }

  /* ── AGENT ACTIVITY ── */
  .activity-feed {
    padding: 10px 14px;
    display: flex; flex-direction: column; gap: 6px;
    max-height: 200px; overflow-y: auto;
  }

  .activity-item {
    display: flex; align-items: flex-start;
    gap: 8px; font-size: 10px;
    padding: 4px 0;
    border-bottom: 1px solid var(--border);
  }

  .activity-item:last-child { border-bottom: none; }

  .activity-time { color: var(--text-muted); white-space: nowrap; flex-shrink: 0; }
  .activity-agent { color: var(--amber); flex-shrink: 0; }
  .activity-msg { color: var(--text-dim); }

  .activity-dot {
    width: 5px; height: 5px; border-radius: 50%;
    margin-top: 5px; flex-shrink: 0;
  }

  /* ── TEMPLATE GRID ── */
  .template-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .template-card {
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
    transition: all 0.12s;
  }

  .template-card:hover { border-color: var(--amber-glow); background: var(--amber-dim); }

  .template-name {
    font-size: 11px; font-weight: 600; color: var(--text);
    margin-bottom: 3px;
  }

  .template-desc { font-size: 10px; color: var(--text-muted); }

  /* ── PILL ── */
  .pill {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; padding: 2px 7px; border-radius: 20px;
  }

  .pill-jade { background: var(--jade-dim); color: var(--jade); }
  .pill-amber { background: var(--amber-dim); color: var(--amber); }
  .pill-crimson { background: var(--crimson-dim); color: var(--crimson); }
  .pill-blue { background: var(--blue-dim); color: var(--blue); }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const GATE_DATA = [
  {
    id: "g1", type: "hard", stage: "Creative Critique MAS",
    agent: "Critique Consolidator",
    summary: "Originality Critic scored this piece at 34/100 — significantly below the 60% floor threshold. The angle closely mirrors content published 6 weeks ago.",
    preview: "\"The real cost of AI adoption isn't infrastructure — it's the organizational inertia that makes every deployment 3x harder than it should be.\"",
    timer: "12:34", urgent: false, severity: "Critical"
  },
  {
    id: "g2", type: "soft", stage: "Brand Voice MAS",
    agent: "Tone Enforcer",
    summary: "Section 3 detected 18% tone deviation from established voice profile. Content is more formal than your baseline. Advisory only — pipeline continues.",
    preview: "\"Enterprises must strategically evaluate the long-term operational implications of...\"",
    timer: "48:12", urgent: false, severity: "Medium"
  },
  {
    id: "g3", type: "emergency", stage: "Ethics & Safety MAS",
    agent: "Risk Flagger",
    summary: "Compliance Checker flagged potential FTC disclosure violation. Sponsored content relationship not disclosed. Pipeline halted.",
    preview: "\"...which is why I recommend this tool to every founder in my network — it's changed how I approach...\"",
    timer: "02:41", urgent: true, severity: "Critical"
  }
];

const PIPELINE_STAGES = [
  { num: "01", name: "Research & Insight", status: "done" },
  { num: "02", name: "Long-Form Writing", status: "done" },
  { num: "03", name: "Brand Voice", status: "done" },
  { num: "04", name: "Creative Critique", status: "gate", gateType: "gate-hard" },
  { num: "05", name: "Fact-Check & Sources", status: "pending" },
  { num: "06", name: "AI Detection & Audit", status: "pending" },
  { num: "07", name: "Ethics & Safety", status: "pending" },
  { num: "08", name: "QC & Consistency", status: "pending" },
];

const MAS_SYSTEMS = [
  { name: "Research & Insight", status: "idle", score: "94" },
  { name: "Long-Form Writing", status: "idle", score: "88" },
  { name: "Brand Voice MAS", status: "gate", score: "—" },
  { name: "Creative Critique", status: "gate", score: "—" },
  { name: "Fact-Check & Verify", status: "standby", score: "91" },
  { name: "AI Detection Audit", status: "standby", score: "96" },
  { name: "Ethics & Safety", status: "running", score: "—" },
  { name: "QC & Monitoring", status: "running", score: "—" },
  { name: "Repurposing & Dist.", status: "idle", score: "—" },
  { name: "Marketing Campaign", status: "idle", score: "—" },
];

const ACTIVITY = [
  { time: "14:32:18", agent: "Brief Builder", msg: "Brief confidence score: 91%. Angle selected: SMB focus, AI tools in recruitment.", color: "#1db97b" },
  { time: "14:33:04", agent: "Structure Planner", msg: "Blueprint generated — 1,800 word target, 5 sections. Template: Thought Leadership.", color: "#f5a623" },
  { time: "14:35:41", agent: "Tone Enforcer", msg: "Soft Gate triggered: Section 3 tone deviation +18%. Notification sent.", color: "#4a9eff" },
  { time: "14:36:12", agent: "Drafting Agent", msg: "First draft complete. 1,847 words. Style match score: 83%.", color: "#f5a623" },
  { time: "14:38:55", agent: "Critique Consolidator", msg: "Hard Gate: Originality score 34/100. Pipeline paused. Awaiting review.", color: "#e84040" },
  { time: "14:39:01", agent: "Master Orchestrator", msg: "Pipeline paused at Creative Critique stage. 2 gates pending human action.", color: "#9b6dff" },
];

const TEMPLATES = [
  { name: "Weekly Newsletter", desc: "Full pipeline · Hard gate pre-send" },
  { name: "Thought Leadership", desc: "Long-form · Critique-heavy" },
  { name: "Trend Response Post", desc: "Accelerated · Soft gates only" },
  { name: "Content Repurpose", desc: "Skip Research & Writing" },
  { name: "Data-Driven Report", desc: "Fact-Check extended · No repurpose" },
  { name: "Audit Mode", desc: "AI Buster + Ethics only" },
];

const SPARK_DATA = [40, 55, 48, 70, 62, 88, 75, 90, 68, 82, 95, 78];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function PromptierDashboard() {
  const [activePanel, setActivePanel] = useState("pipeline");
  const [mode, setMode] = useState("solo");
  const [inputMode, setInputMode] = useState("brief");
  const [briefText, setBriefText] = useState("");
  const [gateSens, setGateSens] = useState("normal");
  const [showConfirm, setShowConfirm] = useState(false);
  const [dismissedGates, setDismissedGates] = useState([]);
  const [approvedGates, setApprovedGates] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const readiness = briefText.length > 40 ? 85 : briefText.length > 20 ? 60 : briefText.length > 5 ? 35 : 0;
  const activeGates = GATE_DATA.filter(g => !dismissedGates.includes(g.id) && !approvedGates.includes(g.id));
  const hardGates = activeGates.filter(g => g.type === "hard").length;
  const emergencyGates = activeGates.filter(g => g.type === "emergency").length;

  const nav = [
    { id: "pipeline", icon: "◈", label: "Pipeline", badge: null },
    { id: "gates", icon: "⬡", label: "Gate Queue", badge: activeGates.length > 0 ? activeGates.length : null, badgeType: emergencyGates > 0 ? "" : hardGates > 0 ? "pending" : "soft" },
    { id: "input", icon: "⌗", label: "New Content", badge: null },
    { id: "memory", icon: "◎", label: "Memory Inspector", badge: null },
    { id: "performance", icon: "⟁", label: "Performance", badge: null },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-logo">
            <div className="logo-dot" />
            Promptier
          </div>
          <div className="topbar-sep" />
          <div className="topbar-session">
            <span className="session-badge">Session</span>
            <span style={{fontFamily:"'JetBrains Mono'",fontSize:10,color:"var(--text-muted)"}}>SES-{Math.floor(Date.now()/1000).toString(36).toUpperCase()}</span>
          </div>
          <div className="topbar-session" style={{gap:4}}>
            <span style={{color:"var(--text-muted)",fontSize:10}}>●</span>
            <span style={{color:"var(--jade)",fontSize:10}}>Pipeline active</span>
          </div>
          <div className="topbar-right">
            <div className="mode-selector">
              {["solo","team","enterprise"].map(m => (
                <button key={m} className={`mode-btn ${mode===m?"active":""}`} onClick={()=>setMode(m)}>
                  {m}
                </button>
              ))}
            </div>
            <div className="topbar-sep" />
            <button className="e-stop">
              <div className="e-stop-dot" />
              Emergency Stop
            </button>
            <div className="avatar">TC</div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-section">Navigation</div>
          {nav.map(n => (
            <div key={n.id} className={`nav-item ${activePanel===n.id?"active":""}`} onClick={()=>setActivePanel(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
              {n.badge && <span className={`nav-badge ${n.badgeType||""}`}>{n.badge}</span>}
            </div>
          ))}

          <div style={{marginTop:16}}>
            <div className="sidebar-section">MAS Systems</div>
            {MAS_SYSTEMS.slice(0,5).map((m,i) => (
              <div key={i} className="nav-item" style={{fontSize:10,padding:"5px 16px"}}>
                <div className={`mas-status-dot ${m.status}`} />
                <span style={{flex:1,color:"var(--text-muted)"}}>{m.name.split(" ")[0]}</span>
                <span style={{fontSize:9,color:"var(--text-muted)"}}>{m.status}</span>
              </div>
            ))}
          </div>

          <div className="sidebar-bottom">
            <div className="health-score">
              <div className="health-label">
                <span>Ecosystem Health</span>
                <span style={{color:"var(--jade)"}}>↑ +3</span>
              </div>
              <div className="health-number">87</div>
              <div className="health-bar">
                <div className="health-fill" style={{width:"87%"}} />
              </div>
            </div>
            <div style={{marginTop:8,fontSize:10,color:"var(--text-muted)",textAlign:"center"}}>
              {time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">

          {/* ── PIPELINE PANEL ── */}
          {activePanel === "pipeline" && (
            <>
              <div className="two-col" style={{gap:16}}>
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-dot" />
                    <div className="panel-title">Pipeline Status</div>
                    <div className="panel-header-right">
                      <span className="pill pill-amber">Paused · Gate</span>
                    </div>
                  </div>
                  <div className="pipeline-stages">
                    {PIPELINE_STAGES.map((s,i) => (
                      <div key={s.num}>
                        <div className="stage-row">
                          <div className={`stage-num ${s.status}`}>{s.num}</div>
                          <div className={`stage-name ${s.status==="pending"?"dim":""}`}>{s.name}</div>
                          <div className={`stage-status ${s.status==="done"?"done":s.status==="active"?"active":s.status==="gate"?s.gateType||"gate-hard":"pending"}`}>
                            {s.status==="done"?"Complete":s.status==="active"?"Running":s.status==="gate"?"Hard Gate":"Pending"}
                          </div>
                        </div>
                        {i < PIPELINE_STAGES.length-1 && <div className="stage-connector" />}
                      </div>
                    ))}
                  </div>
                  <div className="metrics-row">
                    <div className="metric-card">
                      <div className="metric-label">Confidence</div>
                      <div className="metric-value amber">83%</div>
                      <div className="metric-sub">Overall draft</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">Gates</div>
                      <div className="metric-value crimson">{activeGates.length}</div>
                      <div className="metric-sub">Pending action</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">Brand Align</div>
                      <div className="metric-value jade">91%</div>
                      <div className="metric-sub">Voice match</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">ETA</div>
                      <div className="metric-value blue">~18m</div>
                      <div className="metric-sub">To complete</div>
                    </div>
                  </div>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div className="panel" style={{flex:1}}>
                    <div className="panel-header">
                      <div className="panel-dot" style={{background:"var(--blue)"}} />
                      <div className="panel-title">Agent Activity</div>
                    </div>
                    <div className="activity-feed">
                      {ACTIVITY.map((a,i) => (
                        <div key={i} className="activity-item">
                          <div className="activity-dot" style={{background:a.color}} />
                          <span className="activity-time">{a.time}</span>
                          <span className="activity-agent" style={{color:a.color}}>{a.agent}</span>
                          <span className="activity-msg">{a.msg}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="panel">
                    <div className="panel-header">
                      <div className="panel-dot" style={{background:"var(--purple)"}} />
                      <div className="panel-title">MAS Systems</div>
                    </div>
                    <div className="mas-grid">
                      {MAS_SYSTEMS.map((m,i) => (
                        <div key={i} className="mas-item">
                          <div className={`mas-status-dot ${m.status}`} />
                          <span className="mas-name">{m.name}</span>
                          <span className="mas-score">{m.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── GATE QUEUE ── */}
          {activePanel === "gates" && (
            <div className="panel">
              <div className="panel-header">
                <div className="panel-dot" style={{background:"var(--amber)"}} />
                <div className="panel-title">Gate Queue</div>
                <div className="panel-header-right">
                  {emergencyGates > 0 && <span className="pill pill-crimson">⚠ {emergencyGates} Emergency</span>}
                  {hardGates > 0 && <span className="pill pill-amber">{hardGates} Hard Gates</span>}
                  <span className="pill pill-jade">{activeGates.length} Total Pending</span>
                </div>
              </div>
              <div className="gate-list">
                {activeGates.length === 0 && (
                  <div style={{padding:"32px 16px",textAlign:"center",color:"var(--text-muted)",fontSize:12}}>
                    ✓ No gates pending — pipeline is clear
                  </div>
                )}
                {activeGates.map(gate => (
                  <div key={gate.id} className={`gate-card ${gate.type}`}>
                    <div className="gate-header">
                      <span className={`gate-type-badge ${gate.type}`}>
                        {gate.type === "emergency" ? "⚠ Emergency Stop" : gate.type === "hard" ? "● Hard Gate" : "○ Soft Gate"}
                      </span>
                      <span className="gate-agent">{gate.agent}</span>
                      <span className="gate-stage">{gate.stage}</span>
                    </div>
                    <div className="gate-body">
                      <div className="gate-summary">{gate.summary}</div>
                      <div className="gate-preview">{gate.preview}</div>
                      <div className="gate-actions">
                        <button className="btn btn-approve" onClick={() => setApprovedGates(p=>[...p,gate.id])}>
                          ✓ Approve
                        </button>
                        <button className="btn btn-edit">✎ Edit & Approve</button>
                        <button className="btn btn-reject" onClick={() => setDismissedGates(p=>[...p,gate.id])}>
                          ✕ Reject
                        </button>
                        <div className={`gate-timer ${gate.urgent?"urgent":""}`}>
                          ⏱ {gate.timer} remaining
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {approvedGates.length > 0 && (
                  <div style={{fontSize:10,color:"var(--jade)",padding:"4px 8px"}}>
                    ✓ {approvedGates.length} gate{approvedGates.length>1?"s":""} approved this session
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── INPUT INTERFACE ── */}
          {activePanel === "input" && (
            <>
              <div className="input-section">
                <div className="panel-header">
                  <div className="panel-dot" style={{background:"var(--purple)"}} />
                  <div className="panel-title">New Content · Input Interface</div>
                </div>
                <div className="input-modes">
                  {[
                    {id:"brief",icon:"⌥",label:"Brief Box"},
                    {id:"upload",icon:"↑",label:"Upload Doc"},
                    {id:"template",icon:"⊞",label:"Templates"},
                    {id:"voice",icon:"◉",label:"Voice Input"},
                  ].map(tab => (
                    <button key={tab.id} className={`input-mode-tab ${inputMode===tab.id?"active":""}`} onClick={()=>setInputMode(tab.id)}>
                      <span>{tab.icon}</span> {tab.label}
                    </button>
                  ))}
                </div>
                <div className="input-body">
                  {inputMode === "brief" && (
                    <>
                      <textarea
                        className="brief-box"
                        placeholder="Tell me what you want to write. Topic, angle, audience, tone — whatever you have. The system will figure out the rest..."
                        value={briefText}
                        onChange={e=>setBriefText(e.target.value)}
                        rows={4}
                      />
                      <div className="input-footer">
                        <span className="readiness-label">Readiness</span>
                        <div className="readiness-bar">
                          <div className="readiness-fill" style={{width:`${readiness}%`}} />
                        </div>
                        <span className="readiness-label">{readiness}%</span>
                        <button className="btn-primary" onClick={()=>briefText.length>5&&setShowConfirm(true)} style={{opacity:briefText.length<5?0.4:1}}>
                          Analyse Brief →
                        </button>
                      </div>
                    </>
                  )}
                  {inputMode === "upload" && (
                    <div style={{
                      border:"2px dashed var(--border)",borderRadius:6,
                      padding:"32px 20px",textAlign:"center",
                      cursor:"pointer",transition:"all 0.15s"
                    }}>
                      <div style={{fontSize:24,marginBottom:8}}>↑</div>
                      <div style={{fontSize:12,color:"var(--text-dim)",marginBottom:4}}>Drop a file or click to upload</div>
                      <div style={{fontSize:10,color:"var(--text-muted)"}}>
                        .docx · .txt · .md · .pdf — Rough drafts, research notes, voice transcripts, competitor content
                      </div>
                    </div>
                  )}
                  {inputMode === "template" && (
                    <div className="template-grid">
                      {TEMPLATES.map((t,i) => (
                        <div key={i} className="template-card" onClick={()=>{setInputMode("brief"); setShowConfirm(true);}}>
                          <div className="template-name">{t.name}</div>
                          <div className="template-desc">{t.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {inputMode === "voice" && (
                    <div style={{textAlign:"center",padding:"24px 20px"}}>
                      <div style={{
                        width:56,height:56,borderRadius:"50%",
                        background:"var(--crimson-dim)",border:"2px solid var(--crimson)",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:22,margin:"0 auto 12px",cursor:"pointer"
                      }}>◉</div>
                      <div style={{fontSize:12,color:"var(--text-dim)",marginBottom:4}}>Press to speak your brief</div>
                      <div style={{fontSize:10,color:"var(--text-muted)"}}>Natural language — no structure required</div>
                    </div>
                  )}
                </div>
              </div>

              {/* CONFIRMATION CARD */}
              {showConfirm && (
                <div className="confirm-card">
                  <div className="confirm-header">
                    <span className="confirm-title">Pre-Run Confirmation Card</span>
                    <span style={{fontSize:10,color:"var(--amber)",marginLeft:4}}>— Review before pipeline activates</span>
                    <span className="readiness-score-badge">85 Ready</span>
                  </div>
                  <div className="confirm-body">
                    <div className="confirm-intent">
                      "Write a newsletter piece on AI tools changing hiring for SMBs. Angle: AI isn't replacing recruiters — it's exposing the bad ones. Audience: HR leaders and founders at companies under 200 people. Tone: sharp, a little provocative."
                    </div>

                    <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--text-muted)"}}>
                      Extracted Fields
                    </div>
                    <div className="fields-grid">
                      {[
                        {k:"Topic",v:"AI in SMB Hiring",src:"stated",s:"stated"},
                        {k:"Format",v:"Newsletter",src:"stated",s:"stated"},
                        {k:"Audience",v:"HR Leaders · Founders",src:"stated",s:"stated"},
                        {k:"Angle",v:"AI exposes bad recruiters",src:"stated",s:"stated"},
                        {k:"Tone",v:"Sharp · Provocative",src:"stated",s:"stated"},
                        {k:"Length",v:"~1,200 words",src:"inferred from format",s:"inferred"},
                        {k:"Platform",v:"Email Newsletter",src:"inferred from history",s:"inferred"},
                        {k:"Urgency",v:"Normal",src:"default",s:"default"},
                        {k:"Brand Align",v:"94% match",src:"Brand DNA",s:"stated"},
                      ].map((f,i) => (
                        <div key={i} className="field-item">
                          <div className="field-key">{f.k}</div>
                          <div className="field-val">{f.v}</div>
                          <div className={`field-source ${f.s}`}>{f.src}</div>
                        </div>
                      ))}
                    </div>

                    <div className="gate-sensitivity">
                      <span className="gate-sens-label">Gate Sensitivity:</span>
                      <div className="gate-sens-options">
                        {["express","normal","thorough"].map(s => (
                          <button key={s} className={`gate-sens-btn ${gateSens===s?"active":""}`} onClick={()=>setGateSens(s)}>
                            {s}
                          </button>
                        ))}
                      </div>
                      <span style={{fontSize:10,color:"var(--text-muted)",marginLeft:6}}>
                        {gateSens==="express"?"Hard Gates + Emergency only":gateSens==="normal"?"Standard calibrated gates":"Lower thresholds · More review"}
                      </span>
                    </div>

                    <div className="confirm-actions">
                      <button className="btn-primary" onClick={()=>{setShowConfirm(false);setActivePanel("pipeline");}}>
                        ▶ Start Pipeline
                      </button>
                      <button className="btn btn-edit" onClick={()=>setShowConfirm(false)}>
                        ✎ Edit Brief
                      </button>
                      <button className="btn btn-ghost">
                        ⬡ Save as Draft
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── MEMORY INSPECTOR ── */}
          {activePanel === "memory" && (
            <div className="two-col">
              {[
                {title:"Brand DNA Store",color:"var(--amber)",items:[
                  {k:"Voice Profile",v:"Direct · Research-backed · Anti-toxic-positivity"},
                  {k:"Tone Matrix",v:"Formal for analysis · Casual for threads · Sharp for social"},
                  {k:"Messaging Pillars",v:"Trauma-informed · Psychology-led · Practical tools"},
                  {k:"Vocabulary",v:"847 approved · 34 banned · 12 pending review"},
                ]},
                {title:"Long-Term Memory",color:"var(--blue)",items:[
                  {k:"Sessions Logged",v:"47 completed sessions"},
                  {k:"Style Evolution",v:"Baseline established · 3 drift proposals pending"},
                  {k:"Content History",v:"124 pieces indexed across 8 formats"},
                  {k:"Decision Patterns",v:"Rejects: 12% avg · Edits: 31% avg · Approvals: 57%"},
                ]},
                {title:"Source Library",color:"var(--jade)",items:[
                  {k:"Verified Sources",v:"1,247 sources · Avg credibility: 78/100"},
                  {k:"Trusted Domains",v:"34 domains whitelisted"},
                  {k:"Blocked Domains",v:"8 domains flagged as unreliable"},
                  {k:"Recent Additions",v:"14 new sources added this session"},
                ]},
                {title:"Audience Intelligence",color:"var(--purple)",items:[
                  {k:"Active Segments",v:"3 behavioral clusters identified"},
                  {k:"Top Resonance",v:"Psychology + Career content · Avg 4.2x baseline"},
                  {k:"Sentiment Baseline",v:"Positive: 74% · Neutral: 19% · Negative: 7%"},
                  {k:"Last Reconciled",v:"6 hours ago · Next: in 18h"},
                ]},
              ].map((section,i) => (
                <div key={i} className="panel">
                  <div className="panel-header">
                    <div className="panel-dot" style={{background:section.color}} />
                    <div className="panel-title">{section.title}</div>
                    <div className="panel-header-right">
                      <button className="btn btn-ghost" style={{padding:"3px 8px",fontSize:9}}>Inspect</button>
                    </div>
                  </div>
                  <div style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
                    {section.items.map((item,j) => (
                      <div key={j} style={{display:"flex",flexDirection:"column",gap:2,padding:"8px 10px",background:"var(--bg-3)",border:"1px solid var(--border)",borderRadius:5}}>
                        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--text-muted)"}}>{item.k}</div>
                        <div style={{fontSize:11,color:"var(--text)"}}>{item.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PERFORMANCE ── */}
          {activePanel === "performance" && (
            <>
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-dot" style={{background:"var(--jade)"}} />
                  <div className="panel-title">Performance Overview</div>
                  <div className="panel-header-right">
                    <span className="pill pill-jade">Last 30 days</span>
                  </div>
                </div>
                <div className="perf-grid">
                  {[
                    {val:"47",col:"amber",label:"Sessions completed",trend:"+8 vs last month",up:true},
                    {val:"124",col:"jade",label:"Pieces published",trend:"+31% output increase",up:true},
                    {val:"91%",col:"blue",label:"Avg gate approval rate",trend:"−3% vs prior period",up:false},
                    {val:"1.4",col:"purple",label:"Avg review rounds",trend:"−0.6 rounds saved",up:true},
                    {val:"87",col:"amber",label:"Ecosystem health score",trend:"+3 points this month",up:true},
                    {val:"99%",col:"jade",label:"Ethics gate clearance",trend:"Zero violations",up:true},
                  ].map((s,i) => (
                    <div key={i} className="perf-stat">
                      <div className={`perf-stat-val`} style={{color:`var(--${s.col})`}}>{s.val}</div>
                      <div className="perf-stat-label">{s.label}</div>
                      <div className={`perf-trend ${s.up?"trend-up":"trend-down"}`}>
                        {s.up?"↑":"↓"} {s.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div className="panel-dot" style={{background:"var(--amber)"}} />
                  <div className="panel-title">Output Volume — Last 12 Sessions</div>
                </div>
                <div style={{padding:"12px 16px"}}>
                  <div className="sparkbar" style={{height:60}}>
                    {SPARK_DATA.map((v,i) => (
                      <div key={i} className={`spark-col ${v===Math.max(...SPARK_DATA)?"peak":""}`}
                        style={{height:`${v}%`}} title={`Session ${i+1}: ${v}% quality score`} />
                    ))}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:9,color:"var(--text-muted)"}}>
                    <span>Session −11</span><span>Session −6</span><span>Current</span>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div className="panel-dot" style={{background:"var(--blue)"}} />
                  <div className="panel-title">Gate Activity Summary</div>
                </div>
                <div style={{padding:"12px 14px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {[
                    {label:"Soft Gates Fired",val:"23",color:"var(--blue)"},
                    {label:"Hard Gates Fired",val:"11",color:"var(--amber)"},
                    {label:"Emergency Stops",val:"1",color:"var(--crimson)"},
                    {label:"Approvals",val:"28",color:"var(--jade)"},
                    {label:"Rejections",val:"4",color:"var(--crimson)"},
                    {label:"Edits Made",val:"15",color:"var(--purple)"},
                  ].map((s,i)=>(
                    <div key={i} style={{background:"var(--bg-3)",border:"1px solid var(--border)",borderRadius:5,padding:"10px",textAlign:"center"}}>
                      <div style={{fontSize:22,fontWeight:700,fontFamily:"'Libre Baskerville',serif",color:s.color}}>{s.val}</div>
                      <div style={{fontSize:10,color:"var(--text-muted)",marginTop:3}}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
