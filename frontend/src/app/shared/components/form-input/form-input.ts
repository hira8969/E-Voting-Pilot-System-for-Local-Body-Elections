import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css'
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() id: string = `input-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() value: string | number = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() prefixIcon: string = '';
  @Input() errorMessage: string = '';
  @Input() hint: string = '';

  @Output() valueChange = new EventEmitter<string | number>();

  touched: boolean = false;

  private onChange: (val: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: any): void {
    this.value = val ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
  }

  getInputClasses(): string {
    const base = 'block w-full rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors py-2.5 px-3.5';
    const border = this.errorMessage && this.touched
      ? 'border border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-red-50/20'
      : 'border border-slate-300 focus:border-blue-800 focus:ring-1 focus:ring-blue-800 bg-white';
    const padding = this.prefixIcon ? 'pl-10' : 'pl-3.5';
    const disabledState = this.disabled ? 'bg-slate-100 cursor-not-allowed opacity-75' : '';

    return `${base} ${border} ${padding} ${disabledState}`;
  }
}
