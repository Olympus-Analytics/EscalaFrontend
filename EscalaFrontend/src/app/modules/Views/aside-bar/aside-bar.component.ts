import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtontabComponent } from '../../ui/buttontab/buttontab.component';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { FormsManagersService } from '../../../services/forms-managers.service';
import { LayerManagerComponent } from './components/layer-manager/layer-manager.component';
import { GraphComponent } from "../../graphs/components/graph/graph.component";



@Component({
  selector: 'app-aside-bar',
  standalone: true,
  imports: [NgClass, ButtontabComponent, FormsModule, CalendarModule, LayerManagerComponent, GraphComponent],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.css',
})
export class AsideBarComponent {
  opened = false;
  formControlService = inject(FormsManagersService);
  years: {name:string, code:string}[] = [
    {name: '2016', code: '2016'},
    {name: '2017', code: '2017'},
    {name: '2018', code: '2018'},
    {name: '2019', code: '2019'},
    {name: '2020', code: '2020'},
    {name: '2021', code: '2021'},
    {name: '2022', code: '2022'},
  ]
  
  minDate: Date = new Date(2016, 0, 1);
  maxDate: Date = new Date(2022, 11, 31);
  rangeDates = this.formControlService.rangeDates;
  dateRaster = this.formControlService.dateRaster;
  constructor() { }
  toggle(value: boolean) {
    this.opened = value;
  }

}
