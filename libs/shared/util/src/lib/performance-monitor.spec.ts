import { initPerformanceMonitoring } from './performance-monitor';
import * as webVitals from 'web-vitals';

jest.mock('web-vitals', () => ({
  onLCP: jest.fn(),
  onCLS: jest.fn(),
  onINP: jest.fn(),
  onFCP: jest.fn(),
  onTTFB: jest.fn(),
}));

describe('PerformanceMonitor', () => {
  it('should initialize all web vitals listeners', () => {
    initPerformanceMonitoring();
    expect(webVitals.onLCP).toHaveBeenCalled();
    expect(webVitals.onCLS).toHaveBeenCalled();
    expect(webVitals.onINP).toHaveBeenCalled();
    expect(webVitals.onFCP).toHaveBeenCalled();
    expect(webVitals.onTTFB).toHaveBeenCalled();
  });
});
