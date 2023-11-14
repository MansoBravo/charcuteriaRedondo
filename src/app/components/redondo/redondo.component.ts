import { Component, OnInit, HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute} from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';
import { Location } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-redondo',
  templateUrl: './redondo.component.html'
})
export class RedondoComponent implements OnInit {
  vistaApartado:boolean = false;

  constructor(private activatedRoute:ActivatedRoute,
    private router: Router,
    public _datosService:DatosService,
      private carritoService: CarritoService,) { }

  ngOnInit() {
    this.sacaApartado();
    this._datosService.ponSeccion('redondo');
    this._datosService.updateTitle('Redondo Charcutería Carnicería online Valladolid|Lechazo|Cochinillo');
    this._datosService.updateOgUrl('');
    //Updating Description tag dynamically with title
    this._datosService.updateDescription('Redondo Carnicería, servicio a domicilio en Valladolid y provincia. Carne de ternera, lechazo, jamón, embutidos, vino, charcutería de elaboración propia.');

  }

  sacaApartado() {
    setTimeout(() => {
      this.vistaApartado = true;
    }, 1000);
  }

}
