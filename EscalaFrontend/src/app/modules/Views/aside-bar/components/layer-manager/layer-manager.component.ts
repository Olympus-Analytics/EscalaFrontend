import { Component, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsManagersService } from '@/services/forms-managers.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-layer-manager',
  standalone: true,
  imports: [CheckboxModule, FormsModule],
  templateUrl: './layer-manager.component.html',
  styleUrl: './layer-manager.component.css',
})
export class LayerManagerComponent {
  formControlService = inject(FormsManagersService);
  layersActivated = this.formControlService.layersActivated;
}
