import { Component, OnInit, HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute} from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { AutenticacionService } from '../../services/autenticacion.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {

  textoHome:string = '';
  opinionDestacada:string = '';

  public buscadorOpen:boolean = false;

  vistaApartado:boolean = false;


  categorias:any = []; //TODAS LAS CATEGORIAS
  categoriaSeleccionada:any = []; //CATEGORIA PADRE
  categoriaSeleccionada2:any = []; //CATEGORIA HIJA
  subCategorias:any = []; //SUBCATEGORIAS (SI HAY)

  rutaCategoria:string = ''; //URL CATEGORIA PADRE
  rutaCategoria2:string = '';  //URL CATEGORIA HIJA

  productos:any = [];
  productosFiltrados:any = [];

  isScrolled:boolean = false;
  scrollLimit:number =  0;

  formCategorias: FormGroup;

  textoImagenHome: string = '';
  imagenHome:any = [];

  opinionesHome:any = [];


  form: FormGroup;
  filtros = [
  { id: 'es_novedad', name: 'novedad' },
  { id: 'es_oferta', name: 'oferta' }];

  /*
  filtros = [
  { id: 'es_novedad', name: 'novedad' },
  { id: 'es_oferta', name: 'oferta' },
  { id: 'tierra_de_sabor', name: 'tierra' }];
  */

  arrFiltros:any = [];

  busqueda:string = '';

  constructor( private activatedRoute:ActivatedRoute,
    private router: Router,
    public _datosService:DatosService,
    private carritoService: CarritoService,
    public formBuilder: FormBuilder) {

    const controls = this.filtros.map(c => new FormControl(false));
    //controls[0].setValue(true);

    this.form = this.formBuilder.group({
      filtros: new FormArray(controls)
    });

    this.form.valueChanges.subscribe(() => {
      this.recogeFiltros();
    });
  }

  //seleccionamos el div "banda" como punto de inflexión para poner fixed
@ViewChild("banda", {read: ElementRef}) banda: ElementRef;
@HostListener("window:scroll", [])
    onWindowScroll() {
        this.scrollLimit = this.banda.nativeElement.offsetTop - 100;
        if(window.pageYOffset > this.scrollLimit) {
          this.isScrolled = true;
        }
        else {
          this.isScrolled = true;
        }
}

  get formData() { return <FormArray>this.form.get('filtros'); }

  recogeFiltros() {
   const selectedFiltros = this.form.value.filtros
     .map((v, i) => v ? this.filtros[i].id : null)
     .filter(v => v !== null);

     this.arrFiltros = selectedFiltros;

     this.getProductos();

  }

  changeBuscador() {
    this.buscadorOpen =! this.buscadorOpen;
  }


  ngOnInit() {
    this._datosService.ponSeccion('productos');
    this.isScrolled = false;


    this._datosService.getTexto('opinion-destacada').subscribe(datos => {
      console.log(datos.text_1);
      this.opinionDestacada = datos.text_1;
    });

    this._datosService.getTexto('texto-home').subscribe(datos=> {
      console.log(datos.text_1);
      this.textoHome = datos.text_1;
      
    });

    this._datosService.getTexto('1').subscribe(datos=>{
      this.textoImagenHome = datos.text_1;
      this.imagenHome = datos.imagenes[0];
      if(this.imagenHome.mime_type.includes('png')) {
        this.imagenHome.extension = '.png';
      } else {
        this.imagenHome.extension = '.jpg';
      } 
    });
    this._datosService.getOpinionesHome().subscribe(datos =>{
      this.opinionesHome = datos;
    });
    
    this.activatedRoute.url.subscribe( url=> {
        if(localStorage.getItem('token') != null) {
        }
        this.vistaApartado = false;
        this.categoriaSeleccionada2 = [];

        if(this.activatedRoute.snapshot.url.length > 1) {
          this.rutaCategoria = this.activatedRoute.snapshot.url[1].path; //CATEGORIA PADRE
          if(this.activatedRoute.snapshot.url.length > 2) {
            this.rutaCategoria2 = this.activatedRoute.snapshot.url[2].path; //CATEGORIA HIJA
          }

        }
        //Cargamos las categorias...
        this._datosService.getCategorias().subscribe(datos => {
          this.categorias = datos;
          //ORDENO POR POSITION
          this.categorias.sort((val1, val2)=> {return val2.position - val1.position});
          this.categoriaSeleccionada = [];
          
          if(this.rutaCategoria) {
            let indiceCategoria = this.categorias.findIndex((indiceCategoria) => indiceCategoria.url == this.rutaCategoria );
            if(indiceCategoria != -1) {
               this.categoriaSeleccionada = this.categorias[indiceCategoria];

              if(this.rutaCategoria2) {
                let indiceCategoria2 = this.categorias.findIndex((indiceCategoria2) => indiceCategoria2.url == this.rutaCategoria2 );
                this.categoriaSeleccionada2 = this.categorias[indiceCategoria2];
              }


              //SACO SUBCATEGORIAS ...
              this.subCategorias = this.categorias.filter((categoria)=> categoria.owner_id == this.categoriaSeleccionada['id'] );

              //SI HAY SUBCATEGORIAS Y NO ESTÁ PICADA NINGUNA PICO LA PRIMERA ...
              if(this.subCategorias.length > 0 && !this.rutaCategoria2 ) {
                this.router.navigate(['/tienda/' + this.rutaCategoria + "/" + this.subCategorias[0].url]);
              }
            } else {
              this.busqueda = this.rutaCategoria;
            }
          }
          this.getProductos();
        });
      }
    );


  }

  sacaApartado() {
    setTimeout(() => {
      this.vistaApartado = true;
    }, 1000);
  }


  getProductos() {
    this._datosService.getProductos().subscribe(datos => {
      this.productos = datos;
      this.sacaApartado();

      //FILTRO POR CATEGORÍA SI ESTÁ SELECCIONADA LA HIJA
      if(this.categoriaSeleccionada['id']) {
          this._datosService.updateTitle(this.categoriaSeleccionada['meta_titulo'] + ' | Redondo Charcutería Carnicería');
          this._datosService.updateOgUrl(this.rutaCategoria);
          //Updating Description tag dynamically with title
          this._datosService.updateDescription(this.categoriaSeleccionada['meta_descripcion']);

          if(this.categoriaSeleccionada2['id']) {
            //SACAMOS LOS PRODUCTOS DE LA HIJA
            this.productosFiltrados =  this.productos.filter((producto)=> producto.id_categoria == this.categoriaSeleccionada2['id'] );
          }
          else {
            //SACAMOS LOS PRODUCTOS DE LA MADRE
            if(this.subCategorias.length) {
              this.productosFiltrados =  this.productos.filter((producto)=> this.checkProducto(producto));
            }
            else {
              //LA MADRE ES CATEGORIA FINAL
              this.productosFiltrados =  this.productos.filter((producto)=> producto.id_categoria == this.categoriaSeleccionada['id'] );
            }
          }
      }
      else if(this.busqueda) {
        this.productosFiltrados = this.productos.filter((producto)=> this._datosService.filtrar_acentos(producto.nombre.toLowerCase()).indexOf(this._datosService.filtrar_acentos(this.busqueda.toLowerCase())) > -1);

        this._datosService.updateTitle('Redondo Charcutería Carnicería a Domicilio, donde comprar carne online en Valladolid');
        this._datosService.updateOgUrl('');
        //Updating Description tag dynamically with title
        this._datosService.updateDescription('Podrás comprar carne online en toda la provincia de Valladolid gracias a nuestro servicio de carnicería a domicilio');
      }
      else { //SIN CATEGORIA = DESTACADOS
        this.productosFiltrados =  this.productos;
        this.productosFiltrados = this.productosFiltrados.filter((producto)=> producto.destacado );

        this._datosService.updateTitle('Redondo Charcutería Carnicería a Domicilio, donde comprar carne online en Valladolid');
        this._datosService.updateOgUrl('');
        //Updating Description tag dynamically with title
        this._datosService.updateDescription('Podrás comprar carne online en toda la provincia de Valladolid gracias a nuestro servicio de carnicería a domicilio');
      }


      this.productosFiltrados = this.productosFiltrados.filter((producto)=> producto.publicado );

      //FILTRO POR arrFiltros SI HAY
      if(this.arrFiltros.length > 0) {

      this.arrFiltros.forEach(filtro => {
        if(filtro == 'es_oferta') {
          this.productosFiltrados =  this.productosFiltrados.filter((producto)=> producto.precio > producto.precio_rebajado );
        }
        else {
          this.productosFiltrados =  this.productosFiltrados.filter((producto)=> producto[filtro] == true );
        }
        });
      }

      //ORDENO POR POSITION
      this.productosFiltrados.sort((val1, val2)=> {return val2.position - val1.position});



    });

  }

  //chekear producto en categoria padre...
  checkProducto(elproducto) {
    let busca = this.subCategorias.map(function(categoria) { return categoria.id; }).indexOf(elproducto.id_categoria);
    if(busca != -1) { //existe el producto en el la categoria padre
      return true;
    }

  }

  isOferta(producto) {
    if(producto.precio > producto.precio_rebajado) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * addProducto al carrito
   */
  addProducto(producto) {
    this.carritoService.checkProducto(producto, 1);
  }

}
