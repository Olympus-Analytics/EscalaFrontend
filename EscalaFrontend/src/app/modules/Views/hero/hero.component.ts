import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GalleriaModule } from 'primeng/galleria';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ RouterLink, GalleriaModule, RadioButtonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'] // Corregido: 'styleUrls' debe ser un array
})
export class HeroComponent {
  images = ['/images/image1.JPG', '/images/image2.JPG', '/images/image3.JPG', '/images/image4.JPG', '/images/image5.JPG', '/images/image6.JPG', '/images/image7.JPG', '/images/image8.JPG', '/images/image9.JPG', '/images/image10.JPG']; // Imágenes para la galería

  position: string = 'bottom';

  positionOptions = [
    { label: 'Bottom', value: 'bottom' },
    { label: 'Top', value: 'top' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' }
  ];


}
