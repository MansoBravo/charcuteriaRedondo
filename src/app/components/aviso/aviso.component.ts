import { Component, OnInit, HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html'
})
export class AvisoComponent implements OnInit {

  rutaApartado: string = '';
  vistaApartado: boolean = false;
  apartado: string = "";
  texto: any[];
  texto_en: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public _datosService: DatosService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let ruta = this.router.routerState.snapshot.root.firstChild.url[0].path;
        this.rutaApartado = ruta;
        if (ruta == 'politica-de-venta') {
          this.apartado = 'legal_politica_de_venta';
        }
        if (ruta == 'politica-de-cookies') {
          this.apartado = 'legal_politica_de_cookies';
        }
        if (ruta == 'politica-de-privacidad') {
          this.apartado = 'legal_politica_de_privacidad';
        }
        if (ruta == 'aviso-legal') {
          this.apartado = 'legal_aviso_legal';
        }
        this.sacaApartado()
        this.cargaContenido(this.apartado);
        console.log('esta ', this.apartado);
      }

    });

  }

  ngOnInit() {
    this._datosService.ponSeccion('aviso');
  }

  cargaContenido(ruta) {
    console.log(ruta);
    this._datosService.getTexto(ruta).subscribe(datos => {
      this.texto = datos.text_1;
    });

    let rutaIngles = ruta + "_en";
    this._datosService.getTexto(rutaIngles).subscribe(datos => {
      this.texto_en = datos.text_1;
    });
  }

  sacaApartado() {
    setTimeout(() => {
      this.vistaApartado = true;
    }, 1000);
  }

}
