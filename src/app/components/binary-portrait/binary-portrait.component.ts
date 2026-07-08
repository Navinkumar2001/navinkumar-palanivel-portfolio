import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
  OnDestroy,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-binary-portrait',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hologram-viewport">
      <div class="hologram-container" #holoContainer (mousemove)="onMouseMove($event)" (mouseleave)="onMouseLeave()">
        <!-- Outer rotating hexagonal frame -->
        <svg class="hex-frame" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00d4ff" />
            <stop offset="50%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#ec4899" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <!-- Outer tech ring -->
        <circle cx="200" cy="200" r="185" fill="none" stroke="url(#hexGrad)" 
                stroke-width="1" stroke-dasharray="8 4" class="tech-ring" filter="url(#glow)" />
        <!-- Middle ring with data dots -->
        <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(0,212,255,0.2)" 
                stroke-width="0.5" class="data-ring" />
        <!-- Arc segments -->
        <path d="M 200 20 A 180 180 0 0 1 380 200" fill="none" 
              stroke="#00d4ff" stroke-width="2" stroke-linecap="round" class="arc arc-1" opacity="0.6" />
        <path d="M 380 200 A 180 180 0 0 1 200 380" fill="none" 
              stroke="#a855f7" stroke-width="2" stroke-linecap="round" class="arc arc-2" opacity="0.4" />
        <path d="M 200 380 A 180 180 0 0 1 20 200" fill="none" 
              stroke="#ec4899" stroke-width="1.5" stroke-linecap="round" class="arc arc-3" opacity="0.3" />
        <!-- Corner brackets -->
        <path d="M 80 60 L 60 60 L 60 80" fill="none" stroke="#00d4ff" stroke-width="2" opacity="0.8" />
        <path d="M 320 60 L 340 60 L 340 80" fill="none" stroke="#00d4ff" stroke-width="2" opacity="0.8" />
        <path d="M 80 340 L 60 340 L 60 320" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.8" />
        <path d="M 320 340 L 340 340 L 340 320" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.8" />
      </svg>

      <!-- Glitch overlay lines -->
      <div class="glitch-lines">
        <div class="g-line"></div>
        <div class="g-line"></div>
        <div class="g-line"></div>
      </div>

      <!-- Main image with holographic effects -->
      <div class="holo-image-wrap" #imageWrap>
        <!-- Complete image (shown after assembly) -->
        <img [src]="imageSrc" alt="Navinkumar Palanivel" class="holo-img complete-img" [class.visible]="assemblyDone" />
        <!-- Puzzle assembly tiles (shown during animation only) -->
        <div class="puzzle-grid" [class.assembled]="isAssembled" [class.hidden]="assemblyDone">
          <div *ngFor="let tile of puzzleTiles; let i = index"
               class="puzzle-tile"
               [style.clip-path]="tile.clipPath"
               [style.transition-delay]="tile.delay + 'ms'"
               [style.--tx]="((i * 7) % 200 - 100) + 'px'"
               [style.--ty]="((i * 13) % 200 - 100) + 'px'"
               [style.--rot]="((i * 37) % 60 - 30) + 'deg'">
            <img [src]="imageSrc" alt="Navinkumar Palanivel" class="holo-img" />
          </div>
        </div>
        <div class="holo-gradient"></div>
        <div class="holo-scanlines"></div>
        <div class="holo-flare"></div>
        <div class="data-scan"></div>
        <!-- Binary code reveal on hover -->
        <canvas #binaryCanvas class="binary-canvas"></canvas>
      </div>

      <!-- Floating data elements -->
      <div class="float-data top-left">
        <span class="data-label">SYS.STATUS</span>
        <span class="data-value online">ONLINE</span>
      </div>
      <div class="float-data top-right">
        <span class="data-label">EXP</span>
        <span class="data-value">3+ YRS</span>
      </div>
      <div class="float-data bottom-left">
        <span class="data-label">STACK</span>
        <span class="data-value">FULL</span>
      </div>
      <div class="float-data bottom-right">
        <span class="data-label">MODE</span>
        <span class="data-value">BUILD</span>
      </div>

      <!-- Particle ring -->
      <canvas #particleRing class="particle-ring-canvas"></canvas>
    </div>
  </div>
  `,
  styles: [
    `
      .hologram-viewport {
        position: relative;
        width: 380px;
        height: 380px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        perspective: 1200px;
      }

      .hologram-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform-style: preserve-3d;
        transition: transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1);
      }

      /* SVG Frame */
      .hex-frame {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        pointer-events: none;
        transform: translateZ(50px);
        transform-style: preserve-3d;
      }

      .tech-ring {
        animation: spin-slow 30s linear infinite;
        transform-origin: center;
      }

      .data-ring {
        animation: spin-slow 45s linear infinite reverse;
        transform-origin: center;
      }

      .arc {
        stroke-dasharray: 100 200;
        animation: arc-dash 4s ease-in-out infinite;
      }

      .arc-1 { animation-delay: 0s; }
      .arc-2 { animation-delay: 1.3s; }
      .arc-3 { animation-delay: 2.6s; }

      @keyframes spin-slow {
        to { transform: rotate(360deg); }
      }

      @keyframes arc-dash {
        0%, 100% { stroke-dashoffset: 0; }
        50% { stroke-dashoffset: 150; }
      }

      /* Glitch lines */
      .glitch-lines {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 10;
        overflow: hidden;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.3s;
      }

      .hologram-container:hover .glitch-lines {
        opacity: 1;
      }

      .g-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        background: rgba(0, 212, 255, 0.4);
        animation: glitch-scan 2s linear infinite;
      }

      .g-line:nth-child(2) {
        animation-delay: 0.7s;
        background: rgba(168, 85, 247, 0.3);
      }

      .g-line:nth-child(3) {
        animation-delay: 1.4s;
        background: rgba(236, 72, 153, 0.2);
      }

      @keyframes glitch-scan {
        0% { top: -5%; }
        100% { top: 105%; }
      }

      /* Image */
      .holo-image-wrap {
        position: relative;
        width: 260px;
        height: 260px;
        border-radius: 50%;
        overflow: hidden;
        z-index: 3;
        transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow:
          0 0 40px rgba(0, 212, 255, 0.25),
          0 0 80px rgba(168, 85, 247, 0.15),
          inset 0 0 40px rgba(0, 0, 0, 0.4);
        border: 2px solid rgba(0, 212, 255, 0.4);
        transform: translateZ(15px);
        transform-style: preserve-3d;
      }

      .holo-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: saturate(1.15) contrast(1.05) brightness(1.05);
        transition: filter 0.4s ease;
      }

      .hologram-container:hover .holo-img {
        filter: saturate(1.4) contrast(1.1) brightness(1.1);
      }

      /* Puzzle assembly grid */
      .puzzle-grid {
        position: absolute;
        inset: 0;
        border-radius: 50%;
      }

      .puzzle-grid.hidden {
        display: none;
      }

      .complete-img {
        position: absolute;
        inset: 0;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .complete-img.visible {
        opacity: 1;
      }

      .puzzle-tile {
        position: absolute;
        inset: 0;
        transform: translate(var(--tx, 0), var(--ty, 0)) rotate(var(--rot, 0deg)) scale(0.4);
        opacity: 0;
        transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease;
      }

      .puzzle-grid.assembled .puzzle-tile {
        transform: translate(0, 0) rotate(0deg) scale(1);
        opacity: 1;
      }

      .holo-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          160deg,
          rgba(0, 212, 255, 0.12) 0%,
          transparent 40%,
          transparent 60%,
          rgba(168, 85, 247, 0.1) 100%
        );
        pointer-events: none;
      }

      .holo-scanlines {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.03) 2px,
          rgba(0, 0, 0, 0.03) 4px
        );
        pointer-events: none;
        opacity: 0.5;
      }

      .holo-flare {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(
          from 0deg,
          transparent 0deg,
          rgba(0, 212, 255, 0.08) 60deg,
          transparent 120deg,
          rgba(168, 85, 247, 0.06) 200deg,
          transparent 260deg,
          rgba(236, 72, 153, 0.04) 320deg,
          transparent 360deg
        );
        animation: flare-rotate 6s linear infinite;
        pointer-events: none;
      }

      @keyframes flare-rotate {
        to { transform: rotate(360deg); }
      }

      .data-scan {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, #00d4ff, transparent);
        box-shadow: 0 0 15px #00d4ff;
        animation: scan-sweep 4s ease-in-out infinite;
        pointer-events: none;
        opacity: 0.8;
      }

      @keyframes scan-sweep {
        0%, 100% { top: -3px; opacity: 0; }
        5% { opacity: 0.8; }
        95% { opacity: 0.8; }
        100% { top: 100%; opacity: 0; }
      }

      /* Binary code canvas overlay */
      .binary-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        pointer-events: none;
        z-index: 8;
        opacity: 0;
        transition: opacity 0.3s ease;
        transform: translateZ(30px);
      }

      .hologram-container:hover .binary-canvas {
        opacity: 1;
      }

      /* Floating data HUD elements */
      .float-data {
        position: absolute;
        z-index: 5;
        display: flex;
        flex-direction: column;
        padding: 6px 10px;
        background: rgba(0, 10, 20, 0.7);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 6px;
        animation: float-in 0.5s ease forwards;
        opacity: 0;
        transform: translateZ(80px);
        transition: border-color 0.3s, box-shadow 0.3s;
      }

      .float-data.top-left { top: 30px; left: -10px; animation-delay: 0.2s; }
      .float-data.top-right { top: 30px; right: -10px; animation-delay: 0.4s; }
      .float-data.bottom-left { bottom: 30px; left: -10px; animation-delay: 0.6s; }
      .float-data.bottom-right { bottom: 30px; right: -10px; animation-delay: 0.8s; }

      @keyframes float-in {
        from { opacity: 0; transform: translateY(15px) translateZ(30px); }
        to { opacity: 1; transform: translateY(0) translateZ(80px); }
      }

      .data-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.55rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: rgba(255, 255, 255, 0.4);
      }

      .data-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        font-weight: 600;
        color: #00d4ff;
        margin-top: 2px;
      }

      .data-value.online {
        color: #10b981;
        animation: blink-status 2s step-end infinite;
      }

      @keyframes blink-status {
        0%, 90% { opacity: 1; }
        91%, 100% { opacity: 0.3; }
      }

      /* Particle ring canvas */
      .particle-ring-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        transform: translateZ(-30px);
      }

      @media (max-width: 768px) {
        .hologram-viewport {
          width: 320px;
          height: 320px;
        }
        .hologram-container {
          width: 100%;
          height: 100%;
        }
        .holo-image-wrap {
          width: 200px;
          height: 200px;
        }
        .float-data {
          padding: 4px 8px;
          border-radius: 4px;
        }
        .float-data.top-left { top: 15px; left: 5px; }
        .float-data.top-right { top: 15px; right: 5px; }
        .float-data.bottom-left { bottom: 15px; left: 5px; }
        .float-data.bottom-right { bottom: 15px; right: 5px; }
        .data-label { font-size: 0.45rem; }
        .data-value { font-size: 0.6rem; }
      }

      @media (max-width: 400px) {
        .hologram-viewport {
          width: 280px;
          height: 280px;
        }
        .holo-image-wrap {
          width: 170px;
          height: 170px;
        }
        .float-data.top-left { top: 10px; left: 0; }
        .float-data.top-right { top: 10px; right: 0; }
        .float-data.bottom-left { bottom: 10px; left: 0; }
        .float-data.bottom-right { bottom: 10px; right: 0; }
      }
    `,
  ],
})
export class BinaryPortraitComponent implements AfterViewInit, OnDestroy {
  @ViewChild('holoContainer') holoContainerRef!: ElementRef<HTMLElement>;
  @ViewChild('particleRing') particleCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imageWrap') imageWrapRef!: ElementRef<HTMLElement>;
  @ViewChild('binaryCanvas') binaryCanvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() imageSrc = 'assets/images/navinkumar-profile-pic.png';

  private animationId = 0;
  private particles: { angle: number; radius: number; speed: number; size: number; color: string }[] = [];
  private mousePos = { x: -1000, y: -1000 };
  private isHovering = false;
  private binaryAnimId = 0;
  isAssembled = false;
  assemblyDone = false;

  // 4x4 grid of puzzle pieces with clip-paths and random scatter positions
  puzzleTiles = this.generatePuzzleTiles();

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initParticles();
      this.animateParticles();
      this.animateBinary();
    });

    // Trigger puzzle assembly when image scrolls into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              this.isAssembled = true;
              // After all tiles finish animating, show complete image and hide tiles
              setTimeout(() => {
                this.assemblyDone = true;
              }, 1200); // Wait for longest delay (800ms) + transition (400ms)
            }, 200);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    const el = this.imageWrapRef?.nativeElement;
    if (el) observer.observe(el);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    cancelAnimationFrame(this.binaryAnimId);
  }

  onMouseMove(event: MouseEvent): void {
    const container = this.holoContainerRef?.nativeElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
    
    // Apply 3D perspective tilt to the entire container
    container.style.transform = `rotateY(${x * 24}deg) rotateX(${-y * 24}deg)`;

    // Track mouse position relative to the image for binary reveal
    const el = this.imageWrapRef?.nativeElement;
    if (el) {
      const imgRect = el.getBoundingClientRect();
      this.mousePos.x = event.clientX - imgRect.left;
      this.mousePos.y = event.clientY - imgRect.top;
    }
    this.isHovering = true;
  }

  onMouseLeave(): void {
    const container = this.holoContainerRef?.nativeElement;
    if (container) {
      container.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
    this.isHovering = false;
    this.mousePos = { x: -1000, y: -1000 };
  }

  private initParticles(): void {
    const colors = ['#00d4ff', '#a855f7', '#ec4899', '#06b6d4'];
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 140 + Math.random() * 40,
        speed: 0.003 + Math.random() * 0.005,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  private animateParticles = (): void => {
    const canvas = this.particleCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const cx = rect.width / 2;
    const cy = rect.height / 2;

    this.particles.forEach((p) => {
      p.angle += p.speed;
      const x = cx + Math.cos(p.angle) * p.radius;
      const y = cy + Math.sin(p.angle) * p.radius;

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.6 + Math.sin(p.angle * 3) * 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    this.animationId = requestAnimationFrame(this.animateParticles);
  };

  private animateBinary = (): void => {
    const canvas = this.binaryCanvasRef?.nativeElement;
    if (!canvas) {
      this.binaryAnimId = requestAnimationFrame(this.animateBinary);
      return;
    }

    const ctx = canvas.getContext('2d')!;
    const el = this.imageWrapRef?.nativeElement;
    if (!el) {
      this.binaryAnimId = requestAnimationFrame(this.animateBinary);
      return;
    }

    const rect = el.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (this.isHovering) {
      const radius = 70;
      const fontSize = 10;
      const cols = Math.ceil((radius * 2) / fontSize);
      const rows = Math.ceil((radius * 2) / (fontSize * 1.2));

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const charX = this.mousePos.x - radius + col * fontSize + fontSize / 2;
          const charY = this.mousePos.y - radius + row * fontSize * 1.2 + fontSize;

          // Check if within circular radius
          const dx = charX - this.mousePos.x;
          const dy = charY - this.mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius) {
            const alpha = (1 - dist / radius) * 0.9;
            const colors = ['#00d4ff', '#a855f7', '#10b981'];
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.globalAlpha = alpha;
            ctx.fillText(Math.random() > 0.5 ? '1' : '0', charX, charY);
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    this.binaryAnimId = requestAnimationFrame(this.animateBinary);
  };

  private generatePuzzleTiles(): { clipPath: string; delay: number }[] {
    const grid = 10; // 10x10 grid = 100 tiles
    const tiles: { clipPath: string; delay: number }[] = [];

    for (let row = 0; row < grid; row++) {
      for (let col = 0; col < grid; col++) {
        // Add slight random offset to make pieces uneven
        const jitter = 0.8;
        const x1 = (col / grid) * 100 + (Math.random() - 0.5) * jitter;
        const y1 = (row / grid) * 100 + (Math.random() - 0.5) * jitter;
        const x2 = ((col + 1) / grid) * 100 + (Math.random() - 0.5) * jitter;
        const y2 = ((row + 1) / grid) * 100 + (Math.random() - 0.5) * jitter;

        // Create irregular polygon with 5-6 points for uneven shapes
        const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 2;
        const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 2;

        const clipPath = `polygon(${x1}% ${y1}%, ${mx}% ${y1 + (Math.random() - 0.5) * 1.5}%, ${x2}% ${y1}%, ${x2}% ${my + (Math.random() - 0.5) * 1}%, ${x2}% ${y2}%, ${mx}% ${y2 + (Math.random() - 0.5) * 1.5}%, ${x1}% ${y2}%, ${x1}% ${my + (Math.random() - 0.5) * 1}%)`;

        tiles.push({
          clipPath,
          delay: Math.random() * 800,
        });
      }
    }
    return tiles;
  }
}
