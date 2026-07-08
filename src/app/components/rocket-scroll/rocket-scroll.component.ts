import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rocket-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rocket-scroll.component.html',
  styleUrl: './rocket-scroll.component.scss',
})
export class RocketScrollComponent {
  scrollPercent = 0;
  isVisible = false;

  layers = [
    { name: 'Ground', color: '#1a1a2e', from: 0, to: 12 },
    { name: 'Troposphere', color: '#16213e', from: 12, to: 25 },
    { name: 'Stratosphere', color: '#0f3460', from: 25, to: 40 },
    { name: 'Mesosphere', color: '#1a1a3e', from: 40, to: 55 },
    { name: 'Thermosphere', color: '#0d0d1a', from: 55, to: 75 },
    { name: 'Exosphere', color: '#080812', from: 75, to: 90 },
    { name: 'Deep Space', color: '#000005', from: 90, to: 100 },
  ];

  get currentLayer(): string {
    for (let i = this.layers.length - 1; i >= 0; i--) {
      if (this.scrollPercent >= this.layers[i].from) {
        return this.layers[i].name;
      }
    }
    return this.layers[0].name;
  }

  get rocketBottom(): number {
    return this.scrollPercent;
  }

  get flameIntensity(): number {
    return Math.min(1, this.scrollPercent / 20 + 0.3);
  }

  get showStars(): boolean {
    return this.scrollPercent > 50;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    this.isVisible = scrollTop > 200;
  }
}
