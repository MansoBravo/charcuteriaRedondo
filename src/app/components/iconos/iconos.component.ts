import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-iconos',
  templateUrl: './iconos.component.html'
})
export class IconosComponent implements OnInit {

  arrIconos:any = ['estrella', 'horeca', 'regalo'];

  constructor(public _datosService:DatosService) { }

  ngOnInit() {
  }

}
