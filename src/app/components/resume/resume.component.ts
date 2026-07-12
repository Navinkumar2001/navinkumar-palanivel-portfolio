import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ResumeEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  achievements: string[];
  tech: string[];
  color: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  score: string;
}

interface SkillGroup {
  category: string;
  skills: string[];
  color: string;
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="resume" class="resume-section section-padding">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">&lt;Resume /&gt;</span>
          <h2 class="section-title gradient-text">Visual Resume</h2>
          <p class="section-subtitle">An interactive overview of my career — click to print or save as PDF</p>
        </div>

        <!-- Print / Download button -->
        <div class="resume-actions">
          <button class="action-btn" (click)="printResume()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print / Save PDF
          </button>
          <a href="assets/Navinkumar_Palanivel_Updated_Resume.pdf" download class="action-btn outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download PDF
          </a>
        </div>

        <!-- Resume Card -->
        <div class="resume-card glass" id="resume-print-area">
          <!-- Header -->
          <div class="resume-header">
            <div class="resume-identity">
              <h1 class="resume-name">Navinkumar Palanivel</h1>
              <p class="resume-title">Full-Stack Developer</p>
            </div>
            <div class="resume-contact">
              <span class="contact-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                navinkumar.it.2001&#64;gmail.com
              </span>
              <span class="contact-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Chennai, India
              </span>
              <span class="contact-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                linkedin.com/in/navinkumar-palanivel
              </span>
            </div>
          </div>

          <div class="resume-divider"></div>

          <!-- Summary -->
          <div class="resume-block">
            <h3 class="block-title">Professional Summary</h3>
            <p class="summary-text">
              Full-Stack Developer with 3+ years of experience building enterprise FinTech and insurance platforms.
              Specializing in Angular, Vue.js, TypeScript, and Python/FastAPI. Proven track record of delivering
              AI-powered applications, migrating legacy systems, and optimizing performance for 100k+ row datasets.
            </p>
          </div>

          <!-- Experience -->
          <div class="resume-block">
            <h3 class="block-title">Experience</h3>
            <div class="experience-entries">
              <div *ngFor="let entry of experience" class="exp-entry">
                <div class="exp-header">
                  <div>
                    <h4 class="exp-role">{{ entry.role }}</h4>
                    <span class="exp-company">{{ entry.company }}</span>
                  </div>
                  <div class="exp-meta">
                    <span class="exp-period">{{ entry.period }}</span>
                    <span class="exp-location">{{ entry.location }}</span>
                  </div>
                </div>
                <ul class="exp-achievements">
                  <li *ngFor="let a of entry.achievements">{{ a }}</li>
                </ul>
                <div class="exp-tech-row">
                  <span *ngFor="let t of entry.tech" class="exp-tech-tag" [style.border-color]="entry.color + '40'" [style.color]="entry.color">{{ t }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Two column: Skills + Education -->
          <div class="resume-columns">
            <div class="resume-block col-left">
              <h3 class="block-title">Technical Skills</h3>
              <div class="skills-groups">
                <div *ngFor="let group of skills" class="skill-group">
                  <span class="skill-category" [style.color]="group.color">{{ group.category }}</span>
                  <div class="skill-tags">
                    <span *ngFor="let s of group.skills" class="skill-tag">{{ s }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="resume-block col-right">
              <h3 class="block-title">Education</h3>
              <div *ngFor="let edu of education" class="edu-entry">
                <h4 class="edu-degree">{{ edu.degree }}</h4>
                <span class="edu-institution">{{ edu.institution }}</span>
                <div class="edu-meta">
                  <span>{{ edu.year }}</span>
                  <span class="edu-score">{{ edu.score }}</span>
                </div>
              </div>

              <h3 class="block-title mt-32">Recognition</h3>
              <div class="recognition-item">
                <span class="recognition-icon">🏆</span>
                <div>
                  <strong>Spot Award Winner (2025)</strong>
                  <p>Recognized for exceptional delivery at Intellect Design Arena Ltd.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats bar -->
          <div class="resume-stats-bar">
            <div class="stat-block" *ngFor="let stat of stats">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .resume-section { position: relative; z-index: 10; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .section-header { text-align: center; margin-bottom: 48px; }
    .section-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: #00d4ff; margin-bottom: 16px; display: block; }

    .resume-actions {
      display: flex; justify-content: center; gap: 16px; margin-bottom: 40px; flex-wrap: wrap;
    }
    .action-btn {
      display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 10px;
      font-size: 0.85rem; font-family: 'JetBrains Mono', monospace; cursor: pointer; transition: all 0.3s ease;
      background: linear-gradient(135deg, #00d4ff, #a855f7); color: #fff; border: none;
      text-decoration: none;
    }
    .action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,212,255,0.3); }
    .action-btn.outline {
      background: transparent; border: 1px solid rgba(0,212,255,0.3); color: #00d4ff;
    }
    .action-btn.outline:hover { background: rgba(0,212,255,0.05); border-color: #00d4ff; }

    .resume-card {
      padding: 48px; border-radius: 20px; max-width: 900px; margin: 0 auto;
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);
    }

    .resume-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px; }
    .resume-name { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
    .resume-title { font-size: 1rem; color: #00d4ff; font-weight: 500; }
    .resume-contact { display: flex; flex-direction: column; gap: 6px; }
    .contact-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: rgba(255,255,255,0.6); }

    .resume-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(0,212,255,0.3), rgba(168,85,247,0.3), transparent); margin: 28px 0; }

    .resume-block { margin-bottom: 32px; }
    .block-title {
      font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1.5px; color: #00d4ff; margin-bottom: 16px;
      padding-bottom: 8px; border-bottom: 1px solid rgba(0,212,255,0.15);
    }
    .summary-text { font-size: 0.9rem; color: rgba(255,255,255,0.7); line-height: 1.7; }

    .experience-entries { display: flex; flex-direction: column; gap: 28px; }
    .exp-entry { padding-left: 16px; border-left: 2px solid rgba(0,212,255,0.2); }
    .exp-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
    .exp-role { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 600; color: #fff; }
    .exp-company { font-size: 0.85rem; color: rgba(255,255,255,0.5); }
    .exp-meta { text-align: right; }
    .exp-period { display: block; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: rgba(255,255,255,0.5); }
    .exp-location { font-size: 0.75rem; color: rgba(255,255,255,0.35); }
    .exp-achievements { padding-left: 16px; margin: 0; }
    .exp-achievements li { font-size: 0.83rem; color: rgba(255,255,255,0.65); line-height: 1.7; margin-bottom: 4px; }
    .exp-tech-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
    .exp-tech-tag { padding: 2px 10px; border-radius: 4px; border: 1px solid; font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; }

    .resume-columns { display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; }
    .skills-groups { display: flex; flex-direction: column; gap: 14px; }
    .skill-category { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px; }
    .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-tag { padding: 3px 10px; border-radius: 5px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); font-size: 0.72rem; color: rgba(255,255,255,0.7); font-family: 'JetBrains Mono', monospace; }

    .edu-entry { margin-bottom: 16px; }
    .edu-degree { font-size: 0.92rem; font-weight: 600; color: #fff; margin-bottom: 2px; }
    .edu-institution { font-size: 0.8rem; color: rgba(255,255,255,0.5); }
    .edu-meta { display: flex; gap: 12px; margin-top: 4px; font-size: 0.75rem; color: rgba(255,255,255,0.4); }
    .edu-score { color: #10b981; font-weight: 600; }
    .mt-32 { margin-top: 32px; }

    .recognition-item { display: flex; align-items: flex-start; gap: 12px; }
    .recognition-icon { font-size: 1.5rem; }
    .recognition-item strong { font-size: 0.85rem; color: #fbbf24; display: block; }
    .recognition-item p { font-size: 0.78rem; color: rgba(255,255,255,0.5); margin: 2px 0 0; }

    .resume-stats-bar {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 32px;
      padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06);
    }
    .stat-block { text-align: center; }
    .stat-value { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 700; color: #00d4ff; }
    .stat-label { font-size: 0.7rem; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.5px; }

    @media (max-width: 768px) {
      .resume-card { padding: 28px 20px; }
      .resume-header { flex-direction: column; }
      .resume-columns { grid-template-columns: 1fr; gap: 24px; }
      .resume-stats-bar { grid-template-columns: repeat(2, 1fr); }
      .exp-header { flex-direction: column; }
      .exp-meta { text-align: left; }
    }

    /* Print styles */
    @media print {
      .resume-section { padding: 0; }
      .section-header, .resume-actions { display: none; }
      .resume-card { border: none; background: #fff; padding: 0; box-shadow: none; border-radius: 0; max-width: 100%; }
      .resume-name { color: #111; }
      .resume-title { color: #0284c7; }
      .block-title { color: #0284c7; border-color: #0284c7; }
      .contact-item { color: #444; }
      .summary-text, .exp-achievements li { color: #333; }
      .exp-role { color: #111; }
      .exp-company, .exp-period, .exp-location { color: #666; }
      .skill-tag { background: #f1f5f9; border-color: #e2e8f0; color: #334155; }
      .edu-degree { color: #111; }
      .stat-value { color: #0284c7; }
      .stat-label { color: #666; }
      .resume-divider { background: #e2e8f0; }
      .exp-entry { border-color: #0284c7; }
      .resume-stats-bar { border-color: #e2e8f0; }
      .recognition-item strong { color: #b45309; }
      .recognition-item p { color: #666; }
    }
  `],
})
export class ResumeComponent implements AfterViewInit {
  experience: ResumeEntry[] = [
    {
      role: 'Full-Stack Developer',
      company: 'Intellect Design Arena Ltd',
      period: 'Jun 2023 — Present',
      location: 'Chennai, India',
      color: '#00d4ff',
      achievements: [
        'Built AI-powered document processing platform reducing manual review time by 60%',
        'Led Angular 19 migration from legacy Ext JS, improving load times by 40%',
        'Developed reusable component library adopted across 5+ enterprise modules',
        'Optimized ag-Grid rendering for 100k+ row datasets with virtual scrolling',
        'Created real-time workflow automation reducing underwriting processing by 40%',
      ],
      tech: ['Angular', 'Vue.js', 'TypeScript', 'FastAPI', 'Python', 'MongoDB', 'ag-Grid'],
    },
  ];

  skills: SkillGroup[] = [
    { category: 'Frontend', skills: ['Angular', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SCSS'], color: '#00d4ff' },
    { category: 'Backend', skills: ['Python', 'FastAPI', 'REST APIs', 'WebSockets'], color: '#a855f7' },
    { category: 'Database', skills: ['MongoDB', 'SQL', 'PostgreSQL'], color: '#10b981' },
    { category: 'Tools', skills: ['Git', 'Jenkins', 'Jira', 'ag-Grid', 'Webpack', 'Vite'], color: '#f59e0b' },
  ];

  education: Education[] = [
    {
      degree: 'B.Tech — Information Technology',
      institution: 'Muthayammal Engineering College',
      year: '2019 — 2023',
      score: 'CGPA: 8.7',
    },
  ];

  stats = [
    { value: '3+', label: 'Years Experience' },
    { value: '20+', label: 'Enterprise Modules' },
    { value: '3', label: 'Major Platforms' },
    { value: '60%', label: 'Efficiency Gains' },
  ];

  ngAfterViewInit(): void {
    gsap.from('.resume-card', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.resume-card',
        start: 'top 90%',
        once: true,
      },
    });
  }

  printResume(): void {
    window.print();
  }
}
