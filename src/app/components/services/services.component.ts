import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gsap } from 'gsap';

interface Service {
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="services" class="services-section section-padding">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">&lt;Services /&gt;</span>
          <h2 class="section-title gradient-text">What I Do</h2>
          <p class="section-subtitle">Specialized services I offer for modern web development</p>
        </div>

        <div class="services-grid">
          <div *ngFor="let service of services"
               class="service-card glass"
               [style.border-color]="service.color + '15'"
               (mouseenter)="onHover($event)"
               (mouseleave)="onLeave($event)">
            
            <!-- Colored Cyber Corners -->
            <div class="cyber-corner top-left" [style.border-color]="service.color + '50'"></div>
            <div class="cyber-corner top-right" [style.border-color]="service.color + '50'"></div>
            <div class="cyber-corner bottom-left" [style.border-color]="service.color + '50'"></div>
            <div class="cyber-corner bottom-right" [style.border-color]="service.color + '50'"></div>

            <div class="service-icon" [style.background]="service.color + '15'" [style.border-color]="service.color + '30'" [style.color]="service.color">
              <span [innerHTML]="getSafeIcon(service.icon)"></span>
            </div>
            <h4 class="service-title">{{ service.title }}</h4>
            <p class="service-description">{{ service.description }}</p>
            <div class="service-glow" [style.background]="'radial-gradient(circle, ' + service.color + '10, transparent 70%)'"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .services-section {
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

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
    }

    .service-card {
      padding: 40px 32px;
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      cursor: default;
      border: 1px solid;
      text-align: center;

      &:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
        .service-glow { opacity: 1; }

        .service-icon {
          transform: scale(1.1);
          box-shadow: 0 0 15px currentColor;
        }

        .cyber-corner {
          opacity: 0.9;
          filter: drop-shadow(0 0 4px currentColor);
        }
        .cyber-corner.top-left { transform: translate(-2px, -2px); }
        .cyber-corner.top-right { transform: translate(2px, -2px); }
        .cyber-corner.bottom-left { transform: translate(-2px, 2px); }
        .cyber-corner.bottom-right { transform: translate(2px, 2px); }
      }
    }

    .service-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      border: 1px solid;
      margin: 0 auto 24px;
      transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s ease;

      span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
      }

      svg {
        width: 24px;
        height: 24px;
      }
    }

    .service-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.15rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 12px;
    }

    .service-description {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.7;
    }

    .service-glow {
      position: absolute;
      bottom: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 200%;
      height: 200%;
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
    }

    @media (max-width: 768px) {
      .services-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ServicesComponent implements AfterViewInit {
  constructor(private sanitizer: DomSanitizer) {}

  services: Service[] = [
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
      title: 'Frontend Development',
      description: 'Building responsive, performant UIs with Angular, Vue.js, TypeScript, and modern CSS frameworks.',
      color: '#00d4ff',
    },
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      title: 'Full-Stack Development',
      description: 'End-to-end application development from database design to frontend implementation.',
      color: '#a855f7',
    },
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
      title: 'API Development',
      description: 'Designing and building RESTful APIs with FastAPI, Python, and proper documentation.',
      color: '#10b981',
    },
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/><path d="M2 20h20"/></svg>',
      title: 'Performance Optimization',
      description: 'Optimizing load times, bundle sizes, and runtime performance for enterprise applications.',
      color: '#f59e0b',
    },
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      title: 'Enterprise Applications',
      description: 'Scalable, maintainable architecture for large-scale FinTech and insurance platforms.',
      color: '#ec4899',
    },
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V11h3a3 3 0 0 1 3 3v1"/><path d="M6 11V9.6C4.8 8.8 4 7.5 4 6a4 4 0 0 1 8 0"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><rect x="9" y="17" width="6" height="5" rx="1"/></svg>',
      title: 'AI-Powered Solutions',
      description: 'Integrating AI/ML capabilities into web applications for intelligent automation.',
      color: '#6366f1',
    },
  ];

  getSafeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  ngAfterViewInit(): void {
    // Ensure all cards are visible — no opacity animation that might fail
    document.querySelectorAll('.service-card').forEach((card) => {
      (card as HTMLElement).style.opacity = '1';
    });
  }

  onHover(event: MouseEvent): void {
    gsap.to(event.currentTarget, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  onLeave(event: MouseEvent): void {
    gsap.to(event.currentTarget, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
}
