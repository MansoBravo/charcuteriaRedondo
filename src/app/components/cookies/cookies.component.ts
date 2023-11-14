import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { ModalService } from '../../_modal';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html'
})
export class CookiesComponent implements OnInit {
    bodyText: string;
    isChecked: boolean = true;

    constructor( public _datosService:DatosService, private modalService: ModalService) { }

    ngOnInit() {
      this.bodyText = 'This text';
    }
    
    openModal(id: string) {
      this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }
  }
