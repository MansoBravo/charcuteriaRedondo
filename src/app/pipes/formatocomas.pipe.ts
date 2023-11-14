import { Pipe, PipeTransform } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Pipe({
  name: 'formatocomas'
})
export class FormatocomasPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let resultado = value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
    return resultado;
  }

}
