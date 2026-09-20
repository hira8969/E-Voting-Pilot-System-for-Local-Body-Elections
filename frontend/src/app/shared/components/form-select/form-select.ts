import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true
    }
  ],
  templateUrl: './form-select.html',
  styleUrl: './form-select.css'
})
export class FormSelectComponent implements ControlValueAccessor {
  @Input() id: string = `select-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label: string = '';
  @Input() placeholder: string = 'Select option';
  @Input() options: SelectOption[] = [];
  @Input() value: any = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() hint: string = '';

  @Output() valueChange = new EventEmitter<any>();

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

  onChangeSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }
}
