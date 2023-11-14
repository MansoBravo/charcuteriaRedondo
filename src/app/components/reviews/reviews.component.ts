import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styles: []
})
export class ReviewsComponent implements OnInit {

  opiniones:any = [];

  constructor( public _datosService:DatosService) { }

  ngOnInit() {
    this._datosService.getOpiniones().subscribe(datos =>{
      this.opiniones = datos;
      this.opiniones.sort((val1, val2)=> {return Number(moment(val2.fecha)) - Number(moment(val1.fecha))});
    });
  }

}
