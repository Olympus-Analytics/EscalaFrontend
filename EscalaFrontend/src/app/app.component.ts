import { Component } from '@angular/core';
import { MainComponent } from './modules/Views/main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainComponent, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
