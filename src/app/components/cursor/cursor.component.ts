import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-cursor" id="cursor-dot"></div>
    <div class="custom-cursor-ring" id="cursor-ring"></div>
  `,
  styles: [`
    .custom-cursor {
      width: 8px;
      height: 8px;
      background: #00d4ff;
      border-radius: 50%;
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 99999;
      mix-blend-mode: difference;
      transition: transform 0.1s ease;
    }

    .custom-cursor-ring {
      width: 40px;
      height: 40px;
      border: 1px solid rgba(0, 212, 255, 0.5);
      border-radius: 50%;
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 99998;
      transition: width 0.3s, height 0.3s, border-color 0.3s;
    }

    @media (max-width: 768px) {
      .custom-cursor,
      .custom-cursor-ring {
        display: none;
      }
    }
  `],
})
export class CursorComponent implements OnInit, OnDestroy {
  private mouseX = 0;
  private mouseY = 0;
  private animationId = 0;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this.onMouseMove);
      this.animate();
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    cancelAnimationFrame(this.animationId);
  }

  private onMouseMove = (e: MouseEvent): void => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  };

  private animate = (): void => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (dot && ring) {
      gsap.to(dot, {
        x: this.mouseX - 4,
        y: this.mouseY - 4,
        duration: 0.1,
        ease: 'power2.out',
      });
      gsap.to(ring, {
        x: this.mouseX - 20,
        y: this.mouseY - 20,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    this.animationId = requestAnimationFrame(this.animate);
  };
}
