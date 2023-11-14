import { Component, OnInit } from '@angular/core';

import { Router, NavigationStart, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';
import { AlertService } from '../../services/alert.service';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';


import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html'
})
export class RecuperarComponent implements OnInit {
  vistaApartado:boolean = false;
  sms: string;
  usuario:string;
  token:string;
  reestablecerForm:FormGroup;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private alertService:AlertService,
      private fb:FormBuilder,
      public _datosService:DatosService,
      private carritoService: CarritoService,
      private autenticacionService:AutenticacionService) { }

  ngOnInit() {
    this._datosService.ponSeccion('restablecer');
    this.vistaApartado = false;
    this.usuario = '';
    this.sacaApartado();

    //formulario
    this.reestablecerForm = this.fb.group({
          password: ['', [Validators.required, Validators.minLength(6)]],
          password2: ['', [Validators.required, Validators.minLength(6)]],
    });


    this.route.url.subscribe( url=> {
            let usuario = this.route.snapshot.url[1].path;
            let token = this.route.snapshot.url[2].path;

            this.usuario = usuario;
            this.token = token;

            this.autenticacionService.checkRestablecerContrasena(usuario, token).subscribe(
              data => {
                  if(data.status != 'success'){
                    this.sms = data;
                  }
              },
              error=> {
                this.alertService.error(error.mensaje);
                this.sms = error.mensaje;
                console.log('error', error.mensaje);
              }
            );

      });
  }

  sacaApartado() {
    setTimeout(() => {
      this.vistaApartado = true;
    }, 1000);
  }

  reestablacer() {
    this.autenticacionService.restablecerContrasena(this.usuario, this.token, this.reestablecerForm.value['password'], this.reestablecerForm.value['password2']).subscribe(
      data => {
          console.log(data);
          this.router.navigate(['/checkout']);
      },
      error=> {
        this.alertService.error(error.mensaje);
      }
    );
  }

}
