import { Component, OnInit, HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute} from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Location } from '@angular/common';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-receta',
  templateUrl: './receta.component.html'
})
export class RecetaComponent implements OnInit {

  rutaReceta:string = '';
  categorias:any = [];
  receta:any = [];
  recetaNombre:string;
  recetaDescripcion: string;

  categoriasProductos:any = [];
  productos:any = [];
  productosFiltrados:any = [];
  vistaApartado:boolean = false;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    public _datosService:DatosService,
    private carritoService: CarritoService,
    private formBuilder: FormBuilder,
    private location: Location,
    private meta:Meta
  ) { }

  ngOnInit() {
    this._datosService.ponSeccion('recetas');


    this.activatedRoute.url.subscribe( url=> {
        if(this.activatedRoute.snapshot.url.length > 1) {
          this.rutaReceta = this.activatedRoute.snapshot.url[1].path;
        }

        this._datosService.getCategorias().subscribe(datos => {
          this.categoriasProductos = datos;
        });

        //Cargamos las categorias...
        this._datosService.getCategoriasRecetas().subscribe(datos => {
          this.categorias = datos;

          this._datosService.getReceta(this.rutaReceta).subscribe(datos => {
            this.receta = datos;

            if(this._datosService.getIdioma() == 'en' ) {
              this.recetaNombre = this.receta['title_en'];
              this.recetaDescripcion = this.receta['meta_descripcion'];
            }
            else {
              this.recetaNombre = this.receta['title'];
              this.recetaDescripcion = this.receta['meta_descripcion'];
            }

            this.meta.updateTag({ name: 'title', content: 'Agroinnova Calidad | ' + this.recetaNombre});
            this.meta.updateTag({ name: 'description', content: this.recetaDescripcion});


            this.sacaApartado();

            this.productosFiltrados = [];

            //Cargamos los productos
            this._datosService.getProductos().subscribe(datos => {
              this.productos = datos;
              //FILTRO POR LA RECETA...
              this.productosFiltrados =  this.productos.filter((producto) => this.receta.productos.find((tag) => tag.tag_id === producto.id));
            });


            //ORDENO POR POSITION
            this.productosFiltrados.sort((val1, val2)=> {return val2.position - val1.position});
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


  getNombreCategoria(idCategoria) {
    let categoria = this.categorias.find((cat) => cat.id === idCategoria);
    return categoria.nombre;
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



  volver() {
    this.location.back();
  }


}
