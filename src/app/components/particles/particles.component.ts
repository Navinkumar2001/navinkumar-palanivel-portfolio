import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

@Component({
  selector: 'app-particles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #particleCanvas class="particles-canvas"></canvas>
    <div class="floating-logos">
      <img *ngFor="let logo of floatingLogos"
           [src]="logo.src"
           [alt]="logo.name"
           class="floating-logo"
           [style.left]="logo.x + '%'"
           [style.top]="logo.y + '%'"
           [style.animation-duration]="logo.duration + 's'"
           [style.animation-delay]="logo.delay + 's'"
           [style.width]="logo.size + 'px'"
           [style.height]="logo.size + 'px'"
           [style.opacity]="logo.opacity" />
    </div>
  `,
  styles: [`
    .particles-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.6;
    }

    .floating-logos {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    }

    .floating-logo {
      position: absolute;
      object-fit: contain;
      animation: floatAround 20s ease-in-out infinite;
      filter: grayscale(0.3);
    }

    @keyframes floatAround {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(15px, -20px) rotate(5deg);
      }
      50% {
        transform: translate(-10px, -35px) rotate(-3deg);
      }
      75% {
        transform: translate(20px, -15px) rotate(4deg);
      }
    }
  `],
})
export class ParticlesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId = 0;
  private mouseX = 0;
  private mouseY = 0;

  floatingLogos = [
    { name: 'Angular', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg', x: 8, y: 15, size: 56, opacity: 0.12, duration: 18, delay: 0 },
    { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', x: 85, y: 25, size: 48, opacity: 0.1, duration: 22, delay: 2 },
    { name: 'Vue', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', x: 15, y: 55, size: 52, opacity: 0.1, duration: 20, delay: 4 },
    { name: 'Python', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', x: 75, y: 65, size: 58, opacity: 0.1, duration: 24, delay: 1 },
    { name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', x: 45, y: 80, size: 44, opacity: 0.08, duration: 19, delay: 3 },
    { name: 'Git', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', x: 92, y: 50, size: 42, opacity: 0.09, duration: 21, delay: 5 },
    { name: 'MongoDB', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', x: 5, y: 80, size: 48, opacity: 0.08, duration: 23, delay: 6 },
    { name: 'HTML5', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', x: 60, y: 10, size: 46, opacity: 0.09, duration: 17, delay: 2 },
    { name: 'CSS3', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', x: 30, y: 35, size: 40, opacity: 0.07, duration: 25, delay: 7 },
    { name: 'Sass', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg', x: 70, y: 85, size: 38, opacity: 0.08, duration: 20, delay: 4 },
    { name: 'Webpack', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg', x: 50, y: 45, size: 42, opacity: 0.07, duration: 26, delay: 8 },
    { name: 'Vite', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg', x: 20, y: 92, size: 38, opacity: 0.08, duration: 22, delay: 3 },
  ];

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initCanvas();
      this.createParticles();
      this.animate();
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('mousemove', this.handleMouseMove);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private createParticles(): void {
    const count = Math.min(80, Math.floor(window.innerWidth / 20));
    const colors = ['#00d4ff', '#a855f7', '#ec4899', '#06b6d4'];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  private animate = (): void => {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.particles.forEach((particle, i) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        particle.vx -= dx * 0.00005;
        particle.vy -= dy * 0.00005;
      }

      // Wrap around
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const other = this.particles[j];
        const distance = Math.sqrt(
          Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
        );
        if (distance < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = particle.color;
          this.ctx.globalAlpha = (1 - distance / 120) * 0.15;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    this.ctx.globalAlpha = 1;
    this.animationId = requestAnimationFrame(this.animate);
  };

  private handleResize = (): void => {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  private handleMouseMove = (e: MouseEvent): void => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  };
}
