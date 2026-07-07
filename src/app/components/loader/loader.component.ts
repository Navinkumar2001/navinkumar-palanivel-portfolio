import {
  Component, OnInit, Output, EventEmitter,
  AfterViewInit, ViewChild, ElementRef, NgZone, OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay" [class.fade-out]="isDone">
      <canvas #mainCanvas class="main-canvas"></canvas>
      <div class="loader-center">
        <div class="mission-text">
          <span class="mission-label">CASE: ENDURANCE STATUS</span>
          <div class="loader-text">
            <span class="code-line" [class.visible]="step >= 1">Cooper, initiating spin at 67 RPM...</span>
            <span class="code-line" [class.visible]="step >= 2">Matching rotation with Endurance...</span>
            <span class="code-line" [class.visible]="step >= 3">Docking lock confirmed. All systems nominal.</span>
            <span class="code-line success" [class.visible]="step >= 4">It's not possible. No — it's necessary. ✓</span>
          </div>
        </div>
        <div class="loader-progress">
          <span class="progress-label">DOCK SEQUENCE</span>
          <div class="progress-bar-wrap">
            <div class="progress-track">
              <div class="progress-fill" [style.width]="progress + '%'"></div>
              <div class="progress-glow" [style.left]="progress + '%'"></div>
            </div>
            <div class="progress-ticks">
              <span class="tick" *ngFor="let t of [0,1,2,3,4,5,6,7,8,9]"
                    [class.active]="progress >= (t + 1) * 10"></span>
            </div>
          </div>
          <span class="progress-percent">{{ progress }}%</span>
        </div>
      </div>
      <div class="hud-corner top-left"><span>ENDURANCE // MODULE A</span></div>
      <div class="hud-corner top-right"><span>RPM: {{ progress < 100 ? '67.032' : '0.000' }}</span></div>
      <div class="hud-corner bottom-left"><span>CREW: COOPER.N</span></div>
      <div class="hud-corner bottom-right"><span>DOCK: {{ progress }}%</span></div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #020206;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.8s ease, visibility 0.8s ease;
      overflow: hidden;
    }
    .loader-overlay.fade-out { opacity: 0; visibility: hidden; }
    .main-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    .loader-center {
      position: relative; display: flex; flex-direction: column;
      align-items: center; gap: 24px; z-index: 2;
      margin-top: 160px;
    }
    .mission-text { display: flex; flex-direction: column; align-items: center; gap: 14px; }
    .mission-label {
      font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;
      letter-spacing: 3px; color: rgba(0, 212, 255, 0.8); text-transform: uppercase;
      text-shadow: 0 0 8px rgba(0, 212, 255, 0.3);
    }
    .loader-text {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;
    }
    .code-line {
      color: rgba(255,255,255,0.6); opacity: 0; transform: translateY(8px);
      transition: all 0.5s ease;
    }
    .code-line.visible { opacity: 1; transform: translateY(0); }
    .code-line.success { color: #10b981; font-weight: 600; }
    .loader-progress {
      display: flex; flex-direction: column; align-items: center; gap: 10px; width: 280px;
    }
    .progress-label {
      font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
      letter-spacing: 2px; color: rgba(200, 220, 240, 0.3); text-transform: uppercase;
    }
    .progress-bar-wrap { width: 100%; position: relative; }
    .progress-track {
      width: 100%; height: 4px; background: rgba(200, 220, 240, 0.06);
      border-radius: 2px; overflow: visible; position: relative;
      border: 1px solid rgba(200, 220, 240, 0.1);
    }
    .progress-fill {
      height: 100%; border-radius: 2px; transition: width 0.2s ease;
      background: linear-gradient(90deg, rgba(0, 212, 255, 0.6), rgba(200, 220, 240, 0.8));
      box-shadow: 0 0 8px rgba(0, 212, 255, 0.4), 0 0 2px rgba(200, 220, 240, 0.6);
    }
    .progress-glow {
      position: absolute; top: -4px; width: 8px; height: 12px;
      background: rgba(200, 220, 240, 0.8); border-radius: 2px;
      box-shadow: 0 0 12px rgba(0, 212, 255, 0.6), 0 0 4px rgba(200, 220, 240, 0.9);
      transform: translateX(-50%); transition: left 0.2s ease;
    }
    .progress-ticks {
      display: flex; justify-content: space-between; margin-top: 6px; padding: 0 2px;
    }
    .tick {
      width: 2px; height: 8px; background: rgba(200, 220, 240, 0.1);
      border-radius: 1px; transition: background 0.3s ease;
    }
    .tick.active {
      background: rgba(0, 212, 255, 0.5);
      box-shadow: 0 0 4px rgba(0, 212, 255, 0.3);
    }
    .progress-percent {
      font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;
      color: rgba(200, 220, 240, 0.7); min-width: 40px; text-align: center;
    }
    .hud-corner {
      position: absolute; font-family: 'JetBrains Mono', monospace;
      font-size: 0.6rem; color: rgba(255,255,255,0.15); letter-spacing: 1px;
    }
    .hud-corner.top-left { top: 28px; left: 28px; }
    .hud-corner.top-right { top: 28px; right: 28px; }
    .hud-corner.bottom-left { bottom: 28px; left: 28px; }
    .hud-corner.bottom-right { bottom: 28px; right: 28px; }
    @media (max-width: 768px) { .hud-corner { display: none; } }
  `],
})
export class LoaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() loadingComplete = new EventEmitter<void>();
  @ViewChild('mainCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  progress = 0;
  step = 0;
  isDone = false;
  private animationId = 0;
  private stars: { x: number; y: number; z: number; size: number }[] = [];
  private rotation = 0;
  private litCount = 0;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.animateLoader();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initStars();
      this.animate();
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }

  private initStars(): void {
    for (let i = 0; i < 400; i++) {
      this.stars.push({
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 2000 - 1000,
        z: Math.random() * 1000,
        size: Math.random() * 1.5 + 0.3,
      });
    }
  }

  private animate = (): void => {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) { this.animationId = requestAnimationFrame(this.animate); return; }

    const ctx = canvas.getContext('2d')!;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    // Starfield
    const starSpeed = this.step >= 4 ? 5 : 1.2;
    this.stars.forEach((star) => {
      star.z -= starSpeed;
      if (star.z <= 0) { star.z = 1000; star.x = Math.random() * 2000 - 1000; star.y = Math.random() * 2000 - 1000; }
      const sx = (star.x / star.z) * 300 + cx;
      const sy = (star.y / star.z) * 300 + cy;
      const size = (1 - star.z / 1000) * star.size * 2;
      const alpha = (1 - star.z / 1000) * 0.7;
      if (sx >= 0 && sx <= w && sy >= 0 && sy <= h) {
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(size, 0.3), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 210, 255, ${alpha})`;
        ctx.fill();
      }
    });

    // Endurance ring — face-on view (like looking straight at the station)
    const ringRadius = Math.min(w, h) * 0.15;
    const numPods = 12;
    const rotSpeed = this.step >= 4 ? 0.02 : 0.006;
    this.rotation += rotSpeed;

    // Position ring above center (above the text)
    const ringCx = cx;
    const ringCy = cy - 120;

    // Main ring track
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ringCx, ringCy, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring track
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.05)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ringCx, ringCy, ringRadius * 0.85, 0, Math.PI * 2);
    ctx.stroke();

    // Hub — cross shape like the real Endurance center
    const hubR = ringRadius * 0.12;
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ringCx, ringCy, hubR, 0, Math.PI * 2);
    ctx.stroke();
    // Cross arms from hub
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ringCx - hubR * 1.8, ringCy);
    ctx.lineTo(ringCx + hubR * 1.8, ringCy);
    ctx.moveTo(ringCx, ringCy - hubR * 1.8);
    ctx.lineTo(ringCx, ringCy + hubR * 1.8);
    ctx.stroke();

    // Draw pods — no depth sorting needed for face-on view
    for (let i = 0; i < numPods; i++) {
      const angle = this.rotation + (i / numPods) * Math.PI * 2;
      const podX = ringCx + Math.cos(angle) * ringRadius;
      const podY = ringCy + Math.sin(angle) * ringRadius;
      const isLit = i < this.litCount;

      // Arm connecting hub to pod
      ctx.strokeStyle = isLit ? 'rgba(0, 212, 255, 0.25)' : 'rgba(100, 150, 180, 0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ringCx + Math.cos(angle) * hubR * 1.8, ringCy + Math.sin(angle) * hubR * 1.8);
      ctx.lineTo(podX, podY);
      ctx.stroke();

      // Pod body — rotated rectangle facing outward
      const podW = 24;
      const podH = 16;
      ctx.save();
      ctx.translate(podX, podY);
      ctx.rotate(angle + Math.PI / 2); // Rotate pod to face tangent

      // Main pod body
      if (isLit) {
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 12;
        ctx.fillStyle = 'rgba(0, 212, 255, 0.35)';
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(80, 100, 120, 0.2)';
        ctx.strokeStyle = 'rgba(120, 150, 170, 0.3)';
      }
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.rect(-podW / 2, -podH / 2, podW, podH);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Pod detail lines (panel look)
      ctx.strokeStyle = isLit ? 'rgba(0, 212, 255, 0.3)' : 'rgba(150, 170, 190, 0.15)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-podW / 2 + 4, -podH / 2);
      ctx.lineTo(-podW / 2 + 4, podH / 2);
      ctx.moveTo(podW / 2 - 4, -podH / 2);
      ctx.lineTo(podW / 2 - 4, podH / 2);
      ctx.stroke();

      // Pod light/window
      if (isLit) {
        ctx.fillStyle = 'rgba(0, 212, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // Outer glow ring
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.03)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ringCx, ringCy, ringRadius * 1.3, 0, Math.PI * 2);
    ctx.stroke();

    this.animationId = requestAnimationFrame(this.animate);
  };

  private animateLoader(): void {
    const duration = 3000;
    const startTime = Date.now();
    const update = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      this.progress = Math.round(this.easeOutCubic(t) * 100);
      this.litCount = Math.floor(t * 12);
      if (t >= 0.15 && this.step < 1) this.step = 1;
      if (t >= 0.4 && this.step < 2) this.step = 2;
      if (t >= 0.7 && this.step < 3) this.step = 3;
      if (t >= 0.95 && this.step < 4) this.step = 4;
      if (t < 1) {
        requestAnimationFrame(update);
      } else {
        setTimeout(() => { this.isDone = true; setTimeout(() => this.loadingComplete.emit(), 800); }, 500);
      }
    };
    requestAnimationFrame(update);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }
}
