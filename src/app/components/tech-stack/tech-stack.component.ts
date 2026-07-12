import { Component, AfterViewInit, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  category: string;
  color: string;
  logo: string;
}

interface RadarSkill {
  label: string;
  value: number; // 0-100
  color: string;
}

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="skills" class="skills-section section-padding">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">&lt;Tech Stack /&gt;</span>
          <h2 class="section-title gradient-text">Skills Galaxy</h2>
          <p class="section-subtitle">Technologies I work with to build amazing products</p>
        </div>

        <!-- Radar Chart -->
        <div class="radar-section">
          <div class="radar-container" #radarContainer>
            <svg viewBox="0 0 500 500" class="radar-svg" #radarSvg>
              <!-- Background rings -->
              <polygon *ngFor="let ring of radarRings"
                       [attr.points]="getPolygonPoints(ring)"
                       class="radar-ring" />

              <!-- Axis lines -->
              <line *ngFor="let axis of radarAxes"
                    [attr.x1]="250"
                    [attr.y1]="250"
                    [attr.x2]="axis.x"
                    [attr.y2]="axis.y"
                    class="radar-axis" />

              <!-- Data area -->
              <polygon [attr.points]="radarDataPoints"
                       class="radar-data"
                       [class.animated]="radarAnimated" />

              <!-- Data points -->
              <circle *ngFor="let point of radarPoints; let i = index"
                      [attr.cx]="point.x"
                      [attr.cy]="point.y"
                      [attr.r]="radarAnimated ? 5 : 0"
                      class="radar-point"
                      [style.transition-delay]="(i * 0.1) + 's'"
                      (mouseenter)="onRadarPointHover(i)"
                      (mouseleave)="onRadarPointLeave()" />

              <!-- Labels -->
              <text *ngFor="let label of radarLabels"
                    [attr.x]="label.x"
                    [attr.y]="label.y"
                    [attr.text-anchor]="label.anchor"
                    class="radar-label">
                {{ label.text }}
              </text>
            </svg>

            <!-- Tooltip -->
            <div class="radar-tooltip" *ngIf="hoveredSkill !== null"
                 [style.left]="tooltipPos.x + 'px'"
                 [style.top]="tooltipPos.y + 'px'">
              <span class="tooltip-name">{{ radarSkills[hoveredSkill].label }}</span>
              <span class="tooltip-value">{{ radarSkills[hoveredSkill].value }}%</span>
            </div>
          </div>

          <!-- Skill bars alongside -->
          <div class="skill-bars">
            <div class="skill-bar-item" *ngFor="let skill of radarSkills; let i = index"
                 [style.animation-delay]="(i * 0.1) + 's'">
              <div class="bar-header">
                <span class="bar-label">{{ skill.label }}</span>
                <span class="bar-value">{{ skill.value }}%</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill"
                     [style.width]="(radarAnimated ? skill.value : 0) + '%'"
                     [style.background]="'linear-gradient(90deg, ' + skill.color + ', ' + skill.color + '80)'"
                     [style.box-shadow]="'0 0 12px ' + skill.color + '40'">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="skills-categories">
          <button *ngFor="let cat of categories"
                  class="cat-btn"
                  [class.active]="activeCategory === cat"
                  (click)="filterCategory(cat)">
            {{ cat }}
          </button>
        </div>

        <div class="skills-orbit">
          <div class="skills-grid">
            <div *ngFor="let skill of filteredSkills; let i = index"
                 class="skill-card glass"
                 [style.animation-delay]="i * 0.05 + 's'"
                 [style.border-color]="skill.color + '25'">
              <div class="skill-icon" [style.background]="skill.color + '15'">
                <img [src]="skill.logo" [alt]="skill.name" class="skill-logo" 
                     loading="lazy"
                     (error)="onImgError($event, skill)" />
                <span *ngIf="!skill.logo" class="skill-fallback" [style.color]="skill.color">
                  {{ skill.name.charAt(0) }}
                </span>
              </div>
              <span class="skill-name">{{ skill.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .skills-section {
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
      margin-bottom: 60px;
    }

    .section-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: #00d4ff;
      margin-bottom: 16px;
      display: block;
    }

    /* Radar Section */
    .radar-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
      margin-bottom: 80px;
      padding: 40px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .radar-container {
      position: relative;
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      padding-left: 20px;
    }

    .radar-svg {
      width: 100%;
      height: auto;
      overflow: visible;
    }

    .radar-ring {
      fill: none;
      stroke: rgba(255, 255, 255, 0.06);
      stroke-width: 1;
    }

    .radar-axis {
      stroke: rgba(255, 255, 255, 0.08);
      stroke-width: 1;
      stroke-dasharray: 4 4;
    }

    .radar-data {
      fill: rgba(0, 212, 255, 0.08);
      stroke: #00d4ff;
      stroke-width: 2;
      stroke-linejoin: round;
      opacity: 0;
      transition: opacity 0.8s ease, d 0.8s ease;
      filter: drop-shadow(0 0 6px rgba(0, 212, 255, 0.3));

      &.animated {
        opacity: 1;
      }
    }

    .radar-point {
      fill: #00d4ff;
      stroke: #0a0a0f;
      stroke-width: 2;
      transition: r 0.4s ease, fill 0.2s ease;
      cursor: pointer;

      &:hover {
        fill: #a855f7;
        r: 8;
      }
    }

    .radar-label {
      fill: rgba(255, 255, 255, 0.6);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
    }

    .radar-tooltip {
      position: absolute;
      background: rgba(0, 10, 20, 0.9);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 8px;
      padding: 8px 14px;
      pointer-events: none;
      transform: translate(-50%, -120%);
      white-space: nowrap;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 212, 255, 0.1);

      .tooltip-name {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.7);
      }

      .tooltip-value {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.1rem;
        font-weight: 700;
        color: #00d4ff;
      }
    }

    /* Skill Bars */
    .skill-bars {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .skill-bar-item {
      animation: fadeSlideRight 0.5s ease forwards;
      opacity: 0;
      transform: translateX(-20px);
    }

    @keyframes fadeSlideRight {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .bar-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .bar-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
    }

    .bar-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #00d4ff;
    }

    .bar-track {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 3px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 1.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    /* Categories */
    .skills-categories {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 60px;
    }

    .cat-btn {
      padding: 8px 20px;
      border-radius: 50px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.02);
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover, &.active {
        border-color: #00d4ff;
        color: #00d4ff;
        background: rgba(0, 212, 255, 0.05);
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.1);
      }
    }

    .skills-orbit {
      position: relative;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 20px;
    }

    .skill-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      padding: 28px 16px;
      border-radius: 16px;
      transition: all 0.3s ease;
      animation: fadeInUp 0.5s ease forwards;
      opacity: 0;
      border: 1px solid;

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 40px rgba(0, 212, 255, 0.1);
      }
    }

    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
      from { opacity: 0; transform: translateY(20px); }
    }

    .skill-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;

      .skill-logo {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }

      .skill-fallback {
        font-size: 1.5rem;
        font-weight: 700;
      }
    }

    .skill-name {
      font-size: 0.85rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);
      text-align: center;
    }

    @media (max-width: 768px) {
      .radar-section {
        grid-template-columns: 1fr;
        padding: 24px;
      }

      .radar-container {
        max-width: 300px;
      }

      .skills-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 14px;
      }
    }
  `],
})
export class TechStackComponent implements AfterViewInit, OnDestroy {
  @ViewChild('radarContainer') radarContainerRef!: ElementRef<HTMLElement>;

  activeCategory = 'All';
  categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools', 'AI Tools'];
  radarAnimated = false;
  hoveredSkill: number | null = null;
  tooltipPos = { x: 0, y: 0 };

  // Radar chart data — proficiency per category
  radarSkills: RadarSkill[] = [
    { label: 'Frontend', value: 95, color: '#00d4ff' },
    { label: 'Backend', value: 75, color: '#a855f7' },
    { label: 'Database', value: 70, color: '#10b981' },
    { label: 'AI/ML', value: 65, color: '#ec4899' },
    { label: 'Architecture', value: 70, color: '#f59e0b' },
    { label: 'AI Tools', value: 80, color: '#f50bd6' },
  ];

  // Radar computed values
  radarRings = [0.2, 0.4, 0.6, 0.8, 1.0];
  radarAxes: { x: number; y: number }[] = [];
  radarPoints: { x: number; y: number }[] = [];
  radarLabels: { x: number; y: number; text: string; anchor: string }[] = [];
  radarDataPoints = '';

  private observer: IntersectionObserver | null = null;

  skills: Skill[] = [
    { name: 'Angular', category: 'Frontend', color: '#dd0031', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg' },
    { name: 'Vue.js', category: 'Frontend', color: '#42b883', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg' },
    { name: 'TypeScript', category: 'Frontend', color: '#3178c6', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
    { name: 'JavaScript', category: 'Frontend', color: '#f7df1e', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
    { name: 'HTML5', category: 'Frontend', color: '#e34f26', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
    { name: 'CSS3', category: 'Frontend', color: '#1572b6', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
    { name: 'SCSS', category: 'Frontend', color: '#cc6699', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg' },
    { name: 'Python', category: 'Backend', color: '#3776ab', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
    { name: 'FastAPI', category: 'Backend', color: '#009688', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg' },
    { name: 'MongoDB', category: 'Database', color: '#47a248', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
    { name: 'SQL', category: 'Database', color: '#4479a1', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
    { name: 'Git', category: 'Tools', color: '#f05032', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
    { name: 'Jenkins', category: 'Tools', color: '#d24939', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg' },
    { name: 'Jira', category: 'Tools', color: '#0052cc', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg' },
    { name: 'AG Grid', category: 'Tools', color: '#55b4c8', logo: 'assets/images/ag-grid-logo.svg' },
    { name: 'Webpack', category: 'Tools', color: '#8dd6f9', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webpack/webpack-original.svg' },
    { name: 'Vite', category: 'Tools', color: '#646cff', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg' },
    { name: 'ChatGPT', category: 'AI Tools', color: '#10a37f', logo: 'assets/images/chatgpt-logo.svg' },
    { name: 'Claude', category: 'AI Tools', color: '#d97757', logo: 'assets/images/claude-logo.svg' },
    { name: 'Amazon Q', category: 'AI Tools', color: '#ff9900', logo: 'assets/images/amazon-q-logo.svg' },
    { name: 'Gemini', category: 'AI Tools', color: '#4285f4', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg' },
  ];

  filteredSkills: Skill[] = [];

  constructor(private ngZone: NgZone) {
    this.filteredSkills = [...this.skills];
    this.calculateRadar();
  }

  ngAfterViewInit(): void {
    gsap.from('.skill-card', {
      y: 30,
      opacity: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 95%',
        once: true,
      },
    });

    // Trigger radar animation on scroll
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              this.radarAnimated = true;
            }, 300);
            this.observer?.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const el = this.radarContainerRef?.nativeElement;
    if (el) this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private calculateRadar(): void {
    const cx = 250;
    const cy = 250;
    const maxRadius = 180;
    const count = this.radarSkills.length;
    const angleStep = (Math.PI * 2) / count;

    // Axis endpoints
    this.radarAxes = [];
    for (let i = 0; i < count; i++) {
      const angle = angleStep * i - Math.PI / 2;
      this.radarAxes.push({
        x: cx + Math.cos(angle) * maxRadius,
        y: cy + Math.sin(angle) * maxRadius,
      });
    }

    // Data points
    this.radarPoints = [];
    const pointStrings: string[] = [];
    for (let i = 0; i < count; i++) {
      const angle = angleStep * i - Math.PI / 2;
      const r = (this.radarSkills[i].value / 100) * maxRadius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      this.radarPoints.push({ x, y });
      pointStrings.push(`${x},${y}`);
    }
    this.radarDataPoints = pointStrings.join(' ');

    // Labels
    this.radarLabels = [];
    for (let i = 0; i < count; i++) {
      const angle = angleStep * i - Math.PI / 2;
      const labelR = maxRadius + 24;
      const x = cx + Math.cos(angle) * labelR;
      const y = cy + Math.sin(angle) * labelR;

      let anchor = 'middle';
      if (x < cx - 10) anchor = 'end';
      else if (x > cx + 10) anchor = 'start';

      this.radarLabels.push({
        x,
        y: y + 4,
        text: this.radarSkills[i].label,
        anchor,
      });
    }
  }

  getPolygonPoints(scale: number): string {
    const cx = 250;
    const cy = 250;
    const maxRadius = 180;
    const count = this.radarSkills.length;
    const angleStep = (Math.PI * 2) / count;
    const points: string[] = [];

    for (let i = 0; i < count; i++) {
      const angle = angleStep * i - Math.PI / 2;
      const r = maxRadius * scale;
      points.push(`${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`);
    }
    return points.join(' ');
  }

  onRadarPointHover(index: number): void {
    this.hoveredSkill = index;
    const point = this.radarPoints[index];
    // Convert SVG coords to container-relative percentage
    const container = this.radarContainerRef?.nativeElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      const svgWidth = 500;
      this.tooltipPos = {
        x: (point.x / svgWidth) * rect.width,
        y: (point.y / svgWidth) * rect.height,
      };
    }
  }

  onRadarPointLeave(): void {
    this.hoveredSkill = null;
  }

  filterCategory(category: string): void {
    this.activeCategory = category;
    this.filteredSkills = category === 'All'
      ? [...this.skills]
      : this.skills.filter((s) => s.category === category);
  }

  onImgError(event: Event, skill: Skill): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    skill.logo = '';
  }
}
