import { Directive, ElementRef, Renderer2, inject, input, effect } from '@angular/core';

@Directive({
  selector: '[appVisualEffect]',
  standalone: true,
})
export class VisualEffectDirective {
  readonly perception = input<string>('', { alias: 'appVisualEffect' });

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  private container: HTMLElement | null = null;
  private cloudsLayer: HTMLElement | null = null;
  private stinkLayer: HTMLElement | null = null;
  private sparklesLayer: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const perceptionValue = this.perception();
      this.updateEffects(perceptionValue);
    });
  }

  private updateEffects(perception: string): void {
    const hasBreeze = perception.includes('brisa') || perception.includes('breeze');
    const hasStench = perception.includes('hedor') || perception.includes('stench');
    const hasShine = perception.includes('brillo') || perception.includes('shine');

    if (!hasBreeze && !hasStench && !hasShine) {
      this.removeBaseContainer();
      return;
    }

    if (!this.container) {
      this.createBaseContainer();
    }

    this.toggleLayer('clouds', hasBreeze);
    this.toggleLayer('stink', hasStench);
    this.toggleLayer('sparkles', hasShine);
  }

  private createBaseContainer(): void {
    this.container = this.renderer.createElement('div');
    this.renderer.addClass(this.container, 'effect-layer');
    this.renderer.appendChild(this.el.nativeElement, this.container);
  }

  private removeBaseContainer(): void {
    if (this.container) {
      this.renderer.removeChild(this.el.nativeElement, this.container);
      this.container = null;
      this.cloudsLayer = null;
      this.stinkLayer = null;
      this.sparklesLayer = null;
    }
  }

  private toggleLayer(type: 'clouds' | 'stink' | 'sparkles', show: boolean): void {
    let layer = this.getLayer(type);

    if (show && !layer) {
      layer = this.createLayer(type);
      this.setLayer(type, layer);
      this.renderer.appendChild(this.container, layer);
    }

    if (layer) {
      if (show) {
        this.renderer.removeStyle(layer, 'display');
      } else {
        this.renderer.setStyle(layer, 'display', 'none');
      }
    }
  }

  private getLayer(type: 'clouds' | 'stink' | 'sparkles'): HTMLElement | null {
    if (type === 'clouds') return this.cloudsLayer;
    if (type === 'stink') return this.stinkLayer;
    return this.sparklesLayer;
  }

  private setLayer(type: 'clouds' | 'stink' | 'sparkles', layer: HTMLElement): void {
    if (type === 'clouds') this.cloudsLayer = layer;
    else if (type === 'stink') this.stinkLayer = layer;
    else this.sparklesLayer = layer;
  }

  private createLayer(type: 'clouds' | 'stink' | 'sparkles'): HTMLElement {
    const layer = this.renderer.createElement('div');
    if (type === 'clouds') this.addClouds(layer);
    else if (type === 'stink') this.addStink(layer);
    else this.addSparkles(layer);
    return layer;
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
    return str.replaceAll(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
