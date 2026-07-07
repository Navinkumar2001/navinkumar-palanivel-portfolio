import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BinaryPortraitComponent } from '../binary-portrait/binary-portrait.component';

gsap.registerPlugin(ScrollTrigger);

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

              <div class="about-info">
                <div class="info-item" *ngFor="let info of profileInfo; let i = index"
                     [style.animation-delay]="(i * 100) + 'ms'">
                  <div class="info-icon">{{ info.icon }}</div>
                  <div class="info-content">
                    <span class="info-label">{{ info.label }}</span>
                    <span class="info-value">{{ info.value }}</span>
                  </div>
                  <div class="info-line"></div>
                </div>
              </div>

              <div class="about-description-wrapper">
                <div class="desc-line-accent"></div>
                <p class="about-description">
                  I'm a Full-Stack Developer with 3+ years of hands-on experience building 
                  enterprise-grade FinTech and AI-powered insurance platforms at Intellect Design Arena Ltd. 
                  I specialize in crafting scalable frontend architectures with Angular and Vue.js, 
                  designing robust backend APIs with FastAPI and Python, and integrating AI/ML workflows 
                  into real-world products. From migrating legacy systems to modern frameworks, to building 
                  intelligent document processing platforms from scratch — I thrive on turning complex 
                  business challenges into elegant, high-performance web applications that serve thousands 
                  of users daily.
                </p>
              </div>

              <!-- Tech badges at bottom -->
              <div class="tech-badges">
                <span class="badge" *ngFor="let badge of techBadges">{{ badge }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card glass" *ngFor="let stat of stats; let i = index">
            <div class="stat-icon">{{ stat.icon }}</div>
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
      overflow: hidden;
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

    /* Info grid */
    .about-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      padding: 24px 32px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 12px;
      position: relative;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      animation: fadeSlideIn 0.5s ease forwards;
      opacity: 0;
      transform: translateX(-10px);
      transition: background 0.3s ease;

      &:hover {
        background: rgba(0, 212, 255, 0.03);

        .info-icon {
          transform: scale(1.15);
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }

        .info-line {
          transform: scaleX(1);
        }
      }
    }

    @keyframes fadeSlideIn {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .info-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(0, 212, 255, 0.08);
      border: 1px solid rgba(0, 212, 255, 0.15);
      font-size: 1rem;
      flex-shrink: 0;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .info-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: rgba(255, 255, 255, 0.35);
    }

    .info-value {
      font-size: 0.95rem;
      font-weight: 600;
      color: #fff;
    }

    .info-line {
      position: absolute;
      bottom: 0;
      left: 12px;
      right: 12px;
      height: 1px;
      background: linear-gradient(90deg, #00d4ff, #a855f7);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s ease;
    }

    /* Description */
    .about-description-wrapper {
      padding: 24px 32px;
      position: relative;
      display: flex;
      gap: 16px;
    }

    .desc-line-accent {
      width: 3px;
      min-height: 100%;
      background: linear-gradient(180deg, #00d4ff, #a855f7, transparent);
      border-radius: 2px;
      flex-shrink: 0;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: inherit;
        filter: blur(6px);
        opacity: 0.5;
      }
    }

    .about-description {
      font-size: 0.95rem;
      line-height: 1.85;
      color: rgba(255, 255, 255, 0.65);
    }

    /* Tech badges */
    .tech-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 16px 32px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      position: relative;
      z-index: 2;
    }

    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      padding: 4px 10px;
      border-radius: 4px;
      background: rgba(0, 212, 255, 0.06);
      border: 1px solid rgba(0, 212, 255, 0.15);
      color: #00d4ff;
      transition: all 0.3s ease;
      animation: badgePopIn 0.4s ease forwards;
      opacity: 0;

      &:nth-child(1) { animation-delay: 0.1s; }
      &:nth-child(2) { animation-delay: 0.15s; }
      &:nth-child(3) { animation-delay: 0.2s; }
      &:nth-child(4) { animation-delay: 0.25s; }
      &:nth-child(5) { animation-delay: 0.3s; }
      &:nth-child(6) { animation-delay: 0.35s; }
      &:nth-child(7) { animation-delay: 0.4s; }
      &:nth-child(8) { animation-delay: 0.45s; }

      &:hover {
        background: rgba(0, 212, 255, 0.12);
        border-color: rgba(0, 212, 255, 0.4);
        box-shadow: 0 0 12px rgba(0, 212, 255, 0.2);
        transform: translateY(-1px);
      }
    }

    @keyframes badgePopIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
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
        margin-bottom: 12px;
        display: block;
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
      .about-info { grid-template-columns: 1fr; padding: 16px 20px; }
      .about-description-wrapper { padding: 16px 20px; }
      .tech-badges { padding: 12px 20px 20px; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .about-content { grid-template-columns: 1fr; gap: 40px; }
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

  stats = [
    { value: 3, suffix: '+', label: 'Years Experience', icon: '🚀' },
    { value: 10, suffix: '+', label: 'Enterprise Modules', icon: '📦' },
    { value: 100, suffix: 'K+', label: 'Data Records Processed', icon: '⚡' },
    { value: 50, suffix: '+', label: 'Features Delivered', icon: '✨' },
  ];

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initAnimations();
    this.ngZone.runOutsideAngular(() => {
      this.initBgParticles();
      this.animateBgParticles();
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
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
