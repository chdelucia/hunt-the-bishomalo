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
      get(target: any, prop: string) {
        if (prop === 'state') return 'running';
        if (prop === 'currentTime') return 0;
        if (prop === 'destination') return {};
        if (typeof target[prop] === 'function') return target[prop];
        if (prop === 'close') return () => Promise.resolve();

        // Return a dummy function for any unmocked method to avoid crashes
        return () => ({
          connect: () => {},
          start: () => {},
          stop: () => {},
          disconnect: () => {},
          setValueAtTime: () => {},
          linearRampToValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {},
          setTargetAtTime: () => {},
          setValueCurveAtTime: () => {},
          cancelScheduledValues: () => {},
          cancelAndHoldAtTime: () => {},
          gain: {
            value: 1,
            setValueAtTime: () => {},
            linearRampToValueAtTime: () => {},
            exponentialRampToValueAtTime: () => {},
          },
          frequency: {
            value: 440,
            setValueAtTime: () => {},
            linearRampToValueAtTime: () => {},
            exponentialRampToValueAtTime: () => {},
          }
        });
      }
    };
    return new Proxy({}, handler);
  };

  win.AudioContext = mockAudioContext as any;
  (win as any).webkitAudioContext = mockAudioContext as any;

  // Mock speechSynthesis
  Object.defineProperty(win, 'speechSynthesis', {
    value: {
      speak: () => {},
      cancel: () => {},
      getVoices: () => [],
      pause: () => {},
      resume: () => {},
      pending: false,
      speaking: false,
      paused: false,
      onvoiceschanged: null,
    },
    writable: true,
  });

  // Mock SpeechSynthesisUtterance
  win.SpeechSynthesisUtterance = function (text?: string) {
    return {
      text: text || '',
      lang: '',
      voice: null,
      volume: 1,
      rate: 1,
      pitch: 1,
      onstart: null,
      onend: null,
      onerror: null,
      onpause: null,
      onresume: null,
      onmark: null,
      onboundary: null,
    };
  } as any;
});
