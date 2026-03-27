import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EffectFactoryService {
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly renderer: Renderer2;

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public createEffectContainer(): HTMLElement {
    const container = this.renderer.createElement('div');
    this.renderer.addClass(container, 'effect-layer');
    return container;
  }

  public addClouds(container: HTMLElement): void {
    for (let i = 0; i < 8; i++) {
      const cloud = this.renderer.createElement('div');
      this.renderer.addClass(cloud, 'cloud');
      this.setStyles(cloud, {
        width: `${50 + Math.random() * 80}px`,
        height: `${30 + Math.random() * 40}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        'animation-duration': `${10 + Math.random() * 10}s`,
        'animation-delay': `${Math.random() * 5}s`,
      });
      this.renderer.appendChild(container, cloud);
    }
  }

  public addStink(container: HTMLElement): void {
    for (let i = 0; i < 5; i++) {
      const stink = this.renderer.createElement('div');
      this.renderer.addClass(stink, 'stink');
      const size = 60 + Math.random() * 60;
      this.setStyles(stink, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        'animation-duration': `${6 + Math.random() * 5}s`,
        'animation-delay': `${Math.random() * 3}s`,
      });
      this.renderer.appendChild(container, stink);
    }
  }

  public addSparkles(container: HTMLElement): void {
    for (let i = 0; i < 12; i++) {
      const sparkle = this.renderer.createElement('div');
      this.renderer.addClass(sparkle, 'sparkle');
      this.setStyles(sparkle, {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        'animation-duration': `${2 + Math.random() * 3}s`,
        'animation-delay': `${Math.random() * 2}s`,
      });
      this.renderer.appendChild(container, sparkle);
    }
  }

  private setStyles(el: HTMLElement, styles: Record<string, string>): void {
    for (const [key, value] of Object.entries(styles)) {
      this.renderer.setStyle(el, key, value);
    }
  }
}
