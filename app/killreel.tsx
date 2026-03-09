"use client";
import { useState, useRef, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  :root {
    --apex-red: #e8003d;
    --apex-red-dim: rgba(232,0,61,0.15);
    --apex-red-glow: rgba(232,0,61,0.5);
    --cyan: #00e5ff;
    --cyan-dim: rgba(0,229,255,0.1);
    --cyan-glow: rgba(0,229,255,0.4);
    --bg-deep: #050508;
    --bg-panel: rgba(10,10,18,0.92);
    --bg-glass: rgba(255,255,255,0.03);
    --border: rgba(255,255,255,0.07);
    --border-active: rgba(0,229,255,0.4);
    --text-primary: #f0f0f8;
    --text-secondary: rgba(240,240,248,0.5);
    --gold: #ffd166;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg-deep);
    font-family: 'Rajdhani', sans-serif;
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app-wrapper {
    min-height: 100vh;
    background:
      radial-gradient(ellipse 80% 40% at 50% -10%, rgba(232,0,61,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 30% at 80% 100%, rgba(0,229,255,0.06) 0%, transparent 50%),
      var(--bg-deep);
  }

  /* Scanline overlay */
  .app-wrapper::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.08) 2px,
      rgba(0,0,0,0.08) 4px
    );
    pointer-events: none;
    z-index: 0;
  }

  .container {
    max-width: 480px;
    margin: 0 auto;
    padding: 0 16px 100px;
    position: relative;
    z-index: 1;
  }

  /* ── HEADER ── */
  .header {
    padding: 20px 0 16px;
    text-align: center;
    position: relative;
  }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--apex-red-dim);
    border: 1px solid var(--apex-red);
    border-radius: 2px;
    padding: 3px 10px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--apex-red);
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .header-badge::before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--apex-red);
    border-radius: 50%;
    animation: pulse-dot 1.5s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .logo {
    font-family: 'Orbitron', sans-serif;
    font-size: 28px;
    font-weight: 900;
    letter-spacing: -0.5px;
    line-height: 1;
    background: linear-gradient(135deg, #fff 0%, var(--cyan) 60%, var(--apex-red) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .logo span {
    color: var(--apex-red);
    -webkit-text-fill-color: var(--apex-red);
  }

  .tagline {
    font-size: 11px;
    color: var(--text-secondary);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-top: 4px;
    font-family: 'Share Tech Mono', monospace;
  }

  /* Corner decorations */
  .corner-deco {
    position: absolute;
    width: 16px;
    height: 16px;
  }
  .corner-deco.tl { top: 20px; left: 0; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); }
  .corner-deco.tr { top: 20px; right: 0; border-top: 2px solid var(--cyan); border-right: 2px solid var(--cyan); }

  /* ── SECTION LABEL ── */
  .section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    color: var(--cyan);
    text-transform: uppercase;
  }

  .section-label::before {
    content: '';
    display: block;
    width: 3px;
    height: 14px;
    background: var(--cyan);
    border-radius: 1px;
  }

  .section-label .num {
    color: rgba(0,229,255,0.4);
    margin-right: 2px;
  }

  /* ── UPLOAD ZONE ── */
  .upload-zone {
    border: 2px dashed rgba(0,229,255,0.25);
    border-radius: 8px;
    padding: 28px 16px;
    text-align: center;
    background: var(--bg-glass);
    backdrop-filter: blur(8px);
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--cyan);
    background: var(--cyan-dim);
    box-shadow: 0 0 24px var(--cyan-glow), inset 0 0 24px rgba(0,229,255,0.05);
  }

  .upload-zone::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 30%, rgba(0,229,255,0.03) 50%, transparent 70%);
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .upload-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 12px;
    position: relative;
  }

  .upload-icon svg {
    width: 100%;
    height: 100%;
    stroke: var(--cyan);
    opacity: 0.8;
  }

  .upload-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
    letter-spacing: 0.5px;
  }

  .upload-sub {
    font-size: 12px;
    color: var(--text-secondary);
    font-family: 'Share Tech Mono', monospace;
  }

  .upload-limit {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 10px;
    padding: 3px 10px;
    background: rgba(232,0,61,0.1);
    border: 1px solid rgba(232,0,61,0.3);
    border-radius: 2px;
    font-size: 10px;
    color: var(--apex-red);
    font-family: 'Share Tech Mono', monospace;
    letter-spacing: 1px;
  }

  /* ── CLIP GRID ── */
  .clip-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }

  .clip-card {
    position: relative;
    aspect-ratio: 9/16;
    border-radius: 6px;
    overflow: hidden;
    background: #0a0a12;
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.2s;
  }

  .clip-card:hover {
    border-color: var(--cyan);
    box-shadow: 0 0 12px var(--cyan-glow);
  }

  .clip-card.selected {
    border-color: var(--cyan);
    box-shadow: 0 0 16px var(--cyan-glow);
  }

  .clip-card.selected::after {
    content: '✓';
    position: absolute;
    top: 4px;
    right: 4px;
    width: 18px;
    height: 18px;
    background: var(--cyan);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    color: #000;
    z-index: 3;
  }

  .clip-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .clip-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
  }

  .clip-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 6px;
  }

  .clip-name {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    color: var(--cyan);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .clip-duration {
    font-size: 9px;
    color: var(--text-secondary);
    font-family: 'Share Tech Mono', monospace;
  }

  .clip-delete {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 20px;
    height: 20px;
    background: rgba(232,0,61,0.8);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 3;
  }

  .clip-card:hover .clip-delete { opacity: 1; }

  .clip-kill-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(232,0,61,0.9);
    border-radius: 2px;
    padding: 1px 4px;
    font-size: 8px;
    font-family: 'Share Tech Mono', monospace;
    color: white;
    letter-spacing: 1px;
  }

  /* ── PANEL ── */
  .panel {
    background: var(--bg-panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    backdrop-filter: blur(12px);
    position: relative;
    overflow: hidden;
  }

  .panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    opacity: 0.5;
  }

  /* ── WEAPON SELECT ── */
  .weapon-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .weapon-btn {
    background: var(--bg-glass);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 6px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .weapon-btn:hover {
    border-color: rgba(0,229,255,0.4);
    background: var(--cyan-dim);
  }

  .weapon-btn.active {
    border-color: var(--cyan);
    background: var(--cyan-dim);
    box-shadow: 0 0 10px var(--cyan-glow);
  }

  .weapon-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--cyan);
  }

  .weapon-icon { font-size: 20px; margin-bottom: 4px; }
  .weapon-name {
    font-size: 10px;
    font-family: 'Share Tech Mono', monospace;
    color: var(--text-secondary);
    letter-spacing: 0.5px;
  }
  .weapon-btn.active .weapon-name { color: var(--cyan); }

  /* ── MUSIC PANEL ── */
  .music-track {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 6px;
    background: var(--bg-glass);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 8px;
  }

  .music-track:hover {
    border-color: rgba(0,229,255,0.3);
    background: var(--cyan-dim);
  }

  .music-track.selected {
    border-color: var(--apex-red);
    background: var(--apex-red-dim);
    box-shadow: 0 0 10px var(--apex-red-glow);
  }

  .track-cover {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background: linear-gradient(135deg, var(--apex-red), #ff6b35);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    position: relative;
    overflow: hidden;
  }

  .track-cover.tiktok { background: linear-gradient(135deg, #ff0050, #00f2ea); }
  .track-cover.hype { background: linear-gradient(135deg, #ffd166, #ff6b35); }
  .track-cover.dark { background: linear-gradient(135deg, #1a1a2e, #6c63ff); }

  .track-cover .eq-bars {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 20px;
  }

  .track-cover .eq-bar {
    width: 3px;
    background: rgba(255,255,255,0.9);
    border-radius: 1px;
    animation: eq 0.8s ease-in-out infinite alternate;
  }
  .eq-bar:nth-child(2) { animation-delay: 0.15s; }
  .eq-bar:nth-child(3) { animation-delay: 0.3s; }
  .eq-bar:nth-child(4) { animation-delay: 0.1s; }

  @keyframes eq {
    0% { height: 4px; }
    100% { height: 18px; }
  }

  .track-info { flex: 1; min-width: 0; }
  .track-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .track-meta {
    font-size: 10px;
    color: var(--text-secondary);
    font-family: 'Share Tech Mono', monospace;
    margin-top: 2px;
    display: flex;
    gap: 8px;
  }

  .track-bpm {
    color: var(--gold);
    font-size: 10px;
    font-family: 'Share Tech Mono', monospace;
    white-space: nowrap;
  }

  .trending-badge {
    background: var(--apex-red-dim);
    border: 1px solid var(--apex-red);
    border-radius: 2px;
    padding: 1px 5px;
    font-size: 8px;
    color: var(--apex-red);
    font-family: 'Share Tech Mono', monospace;
    letter-spacing: 1px;
    display: inline-block;
    margin-top: 2px;
  }

  /* ── REFRESH BUTTON ── */
  .btn-refresh {
    width: 100%;
    padding: 10px;
    background: transparent;
    border: 1px dashed rgba(0,229,255,0.3);
    border-radius: 6px;
    color: var(--cyan);
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    text-transform: uppercase;
  }

  .btn-refresh:hover {
    background: var(--cyan-dim);
    border-style: solid;
    border-color: var(--cyan);
  }

  /* ── OUTPUT SETTINGS ── */
  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }

  .setting-row:last-child { border-bottom: none; }

  .setting-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .setting-hint {
    font-size: 10px;
    color: var(--text-secondary);
    font-family: 'Share Tech Mono', monospace;
  }

  .setting-control {
    display: flex;
    gap: 4px;
  }

  .pill-btn {
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-family: 'Share Tech Mono', monospace;
    background: var(--bg-glass);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.5px;
  }

  .pill-btn.active {
    background: var(--cyan-dim);
    border-color: var(--cyan);
    color: var(--cyan);
  }

  /* ── TOGGLE ── */
  .toggle {
    width: 40px;
    height: 22px;
    background: var(--border);
    border-radius: 11px;
    cursor: pointer;
    position: relative;
    transition: background 0.2s;
    border: none;
  }

  .toggle.on { background: var(--cyan); }

  .toggle::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    transition: transform 0.2s;
  }

  .toggle.on::after { transform: translateX(18px); }

  /* ── GENERATE BUTTON ── */
  .btn-generate {
    width: 100%;
    padding: 18px;
    background: linear-gradient(135deg, var(--apex-red) 0%, #ff3366 50%, #ff0050 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-family: 'Orbitron', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.2s;
    margin-bottom: 10px;
    text-transform: uppercase;
  }

  .btn-generate:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(232,0,61,0.5);
  }

  .btn-generate:active { transform: translateY(0); }

  .btn-generate::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -60%;
    width: 40%;
    height: 200%;
    background: rgba(255,255,255,0.15);
    transform: skewX(-20deg);
    transition: left 0.4s;
  }

  .btn-generate:hover::before { left: 120%; }

  .btn-generate .btn-sub {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 3px;
    opacity: 0.8;
    margin-top: 2px;
  }

  /* ── PROGRESS ── */
  .progress-wrap {
    background: var(--bg-panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 12px;
  }

  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .progress-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--cyan);
    letter-spacing: 1px;
  }

  .progress-pct {
    font-family: 'Share Tech Mono', monospace;
    font-size: 20px;
    color: var(--apex-red);
    font-weight: bold;
  }

  .progress-bar-bg {
    height: 4px;
    background: rgba(255,255,255,0.05);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 14px;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--apex-red), var(--cyan));
    border-radius: 2px;
    transition: width 0.3s ease;
    box-shadow: 0 0 8px var(--apex-red-glow);
  }

  .progress-steps {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .progress-step {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-family: 'Share Tech Mono', monospace;
    color: var(--text-secondary);
  }

  .progress-step.done { color: var(--cyan); }
  .progress-step.active { color: var(--gold); animation: blink 1s ease-in-out infinite; }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .step-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--border);
    flex-shrink: 0;
  }

  .progress-step.done .step-dot { background: var(--cyan); }
  .progress-step.active .step-dot { background: var(--gold); box-shadow: 0 0 6px var(--gold); }

  /* ── PREVIEW ── */
  .preview-wrap {
    aspect-ratio: 9/16;
    background: #000;
    border-radius: 12px;
    border: 1px solid var(--border);
    overflow: hidden;
    position: relative;
    margin-bottom: 12px;
  }

  .preview-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .preview-icon { font-size: 40px; opacity: 0.3; }

  .preview-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    color: var(--text-secondary);
    letter-spacing: 2px;
    text-align: center;
  }

  .preview-hud {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .hud-corner {
    position: absolute;
    width: 20px;
    height: 20px;
  }
  .hud-corner.tl { top: 12px; left: 12px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); }
  .hud-corner.tr { top: 12px; right: 12px; border-top: 2px solid var(--cyan); border-right: 2px solid var(--cyan); }
  .hud-corner.bl { bottom: 12px; left: 12px; border-bottom: 2px solid var(--cyan); border-left: 2px solid var(--cyan); }
  .hud-corner.br { bottom: 12px; right: 12px; border-bottom: 2px solid var(--cyan); border-right: 2px solid var(--cyan); }

  /* ── ACTION BUTTONS ── */
  .action-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 10px;
  }

  .btn-action {
    padding: 14px 8px;
    background: var(--bg-panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .btn-action:hover {
    border-color: var(--cyan);
    background: var(--cyan-dim);
    color: var(--cyan);
  }

  .btn-action.primary {
    background: rgba(0,229,255,0.1);
    border-color: rgba(0,229,255,0.5);
    color: var(--cyan);
  }

  .btn-action .btn-icon { font-size: 20px; }
  .btn-action .btn-label { font-size: 12px; font-family: 'Share Tech Mono', monospace; letter-spacing: 1px; }

  /* ── PLATFORM BUTTONS ── */
  .platform-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    margin-bottom: 20px;
  }

  .platform-btn {
    padding: 10px 4px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg-glass);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .platform-btn:hover { transform: translateY(-2px); }

  .platform-btn.tiktok:hover { border-color: #ff0050; background: rgba(255,0,80,0.1); box-shadow: 0 4px 12px rgba(255,0,80,0.3); }
  .platform-btn.youtube:hover { border-color: #ff0000; background: rgba(255,0,0,0.1); box-shadow: 0 4px 12px rgba(255,0,0,0.3); }
  .platform-btn.instagram:hover { border-color: #e1306c; background: rgba(225,48,108,0.1); box-shadow: 0 4px 12px rgba(225,48,108,0.3); }
  .platform-btn.x:hover { border-color: #fff; background: rgba(255,255,255,0.05); box-shadow: 0 4px 12px rgba(255,255,255,0.15); }

  .platform-icon { font-size: 22px; }
  .platform-name { font-size: 9px; color: var(--text-secondary); font-family: 'Share Tech Mono', monospace; letter-spacing: 0.5px; }

  /* ── STATS ROW ── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-bottom: 20px;
  }

  .stat-card {
    background: var(--bg-panel);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 8px;
    text-align: center;
  }

  .stat-val {
    font-family: 'Orbitron', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--cyan);
  }

  .stat-label {
    font-size: 9px;
    color: var(--text-secondary);
    font-family: 'Share Tech Mono', monospace;
    letter-spacing: 1px;
    margin-top: 2px;
    text-transform: uppercase;
  }

  /* ── BOTTOM NAV ── */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    background: rgba(5,5,8,0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    padding: 10px 24px 20px;
    display: flex;
    justify-content: space-around;
    z-index: 100;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s;
    padding: 4px 12px;
  }

  .nav-item.active {
    opacity: 1;
  }

  .nav-item.active .nav-icon { color: var(--cyan); }
  .nav-item.active .nav-label { color: var(--cyan); }

  .nav-icon { font-size: 20px; }
  .nav-label { font-size: 9px; font-family: 'Share Tech Mono', monospace; letter-spacing: 1px; color: var(--text-secondary); }

  /* ── ANIMATIONS ── */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in { animation: fadeInUp 0.4s ease both; }
  .fade-in-2 { animation: fadeInUp 0.4s 0.1s ease both; }
  .fade-in-3 { animation: fadeInUp 0.4s 0.2s ease both; }
  .fade-in-4 { animation: fadeInUp 0.4s 0.3s ease both; }

  /* ── ANALYZE BADGE ── */
  .analyze-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,209,102,0.1);
    border: 1px solid rgba(255,209,102,0.3);
    border-radius: 3px;
    padding: 2px 6px;
    font-size: 9px;
    color: var(--gold);
    font-family: 'Share Tech Mono', monospace;
    letter-spacing: 1px;
  }

  .analyze-chip::before {
    content: '⚡';
    font-size: 8px;
  }
`;

const MOCK_TRACKS = [
  { id: 1, title: "GODS - New Jeans", bpm: "128 BPM", platform: "TikTok", type: "tiktok", trending: true, duration: "0:45" },
  { id: 2, title: "HYPE MODE", bpm: "140 BPM", platform: "YouTube", type: "hype", trending: true, duration: "0:30" },
  { id: 3, title: "DARK PHONK", bpm: "155 BPM", platform: "Pixabay", type: "dark", trending: false, duration: "0:60" },
];

const WEAPONS = [
  { id: "ar", icon: "🔫", name: "AR/SMG" },
  { id: "sniper", icon: "🎯", name: "Sniper" },
  { id: "shotgun", icon: "💥", name: "Shotgun" },
];

const MOCK_CLIPS = [
  { id: 1, name: "clip_001.mp4", duration: "0:04", kill: true },
  { id: 2, name: "clip_002.mp4", duration: "0:03", kill: true },
  { id: 3, name: "clip_003.mp4", duration: "0:05", kill: false },
];

const PROGRESS_STEPS = [
  "動画解析中 (OpenCV)",
  "キル瞬間を検知",
  "BPM解析 (Tone.js)",
  "ビート同期・カット",
  "エンコード (ffmpeg)",
];

export default function App() {
  const [tab, setTab] = useState("edit");
  const [clips, setClips] = useState(MOCK_CLIPS);
  const [selectedClips, setSelectedClips] = useState([1, 2]);
  const [weapon, setWeapon] = useState("ar");
  const [selectedTrack, setSelectedTrack] = useState(1);
  const [duration, setDuration] = useState("60");
  const [quality, setQuality] = useState("1080");
  const [autoCaption, setAutoCaption] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleUpload = useCallback((files) => {
    const newClips = Array.from(files).map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      duration: `0:0${Math.floor(Math.random() * 5) + 2}`,
      kill: Math.random() > 0.3,
    }));
    setClips(prev => [...prev, ...newClips]);
  }, []);

  const toggleClip = (id) => {
    setSelectedClips(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const deleteClip = (e, id) => {
    e.stopPropagation();
    setClips(prev => prev.filter(c => c.id !== id));
    setSelectedClips(prev => prev.filter(x => x !== id));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setDone(false);
    setProgress(0);
    for (let i = 0; i < PROGRESS_STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 900 + Math.random() * 400));
      setProgress(Math.round(((i + 1) / PROGRESS_STEPS.length) * 100));
    }
    setCurrentStep(-1);
    setGenerating(false);
    setDone(true);
    setTab("preview");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-wrapper">
        <div className="container">

          {/* HEADER */}
          <header className="header fade-in">
            <div className="corner-deco tl" />
            <div className="corner-deco tr" />
            <div className="header-badge">APEX CLIP AI · BETA</div>
            <div className="logo">KILL<span>REEL</span></div>
            <div className="tagline">AI POWERED HIGHLIGHT GENERATOR</div>
          </header>

          {tab === "edit" && (
            <>
              {/* STATS */}
              <div className="stats-row fade-in-2">
                <div className="stat-card">
                  <div className="stat-val">{clips.length}</div>
                  <div className="stat-label">CLIPS</div>
                </div>
                <div className="stat-card">
                  <div className="stat-val">{clips.filter(c => c.kill).length}</div>
                  <div className="stat-label">KILLS</div>
                </div>
                <div className="stat-card">
                  <div className="stat-val">{selectedClips.length}</div>
                  <div className="stat-label">SELECTED</div>
                </div>
              </div>

              {/* UPLOAD */}
              <div className="section-label fade-in-2">
                <span><span className="num">01.</span> クリップをアップロード</span>
              </div>
              <div
                className={`upload-zone fade-in-2 ${dragOver ? "drag-over" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
              >
                <div className="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div className="upload-title">タップして動画を追加</div>
                <div className="upload-sub">または動画をドラッグ＆ドロップ</div>
                <div className="upload-limit">MP4 · MOV · 最大500MB</div>
                <input ref={fileInputRef} type="file" multiple accept="video/*" style={{ display: "none" }}
                  onChange={e => handleUpload(e.target.files)} />
              </div>

              {/* CLIP GRID */}
              {clips.length > 0 && (
                <div className="clip-grid fade-in-3">
                  {clips.map(clip => (
                    <div
                      key={clip.id}
                      className={`clip-card ${selectedClips.includes(clip.id) ? "selected" : ""}`}
                      onClick={() => toggleClip(clip.id)}
                    >
                      <div style={{
                        width: "100%", height: "100%",
                        background: `linear-gradient(135deg, #0a0a18, #1a0a20)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "24px"
                      }}>🎮</div>
                      <div className="clip-overlay" />
                      <button className="clip-delete" onClick={e => deleteClip(e, clip.id)}>×</button>
                      {clip.kill && <div className="clip-kill-badge">KILL</div>}
                      <div className="clip-info">
                        <div className="clip-name">{clip.name}</div>
                        <div className="clip-duration">{clip.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* WEAPON TYPE */}
              <div className="section-label fade-in-3">
                <span><span className="num">02.</span> 武器タイプを選択</span>
              </div>
              <div className="panel fade-in-3">
                <div className="weapon-grid">
                  {WEAPONS.map(w => (
                    <button
                      key={w.id}
                      className={`weapon-btn ${weapon === w.id ? "active" : ""}`}
                      onClick={() => setWeapon(w.id)}
                    >
                      <div className="weapon-icon">{w.icon}</div>
                      <div className="weapon-name">{w.name}</div>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: "10px", padding: "8px", background: "rgba(0,229,255,0.05)", borderRadius: "4px", border: "1px solid rgba(0,229,255,0.1)" }}>
                  <div style={{ fontSize: "11px", color: "var(--cyan)", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.5px" }}>
                    {weapon === "ar" && "⚡ 戦闘開始 → ダウン瞬間をビートと同期"}
                    {weapon === "sniper" && "🎯 ヘッドショット瞬間をビートと同期"}
                    {weapon === "shotgun" && "💥 確キル瞬間をビートと同期"}
                  </div>
                </div>
              </div>

              {/* MUSIC */}
              <div className="section-label fade-in-3">
                <span><span className="num">03.</span> トレンド音源を選択</span>
                <span className="analyze-chip">AI取得</span>
              </div>
              <div className="panel fade-in-3">
                {MOCK_TRACKS.map(track => (
                  <div
                    key={track.id}
                    className={`music-track ${selectedTrack === track.id ? "selected" : ""}`}
                    onClick={() => setSelectedTrack(track.id)}
                  >
                    <div className={`track-cover ${track.type}`}>
                      <div className="eq-bars">
                        {[12, 18, 8, 15].map((h, i) => (
                          <div key={i} className="eq-bar" style={{ height: `${h}px` }} />
                        ))}
                      </div>
                    </div>
                    <div className="track-info">
                      <div className="track-title">{track.title}</div>
                      <div className="track-meta">
                        <span>{track.platform}</span>
                        <span>{track.duration}</span>
                      </div>
                      {track.trending && <div className="trending-badge">🔥 TRENDING</div>}
                    </div>
                    <div className="track-bpm">{track.bpm}</div>
                  </div>
                ))}
                <button className="btn-refresh">↻ &nbsp; 音源を更新する</button>
              </div>

              {/* SETTINGS */}
              <div className="section-label fade-in-4">
                <span><span className="num">04.</span> 出力設定</span>
              </div>
              <div className="panel fade-in-4">
                <div className="setting-row">
                  <div className="setting-label">
                    動画の長さ
                    <span className="setting-hint">音源に合わせて自動調整</span>
                  </div>
                  <div className="setting-control">
                    {["30", "60", "90"].map(d => (
                      <button key={d} className={`pill-btn ${duration === d ? "active" : ""}`} onClick={() => setDuration(d)}>
                        {d}秒
                      </button>
                    ))}
                  </div>
                </div>
                <div className="setting-row">
                  <div className="setting-label">
                    画質
                    <span className="setting-hint">縦動画 9:16</span>
                  </div>
                  <div className="setting-control">
                    {["720", "1080"].map(q => (
                      <button key={q} className={`pill-btn ${quality === q ? "active" : ""}`} onClick={() => setQuality(q)}>
                        {q}p
                      </button>
                    ))}
                  </div>
                </div>
                <div className="setting-row">
                  <div className="setting-label">
                    自動キャプション
                    <span className="setting-hint">キル数などをテキスト表示</span>
                  </div>
                  <button className={`toggle ${autoCaption ? "on" : ""}`} onClick={() => setAutoCaption(p => !p)} />
                </div>
              </div>

              {/* PROGRESS */}
              {generating && (
                <div className="progress-wrap fade-in">
                  <div className="progress-header">
                    <div className="progress-title">AI 生成中...</div>
                    <div className="progress-pct">{progress}%</div>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="progress-steps">
                    {PROGRESS_STEPS.map((step, i) => (
                      <div key={i} className={`progress-step ${i < currentStep ? "done" : i === currentStep ? "active" : ""}`}>
                        <div className="step-dot" />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GENERATE */}
              <button
                className="btn-generate fade-in-4"
                onClick={handleGenerate}
                disabled={generating || selectedClips.length === 0}
                style={{ opacity: (generating || selectedClips.length === 0) ? 0.6 : 1 }}
              >
                {generating ? "⚡ 生成中..." : "⚡ 音ハメ動画を生成する"}
                <span className="btn-sub">
                  {generating ? "しばらくお待ちください" : `${selectedClips.length}クリップ · ${duration}秒 · ${quality}p`}
                </span>
              </button>
            </>
          )}

          {tab === "preview" && (
            <>
              <div className="section-label fade-in">
                <span>プレビュー</span>
                {done && <span className="analyze-chip">完成！</span>}
              </div>

              <div className="preview-wrap fade-in">
                <div className="preview-placeholder">
                  {done ? (
                    <>
                      <div style={{ fontSize: "48px" }}>🎬</div>
                      <div className="preview-text">生成完了！<br />プレビューを再生</div>
                      <button style={{
                        padding: "10px 24px",
                        background: "var(--apex-red)",
                        border: "none",
                        borderRadius: "20px",
                        color: "white",
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: "13px",
                        cursor: "pointer"
                      }}>▶ 再生</button>
                    </>
                  ) : (
                    <>
                      <div className="preview-icon">🎮</div>
                      <div className="preview-text">動画を生成してから<br />ここでプレビューできます</div>
                    </>
                  )}
                </div>
                <div className="preview-hud">
                  <div className="hud-corner tl" />
                  <div className="hud-corner tr" />
                  <div className="hud-corner bl" />
                  <div className="hud-corner br" />
                </div>
              </div>

              <div className="action-grid fade-in-2">
                <button className="btn-action primary">
                  <span className="btn-icon">⬇️</span>
                  <span className="btn-label">DOWNLOAD</span>
                </button>
                <button className="btn-action" onClick={() => setTab("edit")}>
                  <span className="btn-icon">✏️</span>
                  <span className="btn-label">RE-EDIT</span>
                </button>
              </div>

              <div className="section-label fade-in-3">
                <span>プラットフォームに投稿</span>
              </div>
              <div className="platform-row fade-in-3">
                <button className="platform-btn tiktok">
                  <span className="platform-icon">🎵</span>
                  <span className="platform-name">TikTok</span>
                </button>
                <button className="platform-btn youtube">
                  <span className="platform-icon">▶️</span>
                  <span className="platform-name">YouTube</span>
                </button>
                <button className="platform-btn instagram">
                  <span className="platform-icon">📷</span>
                  <span className="platform-name">Reels</span>
                </button>
                <button className="platform-btn x">
                  <span className="platform-icon">✖️</span>
                  <span className="platform-name">X</span>
                </button>
              </div>
            </>
          )}

        </div>

        {/* BOTTOM NAV */}
        <nav className="bottom-nav">
          {[
            { id: "edit", icon: "✂️", label: "EDIT" },
            { id: "preview", icon: "▶️", label: "PREVIEW" },
            { id: "history", icon: "🕐", label: "HISTORY" },
            { id: "settings", icon: "⚙️", label: "SETTING" },
          ].map(item => (
            <div
              key={item.id}
              className={`nav-item ${tab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}