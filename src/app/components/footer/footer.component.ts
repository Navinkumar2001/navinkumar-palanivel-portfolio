import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-top">
          <div class="footer-brand">
            <span class="gradient-text font-display text-2xl font-bold">Navinkumar</span>
            <p>Full-Stack Developer crafting enterprise solutions</p>
          </div>
          <div class="footer-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Navinkumar Palanivel. Built with Angular, Three.js & GSAP.</p>
          <p class="footer-hint">
            <span class="hint-text">Type "NAVIN" for a surprise ✨</span>
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      position: relative;
      z-index: 10;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding: 60px 24px 30px;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-top {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 40px;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 32px;
      }
    }

    .footer-brand {
      p {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
        margin-top: 8px;
      }
    }

    .footer-links {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;

      a {
        color: rgba(255, 255, 255, 0.6);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s;

        &:hover { color: #00d4ff; }
      }
    }

    .footer-bottom {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);

      p {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.4);
      }

      .footer-hint {
        margin-top: 8px;

        .hint-text {
          font-size: 0.75rem;
          color: rgba(168, 85, 247, 0.6);
          font-family: 'JetBrains Mono', monospace;
        }
      }
    }
  `],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
