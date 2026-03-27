import { Directive, ElementRef, Renderer2, inject, input, effect, DestroyRef } from '@angular/core';
import { EffectFactoryService } from './effect-factory.service';

@Directive({
  selector: '[libVisualEffect]',
  standalone: true,
})
export class VisualEffectDirective {
  readonly perception = input<string>('', { alias: 'libVisualEffect' });

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly effectFactory = inject(EffectFactoryService);
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

    cues.sort((a, b) => a.localeCompare(b));
    return cues.join('|');
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

    const container = this.effectFactory.createEffectContainer();

    if (cues.includes('breeze')) {
      this.effectFactory.addClouds(container);
    }

    if (cues.includes('stench')) {
      this.effectFactory.addStink(container);
    }

    if (cues.includes('shine')) {
      this.effectFactory.addSparkles(container);
    }

    if (container.childNodes.length > 0) {
      this.renderer.appendChild(this.el.nativeElement, container);
    }
  }

  private clearEffects(): void {
    const oldLayer = this.el.nativeElement.querySelector('.effect-layer');
    if (oldLayer) {
      this.renderer.removeChild(this.el.nativeElement, oldLayer);
    }
  }
}
