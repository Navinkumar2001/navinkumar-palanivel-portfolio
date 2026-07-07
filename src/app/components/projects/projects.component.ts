import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
                <span class="card-icon">{{ project.icon }}</span>
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
  projects: ProjectCard[] = [
    {
      title: 'Magic Submission',
      description: 'AI-Powered Insurance Submission Platform with intelligent document processing, validation workflows, and automated data extraction.',
      tech: ['Vue.js', 'TypeScript', 'FastAPI', 'Python', 'MongoDB', 'ag-Grid'],
      features: ['AI Document Processing', 'Smart Validation', 'Auto-Fill Forms', 'Workflow Automation', 'Data Extraction'],
      challenge: 'Integrating AI/ML models with real-time document processing while maintaining sub-second response times.',
      impact: 'Automated 70% of manual submission processing, saving 200+ hours monthly across the operations team.',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(0, 212, 255, 0.1))',
      icon: '🤖',
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
      icon: '📊',
      status: 'Production',
    },
    {
      title: 'Xponent',
      description: 'Enterprise underwriting and insurance platform designed for complex risk assessment, policy management, and workflow automation.',
      tech: ['Angular', 'TypeScript', 'REST APIs', 'SCSS', 'ag-Grid'],
      features: ['Dynamic Dashboards', 'Workflow Engine', 'Risk Assessment', 'Policy Management', 'Real-time Updates'],
      challenge: 'Building a scalable, high-performance UI to handle thousands of concurrent users processing complex insurance workflows.',
      impact: 'Reduced underwriting processing time by 40% and improved user productivity across 10+ enterprise modules.',
      gradient: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.1))',
      icon: '⚡',
      status: 'Production',
    },
  ];

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
