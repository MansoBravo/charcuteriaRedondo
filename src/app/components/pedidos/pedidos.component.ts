import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';
import { TranslateService } from '@ngx-translate/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-pedidos',
  templateUrl: 'pedidos.component.html',
  styles: [],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PedidosComponent implements OnInit {
  ordersUsuario:any;
  vistaApartado:boolean = false;
  displayedColumns: string[];
  displayedArticulos: string[];
  selection: any;
  
  constructor(public router: Router, public autenticacionService:AutenticacionService, private translate: TranslateService, public datosService: DatosService, private carritoService: CarritoService) { }

  ngOnInit() {
      this.vistaApartado = false;
      this.sacaApartado();
      this.getOrders();
      setTimeout(() => {
        this.ordersUsuario.forEach(order => {
          order.creation_date = order.creation_date.split(' ', 1);
          order.articulos.forEach(articulo => {
            this.datosService.getProducto(articulo.articulo).subscribe(datos => {
              articulo.producto = datos;
            });
          });
        });
      }, 2000);
      this.displayedColumns = ['id', 'creation_date', 'pvp_total', 'repetir'];
      this.displayedArticulos = ['nombre', 'cantidad', 'precio_unidad', 'select'];
      this.selection = new SelectionModel<any>(true, []);

  }
  
  sacaApartado() {
    setTimeout(() => {
      this.vistaApartado = true;
    }, 1000);
  }
  repetirPedido(articulos) {
    articulos.forEach(articulo => {
      this.carritoService.addCarritoConUnidades(articulo.producto, articulo.unidades);
    });
    this.router.navigate(['/carrito']);
  }

  public getOrders() {
    this.autenticacionService.getUsuarioOrders().subscribe(data => {
      this.ordersUsuario = data;
  },
    error => {
      this.router.navigate(['/login']);
      //console.log(error);
    }
  );
  }

  isAllSelected(articulos) {
    const numSelected = this.selection.selected.length;
    const numRows = articulos.length;
    return numSelected === numRows;
  }

  masterToggle(articulos) {
    this.isAllSelected(articulos) ?
        this.selection.clear() :
        articulos.forEach(row => this.selection.select(row));
  }
}

