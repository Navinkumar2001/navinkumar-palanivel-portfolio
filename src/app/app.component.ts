import { Component, OnInit, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { TechStackComponent } from './components/tech-stack/tech-stack.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { ServicesComponent } from './components/services/services.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { CursorComponent } from './components/cursor/cursor.component';
import { ParticlesComponent } from './components/particles/particles.component';
import { LoaderComponent } from './components/loader/loader.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { SolarNavComponent } from './components/solar-nav/solar-nav.component';
import { RocketScrollComponent } from './components/rocket-scroll/rocket-scroll.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    TechStackComponent,
    ExperienceComponent,
    ProjectsComponent,
    AchievementsComponent,
    ServicesComponent,
    ContactComponent,
    FooterComponent,
    CursorComponent,
    ParticlesComponent,
    LoaderComponent,
    TerminalComponent,
    SolarNavComponent,
    RocketScrollComponent,
  ],
  template: `
    <!-- Loading Screen -->
    <app-loader *ngIf="isLoading" (loadingComplete)="onLoadingComplete()"></app-loader>

    <!-- SVG Defs for loader gradient -->
    <svg width="0" height="0" style="position:absolute">
      <defs>
        <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00d4ff" />
          <stop offset="100%" stop-color="#a855f7" />
        </linearGradient>
      </defs>
    </svg>

    <app-cursor></app-cursor>
    <app-particles></app-particles>
    <app-solar-nav></app-solar-nav>
    <app-rocket-scroll></app-rocket-scroll>
    <app-navbar></app-navbar>

    <!-- Scroll progress bar -->
    <div class="scroll-progress-bar">
      <div class="scroll-progress-fill" [style.width]="scrollProgress + '%'"></div>
    </div>

    <!-- Parallax background layers -->
    <div class="parallax-grid"></div>
    <div class="parallax-glow glow-1"></div>
    <div class="parallax-glow glow-2"></div>
    <div class="parallax-glow glow-3"></div>

    <main>
      <app-hero></app-hero>

      <!-- Animated divider -->
      <div class="section-divider">
        <div class="divider-line"></div>
        <span class="divider-icon">◆</span>
        <div class="divider-line"></div>
      </div>

      <app-about></app-about>
      <app-tech-stack></app-tech-stack>

      <!-- Infinite scrolling marquee -->
      <div class="tech-marquee">
        <div class="marquee-track">
          <div class="marquee-content">
            <span *ngFor="let item of marqueeItems" class="marquee-item">
              <span class="marquee-dot"></span>
              {{ item }}
            </span>
            <span *ngFor="let item of marqueeItems" class="marquee-item">
              <span class="marquee-dot"></span>
              {{ item }}
            </span>
          </div>
        </div>
      </div>

      <app-experience></app-experience>
      <app-projects></app-projects>
      <app-achievements></app-achievements>
      <app-services></app-services>
      <app-contact></app-contact>
    </main>
    <app-footer></app-footer>

    <!-- Back to top button -->
    <button class="back-to-top" [class.visible]="showBackToTop" (click)="scrollToTop()" aria-label="Back to top">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>

    <!-- Easter Egg -->
    <div *ngIf="easterEggActive" class="easter-egg-overlay">
      <div class="easter-egg-content">
        <h1 class="gradient-text-animated">Building the Future with Code 🚀</h1>
      </div>
    </div>

    <!-- Terminal Easter Egg (Ctrl + ~) -->
    <app-terminal></app-terminal>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }

    /* Scroll progress bar */
    .scroll-progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.03);
      z-index: 10001;
    }

    .scroll-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00d4ff, #a855f7, #ec4899);
      border-radius: 0 2px 2px 0;
      box-shadow: 0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(168, 85, 247, 0.3);
      transition: width 0.1s linear;
    }

    /* Back to top button */
    .back-to-top {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.3);
      color: #00d4ff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 9000;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);

      &.visible {
        opacity: 1;
        transform: translateY(0);
      }

      &:hover {
        background: rgba(0, 212, 255, 0.2);
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        transform: translateY(-3px);
      }
    }

    /* Futuristic grid background */
    .parallax-grid {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
    }

    /* Floating parallax glow orbs */
    .parallax-glow {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
      z-index: 0;
      opacity: 0.4;
    }

    .glow-1 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(0, 212, 255, 0.15), transparent 70%);
      top: 10%;
      left: -10%;
    }

    .glow-2 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.12), transparent 70%);
      top: 40%;
      right: -15%;
    }

    .glow-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.1), transparent 70%);
      bottom: 15%;
      left: 20%;
    }

    main {
      position: relative;
      z-index: 2;
    }

    .easter-egg-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: radial-gradient(ellipse at center, #0a0a0f 0%, #000 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.5s ease;
    }

    .easter-egg-content h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 6vw, 5rem);
      font-weight: 700;
      text-align: center;
      animation: scaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from { transform: scale(0.5); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    /* Section Divider */
    .section-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 20px 0;
    }

    .divider-line {
      width: 80px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.4), transparent);
    }

    .divider-icon {
      color: rgba(0, 212, 255, 0.4);
      font-size: 0.6rem;
      animation: pulse-diamond 3s ease-in-out infinite;
    }

    @keyframes pulse-diamond {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.3); }
    }

    /* Infinite Marquee */
    .tech-marquee {
      position: relative;
      overflow: hidden;
      padding: 32px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
      -webkit-mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
    }

    .marquee-track {
      display: flex;
      width: max-content;
    }

    .marquee-content {
      display: flex;
      animation: marquee-scroll 30s linear infinite;
    }

    .marquee-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0 32px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.35);
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: color 0.3s;

      &:hover {
        color: #00d4ff;
      }
    }

    .marquee-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #00d4ff;
      opacity: 0.5;
    }

    @keyframes marquee-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  easterEggActive = false;
  scrollProgress = 0;
  showBackToTop = false;
  isLoading = true;
  private keySequence = '';
  private readonly secretCode = 'NAVIN';

  marqueeItems = [
    'Angular', 'Vue.js', 'TypeScript', 'Python', 'FastAPI', 'MongoDB',
    'AI/ML', 'Docker', 'REST APIs', 'ag-Grid', 'SCSS', 'Git',
    'Microservices', 'CI/CD', 'FinTech', 'Insurance Tech', 'WebSockets',
    'Performance', 'Scalability', 'Clean Code',
  ];

  ngOnInit(): void {
    document.documentElement.classList.add('dark');
  }

  onLoadingComplete(): void {
    this.isLoading = false;
    // Refresh ScrollTrigger after loader is gone
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }

  ngAfterViewInit(): void {
    // Multiple refresh passes to ensure ScrollTrigger calculates positions correctly
    ScrollTrigger.refresh();
    setTimeout(() => ScrollTrigger.refresh(), 100);
    setTimeout(() => ScrollTrigger.refresh(), 500);
    setTimeout(() => ScrollTrigger.refresh(), 1000);

    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => {
        ScrollTrigger.refresh();
      });
    }

    // Parallax glow orbs — move at different speeds on scroll
    gsap.to('.glow-1', {
      y: -200,
      ease: 'none',
      scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 2 },
    });

    gsap.to('.glow-2', {
      y: -350,
      x: -50,
      ease: 'none',
      scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 3 },
    });

    gsap.to('.glow-3', {
      y: -150,
      x: 80,
      ease: 'none',
      scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    // Parallax section headers — subtle upward float
    gsap.utils.toArray('.section-header').forEach((header: any) => {
      gsap.from(header, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 90%',
          once: true,
        },
      });
    });

    // Parallax depth effect on section tags
    gsap.utils.toArray('.section-tag').forEach((tag: any) => {
      gsap.to(tag, {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: tag,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  }

  ngOnDestroy(): void {}

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    this.showBackToTop = scrollTop > 400;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.keySequence += event.key.toUpperCase();
    if (this.keySequence.length > this.secretCode.length) {
      this.keySequence = this.keySequence.slice(-this.secretCode.length);
    }
    if (this.keySequence === this.secretCode) {
      this.triggerEasterEgg();
    }
  }

  private triggerEasterEgg(): void {
    this.easterEggActive = true;
    setTimeout(() => {
      this.easterEggActive = false;
      this.keySequence = '';
    }, 5000);
  }
}
