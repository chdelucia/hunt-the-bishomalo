// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import './commands';

Cypress.on('window:before:load', (win) => {
  // Mock AudioContext to avoid ALSA errors in headless environments
  const mockAudioContext = function () {
    const handler = {
      get(target: Record<string, unknown>, prop: string) {
        if (prop === 'state') return 'running';
        if (prop === 'currentTime') return 0;
        if (prop === 'destination') return {};
        if (typeof target[prop] === 'function') return target[prop];
        if (prop === 'close') return () => Promise.resolve();

        // Return a dummy function for any unmocked method to avoid crashes
        return () => ({
          connect: () => { /* Mock */ },
          start: () => { /* Mock */ },
          stop: () => { /* Mock */ },
          disconnect: () => { /* Mock */ },
          setValueAtTime: () => { /* Mock */ },
          linearRampToValueAtTime: () => { /* Mock */ },
          exponentialRampToValueAtTime: () => { /* Mock */ },
          setTargetAtTime: () => { /* Mock */ },
          setValueCurveAtTime: () => { /* Mock */ },
          cancelScheduledValues: () => { /* Mock */ },
          cancelAndHoldAtTime: () => { /* Mock */ },
          gain: {
            value: 1,
            setValueAtTime: () => { /* Mock */ },
            linearRampToValueAtTime: () => { /* Mock */ },
            exponentialRampToValueAtTime: () => { /* Mock */ },
          },
          frequency: {
            value: 440,
            setValueAtTime: () => { /* Mock */ },
            linearRampToValueAtTime: () => { /* Mock */ },
            exponentialRampToValueAtTime: () => { /* Mock */ },
          }
        });
      }
    };
    return new Proxy({}, handler);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (win as any).AudioContext = mockAudioContext as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (win as any).webkitAudioContext = mockAudioContext as any;

  // Mock speechSynthesis
  Object.defineProperty(win, 'speechSynthesis', {
    value: {
      speak: () => { /* Mock */ },
      cancel: () => { /* Mock */ },
      getVoices: () => [],
      pause: () => { /* Mock */ },
      resume: () => { /* Mock */ },
      pending: false,
      speaking: false,
      paused: false,
      onvoiceschanged: null,
    },
    writable: true,
  });

  // Mock SpeechSynthesisUtterance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (win as any).SpeechSynthesisUtterance = function (this: unknown, text?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const self = this as any;
    self.text = text || '';
    self.lang = '';
    self.voice = null;
    self.volume = 1;
    self.rate = 1;
    self.pitch = 1;
    self.onstart = null;
    self.onend = null;
    self.onerror = null;
    self.onpause = null;
    self.onresume = null;
    self.onmark = null;
    self.onboundary = null;
    return self;
  };
});
