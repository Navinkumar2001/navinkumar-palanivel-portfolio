import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Planet {
  id: string;
  name: string;
  emoji: string;
  color: string;
  size: number;
  section: string;
}

@Component({
  selector: 'app-solar-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solar-nav.component.html',
  styleUrl: './solar-nav.component.scss',
})
export class SolarNavComponent implements OnInit {
  planets: Planet[] = [
    { id: 'hero', name: 'Home', emoji: '☀️', color: '#ffd740', size: 18, section: 'hero' },
    { id: 'about', name: 'About', emoji: '🪐', color: '#00d4ff', size: 14, section: 'about' },
    { id: 'tech', name: 'Tech', emoji: '🔵', color: '#3178c6', size: 12, section: 'skills' },
    { id: 'experience', name: 'Experience', emoji: '🟠', color: '#ff8a65', size: 13, section: 'experience' },
    { id: 'projects', name: 'Projects', emoji: '🟣', color: '#a855f7', size: 12, section: 'projects' },
    { id: 'achievements', name: 'Achievements', emoji: '⭐', color: '#ffd54f', size: 10, section: 'achievements' },
    { id: 'services', name: 'Services', emoji: '🔴', color: '#ec4899', size: 11, section: 'services' },
    { id: 'contact', name: 'Contact', emoji: '🌍', color: '#69f0ae', size: 13, section: 'contact' },
  ];

  activeIndex = 0;
  spacecraftTop = 0;
  isVisible = false;

  ngOnInit(): void {
    this.updateActive();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.updateActive();
    this.isVisible = window.scrollY > 300;
  }

  navigateTo(planet: Planet): void {
    const el = document.getElementById(planet.section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private updateActive(): void {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    for (let i = this.planets.length - 1; i >= 0; i--) {
      const el = document.getElementById(this.planets[i].section);
      if (el && el.offsetTop <= scrollPos) {
        this.activeIndex = i;
        break;
      }
    }

    // Position spacecraft between planet dots
    const totalPlanets = this.planets.length;
    const trackHeight = (totalPlanets - 1) * 56; // 56px gap between planets
    this.spacecraftTop = (this.activeIndex / (totalPlanets - 1)) * trackHeight;
  }
}
