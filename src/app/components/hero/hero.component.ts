import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import * as THREE from 'three';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="hero" class="hero-section">
      <canvas #heroCanvas class="hero-canvas"></canvas>
      
      <div class="hero-grid"></div>
      
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>Available for opportunities</span>
        </div>
        
        <h1 class="hero-title">
          <span class="line line-1">Hi, I'm</span>
          <span class="line line-2 gradient-text-animated">Navinkumar Palanivel</span>
        </h1>
        
        <div class="hero-typing">
          <span class="typing-prefix">&gt; </span>
          <span class="typing-text">{{ currentText }}<span class="cursor-blink">|</span></span>
        </div>
        
        <p class="hero-description">
          Building enterprise FinTech applications, AI-powered platforms, 
          and scalable web architectures with 3+ years of experience.
        </p>
        
        <div class="hero-buttons">
          <a href="#projects" class="btn-primary magnetic-btn">
            <span>View Projects</span>
          </a>
          <a href="#contact" class="btn-outline magnetic-btn">
            <span>Contact Me</span>
          </a>
          <a href="assets/Navinkumar_Palanivel_Updated_Resume.pdf" class="btn-outline magnetic-btn" download="Navinkumar_Palanivel_Resume.pdf">
            <span>Download Resume</span>
          </a>
        </div>
        
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">3+</span>
            <span class="stat-label">Years Exp</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">20+</span>
            <span class="stat-label">Modules</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">50+</span>
            <span class="stat-label">Features</span>
          </div>
        </div>
      </div>
      
      <div class="scroll-indicator">
        <div class="scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 120px 24px 80px;
    }

    .hero-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .hero-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      animation: gridMove 20s linear infinite;
    }

    @keyframes gridMove {
      0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
      100% { transform: perspective(500px) rotateX(60deg) translateY(60px); }
    }

    .hero-content {
      position: relative;
      z-index: 10;
      max-width: 900px;
      text-align: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 50px;
      background: rgba(0, 212, 255, 0.05);
      border: 1px solid rgba(0, 212, 255, 0.2);
      margin-bottom: 32px;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.8);
      opacity: 0;
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.5); }
    }

    .hero-title {
      font-family: 'Space Grotesk', sans-serif;
      margin-bottom: 24px;

      .line {
        display: block;
        overflow: hidden;
      }

      .line-1 {
        font-size: clamp(1.2rem, 3vw, 1.8rem);
        font-weight: 400;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 8px;
        opacity: 0;
      }

      .line-2 {
        font-size: clamp(2.5rem, 7vw, 5rem);
        font-weight: 700;
        line-height: 1.1;
        opacity: 0;
      }
    }

    .hero-typing {
      font-family: 'JetBrains Mono', monospace;
      font-size: clamp(0.9rem, 2vw, 1.1rem);
      color: #00d4ff;
      margin-bottom: 24px;
      opacity: 0;

      .typing-prefix {
        color: #a855f7;
      }

      .cursor-blink {
        animation: blink 1s step-end infinite;
      }

      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    }

    .hero-description {
      font-size: clamp(1rem, 1.5vw, 1.15rem);
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.7;
      max-width: 650px;
      margin: 0 auto 40px;
      opacity: 0;
    }

    .hero-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 60px;
      opacity: 0;
    }

    .hero-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 48px;
      opacity: 0;

      .stat-item {
        text-align: center;
      }

      .stat-number {
        display: block;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.8rem;
        font-weight: 700;
        color: #00d4ff;
      }

      .stat-label {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }

    .scroll-indicator {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      opacity: 0;

      .scroll-line {
        width: 1px;
        height: 40px;
        background: linear-gradient(to bottom, #00d4ff, transparent);
        animation: scrollLine 2s ease-in-out infinite;
      }

      span {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: rgba(255, 255, 255, 0.4);
      }

      @keyframes scrollLine {
        0%, 100% { transform: scaleY(0); transform-origin: top; }
        50% { transform: scaleY(1); transform-origin: top; }
        51% { transform-origin: bottom; }
        100% { transform: scaleY(0); transform-origin: bottom; }
      }
    }

    @media (max-width: 768px) {
      .hero-stats { gap: 24px; }
      .hero-buttons { gap: 12px; }
      .hero-section { padding: 100px 16px 60px; }
    }
  `],
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  currentText = '';
  private titles = [
    'Full-Stack Developer',
    'Frontend Specialist',
    'AI-Powered Application Developer',
    'FinTech Engineer',
  ];
  private titleIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typingInterval: ReturnType<typeof setInterval> | null = null;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationId = 0;
  private stars: THREE.Points | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.startTyping();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initThreeJS();
      this.animateScene();
    });
    this.runEntryAnimations();
  }

  ngOnDestroy(): void {
    if (this.typingInterval) clearInterval(this.typingInterval);
    cancelAnimationFrame(this.animationId);
    this.renderer?.dispose();
  }

  private startTyping(): void {
    this.typingInterval = setInterval(() => {
      const currentTitle = this.titles[this.titleIndex];

      if (!this.isDeleting) {
        this.currentText = currentTitle.substring(0, this.charIndex + 1);
        this.charIndex++;
        if (this.charIndex === currentTitle.length) {
          this.isDeleting = true;
          setTimeout(() => {}, 2000);
        }
      } else {
        this.currentText = currentTitle.substring(0, this.charIndex - 1);
        this.charIndex--;
        if (this.charIndex === 0) {
          this.isDeleting = false;
          this.titleIndex = (this.titleIndex + 1) % this.titles.length;
        }
      }
    }, this.isDeleting ? 50 : 100);
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.2 + 0.55, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    this.stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(this.stars);

    // Floating geometry
    const sphereGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(3, 1, -2);
    this.scene.add(sphere);

    const torusGeo = new THREE.TorusGeometry(0.6, 0.2, 8, 32);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(-3, -1, -3);
    this.scene.add(torus);

    window.addEventListener('resize', this.onResize);
  }

  private animateScene = (): void => {
    if (this.stars) {
      this.stars.rotation.y += 0.0003;
      this.stars.rotation.x += 0.0001;
    }

    this.scene.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        child.rotation.x += 0.003;
        child.rotation.y += 0.005;
        child.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
      }
    });

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.animateScene);
  };

  private onResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private runEntryAnimations(): void {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to('.line-1', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .to('.line-2', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
      .to('.hero-typing', { opacity: 1, duration: 0.5 }, '-=0.3')
      .to('.hero-description', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to('.hero-stats', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to('.scroll-indicator', { opacity: 1, duration: 0.5 }, '-=0.2');
  }
}
