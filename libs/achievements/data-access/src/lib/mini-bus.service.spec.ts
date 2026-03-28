import { TestBed } from '@angular/core/testing';
import { MiniBusService } from './mini-bus.service';

describe('MiniBusService', () => {
  let service: MiniBusService;
  let eventCount = 0;

  const getUniqueEventName = () => `test-event-${eventCount++}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MiniBusService],
    });
    service = TestBed.inject(MiniBusService);
    (globalThis as any).__EVENT_STORE__ = {};
  });

  afterEach(() => {
    (globalThis as any).__EVENT_STORE__ = undefined;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('emit', () => {
    it('should update the event store', () => {
      const event = getUniqueEventName();
      const detail = { foo: 'bar' };

      service.emit(event, detail);

      expect((globalThis as any).__EVENT_STORE__[event]).toBe(detail);
    });

    it('should dispatch a CustomEvent', (done) => {
      const event = getUniqueEventName();
      const detail = { foo: 'bar' };

      globalThis.addEventListener(event, (e: any) => {
        expect(e.detail).toBe(detail);
        done();
      }, { once: true });

      service.emit(event, detail);
    });

    it('should not overwrite existing __EVENT_STORE__', () => {
      const existingStore = { existing: 'data' };
      (globalThis as any).__EVENT_STORE__ = existingStore;

      service.emit('new-event', 'new-data');

      expect((globalThis as any).__EVENT_STORE__).toBe(existingStore);
      expect(existingStore as any).toEqual({
        existing: 'data',
        'new-event': 'new-data'
      });
    });
  });

  describe('listen', () => {
    it('should replay existing events from the store', (done) => {
      const event = getUniqueEventName();
      const detail = { foo: 'bar' };
      (globalThis as any).__EVENT_STORE__[event] = detail;

      service.listen(event, (data) => {
        expect(data).toBe(detail);
        done();
      });
    });

    it('should listen for future events', (done) => {
      const event = getUniqueEventName();
      const detail = { foo: 'bar' };

      service.listen(event, (data) => {
        expect(data).toBe(detail);
        done();
      });

      service.emit(event, detail);
    });

    it('should handle multiple listeners and both replay and future events', () => {
      const event = getUniqueEventName();
      const detail1 = { foo: 'bar1' };
      const detail2 = { foo: 'bar2' };
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      service.emit(event, detail1);
      service.listen(event, callback1);
      expect(callback1).toHaveBeenCalledWith(detail1);

      service.listen(event, callback2);
      expect(callback2).toHaveBeenCalledWith(detail1);

      service.emit(event, detail2);
      expect(callback1).toHaveBeenCalledWith(detail2);
      expect(callback2).toHaveBeenCalledWith(detail2);
    });
  });
});
