import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  quantity = 1;

  addQuantity = () => { if (this.quantity < 4) this.quantity++ }
  removeQuantity = () => { if(this.quantity>1) this.quantity-- }
  constructor() { }

}
