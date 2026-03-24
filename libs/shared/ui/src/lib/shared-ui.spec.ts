import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleComponent } from './title/title.component';
import { ButtonComponent } from './button';
import { InputComponent } from './input';
import { SpinnerComponent } from './spinner';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideTransloco, TRANSLOCO_LOADER } from '@jsverse/transloco';
import { of } from 'rxjs';

describe('Shared UI Components', () => {
  describe('TitleComponent', () => {
    let component: TitleComponent;
    let fixture: ComponentFixture<TitleComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TitleComponent, HttpClientTestingModule],
        providers: [
          provideTransloco({
            config: {
              availableLangs: ['en', 'es'],
              defaultLang: 'es',
            },
          }),
          {
            provide: TRANSLOCO_LOADER,
            useValue: {
              getTranslation: () => of({}),
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TitleComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('blackout', false);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('ButtonComponent', () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should emit clicked event when not disabled', () => {
      const spy = jest.spyOn(component.clicked, 'emit');
      component.onClick(new MouseEvent('click'));
      expect(spy).toHaveBeenCalled();
    });

    it('should not emit clicked event when disabled', () => {
      const spy = jest.spyOn(component.clicked, 'emit');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      component.onClick(new MouseEvent('click'));
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('InputComponent', () => {
    let component: InputComponent;
    let fixture: ComponentFixture<InputComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [InputComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should emit valueChange event on input', () => {
      const spy = jest.spyOn(component.valueChange, 'emit');
      const inputElement = fixture.nativeElement.querySelector('input');
      inputElement.value = 'test';
      inputElement.dispatchEvent(new Event('input'));
      expect(spy).toHaveBeenCalledWith('test');
    });

    it('should emit numeric value when type is number', () => {
      const spy = jest.spyOn(component.valueChange, 'emit');
      fixture.componentRef.setInput('type', 'number');
      fixture.detectChanges();
      const inputElement = fixture.nativeElement.querySelector('input');
      inputElement.value = '123';
      inputElement.dispatchEvent(new Event('input'));
      expect(spy).toHaveBeenCalledWith(123);
    });
  });

  describe('SpinnerComponent', () => {
    let component: SpinnerComponent;
    let fixture: ComponentFixture<SpinnerComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SpinnerComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SpinnerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
