import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { IOptionSelect } from './opitonSelect.model';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  @Input() minLenthShowDropdown: number = 0;
  @Input() label: string = '';
  @Input() internalControl!: FormControl;
  @Input() placeholder: string = '';
  @Input() control!: FormControl;
  @Input() opcoes: IOptionSelect[] = [];

  @ViewChild(NgbDropdown) myDrop!: NgbDropdown;

  constructor() { }

  ngOnInit() {

    this.internalControl.valueChanges.subscribe(() =>
      this.showDropdown()
    );
    this.control.valueChanges.subscribe((value) => {
      this.setInternalByValue(value);
    });
    this.setInternalByValue(this.control.value, false);
  }

  private setInternalByValue(value: any, showDropdown = true) {
    setTimeout(() => {
      this.internalControl.setValue(
        this.opcoes.find(option => option.value === value)?.label || ''
      );

      if (showDropdown) this.showDropdown();
      else this.myDrop.close();
    });
  }

  public showDropdown() {
    if ( this.internalControl.value.length >= this.minLenthShowDropdown ) this.myDrop.open();
    else this.myDrop.close();
  }

  selectOption(option: IOptionSelect) {
    this.control.setValue(option.value, { emitEvent: false });
    this.internalControl.setValue(option.label);
    this.myDrop.close();
  }

}

