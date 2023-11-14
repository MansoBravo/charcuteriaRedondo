import { Component, OnInit, HostListener, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';
import { TranslateService } from '@ngx-translate/core';
import { AutenticacionService } from '../../services/autenticacion.service';
import { ConstantPool } from '@angular/compiler';
import { timer } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})


export class HeaderComponent implements OnInit {

  fixed: boolean = false;
  apartados: any = [{ name: 'tienda', link: '' }, { name: 'redondo', link: 'redondo' }, { name: 'preguntas frecuentes', link: 'preguntas-frecuentes' }, { name: 'contacto', link: 'contacto' }, { name: 'blog', link: 'blog' }];
  apartadosTodos: any = ['tienda', 'redondo', 'contacto', 'blog', 'como-comprar'];
  apartadosSecundarios: any = ['aviso-legal', 'politica-de-privacidad', 'politica-de-cookies'];
  inicioSesion: any = { name: 'inicio-sesion', link: 'login' };
  cierreSesion: any = { name: 'cerrar-sesion', link: '' };
  misPedidos: any = { name: 'mis-pedidos', link: 'pedidos' };
  numProductos: number;
  currentLang: any = '';
  categorias: any = [];
  categoriasPrincipales: any = [];
  rutaCategoria: string = '';

  isScrolled: boolean = false;
  scrollLimit: number = 0;

  _second = 1000;
  _minute = this._second * 60;
  _hour = this._minute * 60;
  _day = this._hour * 24;
  end: any;
  now: any;
  day: any;
  hours: any;
  minutes: any;
  seconds: any;
  source = timer(0, 1000);
  clock: any;

  descuentoHeader: any = '';
  codigo: any;
  contadorFin: any;

  constructor(
    private router: Router,
    public _datosService: DatosService,
    private translate: TranslateService, private carritoService: CarritoService, private el: ElementRef, private renderer: Renderer2, private autenticacionService: AutenticacionService) {
  }


  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.scrollLimit = 0;
    //this.scrollLimit = this.cabecera.nativeElement.offsetTop - 100;
    if (window.pageYOffset > this.scrollLimit) {
      this.isScrolled = true;
      this._datosService.globalScroll = true;
    }
    else {

      this.isScrolled = false;
      this._datosService.globalScroll = false;
    }
  }


  ngOnInit() {
    this._datosService.getCodigoBanner().subscribe(datos => {
      this.codigo = datos;
      this.descuentoHeader = datos.codigo;
      this.contadorFin = new Date(datos.fecha_fin);
    });

    this.clock = this.source.subscribe(t => {
      this.now = new Date();
      this.end = this.contadorFin;
      this.showDate();
    });

    this.carritoService.getCarrito().subscribe(data => {
      this.numProductos = this.carritoService.getTotalProductos();
    },
      error => alert(error));

    //Cargamos las categorias...
    this._datosService.getCategorias().subscribe(datos => {
      this.categorias = datos;
      //ORDENO POR POSITION
      this.categorias.sort((val1, val2) => { return val2.position - val1.position });

      //filtro por las principales...
      this.categoriasPrincipales = this.categorias.filter((categoria) => categoria.owner_id == 0);
    });

  }

  getLang() {
    if (this.currentLang) {
      return this.currentLang;
    }
    else {
      return this.translate.getBrowserLang();
    }
  }

  public get usuario(): boolean {
    return (localStorage.getItem('authenticated') == 'si');
  }

  logout() {
    this.autenticacionService.logout();
    this.router.navigate(['/login']);
  }

  showDate() {
    let distance = this.end - this.now;
    this.day = Math.floor(distance / this._day).toString().padStart(2, '0');
    this.hours = Math.floor((distance % this._day) / this._hour).toString().padStart(2, '0');
    this.minutes = Math.floor((distance % this._hour) / this._minute).toString().padStart(2, '0');
    this.seconds = Math.floor((distance % this._minute) / this._second).toString().padStart(2, '0');
  }

}
