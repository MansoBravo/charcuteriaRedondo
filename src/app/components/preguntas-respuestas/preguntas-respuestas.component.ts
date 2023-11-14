import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
    selector: 'app-preguntas',
    templateUrl: './preguntas-respuestas.component.html',
    styles: []
})

export class PreguntasRespuestasComponent implements OnInit {

    preguntasRespuestas: any = [];

    constructor(public _datosService: DatosService) { }

    ngOnInit() {
        this._datosService.getPreguntasFrecuentes().subscribe(datos => {
            datos.forEach((dato) => {
                if (dato.mostrar_web == 1) {
                    this.preguntasRespuestas.push(dato);
                }
            })
        });
    }

}