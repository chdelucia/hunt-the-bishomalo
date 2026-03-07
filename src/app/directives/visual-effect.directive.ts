import { Directive, ElementRef, OnChanges, Renderer2, inject, input } from '@angular/core';

@Directive({
  selector: '[appVisualEffect]',
  standalone: true,
})
export class VisualEffectDirective implements OnChanges {
  readonly perception = input('', { alias: 'appVisualEffect' });

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngOnChanges(): void {
    this.clearEffects();

    const container = this.renderer.createElement('div');
    this.renderer.addClass(container, 'effect-layer');

    const perception = this.perception();
    if (perception.includes('brisa') || perception.includes('breeze')) {
      this.addClouds(container);
    }

    if (perception.includes('hedor') || perception.includes('stench')) {
      this.addStink(container);
    }

    if (perception.includes('brillo') || perception.includes('shine')) {
      this.addSparkles(container);
    }

    if (container.childNodes.length > 0) {
      this.renderer.appendChild(this.el.nativeElement, container);
    }
  }

  private addClouds(container: HTMLElement) {
    for (let i = 0; i < 8; i++) {
      const cloud = this.renderer.createElement('div');
      this.renderer.addClass(cloud, 'cloud');
      this.setStyles(cloud, {
        width: `${50 + Math.random() * 80}px`,
        height: `${30 + Math.random() * 40}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${10 + Math.random() * 10}s`,
        animationDelay: `${Math.random() * 5}s`,
      });
      this.renderer.appendChild(container, cloud);
    }
  }

  private addStink(container: HTMLElement) {
    for (let i = 0; i < 5; i++) {
      const stink = this.renderer.createElement('div');
      this.renderer.addClass(stink, 'stink');
      const size = 60 + Math.random() * 60;
      this.setStyles(stink, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${6 + Math.random() * 5}s`,
        animationDelay: `${Math.random() * 3}s`,
      });
      this.renderer.appendChild(container, stink);
    }
  }

  private addSparkles(container: HTMLElement) {
    for (let i = 0; i < 12; i++) {
      const sparkle = this.renderer.createElement('div');
      this.renderer.addClass(sparkle, 'sparkle');
      this.setStyles(sparkle, {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 3}s`,
        animationDelay: `${Math.random() * 2}s`,
      });
      this.renderer.appendChild(container, sparkle);
    }
  }

  private setStyles(el: HTMLElement, styles: Record<string, string>) {
    for (const [key, value] of Object.entries(styles)) {
      this.renderer.setStyle(el, this.camelToKebab(key), value);
    }
  }

  private camelToKebab(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private clearEffects(): void {
    const oldLayer = this.el.nativeElement.querySelector('.effect-layer');
    if (oldLayer) {
      this.renderer.removeChild(this.el.nativeElement, oldLayer);
    }
  }
}
