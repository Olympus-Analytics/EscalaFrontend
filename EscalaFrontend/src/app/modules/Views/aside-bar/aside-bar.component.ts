import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ButtontabComponent } from '../../ui/buttontab/buttontab.component';

@Component({
  selector: 'app-aside-bar',
  standalone: true,
  imports: [NgClass, ButtontabComponent],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.css'
})
export class AsideBarComponent {
  opened = false;
  constructor() { }
  toggle(value: boolean) {
    this.opened = value;
  }

}
