import { Component, OnInit } from '@angular/core';
import { Producto } from '../../model/producto';
import { Subscription } from 'rxjs/Subscription';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';
import { Location } from '@angular/common';

import { AuthGuard } from '../../guards/auth.guards';
import { JwtInterceptorProvider } from '../../helpers/jwt.interceptor';
import { ErrorInterceptorProvider } from '../../helpers/error.interceptor';

import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html'
})
export class CarritoComponent implements OnInit {
  vistaApartado:boolean = false;

  public carrito: Array<Producto> = [];
  public subscription: Subscription;
  public total: number;
  public totalFinal: number;
  public numProductos: number;
  public numProductosGranel: number;
  public totalPeso: number;
  public totalGastos: number;



  constructor( public _datosService:DatosService, private carritoService: CarritoService, private location: Location) { }

  ngOnInit() {
    this.subscribeCarrito();
    this._datosService.ponSeccion('login');
    this._datosService.updateTitle('Redondo Charcutería Carnicería online Valladolid|Lechazo|Cochinillo');
    this._datosService.updateOgUrl('');
    //Updating Description tag dynamically with title
    this._datosService.updateDescription('Redondo Carnicería, servicio a domicilio en Valladolid y provincia. Carne de ternera, lechazo, jamón, embutidos, vino, charcutería de elaboración propia.');

    this.sacaApartado();

  }

  sacaApartado() {
    setTimeout(() => {
      this.vistaApartado = true;
    }, 1000);
  }

  subscribeCarrito() {
    this.carritoService.getCarrito().subscribe(data => {
      this.carrito = data;
      this.total = this.carritoService.getTotal();
      this.numProductos = this.carritoService.getTotalProductos();
      this.numProductosGranel = this.carritoService.getTotalProductosGranel();
      this.totalPeso = this.carritoService.getTotalPesos();
      this.totalGastos = this.carritoService.getTotalGastos();
      this.totalFinal = this.carritoService.getTotalFinal();
      this.isValidoGranel();
    },
      error => alert(error));
  }

  actualizarUnidades(item, unidades) {
    let tmpUnidades = unidades + 1;
    this.carritoService.cambiaUnidadesProducto(item, tmpUnidades);
  }

  sumar(item) {
    this.carritoService.sumaUnidadProducto(item);
  }

  restar(item) {
      this.carritoService.restaUnidadProducto(item);
  }

  //AÑADIR UN PRODUCTO AL CARRITO
  addProducto(producto) {
      this.carritoService.addCarrito(producto);
  }

  //ELIMINIAR UN PRODUCTO DEL CARRITO
  eliminar(item) {
    this.carritoService.eliminarProducto(item);
  }

  //BORRAR TODOS LOS PRODUCTOS DEL CARRITO
  borrarCarrito() {
    this.carritoService.clearCarrito();
  }

  isValidoGranel() {
    if(this.numProductosGranel == 0) {
      return true;
    }else if(this.numProductosGranel > 0 && this.numProductosGranel%4 == 0) {
      return true;
    }
  }

  volver() {
    this.location.back();
  }
}
