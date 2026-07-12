import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="achievements" class="achievements-section section-padding">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">&lt;Achievements /&gt;</span>
          <h2 class="section-title gradient-text">Recognition</h2>
          <p class="section-subtitle">Milestones and accomplishments along the way</p>
        </div>

        <div class="achievements-grid">
          <div class="achievement-card glass award-card">
            <!-- Cyber Corners -->
            <div class="cyber-corner top-left"></div>
            <div class="cyber-corner top-right"></div>
            <div class="cyber-corner bottom-left"></div>
            <div class="cyber-corner bottom-right"></div>
            <div class="card-scan glow-yellow"></div>

            <div class="award-year-badge">2025</div>
            <div class="trophy-icon">🏆</div>
            <div class="sparkles">
              <span class="sparkle s1">✦</span>
              <span class="sparkle s2">✦</span>
              <span class="sparkle s3">✦</span>
            </div>
            <h4>Spot Award Winner</h4>
            <p>Recognized for exceptional contribution, proactive problem-solving, and delivering high-impact features ahead of schedule at Intellect Design Arena Ltd.</p>
            <div class="award-tag">Excellence in Delivery</div>
            <div class="award-glow"></div>
          </div>

          <div class="achievement-card glass education-card">
            <!-- Cyber Corners -->
            <div class="cyber-corner top-left"></div>
            <div class="cyber-corner top-right"></div>
            <div class="cyber-corner bottom-left"></div>
            <div class="cyber-corner bottom-right"></div>
            <div class="card-scan glow-blue"></div>

            <div class="edu-badge">
              <span class="cgpa-number">8.7</span>
              <span class="cgpa-label">CGPA</span>
            </div>
            <h4>Bachelor of Information Technology</h4>
            <p>Muthayammal Engineering College</p>
            <div class="edu-details">
              <span>B.Tech IT</span>
              <span>Strong Academic Record</span>
            </div>
          </div>

          <div class="achievement-card glass stats-card">
            <!-- Cyber Corners -->
            <div class="cyber-corner top-left"></div>
            <div class="cyber-corner top-right"></div>
            <div class="cyber-corner bottom-left"></div>
            <div class="cyber-corner bottom-right"></div>
            <div class="card-scan glow-pink"></div>

            <div class="mini-stats">
              <div class="mini-stat">
                <span class="mini-number">3+</span>
                <span class="mini-label">Years in Industry</span>
              </div>
              <div class="mini-stat">
                <span class="mini-number">20+</span>
                <span class="mini-label">Enterprise Modules</span>
              </div>
              <div class="mini-stat">
                <span class="mini-number">3</span>
                <span class="mini-label">Major Platforms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .achievements-section {
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

    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
    }

    .achievement-card {
      padding: 40px 32px;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 60px rgba(0, 212, 255, 0.1);

        .card-scan {
          animation: scan-sweep-card 2.5s ease-in-out infinite;
        }

        .trophy-icon {
          transform: scale(1.15) rotate(15deg);
          filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.5));
        }

        .edu-badge {
          border-color: #a855f7;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
          transform: scale(1.05);
        }

        .mini-number {
          transform: scale(1.05);
          text-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
        }
      }

      h4 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.2rem;
        font-weight: 600;
        color: #fff;
        margin-bottom: 12px;
      }

      p {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.6);
        line-height: 1.6;
      }
    }

    /* Card Scan Sweep Overlay */
    .card-scan {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      opacity: 0;
      pointer-events: none;

      &.glow-yellow {
        background: linear-gradient(90deg, transparent, #fbbf24, transparent);
        box-shadow: 0 0 10px #fbbf24;
      }

      &.glow-blue {
        background: linear-gradient(90deg, transparent, #00d4ff, transparent);
        box-shadow: 0 0 10px #00d4ff;
      }

      &.glow-pink {
        background: linear-gradient(90deg, transparent, #ec4899, transparent);
        box-shadow: 0 0 10px #ec4899;
      }
    }

    @keyframes scan-sweep-card {
      0% { top: 0; opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { top: 100%; opacity: 0; }
    }

    .trophy-icon {
      font-size: 3rem;
      margin-bottom: 20px;
      display: inline-block;
      animation: float 3s ease-in-out infinite;
      transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .award-glow {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 3px;
      background: linear-gradient(90deg, transparent, #fbbf24, transparent);
      border-radius: 2px;
    }

    .award-card:hover .award-glow {
      box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
    }

    .award-year-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 4px 12px;
      border-radius: 50px;
      background: rgba(251, 191, 36, 0.1);
      border: 1px solid rgba(251, 191, 36, 0.3);
      color: #fbbf24;
      font-size: 0.75rem;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
    }

    .award-tag {
      display: inline-block;
      margin-top: 16px;
      padding: 6px 16px;
      border-radius: 50px;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.05));
      border: 1px solid rgba(251, 191, 36, 0.2);
      color: #fbbf24;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .sparkles {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .sparkle {
      position: absolute;
      color: #fbbf24;
      font-size: 0.8rem;
      opacity: 0;
      animation: sparkle-anim 3s ease-in-out infinite;

      &.s1 { top: 20%; left: 15%; animation-delay: 0s; }
      &.s2 { top: 30%; right: 18%; animation-delay: 1s; }
      &.s3 { bottom: 30%; left: 22%; animation-delay: 2s; }
    }

    @keyframes sparkle-anim {
      0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
      50% { opacity: 0.8; transform: scale(1.2) rotate(180deg); }
    }

    .edu-badge {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1));
      border: 2px solid rgba(0, 212, 255, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);

      .cgpa-number {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #00d4ff;
        line-height: 1;
      }

      .cgpa-label {
        font-size: 0.6rem;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.5);
        letter-spacing: 1px;
      }
    }

    .edu-details {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;

      span {
        padding: 4px 12px;
        border-radius: 50px;
        background: rgba(168, 85, 247, 0.08);
        color: rgba(168, 85, 247, 0.8);
        font-size: 0.75rem;
      }
    }

    .mini-stats {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .mini-stat {
      .mini-number {
        display: block;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        color: #00d4ff;
        transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), text-shadow 0.4s ease;
      }

      .mini-label {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.5);
      }
    }

    @media (max-width: 768px) {
      .achievements-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class AchievementsComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const cards = document.querySelectorAll('.achievement-card');
    cards.forEach((card, i) => {
      gsap.set(card, { opacity: 1 });
    });
  }
}
