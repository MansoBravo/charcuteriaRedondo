import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { ProductosComponent } from '../productos/productos.component';

@Component({
  selector: 'app-producto-item',
  templateUrl: './producto-item.component.html'
})


export class ProductoItemComponent implements OnInit {

  constructor( public _productos:ProductosComponent) { }

  ngOnInit() {
  }

}
