import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
              <span>{{ service.icon }}</span>
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
      margin-bottom: 24px;
      transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s ease;
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
  services: Service[] = [
    {
      icon: '🎨',
      title: 'Frontend Development',
      description: 'Building responsive, performant UIs with Angular, Vue.js, TypeScript, and modern CSS frameworks.',
      color: '#00d4ff',
    },
    {
      icon: '⚡',
      title: 'Full-Stack Development',
      description: 'End-to-end application development from database design to frontend implementation.',
      color: '#a855f7',
    },
    {
      icon: '🔗',
      title: 'API Development',
      description: 'Designing and building RESTful APIs with FastAPI, Python, and proper documentation.',
      color: '#10b981',
    },
    {
      icon: '🚀',
      title: 'Performance Optimization',
      description: 'Optimizing load times, bundle sizes, and runtime performance for enterprise applications.',
      color: '#f59e0b',
    },
    {
      icon: '🏢',
      title: 'Enterprise Applications',
      description: 'Scalable, maintainable architecture for large-scale FinTech and insurance platforms.',
      color: '#ec4899',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Solutions',
      description: 'Integrating AI/ML capabilities into web applications for intelligent automation.',
      color: '#6366f1',
    },
  ];

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
