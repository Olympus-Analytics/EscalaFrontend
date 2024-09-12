import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-aside-bar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.css'
})
export class AsideBarComponent {
  opened = false;
  constructor() { }
  toggle() {
    this.opened = !this.opened;
  }

}
