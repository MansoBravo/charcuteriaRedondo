import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute} from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { AutenticacionService } from '../../services/autenticacion.service';

@Component({
  selector: 'app-respuesta',
  templateUrl: './respuesta.component.html'
})
export class RespuestaComponent implements OnInit {
  vistaApartado:boolean = false;
  apartado: string = "";
  texto: any[];
  constructor(public _datosService:DatosService, private _carritoService:CarritoService , private _autenticacionService:AutenticacionService, private activatedRoute:ActivatedRoute, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        let ruta = this.router.routerState.snapshot.root.firstChild.url[0].path;
        this.apartado = ruta;
      }

    });
   }

  ngOnInit() {

    this._datosService.ponSeccion('dinamica');
    this.vistaApartado = false;
    this.sacaApartado();
  }

  sacaApartado() {
    setTimeout(() => {
      this.vistaApartado = true;
    }, 1500);


  }

/*
  cargaContenido(ruta) {
    this._datosService.getTexto(ruta).subscribe(datos=> {
      this.texto = datos.text_1;
    });
  }
  */

}
