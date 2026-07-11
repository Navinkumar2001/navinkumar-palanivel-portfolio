import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  name: string;
  description: string;
  highlights: string[];
  tech: string[];
  icon: string;
  color: string;
  period: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="experience" class="experience-section section-padding">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">&lt;Experience /&gt;</span>
          <h2 class="section-title gradient-text">Career Journey</h2>
          <p class="section-subtitle">My professional experience building enterprise applications</p>
        </div>

        <div class="timeline" #timelineEl>
          <!-- Animated progress line -->
          <div class="timeline-line">
            <div class="line-progress" [style.height]="timelineProgress + '%'"></div>
            <div class="line-glow" [style.top]="timelineProgress + '%'"></div>
          </div>
          
          <!-- Company Header -->
          <div class="timeline-header glass" [class.active]="activeIndex >= 0">
            <div class="header-glow"></div>
            <div class="company-info">
              <div class="company-logo-wrap">
                <div class="company-logo">
                  <img src="https://www.intellectdesign.com/wp-content/uploads/2025/10/Intellect-logo.svg" alt="Intellect Design Arena Ltd" class="company-logo-img" />
                </div>
                <div class="logo-pulse"></div>
              </div>
              <div>
                <h3 class="company-name">Intellect Design Arena Ltd</h3>
                <p class="company-role">Full-Stack Developer</p>
                <span class="company-duration">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  June 2023 - Present · {{ yearsMonths }}
                </span>
              </div>
            </div>
            <div class="company-badge">
              <span class="badge-ping"></span>
              <span class="badge-text">Active</span>
            </div>
          </div>

          <!-- Timeline Items -->
          <div class="timeline-projects">
            <div *ngFor="let project of projects; let i = index"
                 class="timeline-item"
                 [class.left]="i % 2 === 0"
                 [class.right]="i % 2 !== 0"
                 [class.active]="activeIndex >= i"
                 [class.current]="activeIndex === i"
                 [attr.data-index]="i"
                 #timelineItems>

              <!-- Timeline node -->
              <div class="timeline-dot" 
                   [class.lit]="activeIndex >= i"
                   [style.--dot-color]="project.color">
                <span class="dot-core"></span>
                <span class="dot-ring"></span>
                <span class="dot-ripple" *ngIf="activeIndex === i"></span>
              </div>

              <!-- Connector line to card -->
              <div class="timeline-connector" [class.lit]="activeIndex >= i"
                   [style.--dot-color]="project.color"></div>

              <div class="timeline-card" [class.elevated]="activeIndex === i">
                <div class="card-accent-top" [style.background]="'linear-gradient(90deg, ' + project.color + ', transparent)'"></div>
                <div class="card-inner">
                  <div class="card-header-row">
                    <div class="card-icon" [style.background]="project.color + '12'" [style.border-color]="project.color + '30'">
                      <span [innerHTML]="getSafeIcon(project.icon)"></span>
                    </div>
                    <div class="card-meta">
                      <span class="card-period" [style.color]="project.color">{{ project.period }}</span>
                      <span class="card-number">0{{ i + 1 }}</span>
                    </div>
                  </div>
                  <h4 class="project-name">{{ project.name }}</h4>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-highlights">
                    <span *ngFor="let h of project.highlights" class="highlight-tag" 
                          [style.--tag-color]="project.color">
                      <span class="tag-dot" [style.background]="project.color"></span>
                      {{ h }}
                    </span>
                  </div>
                  <div class="project-tech">
                    <span *ngFor="let t of project.tech" class="tech-tag">{{ t }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .experience-section {
      position: relative;
      z-index: 10;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
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
    }

    .timeline {
      position: relative;
      max-width: 950px;
      margin: 0 auto;
    }

    /* Timeline Line with scroll progress */
    .timeline-line {
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 2px;
      background: rgba(255, 255, 255, 0.04);
      transform: translateX(-50%);
      border-radius: 2px;
      z-index: 1;

      .line-progress {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background: linear-gradient(to bottom, #00d4ff, #a855f7, #ec4899);
        border-radius: 2px;
        transition: height 0.3s ease;
      }

      .line-glow {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #00d4ff;
        box-shadow: 0 0 12px #00d4ff, 0 0 24px rgba(0, 212, 255, 0.4);
        transition: top 0.3s ease;
      }

      @media (max-width: 768px) { left: 24px; }
    }

    /* Company Header */
    .timeline-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32px 36px;
      margin-bottom: 60px;
      position: relative;
      z-index: 5;
      overflow: hidden;
      border: 1px solid rgba(0, 212, 255, 0.12);
      transition: all 0.5s ease;

      &.active {
        border-color: rgba(0, 212, 255, 0.25);
        box-shadow: 0 0 40px rgba(0, 212, 255, 0.05);
      }

      .header-glow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, #00d4ff, #a855f7, transparent);
      }
    }

    .company-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .company-logo-wrap {
      position: relative;
    }

    .company-logo {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      background: #ffffff;
      border: 1px solid rgba(0, 212, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      .company-logo-img {
        width: 36px;
        height: 36px;
        object-fit: contain;
      }
    }

    .logo-pulse {
      position: absolute;
      inset: -3px;
      border-radius: 16px;
      border: 1px solid rgba(0, 212, 255, 0.2);
      animation: logo-pulse-anim 3s ease-in-out infinite;
    }

    @keyframes logo-pulse-anim {
      0%, 100% { opacity: 0; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.1); }
    }

    .company-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: #fff;
    }

    .company-role {
      color: #00d4ff;
      font-size: 0.95rem;
      margin-top: 2px;
    }

    .company-duration {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 6px;

      svg { opacity: 0.6; }
    }

    .company-badge {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 50px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);

      .badge-ping {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: #10b981;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          opacity: 0;
        }
      }

      .badge-text {
        color: #10b981;
        font-size: 0.8rem;
        font-weight: 600;
        font-family: 'JetBrains Mono', monospace;
      }
    }

    @keyframes ping {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(2.5); opacity: 0; }
    }

    /* Timeline Items */
    .timeline-projects {
      position: relative;
    }

    .timeline-item {
      position: relative;
      width: 50%;
      padding: 0 40px;
      margin-bottom: 48px;
      opacity: 0.4;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;

      &.active {
        opacity: 1;
        transform: translateY(0);
      }

      &.current {
        opacity: 1;
      }

      &.left { margin-left: 0; padding-right: 64px; }
      &.right { margin-left: 50%; padding-left: 64px; }

      @media (max-width: 768px) {
        width: 100%;
        margin-left: 0;
        padding-left: 68px;
        padding-right: 0;

        &.left, &.right {
          margin-left: 0;
          padding-left: 68px;
          padding-right: 0;
        }
      }
    }

    /* Timeline Dot - interactive node */
    .timeline-dot {
      position: absolute;
      top: 28px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;

      .left & { right: -9px; }
      .right & { left: -9px; }

      .dot-core {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transition: all 0.5s ease;
      }

      .dot-ring {
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.1);
        transition: all 0.5s ease;
      }

      .dot-ripple {
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        border: 1px solid var(--dot-color);
        animation: ripple-out 2s ease-out infinite;
      }

      &.lit {
        .dot-core {
          background: var(--dot-color);
          box-shadow: 0 0 12px var(--dot-color);
        }

        .dot-ring {
          border-color: var(--dot-color);
          box-shadow: 0 0 8px var(--dot-color);
        }
      }

      @media (max-width: 768px) {
        left: 15px !important;
        right: auto !important;
      }
    }

    @keyframes ripple-out {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2.5); opacity: 0; }
    }

    /* Connector line from dot to card */
    .timeline-connector {
      position: absolute;
      top: 36px;
      height: 1px;
      width: 40px;
      background: rgba(255, 255, 255, 0.06);
      transition: all 0.5s ease;

      .left & { right: 7px; }
      .right & { left: 7px; }

      &.lit {
        background: var(--dot-color);
        box-shadow: 0 0 4px var(--dot-color);
      }

      @media (max-width: 768px) {
        left: 33px !important;
        right: auto !important;
        width: 24px;
      }
    }

    /* Timeline Card */
    .timeline-card {
      position: relative;
      border-radius: 18px;
      overflow: hidden;
      transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);

      .card-accent-top {
        height: 3px;
        width: 100%;
        opacity: 0;
        transition: opacity 0.5s ease;
      }

      &.elevated {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

        .card-accent-top {
          opacity: 1;
        }

        .card-inner {
          border-color: rgba(255, 255, 255, 0.1);
        }
      }
    }

    .card-inner {
      position: relative;
      padding: 32px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 18px;
      backdrop-filter: blur(10px);
      transition: border-color 0.5s ease;
    }

    .card-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      border: 1px solid;
    }

    .card-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
    }

    .card-period {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      font-weight: 500;
    }

    .card-number {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.06);
      line-height: 1;
    }

    .project-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }

    .project-description {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.55);
      line-height: 1.65;
      margin-bottom: 20px;
    }

    .project-highlights {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;

      .highlight-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid color-mix(in srgb, var(--tag-color) 25%, transparent);
        color: var(--tag-color);
        font-size: 0.75rem;
        font-weight: 500;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-1px);
        }

        .tag-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }
      }
    }

    .project-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.04);

      .tech-tag {
        padding: 3px 10px;
        border-radius: 5px;
        background: rgba(168, 85, 247, 0.06);
        border: 1px solid rgba(168, 85, 247, 0.12);
        color: rgba(168, 85, 247, 0.75);
        font-size: 0.7rem;
        font-family: 'JetBrains Mono', monospace;
      }
    }

    @media (max-width: 768px) {
      .timeline-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        padding: 24px;
      }
      .company-info { flex-direction: column; align-items: flex-start; gap: 12px; }
      .card-inner { padding: 24px; }
      .card-number { font-size: 1.5rem; }
    }
  `],
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('timelineEl') timelineEl!: ElementRef<HTMLElement>;
  @ViewChildren('timelineItems') timelineItems!: QueryList<ElementRef>;

  activeIndex = -1;
  timelineProgress = 0;
  yearsMonths = '';

  projects: Project[] = [
    {
      name: 'Magic Submission',
      description: 'AI-Powered Insurance Submission Platform with intelligent document processing and validation.',
      highlights: ['Vue.js', 'TypeScript', 'ag-Grid', 'FastAPI', 'Document Validation', 'AI Workflows'],
      tech: ['Vue.js', 'TypeScript', 'FastAPI', 'Python', 'MongoDB'],
      icon: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(10.075 5.683)"><g transform="translate(0 8.854)"><path d="M44.074,26.54H41.606v.006H41.6v1.592h.006v.835h2.468V26.54Z" transform="translate(-28.224 -26.54)" fill="currentColor"/><path d="M39.894,30.65H37.42v2.433h1.267l-.006.006h1.243v1.059l.006-.006v1.379H42.3V33.088H40.48v-.006H39.9V30.768l-.006.006V30.65Z" transform="translate(-26.518 -28.217)" fill="currentColor"/><path d="M29.9,26.55H19l8.25,15.773,4.439-8.475H29.943v-.095L27.25,38.89,21.628,28.142H29.9V26.55Z" transform="translate(-19 -26.544)" fill="currentColor"/></g><g transform="translate(4.368)"><rect width="1.959" height="1.959" transform="translate(4.77 2.154)" fill="currentColor"/><rect width="1.959" height="1.959" transform="translate(8.694 2.154)" fill="currentColor"/><rect width="1.959" height="1.959" transform="translate(6.735 0.189)" fill="currentColor"/><path d="M30.132,17.493a2.16,2.16,0,0,1,0-4.321V11.58a3.752,3.752,0,1,0,2.687,6.374l-1.136-1.113a2.139,2.139,0,0,1-1.545.651Z" transform="translate(-26.38 -11.58)" fill="currentColor"/></g></g></svg>',
      color: '#10b981',
      period: '2023 - 2025',
    },
    {
      name: 'Risk Analyst',
      description: 'Enterprise Risk Management Platform with modern UI and high-performance data handling.',
      highlights: ['Angular 19 Migration', 'Ext JS Modernization', 'Reusable Components', 'Performance Optimization'],
      tech: ['Angular 19', 'TypeScript', 'Ext JS', 'ag-Grid'],
      icon: '<svg width="20" height="22" viewBox="0 0 20 22" fill="none"><path d="M16.2242 12.7511C16.2068 12.9821 16.1968 13.1876 16.1968 13.3565C16.1968 17.0307 13.2077 20.0202 9.53316 20.0202C5.85867 20.0202 2.86951 17.031 2.86951 13.3565V7.5214L5.72937 6.14243L3.20851 4.59701L5.57075 3.33951L3.87551 2.01016L13.8043 2.11476C14.7873 3.62939 15.7999 5.24202 16.3879 6.24362C16.9557 6.41128 17.4604 6.72438 17.86 7.13988C17.8603 7.12643 17.8608 7.11153 17.8608 7.09906C17.8608 6.93433 17.8608 6.5484 14.4823 1.36026L14.3393 1.14054L1 1L3.78214 3.18187L1.23635 4.53713L3.68707 6.03953L1.88966 6.90597V13.3565C1.88966 17.5711 5.31852 21 9.53316 21C13.7478 21 17.1764 17.5711 17.1764 13.3565C17.1764 13.1018 17.2038 12.7379 17.2468 12.3146C16.9369 12.5133 16.5925 12.6624 16.2242 12.7511Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/><path d="M15.4301 13.3896C13.2717 13.3896 11.5156 11.6335 11.5156 9.47505C11.5156 7.31665 13.2717 5.56055 15.4301 5.56055C17.5888 5.56055 19.3446 7.31665 19.3446 9.47505C19.3446 11.6337 17.5888 13.3896 15.4301 13.3896ZM15.4301 6.64916C13.872 6.64916 12.6042 7.91692 12.6042 9.47505C12.6042 11.0332 13.872 12.3009 15.4301 12.3009C16.9883 12.3009 18.256 11.0332 18.256 9.47505C18.256 7.91692 16.9883 6.64916 15.4301 6.64916Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/><path d="M15.4306 10.7259C16.1214 10.7259 16.6815 10.1659 16.6815 9.47502C16.6815 8.78417 16.1214 8.22412 15.4306 8.22412C14.7397 8.22412 14.1797 8.78417 14.1797 9.47502C14.1797 10.1659 14.7397 10.7259 15.4306 10.7259Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/><path d="M10.4608 12.9611L6.1929 8.87262L5.92942 9.65328H2.42969V8.78219H5.30422L5.80624 7.29616L8.28727 9.67283L6.63455 5.29932L10.5395 9.10286H15.0504V9.9737H10.1854L8.835 8.65827L10.4608 12.9611Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/><path d="M15.0123 17.7768C13.9796 17.715 12.9675 17.1558 12.1145 16.1595L11.4531 16.7261C12.2839 17.6964 13.2576 18.3172 14.2817 18.5504L15.0123 17.7768Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/></svg>',
      color: '#a855f7',
      period: '2025',
    },
    {
      name: 'Xponent',
      description: 'Enterprise underwriting and insurance platform designed for complex risk assessment workflows.',
      highlights: ['Angular Development', 'REST APIs', 'Dashboard Creation', 'Workflow Automation'],
      tech: ['Angular', 'TypeScript', 'REST API', 'SCSS'],
      icon: '<svg width="36" height="24" viewBox="0 0 42 24" fill="none"><path d="M9.48149 3.07178L6.02166 3.09121L14.6315 11.7472L14.8191 12.0343L5.31641 21.5788L8.74959 21.6239L18.3505 11.9808L9.48149 3.07178Z" fill="currentColor"/><path d="M3.82195 7.13391L0.362483 7.15371L4.92729 11.7457L5.11711 12.0336L0 17.1723L3.43318 17.2182L8.64702 11.9808L3.82195 7.13391Z" fill="currentColor"/><path d="M29.1539 12.1648L28.9717 11.9811L40.8632 0.0366687L26.7216 0.0751707L21.9207 4.89856L17.0514 0.00623367L13.5664 0L21.9207 8.39235L28.0957 2.18912L35.2409 2.18985L25.4761 11.9987L35.2409 21.8094L28.0957 21.8116L21.9203 15.6076L13.5664 24L17.0514 23.9938L21.9203 19.1022L26.7213 23.9248L40.8632 23.9644L29.2134 12.2543L29.1539 12.1648Z" fill="currentColor"/></svg>',
      color: '#00d4ff',
      period: 'Present',
    },
  ];

  private scrollHandler: (() => void) | null = null;

  constructor(private sanitizer: DomSanitizer) {
    this.calculateDuration();
  }

  getSafeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  ngAfterViewInit(): void {
    // Initial entry animation for header
    gsap.from('.timeline-header', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.timeline-header',
        start: 'top 95%',
        once: true,
      },
    });

    // Set up scroll-driven timeline activation
    this.scrollHandler = () => this.updateTimeline();
    window.addEventListener('scroll', this.scrollHandler, { passive: true });

    // Initial check
    setTimeout(() => this.updateTimeline(), 300);
  }

  ngOnDestroy(): void {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  private updateTimeline(): void {
    const timeline = this.timelineEl?.nativeElement;
    if (!timeline) return;

    const timelineRect = timeline.getBoundingClientRect();
    const timelineTop = timelineRect.top;
    const timelineHeight = timelineRect.height;
    const viewportMid = window.innerHeight * 0.6;

    // Calculate progress of scroll through the timeline
    const progress = Math.max(0, Math.min(100, ((viewportMid - timelineTop) / timelineHeight) * 100));
    this.timelineProgress = progress;

    // Determine which items are active based on scroll position
    const items = this.timelineItems?.toArray() || [];
    let newActiveIndex = -1;

    items.forEach((item, index) => {
      const el = item.nativeElement as HTMLElement;
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;

      if (itemCenter < viewportMid + 100) {
        newActiveIndex = index;
      }
    });

    if (newActiveIndex !== this.activeIndex) {
      this.activeIndex = newActiveIndex;
    }
  }

  private calculateDuration(): void {
    const start = new Date(2023, 5); // June 2023
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0 && remainingMonths > 0) {
      this.yearsMonths = `${years} yr ${remainingMonths} mos`;
    } else if (years > 0) {
      this.yearsMonths = `${years} yr`;
    } else {
      this.yearsMonths = `${remainingMonths} mos`;
    }
  }
}
