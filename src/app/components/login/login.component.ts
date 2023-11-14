import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';
import { AlertService } from '../../services/alert.service';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';


import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  vistaApartado:boolean = false;

  loginForm:FormGroup;
  recuperarForm:FormGroup;
  registroForm:FormGroup;
  sms:string = '';
  sms2:string = '';
  sms3:string = '';
  returnUrl: string; //url de intención
  isRecordar:boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService:AlertService,
    private fb:FormBuilder,
    public _datosService:DatosService,
    private carritoService: CarritoService,
    private autenticacionService:AutenticacionService) { }



  ngOnInit() {
    this.autenticacionService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this._datosService.ponSeccion('login');
    this.vistaApartado = false;
    this.isRecordar = false;
    this.sacaApartado();

    this._datosService.updateTitle('Redondo Charcutería Carnicería online Valladolid|Lechazo|Cochinillo');
    this._datosService.updateOgUrl('');
    //Updating Description tag dynamically with title
    this._datosService.updateDescription('Redondo Carnicería, servicio a domicilio en Valladolid y provincia. Carne de ternera, lechazo, jamón, embutidos, vino, charcutería de elaboración propia.');


    //formulario de login
    this.loginForm = this.fb.group({
          username: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]]
    });

    //formulario de recuperar password
    this.recuperarForm = this.fb.group({
          username: ['', [Validators.required, Validators.email]]
    });

    //formulario de registro
    this.registroForm = this.fb.group({
            username: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            password2: ['', [Validators.required, Validators.minLength(6)]],
            aviso: ['',  Validators.required]
        });
  }

  sacaApartado() {
    setTimeout(() => {
      this.vistaApartado = true;
    }, 1000);
  }

  login(){
    this.autenticacionService.login(this.loginForm.value['username'], this.loginForm.value['password']).subscribe(
      data => {
        /*
        if(this.returnUrl) {
          this.router.navigate([this.returnUrl]);
        }
        else {
          this.router.navigate(['/checkout']);
        }*/
          this.router.navigate(['/pedidos']);
      },
      error=> {
        console.log(error.body.mensaje);
        this.alertService.error(error.body.mensaje);
        this.sms2 = error.body.mensaje;
       
      }
    );
  }

  recuperarPassword() {
    this.autenticacionService.recuperarPassword(this.recuperarForm.value['username']).subscribe(
      data => {
          console.log(data);
          this.router.navigate(['/pedidos']);
          this.sms = data.mensaje;
          this.recuperarForm.reset();
      },
      error=> {
        this.alertService.error(error.body.mensaje);
        this.sms = error.body.mensaje;
        console.log('error', error.body.mensaje);
      }
    );
  }

  registro(){
    this.autenticacionService.registro(this.registroForm.value['username'], this.registroForm.value['password'], this.registroForm.value['password2']).subscribe(
      data => {
          //this.router.navigate(['/checkout']);
          this.autenticacionService.login(this.registroForm.value['username'], this.registroForm.value['password']).subscribe(
            data => {
                this.router.navigate(['/pedidos']);
            },
            error=> {
              this.alertService.error(error.mensaje);
              this.sms = error.mensaje;
              console.log('error', error.mensaje);
            }
          );
      },
      error => {
        this.alertService.error(error.body.mensaje);
        this.sms3 = error.body.mensaje;
        console.log('error', error.body.mensaje);
      }
    );
  }

}
