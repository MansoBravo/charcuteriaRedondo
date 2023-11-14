import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})

export class DatosService {
  public urlApi: string = 'https://charcuredondo.com/api/';
  //public urlApi: string = 'http://localhost:4200/api/';
  //public urlNoti: string = "http://localhost:4200/";

  public urlNoti: string = 'https://charcuredondo.com/';

  public cookiesValue: boolean = true;
  public isCookies: boolean = false;
  public seccion: string;
  public primeraVisita: boolean = true;

  public menuOpen: boolean = false;
  public vistaCarrito: boolean = false;
  public vistaSubmenu: boolean = false;

  public arrDestacados: any = ['producto1', 'producto2', 'producto3', 'producto4', 'producto5', 'producto6', 'producto7', 'producto8'];
  destacadoActual: any = '';
  espera: number = 7000;
  indexActual: number;
  interval;

  public selectedIdioma: string = '';
  public globalScroll: boolean = true;

  public datosProducto: any;
  public categoriaBlog: any = '';


  constructor(
    public http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    private location: Location,
    private title: Title,
    private meta: Meta) {
    if (localStorage.getItem("isCookies") == "true") {
      this.isCookies = true;
    }
    if (localStorage.getItem("primeraVisita") == "false") {
      this.primeraVisita = false;
    }
  }

  getCorreosTexto() {
    let url: string = this.urlApi + `correos-automaticos/get-textocorreo/`;
    console.log("URL: " + url);
    return this.http.post<any>(url, { id: "correo_bienvenido_newsletter" })
      .map(resp => {
        console.log(resp);
        return resp;
      });

  }

  enviarCorreosAutomaticos(datos: any) {

    console.log(datos);
    let url: string = this.urlNoti + `correos-notificacion.php?asunto=` + datos[0].asunto + `&texto=` + datos[0].texto + `&destinatario=` + datos[0].destinatario;

    console.log("URL: " + url);
    return this.http.get<any>(url)
      .map(resp => {
        return resp;
      });

  }

  //PARA METAS

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateOgUrl(url: string) {
    this.meta.updateTag({ name: 'og:url', content: url })
  }

  updateDescription(desc: string) {
    this.meta.updateTag({ name: 'description', content: desc })
  }


  aceptaCookies() {
    if (this.cookiesValue) {
      localStorage.setItem("cookiesOpcionales", "true");
    } else {
      localStorage.setItem("cookiesOpcionales", "false");
      document.cookie = '_ga=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = '_gid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    localStorage.setItem("isCookies", "true");
    this.isCookies = true;
  }

  rechazaCookies() {
    this.isCookies = true;
    localStorage.setItem("isCookies", "false");
    localStorage.setItem("cookiesOpcionales", "false");
    document.cookie = '_ga=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = '_gid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  cookies(isChecked: boolean) {
    console.log(isChecked);
    if (isChecked) {
      this.cookiesValue = true;
    } else {
      this.cookiesValue = false;
    }
  }

  changeMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ponSeccion(esta) {
    this.seccion = esta;
  }

  isSeccionFija() {
    if (this.seccion == 'login') {
      return true;
    }
    else {
      return false;
    }
  }


  //noticias
  cambiaVistaSubmenu() {
    this.vistaSubmenu = !this.vistaSubmenu;
  }



  //PRODUCTOS..
  getProductos() {
    let url: string = this.urlApi + `productos/`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

  getProductosFiltrados(miCategoria) {
    let url: string = this.urlApi + `productos/`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {

        let datos = resp.filter((producto) => producto.id_categoria === miCategoria);
        return datos;
      });
  }

  getProducto(producto) {
    let url: string = this.urlApi + `productos/` + producto;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

  getCategorias() {
    let url: string = this.urlApi + `productos/categorias/`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

  //RECTAS

  getReceta(receta) {
    let url: string = this.urlApi + `recetas/` + receta;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

  getRecetas() {
    let url: string = this.urlApi + `recetas/`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

  getCategoriasRecetas() {
    let url: string = this.urlApi + `recetas/categorias/`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

  getTagsRecetas() {
    let url: string = this.urlApi + `recetas/tags/`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

  //FUCIONES DE CARRITO
  cambiaVistaCarrito() {
    this.vistaCarrito = !this.vistaCarrito;
  }

  getPaises() {
    let url: string = this.urlApi + `portes/paises`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }


  getIdioma() {
    if (this.selectedIdioma == '') {
      this.selectedIdioma = this.translate.getBrowserLang();
    }
    return this.selectedIdioma;
  }


  getCampo(campo) {
    if (this.selectedIdioma == '') {
      this.selectedIdioma = this.translate.getBrowserLang();
    }
    let campoidioma = campo;
    if (this.selectedIdioma != 'es') {
      campoidioma = campo + "_" + this.selectedIdioma;
    }
    return campoidioma;
  }


  getTexto(clave) {
    let url: string = this.urlApi + `preferencias/` + clave;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }


  createSlug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  volver() {
    this.location.back();
  }


  //Blog
  getCategoriasNoticias() {
    let url: string = this.urlApi + `noticias/categorias/`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

  getNoticias() {
    let url: string = this.urlApi + `noticias/`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

  getNoticia(laNoticia) {
    let url: string = this.urlApi + `noticias/` + laNoticia;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        this.datosProducto = resp;
        return this.datosProducto;
      });
  }




  filtraCategoriaBlog(idCategoria) {
    this.categoriaBlog = idCategoria;
  }


  limpiaFiltros() {
    this.categoriaBlog = '';
  }

  buscar(busqueda: string) {
    this.router.navigate(['tienda/', busqueda]);
  }

  filtrar_acentos(input: string) {

    var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
    var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
    for (var i = 0; i < acentos.length; i++) {
      input = input.replace(acentos.charAt(i), original.charAt(i)).toLowerCase();
    };
    return input;
  }

  getOpinionesHome() {
    let url: string = this.urlApi + `reviews/home`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

  getOpiniones() {
    let url: string = this.urlApi + `reviews/`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

  getPreguntasFrecuentes() {
    let url: string = this.urlApi + `preguntasfrecuentes/`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

  registroNewsletter(email: string) {
    return this.http.post<any>(this.urlApi + 'formularios/newsletter/registro/', { email: email })
      .map(resp => {
        return resp;
      });
  }

  getCodigoBanner() {
    let url: string = this.urlApi + `codigos/banner`;
    let headers = new HttpHeaders({
    })
    return this.http.get(url, { headers: headers })
      .map((resp: any) => {
        return resp;
      });
  }

}
