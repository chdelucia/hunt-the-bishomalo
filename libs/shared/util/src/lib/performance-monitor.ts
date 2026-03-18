import { onLCP, onCLS, onINP, onFCP, onTTFB, Metric } from 'web-vitals';

/**
 * Logs the metric to the console.
 * In a real application, you might send this to an analytics endpoint.
 */
function logMetric(metric: Metric) {
  // eslint-disable-next-line no-console
  console.log(`[Performance Metric] ${metric.name}:`, metric.value, metric);
}

/**
 * Initializes performance monitoring for Core Web Vitals.
 */
export function initPerformanceMonitoring(): void {
  onLCP(logMetric);
  onCLS(logMetric);
  onINP(logMetric);
  onFCP(logMetric);
  onTTFB(logMetric);
}
