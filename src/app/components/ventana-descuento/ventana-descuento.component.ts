import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { ModalService } from '../../_modal';
import { Router, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';

import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-ventana-descuento',
  templateUrl: './ventana-descuento.component.html'
})
export class VentanaDescuentoComponent implements OnInit {
    bodyText: string;
    isChecked: boolean = true;
    emailDescuentoForm:FormGroup;
    emailRegaloForm:FormGroup;
    sms:string = '';
    sms2:string = '';
    imagenRegalo:any = [];

    constructor( 
      private router: Router,
      public _datosService:DatosService, 
      private modalService: ModalService,
      private fb:FormBuilder,
      private alertService:AlertService) { }

    ngOnInit() {
      this.emailDescuentoForm = this.fb.group({
        email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      });
      this.emailRegaloForm = this.fb.group({
        email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      });
      this._datosService.getTexto('2').subscribe(datos=>{
        this.imagenRegalo = datos.imagenes[0];
        if(this.imagenRegalo.mime_type.includes('png')) {
          this.imagenRegalo.extension = '.png';
        } else {
          this.imagenRegalo.extension = '.jpg';
        } 
      });
    }

    ngAfterViewInit() {
      if (!localStorage.getItem('token')) {
        setTimeout( () => { 
          this.modalService.open('modal-fase-1') 
        }, 4000);
      }
    }
    
    openModal(id: string) {
      this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
        if(id == 'modal-fase-1') this.modalService.open('modal-fase-2');
    }

    descuento_bienvenida(){
      this._datosService.registroNewsletter(this.emailDescuentoForm.value['email']).subscribe(
        data => {
            if(data.status == "warning") this.sms = data.mensaje;
            else if(data.status == "success") {
              this.modalService.close('modal-fase-1');
              const codigo: HTMLElement = document.getElementById('codigo-descuento');
              codigo.textContent = 'ENHORABUENA';
              this.openModal('modal-fase-1-completa');
              localStorage.setItem("primeraVisita", "false");
            }
        },
        error => {
          this.alertService.error(error.body.mensaje);
          this.sms = error.body.mensaje;
        }
      );
    }

    regalo_bienvenida(){
      this._datosService.registroNewsletter(this.emailRegaloForm.value['email']).subscribe(
        data => {
            if(data.status == "warning") this.sms2 = data.mensaje;
            else if(data.status == "success") {
              this.closeModal('modal-fase-2');
              const codigo: HTMLElement = document.getElementById('codigo-regalo');
              codigo.textContent = 'REGALO-25NC';
              this.openModal('modal-fase-2-completa');
              localStorage.setItem("primeraVisita", "false");
            }
        },
        error => {
          this.alertService.error(error.body.mensaje);
          this.sms2 = error.body.mensaje;
        }
      );
    }
  
  }
