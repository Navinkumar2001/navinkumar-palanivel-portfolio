import { Injectable, NgZone } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class GsapService {
  constructor(private ngZone: NgZone) {
    gsap.registerPlugin(ScrollTrigger);
  }

  revealOnScroll(elements: string | Element | Element[], options?: gsap.TweenVars): void {
    this.ngZone.runOutsideAngular(() => {
      gsap.from(elements, {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elements as gsap.DOMTarget,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        ...options,
      });
    });
  }

  fadeIn(element: string | Element, options?: gsap.TweenVars): gsap.core.Tween {
    return gsap.from(element, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      ...options,
    });
  }

  staggerReveal(elements: string | Element[], delay = 0.1): void {
    this.ngZone.runOutsideAngular(() => {
      gsap.from(elements, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elements as gsap.DOMTarget,
          start: 'top 80%',
        },
      });
    });
  }

  parallax(element: string | Element, speed = 50): void {
    this.ngZone.runOutsideAngular(() => {
      gsap.to(element, {
        y: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: element as gsap.DOMTarget,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  counterAnimation(element: Element, target: number, duration = 2): void {
    this.ngZone.runOutsideAngular(() => {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: target,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          once: true,
        },
        onUpdate: () => {
          element.textContent = Math.round(obj.value).toString();
        },
      });
    });
  }

  magneticEffect(element: HTMLElement): void {
    const handleMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(element, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    };

    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseleave', handleLeave);
  }

  textReveal(element: string | Element): void {
    this.ngZone.runOutsideAngular(() => {
      gsap.from(element, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: element as gsap.DOMTarget,
          start: 'top 80%',
        },
      });
    });
  }

  refresh(): void {
    ScrollTrigger.refresh();
  }
}
