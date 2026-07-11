import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCard {
  title: string;
  description: string;
  tech: string[];
  features: string[];
  challenge: string;
  impact: string;
  gradient: string;
  icon: string;
  status: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="projects" class="projects-section section-padding">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">&lt;Projects /&gt;</span>
          <h2 class="section-title gradient-text">Featured Work</h2>
          <p class="section-subtitle">Enterprise-grade applications I've built and contributed to</p>
        </div>

        <div class="projects-grid">
          <div *ngFor="let project of projects; let i = index"
               class="project-card glass"
               (mousemove)="onCardMouseMove($event, i)"
               (mouseleave)="onCardMouseLeave(i)">
            <div class="card-glow" [id]="'glow-' + i"></div>
            
            <!-- Cyber Corners -->
            <div class="cyber-corner top-left"></div>
            <div class="cyber-corner top-right"></div>
            <div class="cyber-corner bottom-left"></div>
            <div class="cyber-corner bottom-right"></div>

            <div class="card-header" [style.background]="project.gradient">
              <div class="card-pattern"></div>
              <div class="card-header-content">
                <span class="card-icon" [innerHTML]="getSafeIcon(project.icon)"></span>
                <h3 class="card-title">{{ project.title }}</h3>
              </div>
              <span class="card-status">{{ project.status }}</span>
              <!-- Animated border on hover -->
              <div class="card-header-shine"></div>
            </div>
            <div class="card-body">
              <p class="card-description">{{ project.description }}</p>
              
              <div class="card-section">
                <h5>Key Features</h5>
                <div class="feature-list">
                  <span *ngFor="let f of project.features" class="feature-item">{{ f }}</span>
                </div>
              </div>

              <div class="card-section">
                <h5>Challenge</h5>
                <p class="card-text">{{ project.challenge }}</p>
              </div>

              <div class="card-section">
                <h5>Impact</h5>
                <p class="card-text impact-text">{{ project.impact }}</p>
              </div>

              <div class="card-tech">
                <span *ngFor="let t of project.tech" class="tech-pill">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .projects-section {
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

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 32px;
      perspective: 1200px;
    }

    .project-card {
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        border-color: rgba(0, 212, 255, 0.2);
        box-shadow: 0 20px 60px rgba(0, 212, 255, 0.08), 0 0 40px rgba(168, 85, 247, 0.04);
        .card-glow { opacity: 1; }
        .card-title { transform: translateZ(30px); }
        .card-description { transform: translateZ(40px); }
        .card-section { transform: translateZ(45px); }
        .card-tech { transform: translateZ(55px); }
      }
    }

    .card-glow {
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 212, 255, 0.15), transparent 70%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1;
    }

    .card-header {
      position: relative;
      padding: 32px;
      overflow: hidden;
      transform-style: preserve-3d;

      .card-pattern {
        position: absolute;
        inset: 0;
        opacity: 0.1;
        background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0);
        background-size: 20px 20px;
      }

      .card-header-content {
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
        z-index: 2;
      }

      .card-icon {
        font-size: 1.8rem;
        filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.4));
      }

      .card-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #fff;
        transform: translateZ(15px);
        transition: transform 0.3s ease;
      }

      .card-status {
        position: absolute;
        top: 16px;
        right: 16px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.6rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #10b981;
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        padding: 3px 8px;
        border-radius: 4px;
      }

      .card-header-shine {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.05),
          transparent
        );
        transition: left 0.6s ease;
      }
    }

    .project-card:hover .card-header-shine {
      left: 100%;
    }

    .card-body {
      padding: 28px;
      transform-style: preserve-3d;
    }

    .card-description {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 20px;
      transform: translateZ(20px);
      transition: transform 0.3s ease;
    }

    .card-section {
      margin-bottom: 16px;
      transform: translateZ(25px);
      transition: transform 0.3s ease;

      h5 {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 0.4);
        margin-bottom: 8px;
      }
    }

    .feature-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .feature-item {
      padding: 4px 10px;
      border-radius: 6px;
      background: rgba(0, 212, 255, 0.06);
      border: 1px solid rgba(0, 212, 255, 0.12);
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.75rem;
    }

    .card-text {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.5;
    }

    .impact-text {
      color: #10b981;
    }

    .card-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      transform: translateZ(30px);
      transition: transform 0.3s ease;
    }

    .tech-pill {
      padding: 4px 12px;
      border-radius: 50px;
      background: rgba(168, 85, 247, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.2);
      color: #a855f7;
      font-size: 0.75rem;
      font-family: 'JetBrains Mono', monospace;
    }

    @media (max-width: 768px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ProjectsComponent implements AfterViewInit {
  constructor(private sanitizer: DomSanitizer) {}

  projects: ProjectCard[] = [
    {
      title: 'Magic Submission',
      description: 'AI-Powered Insurance Submission Platform with intelligent document processing, validation workflows, and automated data extraction.',
      tech: ['Vue.js', 'TypeScript', 'FastAPI', 'Python', 'MongoDB', 'ag-Grid'],
      features: ['AI Document Processing', 'Smart Validation', 'Auto-Fill Forms', 'Workflow Automation', 'Data Extraction'],
      challenge: 'Integrating AI/ML models with real-time document processing while maintaining sub-second response times.',
      impact: 'Automated 70% of manual submission processing, saving 200+ hours monthly across the operations team.',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(0, 212, 255, 0.1))',
      icon: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(10.075 5.683)"><g transform="translate(0 8.854)"><path d="M44.074,26.54H41.606v.006H41.6v1.592h.006v.835h2.468V26.54Z" transform="translate(-28.224 -26.54)" fill="currentColor"/><path d="M39.894,30.65H37.42v2.433h1.267l-.006.006h1.243v1.059l.006-.006v1.379H42.3V33.088H40.48v-.006H39.9V30.768l-.006.006V30.65Z" transform="translate(-26.518 -28.217)" fill="currentColor"/><path d="M29.9,26.55H19l8.25,15.773,4.439-8.475H29.943v-.095L27.25,38.89,21.628,28.142H29.9V26.55Z" transform="translate(-19 -26.544)" fill="currentColor"/></g><g transform="translate(4.368)"><rect width="1.959" height="1.959" transform="translate(4.77 2.154)" fill="currentColor"/><rect width="1.959" height="1.959" transform="translate(8.694 2.154)" fill="currentColor"/><rect width="1.959" height="1.959" transform="translate(6.735 0.189)" fill="currentColor"/><path d="M30.132,17.493a2.16,2.16,0,0,1,0-4.321V11.58a3.752,3.752,0,1,0,2.687,6.374l-1.136-1.113a2.139,2.139,0,0,1-1.545.651Z" transform="translate(-26.38 -11.58)" fill="currentColor"/></g></g></svg>',
      status: 'Production',
    },
    {
      title: 'Risk Analyst',
      description: 'Enterprise Risk Management Platform with modernized UI, migrated from legacy Ext JS to Angular 19 with enhanced performance.',
      tech: ['Angular 19', 'TypeScript', 'Ext JS', 'ag-Grid', 'SCSS'],
      features: ['Framework Migration', 'Reusable Components', 'Performance Optimization', 'Data Visualization', 'Grid Systems'],
      challenge: 'Migrating a complex legacy Ext JS application to modern Angular 19 while maintaining business logic integrity.',
      impact: 'Achieved 60% improvement in load times and created a reusable component library used across 5+ projects.',
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.1))',
      icon: '<svg width="28" height="28" viewBox="0 0 20 22" fill="none"><path d="M16.2242 12.7511C16.2068 12.9821 16.1968 13.1876 16.1968 13.3565C16.1968 17.0307 13.2077 20.0202 9.53316 20.0202C5.85867 20.0202 2.86951 17.031 2.86951 13.3565V7.5214L5.72937 6.14243L3.20851 4.59701L5.57075 3.33951L3.87551 2.01016L13.8043 2.11476C14.7873 3.62939 15.7999 5.24202 16.3879 6.24362C16.9557 6.41128 17.4604 6.72438 17.86 7.13988C17.8603 7.12643 17.8608 7.11153 17.8608 7.09906C17.8608 6.93433 17.8608 6.5484 14.4823 1.36026L14.3393 1.14054L1 1L3.78214 3.18187L1.23635 4.53713L3.68707 6.03953L1.88966 6.90597V13.3565C1.88966 17.5711 5.31852 21 9.53316 21C13.7478 21 17.1764 17.5711 17.1764 13.3565C17.1764 13.1018 17.2038 12.7379 17.2468 12.3146C16.9369 12.5133 16.5925 12.6624 16.2242 12.7511Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/><path d="M15.4301 13.3896C13.2717 13.3896 11.5156 11.6335 11.5156 9.47505C11.5156 7.31665 13.2717 5.56055 15.4301 5.56055C17.5888 5.56055 19.3446 7.31665 19.3446 9.47505C19.3446 11.6337 17.5888 13.3896 15.4301 13.3896ZM15.4301 6.64916C13.872 6.64916 12.6042 7.91692 12.6042 9.47505C12.6042 11.0332 13.872 12.3009 15.4301 12.3009C16.9883 12.3009 18.256 11.0332 18.256 9.47505C18.256 7.91692 16.9883 6.64916 15.4301 6.64916Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/><path d="M15.4306 10.7259C16.1214 10.7259 16.6815 10.1659 16.6815 9.47502C16.6815 8.78417 16.1214 8.22412 15.4306 8.22412C14.7397 8.22412 14.1797 8.78417 14.1797 9.47502C14.1797 10.1659 14.7397 10.7259 15.4306 10.7259Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/><path d="M10.4608 12.9611L6.1929 8.87262L5.92942 9.65328H2.42969V8.78219H5.30422L5.80624 7.29616L8.28727 9.67283L6.63455 5.29932L10.5395 9.10286H15.0504V9.9737H10.1854L8.835 8.65827L10.4608 12.9611Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/><path d="M15.0123 17.7768C13.9796 17.715 12.9675 17.1558 12.1145 16.1595L11.4531 16.7261C12.2839 17.6964 13.2576 18.3172 14.2817 18.5504L15.0123 17.7768Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/></svg>',
      status: 'Production',
    },
    {
      title: 'Xponent',
      description: 'Enterprise underwriting and insurance platform designed for complex risk assessment, policy management, and workflow automation.',
      tech: ['Angular', 'TypeScript', 'REST APIs', 'SCSS', 'ag-Grid'],
      features: ['Dynamic Dashboards', 'Workflow Engine', 'Risk Assessment', 'Policy Management', 'Real-time Updates'],
      challenge: 'Building a scalable, high-performance UI to handle thousands of concurrent users processing complex insurance workflows.',
      impact: 'Reduced underwriting processing time by 40% and improved user productivity across 20+ enterprise modules.',
      gradient: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.1))',
      icon: '<svg width="36" height="24" viewBox="0 0 42 24" fill="none"><path d="M9.48149 3.07178L6.02166 3.09121L14.6315 11.7472L14.8191 12.0343L5.31641 21.5788L8.74959 21.6239L18.3505 11.9808L9.48149 3.07178Z" fill="currentColor"/><path d="M3.82195 7.13391L0.362483 7.15371L4.92729 11.7457L5.11711 12.0336L0 17.1723L3.43318 17.2182L8.64702 11.9808L3.82195 7.13391Z" fill="currentColor"/><path d="M29.1539 12.1648L28.9717 11.9811L40.8632 0.0366687L26.7216 0.0751707L21.9207 4.89856L17.0514 0.00623367L13.5664 0L21.9207 8.39235L28.0957 2.18912L35.2409 2.18985L25.4761 11.9987L35.2409 21.8094L28.0957 21.8116L21.9203 15.6076L13.5664 24L17.0514 23.9938L21.9203 19.1022L26.7213 23.9248L40.8632 23.9644L29.2134 12.2543L29.1539 12.1648Z" fill="currentColor"/></svg>',
      status: 'Production',
    },
  ];

  getSafeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  ngAfterViewInit(): void {
    gsap.from('.project-card', {
      y: 60,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 95%',
        once: true,
      },
    });
  }

  onCardMouseMove(event: MouseEvent, index: number): void {
    const card = (event.currentTarget as HTMLElement);
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate rotation relative to center (max 10 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    const glow = document.getElementById(`glow-${index}`);
    if (glow) {
      glow.style.left = `${x - 100}px`;
      glow.style.top = `${y - 100}px`;
    }
  }

  onCardMouseLeave(index: number): void {
    const cards = document.querySelectorAll('.project-card');
    const card = cards[index] as HTMLElement;
    if (card) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  }
}
