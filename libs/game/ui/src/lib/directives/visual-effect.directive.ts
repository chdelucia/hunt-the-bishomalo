import { Directive, ElementRef, Renderer2, inject, input, effect, DestroyRef } from '@angular/core';

@Directive({
  selector: '[libVisualEffect]',
  standalone: true,
})
export class VisualEffectDirective {
  readonly perception = input<string>('', { alias: 'libVisualEffect' });

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private animationFrameId: number | null = null;
  private currentCues = '';

  constructor() {
    effect(() => {
      const perceptionValue = this.perception();
      const newCues = this.extractCues(perceptionValue);

      // Only schedule update if the environmental cues have actually changed
      if (newCues !== this.currentCues) {
        this.currentCues = newCues;
        this.scheduleUpdate(newCues);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.cancelScheduledUpdate();
    });
  }

  private extractCues(perception: string): string {
    const cues = [];
    const p = perception.toLowerCase();
    if (p.includes('brisa') || p.includes('breeze')) cues.push('breeze');
    if (p.includes('hedor') || p.includes('stench')) cues.push('stench');
    if (p.includes('brillo') || p.includes('shine')) cues.push('shine');
    return cues.sort().join('|');
  }

  /**
   * Schedules the update of visual effects using requestAnimationFrame
   * to batch DOM manipulations and improve Interaction to Next Paint (INP).
   */
  private scheduleUpdate(cues: string): void {
    this.cancelScheduledUpdate();
    this.animationFrameId = requestAnimationFrame(() => {
      this.updateEffects(cues);
      this.animationFrameId = null;
    });
  }

  private cancelScheduledUpdate(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private updateEffects(cues: string): void {
    this.clearEffects();

    const container = this.renderer.createElement('div');
    this.renderer.addClass(container, 'effect-layer');

    if (cues.includes('breeze')) {
      this.addClouds(container);
    }

    if (cues.includes('stench')) {
      this.addStink(container);
    }

    if (cues.includes('shine')) {
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
      /**
       * Security Hotspot Justification:
       * Math.random() is used here for visual effects (randomizing cloud positions and sizes).
       * It does not involve any security-sensitive operations.
       */
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
        'animation-duration': `${6 + Math.random() * 5}s`,
        'animation-delay': `${Math.random() * 3}s`,
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
        'animation-duration': `${2 + Math.random() * 3}s`,
        'animation-delay': `${Math.random() * 2}s`,
      });
      this.renderer.appendChild(container, sparkle);
    }
  }

  private setStyles(el: HTMLElement, styles: Record<string, string>) {
    for (const [key, value] of Object.entries(styles)) {
      this.renderer.setStyle(el, key, value);
    }
  }

  private clearEffects(): void {
    const oldLayer = this.el.nativeElement.querySelector('.effect-layer');
    if (oldLayer) {
      this.renderer.removeChild(this.el.nativeElement, oldLayer);
    }
  }
}
