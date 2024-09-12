import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit {

  private map!: L.Map
  markers: L.Marker[] = [
    L.marker([10.9639, -74.7960]),
    L.marker([10.96, -74.7960]),
  ];

  constructor() { }

  ngOnInit() {
    this.initializeMap();
    this.addMarkers();
    this.centerMap();
  }

  ngAfterViewInit() {

  }


  private initializeMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    this.map = L.map('map');

    this.map.zoomControl.setPosition('bottomright');
    this.map.zoomControl.options.zoomInText = '+';
    this.map.zoomIn(0.1, { animate: true });
    this.map.zoomOut(0.1, { animate: true });
    this.map.setZoom(1);
    L.tileLayer(baseMapURl).addTo(this.map);
  }


  private addMarkers() {

    this.markers.forEach(marker => marker.addTo(this.map));

  }

  private centerMap() {

    const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));


    this.map.fitBounds(bounds, { padding : [200, 200] });
  }
}
