import { Component, OnInit, HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute} from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Location } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html'
})
export class ProductoComponent implements OnInit {

  rutaProducto:string = '';
  categorias:any = [];
  producto:any = [];
  productoFoto:string = '';
  productoIdCategoria:string = '';
  productos:any = [];
  nombreProducto: string;
  descripcionProducto: string;
  categoriasRecetas:any = [];
  recetas:any = [];
  recetasFiltradas:any = [];

  productosFiltrados:any = [];
  productosRelacionados:any = [];
  unidades:number = 1;

  vistaApartado:boolean = false;



  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    public _datosService:DatosService,
    private carritoService: CarritoService,
    private formBuilder: FormBuilder,
    private location: Location,
    private translate: TranslateService,
    private meta:Meta
  ) { }

  ngOnInit() {
    this._datosService.ponSeccion('producto');
    this.unidades = 1;
    this.activatedRoute.url.subscribe( url=> {
        if(this.activatedRoute.snapshot.url.length > 1) {
          this.rutaProducto = this.activatedRoute.snapshot.url[1].path;
          this.unidades = 1;
        }

        this._datosService.getCategoriasRecetas().subscribe(datos => {
          this.categoriasRecetas = datos;
        });

        //Cargamos las categorias...
        this._datosService.getCategorias().subscribe(datos => {
          this.categorias = datos;

          this._datosService.getProducto(this.rutaProducto).subscribe(datos => {
            this.producto = datos;
            this.productoFoto = this.producto.imagenes[0].path;
            this.productoIdCategoria = this.producto.id_categoria;

            //console.log(this.producto);

            if(this._datosService.getIdioma() == 'en' ) {
              this.nombreProducto = this.producto['nombre_en'];
              this.descripcionProducto = this.producto['descripcion_en'];
            }
            else {
              this.nombreProducto = this.producto['nombre'];
              this.descripcionProducto = this.producto['descripcion'];
            }
            let ogRuta = this.router.url;

            this._datosService.updateTitle('Redondo Charcutería Carnicería | ' + this.producto['meta_titulo']);
            this._datosService.updateOgUrl(this.rutaProducto);
            //Updating Description tag dynamically with title
            this._datosService.updateDescription(this.producto['meta_descripcion']);

            this.meta.updateTag({ property: 'og:url', content: ogRuta });
            this.meta.updateTag({ property: 'og:title', content: this.producto['meta_titulo'] });
            this.meta.updateTag({ property: 'og:description', content: this.producto['meta_descripcion'] });
            this.meta.updateTag({ property: 'og:image', content: this.productoFoto});
            this.meta.updateTag({ property: 'og:image:secure_url', content: this.productoFoto});
            this.meta.updateTag({ name: 'twitter:title', content: this.producto['meta_titulo'] });
            this.meta.updateTag({ name: 'twitter:description', content: this.producto['meta_descripcion'] });
            this.meta.updateTag({ name: 'twitter:image', content: this.productoFoto});
            this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image'});

            //this.meta.updateTag({ name: 'title', content: 'Redondo Charcutería Carnicería | ' + this.producto['meta_titulo']});
            //this.meta.updateTag({ name: 'description', content: this.producto['meta_descripcion']});




            this.sacaApartado();
            //Cargamos los productos de igual categoria ...
            this._datosService.getProductosFiltrados(this.producto['id_categoria']).subscribe(datos => {
              this.productosFiltrados = datos;
              //Eliminamos el producto actual de los relacionados
              this.productosFiltrados =  this.productosFiltrados.filter((producto)=> producto.id != this.producto['id'] );
            });


            this.productosRelacionados = [];

            //Cargamos los productos
            this._datosService.getProductos().subscribe(datos => {
              this.productosRelacionados = [];
              this.productos = datos;
              //FILTRO POR LA RECETA...
              this.productosRelacionados =  this.productos.filter((producto) => this.producto.productos_relacionados.find((tag) => tag.id_producto_relaccionado === producto.id));
              //ORDENO POR POSITION
              this.productosRelacionados.sort((val1, val2)=> {return val2.position - val1.position});
            });





            //Cargamos las recetas
            this._datosService.getRecetas().subscribe(datos => {
              this.recetas = datos;
              //FILTRO POR CATEGORÍA SI ESTÁ SELECCIONADA
              if(this.producto['id']) {
                this.recetasFiltradas =  this.recetas.filter((receta) => receta.productos.find((producto) => producto.tag_id === this.producto.id));
              }
            });
          });

        });
      }
    );
  }

  sacaApartado() {
    setTimeout(() => {
      this.vistaApartado = true;
    }, 500);
  }

  isOferta(producto) {
    if(producto.precio > producto.precio_rebajado) {
      return true;
    }
    else {
      return false;
    }
  }

  isActivo(producto) {
    if(!producto.fuera_de_temporada && !producto.en_reposicion) {
      return true;
    }
    else {
        return false;
      }
  }

  restar() {
    if(this.unidades > 1) {
      this.unidades--;
    }
  }

  sumar() {
    this.unidades++;
  }

  getNombreCategoria(idCategoria) {
    let categoria = this.categoriasRecetas.find((cat) => cat.id === idCategoria);
    return categoria.nombre;
  }

  getNombreCategoriaProducto(idCategoria) {
    let categoria = this.categorias.find((cat) => cat.id === idCategoria);

    if(this._datosService.selectedIdioma == '') {
      this._datosService.selectedIdioma = this.translate.getBrowserLang();
    }
    let campoidioma = 'nombre';
    if(this._datosService.selectedIdioma != 'es') {
      campoidioma = "nombre_" + this._datosService.selectedIdioma;
    }
    return categoria[campoidioma];
  }




  /**
   * addProducto al carrito
   */
  addProducto(producto) {
    this.carritoService.checkProducto(producto, this.unidades);
  }

  volver() {
    this.location.back();
  }


}
