import { Component, OnInit, HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute} from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.component.html'
})
export class RecetasComponent implements OnInit {

  vistaApartado:boolean = false;
  categorias:any = [];
  categoriaSeleccionada:any = [];
  rutaCategoria:string = '';
  recetas:any = [];
  recetasFiltradas:any = [];
  recetasFiltradasActivas:any = [];
  tags:any = [];
  buscadorOpen:boolean = false;

  isScrolled:boolean = false;
  scrollLimit:number =  0;
  form: FormGroup;
  arrFiltros:any = [];

  constructor(private activatedRoute:ActivatedRoute,
    private router: Router,
    public _datosService:DatosService,
    private carritoService: CarritoService,
    private translate: TranslateService,
    private formBuilder: FormBuilder) {
      this.form = this.formBuilder.group({});
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
              this.isScrolled = false;
            }
    }

    ngOnInit() {
      this._datosService.ponSeccion('recetas');

      this.activatedRoute.url.subscribe( url=> {
          this.vistaApartado = false;
          if(this.activatedRoute.snapshot.url.length > 1) {
            this.rutaCategoria = this.activatedRoute.snapshot.url[1].path;
          }
          //Cargamos los tags ....
          this._datosService.getTagsRecetas().subscribe(datos=> {
            this.tags = datos;

            const controls = this.tags.map(c => new FormControl(false));

            this.form = this.formBuilder.group({
              tags: new FormArray(controls)
            });

            this.form.valueChanges.subscribe(() => {
              this.recogeFiltros();
            });
          })

          //Cargamos las categorias...
          this._datosService.getCategoriasRecetas().subscribe(datos => {
            this.categorias = datos;
            //ORDENO POR POSITION
            this.categorias.sort((val1, val2)=> {return val2.position - val1.position});
            this.categoriaSeleccionada = [];

            if(this.rutaCategoria) {
              let indiceCategoria = this.categorias.findIndex((indiceCategoria) => indiceCategoria.url == this.rutaCategoria );
              this.categoriaSeleccionada = this.categorias[indiceCategoria];
            }
            this.getRecetas();
          });
        }
      );
    }

    sacaApartado() {
      setTimeout(() => {
        this.vistaApartado = true;
      }, 1000);
    }

    changeBuscador() {
      this.buscadorOpen =! this.buscadorOpen;
    }

    getRecetas() {
      this._datosService.getRecetas().subscribe(datos => {
        this.recetas = datos;
        this.sacaApartado();
        //FILTRO POR CATEGORÍA SI ESTÁ SELECCIONADA
        if(this.categoriaSeleccionada['id']) {
          console.log('hay categoria seleccionada y es...', this.categoriaSeleccionada['id']);
          this.recetasFiltradas =  this.recetas.filter((receta)=> receta.category_id == this.categoriaSeleccionada['id'] );
        }
        else {
          this.recetasFiltradas =  this.recetas;
        }


        //SI HAY FILTROS SELECCIONADOS
        if(this.arrFiltros.length != 0) {
          this.recetasFiltradasActivas = [];
          this.recetasFiltradas.forEach(receta => {
            this.compruebaFiltros(receta);
          });
        }


        //ORDENO POR POSITION
        this.recetasFiltradas.sort((val1, val2)=> {return val2.position - val1.position});

      });

    }

    getNombreCategoria(idCategoria) {
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


    recogeFiltros() {
     const selectedFiltros = this.form.value.tags
       .map((v, i) => v ? this.tags[i].id : null)
       .filter(v => v !== null);


       this.arrFiltros = selectedFiltros;
       this.getRecetas();

    }

    compruebaFiltros(receta) {
        let tagsCoincidentes = 0;
        this.arrFiltros.forEach((filtro)=> {
        tagsCoincidentes += receta.tags.reduce((numTags, tag) =>  {
            return (tag.tag_id == filtro ? numTags + 1 : numTags);
        }, 0);

          if (tagsCoincidentes > 0) {
            let busca = this.recetasFiltradasActivas.map(function(r) { return r.url; }).indexOf(receta.url);
            if(busca == -1) { //NO existe la receta en el array de los filtros
              this.recetasFiltradasActivas.push(receta);
            }
          }

        });

        this.recetasFiltradas = this.recetasFiltradasActivas;
      }


}
