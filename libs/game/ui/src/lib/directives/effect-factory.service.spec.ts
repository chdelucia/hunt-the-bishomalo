import { TestBed } from '@angular/core/testing';
import { EffectFactoryService } from './effect-factory.service';

describe('EffectFactoryService', () => {
  let service: EffectFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EffectFactoryService],
    });
    service = TestBed.inject(EffectFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an effect container', () => {
    const container = service.createEffectContainer();
    expect(container).toBeTruthy();
    expect(container.classList.contains('effect-layer')).toBe(true);
  });

  it('should add clouds to container', () => {
    const container = service.createEffectContainer();
    service.addClouds(container);
    expect(container.querySelectorAll('.cloud').length).toBe(8);
  });

  it('should add stink to container', () => {
    const container = service.createEffectContainer();
    service.addStink(container);
    expect(container.querySelectorAll('.stink').length).toBe(5);
  });

  it('should add sparkles to container', () => {
    const container = service.createEffectContainer();
    service.addSparkles(container);
    expect(container.querySelectorAll('.sparkle').length).toBe(12);
  });
});
