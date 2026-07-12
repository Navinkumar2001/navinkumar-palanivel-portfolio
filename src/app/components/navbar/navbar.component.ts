import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled" [class.hidden]="isHidden">
      <div class="nav-container">
        <a href="#" class="nav-logo">
          <span class="gradient-text font-display font-bold text-xl">NP</span>
        </a>

        <div class="nav-links" [class.active]="menuOpen">
          <a *ngFor="let link of navLinks"
             [href]="'#' + link.id"
             class="nav-link"
             [class.active]="activeSection === link.id"
             (click)="closeMenu()">
            {{ link.label }}
          </a>

          <a href="#contact" class="btn-primary magnetic-btn nav-cta" (click)="closeMenu()">
            <span>Let's Talk</span>
          </a>
        </div>

        <button class="menu-toggle" (click)="toggleMenu()" [attr.aria-label]="'Toggle menu'">
          <span [class.open]="menuOpen"></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 20px 0;
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .navbar.scrolled {
      padding: 12px 0;
      background: rgba(10, 10, 15, 0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .navbar.hidden {
      transform: translateY(-100%);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-logo {
      text-decoration: none;
      font-size: 1.5rem;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.3s ease;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #00d4ff, #a855f7);
        transition: width 0.3s ease;
      }

      &:hover {
        color: #fff;
        &::after { width: 100%; }
      }

      &.active {
        color: #00d4ff;
        &::after { width: 100%; }
      }
    }

    .nav-cta {
      padding: 10px 24px;
      font-size: 0.85rem;
    }

    .menu-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      width: 30px;
      height: 20px;
      position: relative;

      span,
      span::before,
      span::after {
        display: block;
        width: 100%;
        height: 2px;
        background: #fff;
        position: absolute;
        transition: all 0.3s ease;
      }

      span { top: 50%; transform: translateY(-50%); }
      span::before { content: ''; top: -8px; }
      span::after { content: ''; top: 8px; }

      span.open { background: transparent; }
      span.open::before { top: 0; transform: rotate(45deg); }
      span.open::after { top: 0; transform: rotate(-45deg); }
    }

    @media (max-width: 768px) {
      .menu-toggle { display: block; }

      .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        width: 80%;
        max-width: 320px;
        height: 100vh;
        background: rgba(10, 10, 15, 0.98);
        backdrop-filter: blur(20px);
        flex-direction: column;
        justify-content: center;
        padding: 40px;
        transition: right 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);

        &.active { right: 0; }
      }

      .nav-link { font-size: 1.2rem; }
    }
  `],
})
export class NavbarComponent {
  isScrolled = false;
  isHidden = false;
  menuOpen = false;
  activeSection = '';
  private lastScrollY = 0;

  navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 50;
    this.isHidden = scrollY > this.lastScrollY && scrollY > 200;
    this.lastScrollY = scrollY;
    this.updateActiveSection();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  private updateActiveSection(): void {
    const offset = 150;
    for (let i = this.navLinks.length - 1; i >= 0; i--) {
      const section = document.getElementById(this.navLinks[i].id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= offset) {
          this.activeSection = this.navLinks[i].id;
          return;
        }
      }
    }
    this.activeSection = '';
  }
}
