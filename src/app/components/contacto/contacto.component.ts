import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html'
})
export class ContactoComponent implements OnInit {

  constructor(public _datosService:DatosService) { }

  ngOnInit() {
    this._datosService.ponSeccion('home');
    this._datosService.updateTitle('Redondo Charcutería Carnicería online Valladolid|Lechazo|Cochinillo');
    this._datosService.updateOgUrl('');
    //Updating Description tag dynamically with title
    this._datosService.updateDescription('Redondo Carnicería, servicio a domicilio en Valladolid y provincia. Carne de ternera, lechazo, jamón, embutidos, vino, charcutería de elaboración propia.');

  }

}
