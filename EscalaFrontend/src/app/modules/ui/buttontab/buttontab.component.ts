import { Component, input, output} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-buttontab',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './buttontab.component.html',
  styleUrl: './buttontab.component.css'
})
export class ButtontabComponent {
  toggle = false;
  outputToggle = output<boolean>();
  onToggle() {
    this.toggle = !this.toggle;
    this.outputToggle.emit(this.toggle);
  }


}
