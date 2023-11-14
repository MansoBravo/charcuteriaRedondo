import { Component, OnInit, HostListener, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as Rx from 'rxjs/Rx';
import { Producto } from './../model/producto';
import { Observable } from 'rxjs/Rx'
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatosService } from '../services/datos.service';


@Injectable({
  providedIn: 'root'
})

export class CarritoService implements OnInit {

  private subject: BehaviorSubject<Producto[]> = new BehaviorSubject([]);
  private itemsCarrito: Producto[];
  private minCompraSinGastos: number = 60;
  private gastosEnvio:number = 0;


  constructor(public http: HttpClient, public _datosService: DatosService) {
    let localCarrito = localStorage.getItem("carrito");
    if(localCarrito != null){
      this.itemsCarrito = JSON.parse((localCarrito));
      this.subject.next(this.itemsCarrito);
    }

    this.subject.subscribe(data => this.itemsCarrito = data);
  }

  ngOnInit(){


  }

  reestableceCarrito() {
    let localCarrito = localStorage.getItem("carrito");
    if(localCarrito != null){
      this.itemsCarrito = JSON.parse((localCarrito));
      this.subject.next(this.itemsCarrito);
    }

    this.subject.subscribe(data => this.itemsCarrito = data);
  }

  /**
   * addCarrito añadir producto al carrito (por defecto 1 unidad)
   * @param producto
   */
  addCarrito(producto: Producto) {
    producto.unidades = 1;
    producto.a_granel = producto.a_granel;
    producto.peso = producto.peso;
    producto.urlFoto = producto.imagenes[0].path;
    this.subject.next([...this.itemsCarrito, producto]);
      this.actualizarCarrito();
    }

    addCarritoConUnidades(producto: Producto, unidades) {
      producto.unidades = unidades;
      producto.a_granel = producto.a_granel;
      producto.peso = producto.peso;
      producto.urlFoto = producto.imagenes[0].path;
      this.subject.next([...this.itemsCarrito, producto]);
        this.actualizarCarrito();
      }

  /**
   * eliminarProducto eliminar un producto (todas las unidades) del carrito
   */

  eliminarProducto(item){
    this.itemsCarrito.splice(item, 1);
    this.actualizarCarrito();
  }

  /**
   * clearCarrito eliminar todo el carrito
   */
  clearCarrito() {
    this.itemsCarrito = [];
    this.gastosEnvio = 0;
    this.actualizarCarrito();
  }

  //chekear carrito al añadir producto para añadirlo o cambiar unidades
  checkProducto(elproducto, unidades) {
    let busca = this.itemsCarrito.map(function(e) { return e.url; }).indexOf(elproducto.url);
    if(busca != -1) { //existe el producto en el carrito
      //this.cambiaUnidadesProducto(elproducto, 1);
      this.cambiaUnidadesProducto(elproducto, unidades);
    }
    else {
      this.addCarritoConUnidades(elproducto, unidades);
      //this.addCarrito(elproducto);
    }
  }

  cambiaUnidadesProducto(item, unidades) {
    let indiceProducto = this.itemsCarrito.findIndex((indiceProducto) => indiceProducto.url == item.url );
    let tmpUnidades = this.itemsCarrito[indiceProducto].unidades + unidades;
    this.itemsCarrito[indiceProducto].unidades = tmpUnidades;
    this.actualizarCarrito();
  }

  sumaUnidadProducto(item) {
    let indiceProducto = this.itemsCarrito.findIndex((indiceProducto) => indiceProducto.url == item.url );
    let tmpUnidades = this.itemsCarrito[indiceProducto].unidades + 1;
    this.itemsCarrito[indiceProducto].unidades = tmpUnidades;
    this.actualizarCarrito();
  }

  restaUnidadProducto(item) {
    let indiceProducto = this.itemsCarrito.findIndex((indiceProducto) => indiceProducto.url == item.url );
    let tmpUnidades = this.itemsCarrito[indiceProducto].unidades - 1;
    if(tmpUnidades == 0) {
      this.eliminarProducto(item);
    }
    else {
      this.itemsCarrito[indiceProducto].unidades = tmpUnidades;
      this.actualizarCarrito();
    }

  }


  actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify((this.itemsCarrito)));
    this.subject.next(this.itemsCarrito);
  }


  /**
   * getCarrito
   */
  getCarrito(): Observable<Producto[]> {
    return this.subject;
  }

  /**
   * getTotal
   */
  getTotal() {
    return this.itemsCarrito.reduce((total, producto: Producto) => { return total + (producto.precio_rebajado * producto.unidades); }, 0);
  }

  getTotalFinal() {
    let totalBase = this.getTotal();
    let totalGastos = this.getTotalGastos();
    console.log(totalBase, ' | ', totalGastos);

    let resultado = totalGastos + totalBase;
    return resultado;
  }

  getTotalProductos() {
    return this.itemsCarrito.reduce((numProductos, producto: Producto) => { return numProductos + (producto.unidades); }, 0);
  }

  getTotalProductosGranel() {
    return this.itemsCarrito.reduce((numProductosGranel, producto: Producto) =>  {
      return (producto.a_granel ? numProductosGranel + (producto.unidades) : numProductosGranel);
    }, 0);
  }

  getTotalPesos() {
    return this.itemsCarrito.reduce((totalPeso, producto: Producto) =>  {
        return this.itemsCarrito.reduce((totalPeso, producto: Producto) => { return totalPeso + (producto.peso * producto.unidades); }, 0);
    }, 0);
  }

  getTotalGastos() {
    let total = this.getTotal();
    let peso = this.getTotalPesos() / 1000;

    this.gastosEnvio = 0;
    if(total < this.minCompraSinGastos) {
      if(peso <= 5) {
        return 5;
        //return 4.98;
      }
      else if(peso <= 10) {
        return 5;
        //return 7.30;
      }
      else if(peso <= 15) {
        return 5;
        //return 7.99;
      }
      else if(peso <= 20) {
        return 5;
        //return 9.61;
      }
      else if(peso <= 25) {
        return 5;
        //return 10.29;
      }
      else if(peso <= 30) {
        return 5;
        //return 10.87;
      }
      /*
      else if (peso > 30) {
        let pesoExtra = peso - 30;
        let costeEnvioTotal = 10.87 + (pesoExtra * 0.4);
        return costeEnvioTotal;
      }
      */
    }
    else {
      return 0;
    }
  }






 //INSERTAR ARTICULO EN EL CARRITO
  postArticuloUnidades(articulo, unidades) {
    let AuthToken = 'Bearer ' + JSON.parse(localStorage.getItem('token'));
    let url:string = this._datosService.urlApi + `carrito/articulo/unidades`;
      return this.http.post<any>(url, { articulo: articulo, unidades: unidades })
          .map(resp => {
              return resp;
          });
  }

  //ELIMINAR ARTICULO EN EL CARRITO
  deleteArticulo(articulo) {
    let AuthToken = 'Bearer ' + JSON.parse(localStorage.getItem('token'));
    let url:string = this._datosService.urlApi + `carrito/articulo/` + articulo;
      return this.http.delete<any>(url)
          .map(resp => {
              return resp;
          });
  }


   getArticulosCarrito(){
     let AuthToken = 'Bearer ' + JSON.parse(localStorage.getItem('token'));
     let url:string = this._datosService.urlApi + `carrito/`;

      return this.http.get<any>(url)
          .map(resp => {
              return resp;
          });
   }

   //GUARDAR LOS DATOS DE USUARIO
   postDatosUsuario(losdatos) {
     let AuthToken = 'Bearer ' + JSON.parse(localStorage.getItem('token'));
     let url:string = this._datosService.urlApi + `usuario/`;

     let nuevosDatos = losdatos;
     console.log('estoy enviando estos datos', nuevosDatos);

      return this.http.post<any>(url, {telefono: nuevosDatos['telefono'],razon: nuevosDatos['razon'],dni: nuevosDatos['dni'],nombre: nuevosDatos['nombre'], direccion: nuevosDatos['direccion'],poblacion: nuevosDatos['poblacion'],id_pais: nuevosDatos['id_pais'],id_provincia: nuevosDatos['id_provincia'], codigo_postal: nuevosDatos['codigo_postal']})
          .map(resp => {
              return resp;
          });
   }

   //GUARDAR LOS DATOS DE LA ORDER
   postDatosCarrito(losdatos){
     let AuthToken = 'Bearer ' + JSON.parse(localStorage.getItem('token'));
     let url:string = this._datosService.urlApi + `carrito/`;

     let nuevosDatos = losdatos;

      return this.http.post<any>(url, {telefono: nuevosDatos['telefono'],razon: nuevosDatos['razon'],nif: nuevosDatos['nif_dir_facturacion'],nombre: nuevosDatos['nombre'],nif_dir_facturacion: nuevosDatos['nif_dir_facturacion'],nombre_dir_facturacion: nuevosDatos['nombre_dir_facturacion'],direccion_dir_facturacion: nuevosDatos['direccion_dir_facturacion'],localidad_dir_facturacion: nuevosDatos['localidad_dir_facturacion'],pais_dir_facturacion: nuevosDatos['pais_dir_facturacion'],provincia_dir_facturacion: nuevosDatos['provincia_dir_facturacion'],codigo_dir_facturacion: nuevosDatos['codigo_dir_facturacion'],nombre_dir_envio: nuevosDatos['nombre_dir_envio'],direccion_dir_envio: nuevosDatos['direccion_dir_envio'],localidad_dir_envio: nuevosDatos['localidad_dir_envio'],pais_dir_envio: nuevosDatos['pais_dir_envio'],provincia_dir_envio: nuevosDatos['provincia_dir_envio'],codigo_dir_envio: nuevosDatos['codigo_dir_envio'],formaDeEnvio: nuevosDatos['formaDeEnvio'],formaDePago: nuevosDatos['formaDePago'], envioObservaciones: nuevosDatos['envioObservaciones']})
          .map(resp => {
              return resp;
          });
   }



  getOrderCarrito() {
    let AuthToken = 'Bearer ' + JSON.parse(localStorage.getItem('token'));
    let url:string = this._datosService.urlApi + `carrito/`;

     return this.http.get<any>(url)
         .map(resp => {
             return resp;
         });
  }



  notificarPedido () {
  let AuthToken = 'Bearer ' + JSON.parse(localStorage.getItem('token'));
  let url:string = this._datosService.urlNoti + `pedido-notificacion`;
  console.log(url);
   return this.http.get<any>(url)
       .map(resp => {
           return resp;
       });
     }

  redireccionarPedido () {
    let AuthToken = 'Bearer ' + JSON.parse(localStorage.getItem('token'));
    let url:string = this._datosService.urlNoti + `pedido-redireccion/` + localStorage.getItem('token');
     return this.http.get<any>(url)
         .map(resp => {
             return resp;
         });
  }


}
