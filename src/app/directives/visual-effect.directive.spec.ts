import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { VisualEffectDirective } from './visual-effect.directive';

@Component({
  template: `<div [appVisualEffect]="effect"></div>`,
  standalone: true,
  imports: [VisualEffectDirective],
})
class TestHostComponent {
  effect = '';
}

describe('VisualEffectDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let debugEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    debugEl = fixture.debugElement.query(By.directive(VisualEffectDirective));
  });

  it('should create an instance of the directive', () => {
    const directive = debugEl.injector.get(VisualEffectDirective);
    expect(directive).toBeTruthy();
  });

  it('should not render anything if perception is empty', () => {
    fixture.componentInstance.effect = '';
    fixture.detectChanges();
    const layer = debugEl.nativeElement.querySelector('.effect-layer');
    expect(layer).toBeNull();
  });

  it('should render clouds when perception includes "brisa"', () => {
    fixture.componentInstance.effect = 'brisa';
    fixture.detectChanges();

    const layer = debugEl.nativeElement.querySelector('.effect-layer');
    const clouds = layer.querySelectorAll('.cloud');
    expect(clouds.length).toBeGreaterThan(0);
  });

  it('should render stink when perception includes "hedor"', () => {
    fixture.componentInstance.effect = 'hedor';
    fixture.detectChanges();

    const layer = debugEl.nativeElement.querySelector('.effect-layer');
    const stinks = layer.querySelectorAll('.stink');
    expect(stinks.length).toBeGreaterThan(0);
  });

  it('should render sparkles when perception includes "brillo"', () => {
    fixture.componentInstance.effect = 'brillo';
    fixture.detectChanges();

    const layer = debugEl.nativeElement.querySelector('.effect-layer');
    const sparkles = layer.querySelectorAll('.sparkle');
    expect(sparkles.length).toBeGreaterThan(0);
  });

  it('should render multiple effects if perception includes multiple cues', () => {
    fixture.componentInstance.effect = 'brisa hedor brillo';
    fixture.detectChanges();

    const layer = debugEl.nativeElement.querySelector('.effect-layer');
    expect(layer.querySelectorAll('.cloud').length).toBeGreaterThan(0);
    expect(layer.querySelectorAll('.stink').length).toBeGreaterThan(0);
    expect(layer.querySelectorAll('.sparkle').length).toBeGreaterThan(0);
  });

  it('should clear previous effects on perception change', () => {
    fixture.componentInstance.effect = 'brisa';
    fixture.detectChanges();

    let layer = debugEl.nativeElement.querySelector('.effect-layer');
    expect(layer).not.toBeNull();

    fixture.componentInstance.effect = 'brillo';
    fixture.detectChanges();

    layer = debugEl.nativeElement.querySelector('.effect-layer');
    expect(layer.querySelectorAll('.cloud').length).toBe(0);
    expect(layer.querySelectorAll('.sparkle').length).toBeGreaterThan(0);
  });
});
