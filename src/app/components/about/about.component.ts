import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BinaryPortraitComponent } from '../binary-portrait/binary-portrait.component';

gsap.registerPlugin(ScrollTrigger);

interface TooltipData {
  icon: string;
  iconImg?: string;
  title: string;
  type: string;
  description: string;
  colorClass: string;
  meta?: { text: string; color: string }[];
  techIcons?: { name: string; icon: string }[];
  footer?: string;
}

interface JsonLine {
  safeCode: SafeHtml;
  tooltip?: TooltipData | null;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, BinaryPortraitComponent],
  template: `
    <section id="about" class="about-section section-padding" #aboutSection>
      <!-- Background grid pattern -->
      <div class="bg-grid"></div>
      <!-- Floating tech particles -->
      <canvas #bgCanvas class="bg-particles-canvas"></canvas>

      <div class="container">
        <div class="section-header">
          <span class="section-tag">&lt;About Me /&gt;</span>
          <h2 class="section-title gradient-text">Who I Am</h2>
          <div class="header-line"></div>
        </div>

        <div class="about-content">
          <div class="about-portrait">
            <app-binary-portrait></app-binary-portrait>
          </div>

          <div class="about-card-wrapper">
            <!-- Animated gradient border -->
            <div class="card-border-glow"></div>
            <div class="about-card glass">
              <!-- Terminal-style header bar -->
              <div class="card-terminal-bar">
                <div class="terminal-dots">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
                <span class="terminal-title">profile.json</span>
                <span class="terminal-status">● connected</span>
              </div>

              <!-- JSON formatted content -->
              <div class="json-content">
                <!-- Scanline overlay effect -->
                <div class="json-scanline"></div>
                <!-- Inner glow effect -->
                <div class="json-inner-glow"></div>

                <!-- Code area with hoverable lines -->
                <div class="json-code-area">
                  <div class="json-line-wrapper" *ngFor="let line of jsonLines; let i = index"
                       [class.typed]="i < visibleLines">
                    <span class="line-num">{{ i + 1 }}</span>
                    <div class="json-line"
                         [class.has-tooltip]="line.tooltip"
                         [class.active-line]="activeTooltipIndex === i"
                         [attr.tabindex]="line.tooltip ? 0 : null"
                         [attr.role]="line.tooltip ? 'button' : null"
                         [attr.aria-label]="line.tooltip ? 'Show info for ' + line.tooltip.title : null"
                         (mouseenter)="showTooltip(i, $event)"
                         (mouseleave)="hideTooltip()"
                         (click)="toggleTooltip(i, $event)"
                         (keydown.enter)="onKeyboardToggle(i, $event)"
                         (keydown.space)="onKeyboardToggle(i, $event)"
                         (keydown.escape)="closeTooltip($event)">
                      <span [innerHTML]="line.safeCode"></span>
                    </div>
                  </div>
                  <!-- Blinking cursor -->
                  <div class="json-cursor"></div>
                </div>

                <!-- Minimap -->
                <div class="json-minimap">
                  <div class="minimap-line" *ngFor="let line of jsonLineNumbers"
                       [style.width.%]="30 + (line * 3)"
                       [style.background]="line % 3 === 0 ? 'rgba(0, 212, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'">
                  </div>
                  <div class="minimap-viewport"></div>
                </div>
              </div>

              <!-- Hover Tooltip Card -->
              <div class="hover-tooltip" 
                   *ngIf="activeTooltip"
                   [style.top.px]="tooltipTop"
                   [style.left.px]="tooltipLeft"
                   [class]="'hover-tooltip ' + activeTooltip.colorClass">
                <div class="tooltip-header">
                  <img *ngIf="activeTooltip.iconImg" [src]="activeTooltip.iconImg" alt="" class="tooltip-icon-img" />
                  <span *ngIf="!activeTooltip.iconImg" class="tooltip-icon">{{ activeTooltip.icon }}</span>
                  <span class="tooltip-title">{{ activeTooltip.title }}</span>
                  <span class="tooltip-type">{{ activeTooltip.type }}</span>
                  <button class="tooltip-close" (click)="closeTooltip($event)" aria-label="Close tooltip">✕</button>
                </div>
                <div class="tooltip-divider"></div>
                <div class="tooltip-body">
                  <p class="tooltip-desc">{{ activeTooltip.description }}</p>
                  <!-- Tech icons grid -->
                  <div class="tooltip-tech-icons" *ngIf="activeTooltip.techIcons">
                    <div class="tech-icon-item" *ngFor="let tech of activeTooltip.techIcons">
                      <img [src]="tech.icon" [alt]="tech.name" class="tech-icon-img" />
                      <span class="tech-icon-name">{{ tech.name }}</span>
                    </div>
                  </div>
                  <!-- Regular meta items -->
                  <div class="tooltip-meta" *ngIf="activeTooltip.meta && !activeTooltip.techIcons">
                    <span class="meta-item" *ngFor="let m of activeTooltip.meta">
                      <span class="meta-dot" [style.background]="m.color"></span>
                      {{ m.text }}
                    </span>
                  </div>
                </div>
                <div class="tooltip-footer" *ngIf="activeTooltip.footer">
                  {{ activeTooltip.footer }}
                </div>
              </div>

              <!-- Bottom toolbar -->
              <div class="json-toolbar">
                <div class="toolbar-left">
                  <span class="toolbar-item">
                    <span class="toolbar-icon">⎇</span> main
                  </span>
                  <span class="toolbar-item">
                    <span class="toolbar-icon">◉</span> 0 errors
                  </span>
                  <span class="toolbar-item">
                    <span class="toolbar-icon">⚠</span> 0 warnings
                  </span>
                </div>
                <div class="toolbar-right">
                  <span class="toolbar-item">JSON</span>
                  <span class="toolbar-item">UTF-8</span>
                  <span class="toolbar-item">Ln {{ activeLine }}, Col 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card glass" *ngFor="let stat of stats; let i = index">
            <div class="stat-icon" [innerHTML]="getSafeStatIcon(stat.icon)"></div>
            <span class="stat-number" [attr.data-target]="stat.value">0</span>
            <span class="stat-suffix">{{ stat.suffix }}</span>
            <span class="stat-label">{{ stat.label }}</span>
            <div class="stat-glow"></div>
            <div class="stat-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      position: relative;
      z-index: 10;
      overflow: hidden;
    }

    /* Background grid */
    .bg-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
    }

    .bg-particles-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    .section-header {
      text-align: center;
      margin-bottom: 80px;
    }

    .section-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: #00d4ff;
      margin-bottom: 16px;
      display: block;
      opacity: 0.8;
    }

    .header-line {
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #00d4ff, #a855f7);
      margin: 16px auto 0;
      border-radius: 2px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: inherit;
        filter: blur(8px);
        opacity: 0.6;
      }
    }

    .about-content {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 60px;
      align-items: center;
      margin-bottom: 80px;
    }

    .about-portrait {
      display: flex;
      justify-content: center;
    }

    /* Card wrapper with animated border */
    .about-card-wrapper {
      position: relative;
      border-radius: 20px;
    }

    .card-border-glow {
      position: absolute;
      inset: -2px;
      border-radius: 20px;
      background: conic-gradient(
        from var(--border-angle, 0deg),
        transparent 0%,
        #00d4ff 10%,
        #a855f7 20%,
        transparent 30%,
        transparent 100%
      );
      animation: rotate-border 6s linear infinite;
      opacity: 0.6;
      z-index: -1;

      &::after {
        content: '';
        position: absolute;
        inset: 2px;
        border-radius: 18px;
        background: var(--dark-bg, #0a0a0f);
      }
    }

    @property --border-angle {
      syntax: '<angle>';
      inherits: false;
      initial-value: 0deg;
    }

    @keyframes rotate-border {
      to { --border-angle: 360deg; }
    }

    .about-card {
      padding: 0;
      border-radius: 18px;
      overflow: visible;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 
          0 20px 60px rgba(0, 212, 255, 0.1),
          0 0 80px rgba(168, 85, 247, 0.05);
      }
    }

    /* Terminal bar */
    .card-terminal-bar {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      background: rgba(0, 0, 0, 0.4);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      gap: 12px;
      border-radius: 18px 18px 0 0;
    }

    .terminal-dots {
      display: flex;
      gap: 6px;

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        
        &.red { background: #ff5f57; }
        &.yellow { background: #febc2e; }
        &.green { background: #28c840; }
      }
    }

    .terminal-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      flex: 1;
      text-align: center;
    }

    .terminal-status {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      color: #28c840;
      animation: pulse-status 2s ease infinite;
    }

    @keyframes pulse-status {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* JSON content - IDE style */
    .json-content {
      position: relative;
      display: flex;
      padding: 0;
      overflow: hidden;
      background: rgba(10, 10, 20, 0.6);
      min-height: 320px;
    }

    /* Scanline overlay */
    .json-scanline {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 212, 255, 0.008) 2px,
        rgba(0, 212, 255, 0.008) 4px
      );
      pointer-events: none;
      z-index: 3;
      animation: scanlineMove 8s linear infinite;
    }

    @keyframes scanlineMove {
      0% { background-position: 0 0; }
      100% { background-position: 0 100px; }
    }

    /* Inner glow */
    .json-inner-glow {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(ellipse at 20% 50%, rgba(0, 212, 255, 0.04) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.03) 0%, transparent 40%);
      pointer-events: none;
      z-index: 2;
    }

    /* Code area */
    .json-code-area {
      flex: 1;
      padding: 20px 20px 20px 16px;
      position: relative;
      z-index: 1;
      overflow-x: auto;
    }

    .json-line-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 0;

      .line-num {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.72rem;
        line-height: 1.8;
        color: rgba(255, 255, 255, 0.2);
        text-align: right;
        min-width: 28px;
        padding-right: 12px;
        user-select: none;
        flex-shrink: 0;
        border-right: 1px solid rgba(0, 212, 255, 0.1);
        margin-right: 12px;
      }
    }

    .json-line {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.7);
      padding: 1px 8px;
      border-radius: 4px;
      position: relative;
      transition: background 0.25s ease, box-shadow 0.25s ease;
      white-space: pre-wrap;
      word-break: break-word;
      flex: 1;

      &:hover {
        background: rgba(100, 255, 218, 0.04);
        box-shadow: inset 0 0 30px rgba(0, 212, 255, 0.02);

        &::before {
          content: '';
          position: absolute;
          left: -16px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #64ffda, #b388ff);
          border-radius: 1px;
          box-shadow: 0 0 8px rgba(100, 255, 218, 0.6);
        }
      }
    }

    /* Blinking cursor */
    .json-cursor {
      display: inline-block;
      width: 2px;
      height: 14px;
      background: #00d4ff;
      margin-left: 8px;
      animation: blink 1s step-end infinite;
      box-shadow: 0 0 6px rgba(0, 212, 255, 0.6);
      vertical-align: middle;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    /* Minimap */
    .json-minimap {
      width: 40px;
      padding: 20px 6px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      background: rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 1;
      border-left: 1px solid rgba(255, 255, 255, 0.04);
    }

    .minimap-line {
      height: 3px;
      border-radius: 1px;
      opacity: 0.6;
    }

    .minimap-viewport {
      position: absolute;
      top: 16px;
      left: 4px;
      right: 4px;
      height: 50%;
      border: 1px solid rgba(0, 212, 255, 0.2);
      border-radius: 2px;
      background: rgba(0, 212, 255, 0.03);
    }

    /* Bottom toolbar */
    .json-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 16px;
      background: rgba(0, 0, 0, 0.5);
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.62rem;
      border-radius: 0 0 18px 18px;
    }

    .toolbar-left, .toolbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .toolbar-item {
      color: rgba(255, 255, 255, 0.4);
      display: flex;
      align-items: center;
      gap: 4px;
      transition: color 0.2s ease;

      &:hover {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    .toolbar-icon {
      color: #00d4ff;
      font-size: 0.7rem;
    }

    /* Syntax colors - handled via inline styles for Angular innerHTML compatibility */

    /* Typing animation */
    .json-line-wrapper {
      opacity: 0;
      transform: translateX(-4px);
      transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);

      &.typed {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Close button on tooltip */
    .tooltip-close {
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.4);
      border-radius: 4px;
      font-size: 0.7rem;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
      }
    }

    /* Focus styles for keyboard accessibility */
    .json-line.has-tooltip:focus {
      outline: none;
      background: rgba(100, 255, 218, 0.06);
      box-shadow: 0 0 0 1px rgba(0, 212, 255, 0.3);

      &::before {
        content: '';
        position: absolute;
        left: -16px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(180deg, #64ffda, #b388ff);
        border-radius: 1px;
        box-shadow: 0 0 8px rgba(100, 255, 218, 0.6);
      }
    }

    /* Hoverable line indicator */
    .json-line.has-tooltip {
      cursor: pointer;

      &::after {
        content: '';
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(0, 212, 255, 0.3);
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      &:hover::after {
        opacity: 1;
        animation: dotPulse 1.5s ease infinite;
      }
    }

    .json-line.active-line {
      background: rgba(100, 255, 218, 0.06);

      &::before {
        content: '';
        position: absolute;
        left: -16px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(180deg, #64ffda, #b388ff);
        border-radius: 1px;
        box-shadow: 0 0 8px rgba(100, 255, 218, 0.6);
      }
    }

    @keyframes dotPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.4); }
      50% { box-shadow: 0 0 0 4px rgba(0, 212, 255, 0); }
    }

    /* Hover Tooltip Card */
    .hover-tooltip {
      position: absolute;
      z-index: 100;
      min-width: 280px;
      max-width: 360px;
      border-radius: 12px;
      background: rgba(12, 12, 24, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.6),
        0 0 40px rgba(0, 212, 255, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
      animation: tooltipIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      overflow: hidden;

      /* Color variants */
      &.color-cyan {
        border-color: rgba(0, 212, 255, 0.2);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 212, 255, 0.1);
        .tooltip-header { border-left: 3px solid #00d4ff; }
        .tooltip-icon { background: rgba(0, 212, 255, 0.1); color: #00d4ff; }
      }

      &.color-purple {
        border-color: rgba(168, 85, 247, 0.2);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(168, 85, 247, 0.1);
        .tooltip-header { border-left: 3px solid #a855f7; }
        .tooltip-icon { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
      }

      &.color-green {
        border-color: rgba(40, 200, 64, 0.2);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(40, 200, 64, 0.1);
        .tooltip-header { border-left: 3px solid #28c840; }
        .tooltip-icon { background: rgba(40, 200, 64, 0.1); color: #28c840; }
      }

      &.color-pink {
        border-color: rgba(236, 72, 153, 0.2);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(236, 72, 153, 0.1);
        .tooltip-header { border-left: 3px solid #ec4899; }
        .tooltip-icon { background: rgba(236, 72, 153, 0.1); color: #ec4899; }
      }

      &.color-yellow {
        border-color: rgba(255, 213, 79, 0.2);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 213, 79, 0.1);
        .tooltip-header { border-left: 3px solid #ffd54f; }
        .tooltip-icon { background: rgba(255, 213, 79, 0.1); color: #ffd54f; }
      }
    }

    @keyframes tooltipIn {
      from {
        opacity: 0;
        transform: translateY(6px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .tooltip-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-left: 3px solid #00d4ff;
    }

    .tooltip-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .tooltip-icon-img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      border: 2px solid rgba(0, 212, 255, 0.3);
      box-shadow: 0 0 12px rgba(0, 212, 255, 0.2);
    }

    .tooltip-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      color: #fff;
      flex: 1;
    }

    .tooltip-type {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6rem;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tooltip-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    }

    .tooltip-body {
      padding: 12px 16px;
    }

    .tooltip-desc {
      font-size: 0.78rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 10px;
    }

    .tooltip-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      color: rgba(255, 255, 255, 0.5);
      padding: 3px 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .meta-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* Tech icons grid */
    .tooltip-tech-icons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      padding: 4px 0;
    }

    .tech-icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 10px 6px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      transition: all 0.25s ease;

      &:hover {
        background: rgba(255, 215, 64, 0.06);
        border-color: rgba(255, 215, 64, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
    }

    .tech-icon-img {
      width: 28px;
      height: 28px;
      object-fit: contain;
      filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.15));
    }

    .tech-icon-name {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.55rem;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      white-space: nowrap;
    }

    .tooltip-footer {
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.2);
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6rem;
      color: rgba(255, 255, 255, 0.3);
    }

    /* Stats grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .stat-card {
      padding: 32px 24px;
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 50px rgba(0, 212, 255, 0.1);
        
        .stat-glow { opacity: 1; }
        .stat-pulse { transform: scale(1.5); opacity: 0; }
        .stat-icon { transform: scale(1.2); }
      }

      .stat-icon {
        font-size: 1.5rem;
        margin: 0 auto 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        transition: transform 0.3s ease;
      }

      .stat-number {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 3rem;
        font-weight: 700;
        color: #00d4ff;
        display: inline;
      }

      .stat-suffix {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #a855f7;
      }

      .stat-label {
        display: block;
        margin-top: 8px;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.5);
        letter-spacing: 0.5px;
      }

      .stat-glow {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #00d4ff, transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .stat-pulse {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.15), transparent);
        transform: translate(-50%, -50%) scale(1);
        transition: transform 0.6s ease, opacity 0.6s ease;
        pointer-events: none;
      }
    }

    @media (max-width: 768px) {
      .about-card { padding: 0; }
      .json-content { min-height: 260px; }
      .json-code-area { padding: 16px 12px 16px 10px; }
      .json-line { font-size: 0.65rem; }
      .json-line-wrapper .line-num { font-size: 0.6rem; min-width: 22px; padding-right: 8px; margin-right: 8px; }
      .json-minimap { display: none; }
      .json-toolbar { padding: 4px 10px; font-size: 0.55rem; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .about-content { grid-template-columns: 1fr; gap: 40px; }
      .hover-tooltip {
        min-width: 240px;
        max-width: calc(100vw - 48px);
      }
    }
  `],
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aboutSection') sectionRef!: ElementRef;
  @ViewChild('bgCanvas') bgCanvasRef!: ElementRef<HTMLCanvasElement>;

  private animationId = 0;
  private floatingParticles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];

  profileInfo = [
    { icon: '👤', label: 'Name', value: 'Navinkumar Palanivel' },
    { icon: '📍', label: 'Location', value: 'Chennai, India' },
    { icon: '⏱️', label: 'Experience', value: '3+ Years' },
    { icon: '🏢', label: 'Company', value: 'Intellect Design Arena Ltd' },
  ];

  techBadges = ['Angular', 'Vue.js', 'JavaScript', 'TypeScript', 'Python', 'FastAPI', 'SQL', 'PostgreSQL', 'MongoDB'];

  jsonLineNumbers = Array.from({ length: 22 }, (_, i) => i + 1);

  activeLine = 22;

  activeTooltip: TooltipData | null = null;

  tooltipTop = 0;
  tooltipLeft = 0;

  visibleLines = 0;

  jsonLines: JsonLine[] = [];

  private rawJsonLines: { code: string; tooltip?: TooltipData | null }[] = [
    { code: '<span style="color:#e0e0e0;font-weight:700;text-shadow:0 0 8px rgba(255,255,255,0.3);font-size:1.1em">{</span>', tooltip: null },
    {
      code: '  <span style="color:#80d8ff;text-shadow:0 0 12px rgba(128,216,255,0.4);font-weight:500">"name"</span><span style="color:rgba(255,255,255,0.3)">:</span> <span style="color:#80d8ff;text-shadow:0 0 10px rgba(128,216,255,0.35);font-weight:500">"Navinkumar Palanivel"</span><span style="color:rgba(255,255,255,0.3)">,</span>',
      tooltip: {
        icon: '👤', iconImg: 'assets/images/navinkumar-profile-pic.png', title: 'Navinkumar Palanivel', type: 'string',
        description: 'Full-Stack Developer passionate about building scalable, high-performance web applications.',
        colorClass: 'color-cyan',
        meta: [{ text: 'Available for hire', color: '#28c840' }, { text: 'Remote friendly', color: '#00d4ff' }],
        footer: '📧 Connect on LinkedIn',
      },
    },
    {
      code: '  <span style="color:#69f0ae;text-shadow:0 0 12px rgba(105,240,174,0.4);font-weight:500">"location"</span><span style="color:rgba(255,255,255,0.3)">:</span> <span style="color:#69f0ae;text-shadow:0 0 10px rgba(105,240,174,0.35)">"Chennai, India"</span><span style="color:rgba(255,255,255,0.3)">,</span>',
      tooltip: {
        icon: '📍', title: 'Chennai, India', type: 'string',
        description: 'Based in Chennai, India\'s tech hub. Open to remote and hybrid opportunities worldwide.',
        colorClass: 'color-green',
        meta: [{ text: 'IST (UTC+5:30)', color: '#ffd54f' }, { text: 'Hybrid/Remote', color: '#28c840' }],
        footer: '🌏 GMT+5:30 timezone',
      },
    },
    {
      code: '  <span style="color:#ea80fc;text-shadow:0 0 12px rgba(234,128,252,0.4);font-weight:500">"experience"</span><span style="color:rgba(255,255,255,0.3)">:</span> <span style="color:#ea80fc;text-shadow:0 0 10px rgba(234,128,252,0.35)">"3+ Years"</span><span style="color:rgba(255,255,255,0.3)">,</span>',
      tooltip: {
        icon: '⏱️', title: '3+ Years Experience', type: 'string',
        description: 'Over 3 years of professional experience delivering enterprise-grade software across FinTech and InsurTech domains.',
        colorClass: 'color-purple',
        meta: [{ text: 'FinTech', color: '#a855f7' }, { text: 'InsurTech', color: '#ec4899' }, { text: 'AI/ML', color: '#00d4ff' }],
        footer: '🚀 Shipped 50+ features to production',
      },
    },
    {
      code: '  <span style="color:#ffd740;text-shadow:0 0 12px rgba(255,215,64,0.4);font-weight:500">"company"</span><span style="color:rgba(255,255,255,0.3)">:</span> <span style="color:#ffd740;text-shadow:0 0 10px rgba(255,215,64,0.35)">"Intellect Design Arena Ltd"</span><span style="color:rgba(255,255,255,0.3)">,</span>',
      tooltip: {
        icon: '🏢', title: 'Intellect Design Arena Ltd', type: 'string',
        description: 'A global leader in financial technology for banking, insurance, and capital markets with operations in 57+ countries.',
        colorClass: 'color-yellow',
        meta: [{ text: '57+ countries', color: '#ffd54f' }, { text: 'Fortune 500 clients', color: '#f48fb1' }],
        footer: '🌐 Global FinTech company',
      },
    },
    {
      code: '  <span style="color:#ff80ab;text-shadow:0 0 12px rgba(255,128,171,0.4);font-weight:500">"role"</span><span style="color:rgba(255,255,255,0.3)">:</span> <span style="color:#ff80ab;text-shadow:0 0 10px rgba(255,128,171,0.35)">"Full-Stack Developer"</span><span style="color:rgba(255,255,255,0.3)">,</span>',
      tooltip: {
        icon: '💻', title: 'Full-Stack Developer', type: 'string',
        description: 'End-to-end development from pixel-perfect frontends to scalable backend architectures and CI/CD pipelines.',
        colorClass: 'color-pink',
        meta: [{ text: 'Frontend', color: '#00d4ff' }, { text: 'Backend', color: '#a855f7' }, { text: 'DevOps', color: '#28c840' }],
        footer: '⚡ Angular • Vue.js • FastAPI • Python',
      },
    },
    {
      code: '  <span style="color:#80d8ff;text-shadow:0 0 12px rgba(128,216,255,0.4);font-weight:500">"summary"</span><span style="color:rgba(255,255,255,0.3)">:</span> <span style="color:#ffd180;text-shadow:0 0 6px rgba(255,209,128,0.2)">"Building enterprise-grade FinTech &amp; AI-powered platforms."</span><span style="color:rgba(255,255,255,0.3)">,</span>',
      tooltip: {
        icon: '📝', title: 'About Me', type: 'string',
        description: 'I specialize in crafting scalable frontend architectures, designing robust backend APIs, and integrating AI/ML workflows into real-world products.',
        colorClass: 'color-cyan',
        meta: [{ text: 'Architecture', color: '#00d4ff' }, { text: 'AI/ML Integration', color: '#a855f7' }],
        footer: '🎯 Turning complex challenges into elegant solutions',
      },
    },
    { code: '  <span style="color:#b9f6ca;text-shadow:0 0 12px rgba(185,246,202,0.4);font-weight:500">"expertise"</span><span style="color:rgba(255,255,255,0.3)">:</span> <span style="color:#b388ff;font-weight:600;text-shadow:0 0 10px rgba(179,136,255,0.4)">[</span>', tooltip: null },
    {
      code: '    <span style="color:#a5d6a7;text-shadow:0 0 6px rgba(165,214,167,0.25)">"Enterprise FinTech Platforms"</span><span style="color:rgba(255,255,255,0.3)">,</span>',
      tooltip: {
        icon: '🏦', title: 'Enterprise FinTech Platforms', type: 'string',
        description: 'Built and maintained large-scale banking and payment platforms handling millions in transactions daily.',
        colorClass: 'color-green',
        meta: [{ text: 'Banking', color: '#69f0ae' }, { text: 'Payments', color: '#00d4ff' }, { text: 'High Volume', color: '#ffd54f' }],
        footer: '💰 Mission-critical financial systems',
      },
    },
    {
      code: '    <span style="color:#a5d6a7;text-shadow:0 0 6px rgba(165,214,167,0.25)">"AI-powered Insurance Systems"</span><span style="color:rgba(255,255,255,0.3)">,</span>',
      tooltip: {
        icon: '🤖', title: 'AI-powered Insurance Systems', type: 'string',
        description: 'Integrated AI/ML models into insurance platforms for automated document processing and risk assessment.',
        colorClass: 'color-purple',
        meta: [{ text: 'ML Models', color: '#a855f7' }, { text: 'Document AI', color: '#ec4899' }, { text: 'Automation', color: '#00d4ff' }],
        footer: '🧠 Intelligent automation pipelines',
      },
    },
    {
      code: '    <span style="color:#a5d6a7;text-shadow:0 0 6px rgba(165,214,167,0.25)">"Legacy System Migration"</span><span style="color:rgba(255,255,255,0.3)">,</span>',
      tooltip: {
        icon: '🔄', title: 'Legacy System Migration', type: 'string',
        description: 'Successfully migrated legacy applications to modern Angular/Vue.js frameworks with zero downtime.',
        colorClass: 'color-cyan',
        meta: [{ text: 'Zero downtime', color: '#28c840' }, { text: 'Incremental', color: '#00d4ff' }],
        footer: '🚀 Seamless modernization',
      },
    },
    {
      code: '    <span style="color:#a5d6a7;text-shadow:0 0 6px rgba(165,214,167,0.25)">"Intelligent Document Processing"</span>',
      tooltip: {
        icon: '📄', title: 'Intelligent Document Processing', type: 'string',
        description: 'Built end-to-end IDP platforms using OCR, NLP, and custom ML models for extracting structured data from unstructured documents.',
        colorClass: 'color-yellow',
        meta: [{ text: 'OCR', color: '#ffd54f' }, { text: 'NLP', color: '#a855f7' }, { text: 'ML Pipeline', color: '#ec4899' }],
        footer: '📊 90%+ extraction accuracy',
      },
    },
    { code: '  <span style="color:#b388ff;font-weight:600;text-shadow:0 0 10px rgba(179,136,255,0.4)">]</span><span style="color:rgba(255,255,255,0.3)">,</span>', tooltip: null },
    {
      code: '  <span style="color:#ffd740;text-shadow:0 0 12px rgba(255,215,64,0.4);font-weight:500">"techStack"</span><span style="color:rgba(255,255,255,0.3)">:</span> <span style="color:#b388ff;font-weight:600;text-shadow:0 0 10px rgba(179,136,255,0.4)">[</span>',
      tooltip: {
        icon: '🛠️', title: 'Tech Stack', type: 'array',
        description: 'Modern technology stack spanning frontend frameworks, backend services, databases, and cloud infrastructure.',
        colorClass: 'color-yellow',
        techIcons: [
          { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg' },
          { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
          { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
          { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
          { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
          { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
          { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
          { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        ],
        footer: '📦 8 production technologies',
      },
    },
    { code: '    <span style="color:#81d4fa;text-shadow:0 0 8px rgba(129,212,250,0.3)">"Angular"</span><span style="color:rgba(255,255,255,0.3)">,</span> <span style="color:#81d4fa;text-shadow:0 0 8px rgba(129,212,250,0.3)">"Vue.js"</span><span style="color:rgba(255,255,255,0.3)">,</span> <span style="color:#81d4fa;text-shadow:0 0 8px rgba(129,212,250,0.3)">"TypeScript"</span><span style="color:rgba(255,255,255,0.3)">,</span>', tooltip: null },
    { code: '    <span style="color:#81d4fa;text-shadow:0 0 8px rgba(129,212,250,0.3)">"Python"</span><span style="color:rgba(255,255,255,0.3)">,</span> <span style="color:#81d4fa;text-shadow:0 0 8px rgba(129,212,250,0.3)">"FastAPI"</span><span style="color:rgba(255,255,255,0.3)">,</span> <span style="color:#81d4fa;text-shadow:0 0 8px rgba(129,212,250,0.3)">"PostgreSQL"</span>', tooltip: null },
    { code: '  <span style="color:#b388ff;font-weight:600;text-shadow:0 0 10px rgba(179,136,255,0.4)">]</span><span style="color:rgba(255,255,255,0.3)">,</span>', tooltip: null },
    {
      code: '  <span style="color:#ff80ab;text-shadow:0 0 12px rgba(255,128,171,0.4);font-weight:500">"dailyUsers"</span><span style="color:rgba(255,255,255,0.3)">:</span> <span style="color:#ff80ab;font-weight:700;font-size:1.05em;text-shadow:0 0 14px rgba(255,128,171,0.5)">1000</span><span style="color:#ff80ab;font-weight:700;text-shadow:0 0 14px rgba(255,128,171,0.5)">+</span>',
      tooltip: {
        icon: '👥', title: '1000+ Daily Users', type: 'number',
        description: 'Applications I\'ve built serve thousands of active users daily across enterprise banking and insurance platforms.',
        colorClass: 'color-pink',
        meta: [{ text: '1K+ daily', color: '#ec4899' }, { text: '100K+ records', color: '#a855f7' }],
        footer: '📊 High-traffic enterprise platforms',
      },
    },
    { code: '<span style="color:#e0e0e0;font-weight:700;text-shadow:0 0 8px rgba(255,255,255,0.3);font-size:1.1em">}</span>', tooltip: null },
  ];

  stats = [
    { value: 3, suffix: '+', label: 'Years Experience', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>' },
    { value: 20, suffix: '+', label: 'Enterprise Modules', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 8h2m2 0h2m2 0h2"/><path d="M7 11h10"/></svg>' },
    { value: 100, suffix: 'K+', label: 'Data Records Processed', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>' },
    { value: 50, suffix: '+', label: 'Features Delivered', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  ];

  activeTooltipIndex: number | null = null;

  getSafeStatIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  constructor(private ngZone: NgZone, private sanitizer: DomSanitizer) {
    this.jsonLines = this.rawJsonLines.map(line => ({
      safeCode: this.sanitizer.bypassSecurityTrustHtml(line.code),
      tooltip: line.tooltip,
    }));
  }

  closeTooltip(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.activeTooltip = null;
    this.activeTooltipIndex = null;
  }

  onKeyboardToggle(index: number, event: Event): void {
    event.preventDefault();
    this.toggleTooltip(index, event as KeyboardEvent as unknown as MouseEvent);
  }

  showTooltip(index: number, event: MouseEvent): void {
    // Skip on touch devices — handled by toggleTooltip
    if ('ontouchstart' in window) return;

    const line = this.jsonLines[index];
    if (!line.tooltip) {
      this.activeTooltip = null;
      this.activeTooltipIndex = null;
      return;
    }
    this.activeTooltip = line.tooltip;
    this.activeTooltipIndex = index;
    this.activeLine = index + 1;
    this.positionTooltip(event);
  }

  hideTooltip(): void {
    // Skip on touch devices — handled by toggleTooltip
    if ('ontouchstart' in window) return;
    this.activeTooltip = null;
    this.activeTooltipIndex = null;
  }

  toggleTooltip(index: number, event: MouseEvent | TouchEvent): void {
    const line = this.jsonLines[index];
    if (!line.tooltip) {
      this.activeTooltip = null;
      this.activeTooltipIndex = null;
      return;
    }

    // If same line is tapped again, close it
    if (this.activeTooltipIndex === index) {
      this.activeTooltip = null;
      this.activeTooltipIndex = null;
      return;
    }

    this.activeTooltip = line.tooltip;
    this.activeTooltipIndex = index;
    this.activeLine = index + 1;
    this.positionTooltip(event);
  }

  private positionTooltip(event: MouseEvent | TouchEvent): void {
    const target = (event.currentTarget || event.target) as HTMLElement;
    const card = target.closest('.about-card') as HTMLElement;
    if (card) {
      const cardRect = card.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // Center tooltip horizontally on mobile, show below the line
        this.tooltipTop = targetRect.top - cardRect.top + targetRect.height + 8;
        this.tooltipLeft = Math.max(8, (cardRect.width - 280) / 2);
      } else {
        this.tooltipTop = targetRect.top - cardRect.top + targetRect.height + 8;
        this.tooltipLeft = Math.min(targetRect.left - cardRect.left + 40, cardRect.width - 320);
      }
    }
  }

  ngAfterViewInit(): void {
    this.initAnimations();
    this.startTypingAnimation();
    this.ngZone.runOutsideAngular(() => {
      this.initBgParticles();
      this.animateBgParticles();
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }

  private startTypingAnimation(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.typeLines();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    const el = this.sectionRef?.nativeElement;
    if (el) observer.observe(el);
  }

  private typeLines(): void {
    const totalLines = this.jsonLines.length;
    let current = 0;
    const typeNextLine = (): void => {
      current++;
      this.visibleLines = current;
      if (current < totalLines) {
        // Vary delay based on line content length to simulate real typing speed
        const delay = 150 + Math.random() * 100;
        setTimeout(typeNextLine, delay);
      }
    };
    setTimeout(typeNextLine, 400); // Initial delay before typing starts
  }

  private initBgParticles(): void {
    const colors = ['#00d4ff', '#a855f7', '#ec4899', '#06b6d4'];
    for (let i = 0; i < 50; i++) {
      this.floatingParticles.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  private animateBgParticles = (): void => {
    const canvas = this.bgCanvasRef?.nativeElement;
    if (!canvas) {
      this.animationId = requestAnimationFrame(this.animateBgParticles);
      return;
    }

    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    this.floatingParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > rect.width) p.vx *= -1;
      if (p.y < 0 || p.y > rect.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw connections between nearby particles
    for (let i = 0; i < this.floatingParticles.length; i++) {
      for (let j = i + 1; j < this.floatingParticles.length; j++) {
        const a = this.floatingParticles[i];
        const b = this.floatingParticles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.color;
          ctx.globalAlpha = (1 - dist / 120) * 0.08;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    this.animationId = requestAnimationFrame(this.animateBgParticles);
  };

  private initAnimations(): void {
    gsap.from('.about-card-wrapper', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-card-wrapper',
        start: 'top 95%',
        once: true,
      },
    });

    gsap.from('.stat-card', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.stats-grid',
        start: 'top 95%',
        once: true,
      },
    });

    // Counter animations
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      const obj = { value: 0 };
      gsap.to(obj, {
        value: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          once: true,
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.value).toString();
        },
      });
    });
  }
}
