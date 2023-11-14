import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute} from '@angular/router';
import { Directive, ElementRef,Renderer} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html'
})
export class BlogComponent implements OnInit {
  vistaApartado:boolean = false;
  apartado: string = "";
  private categorias:any[];
  private tags:any[];
  private noticias: any[];
  private noticiasFiltradas: any[];
  private noticia: any[];
  private ordenarValues: any[];

  isNoticia: boolean = false;
  nombreCategoria:any = [];
  categoria:any = [];
  tag:any = [];

  constructor(public _datosService:DatosService, private activatedRoute:ActivatedRoute, private router: Router, private meta:Meta) { }

  ngOnInit() {
    this.ordenarValues = [
      {id: 1, val: "Más recientes"}, 
      {id: 2, val: "Más antiguas"}
    ];
    this._datosService.ponSeccion('redondo');
    this.activatedRoute.url.subscribe( url=> {
      let ruta = this.activatedRoute.snapshot.url[0].path;
      this._datosService.ponSeccion(ruta);
      this.sacaApartado();
      this.vistaApartado = false;
      this.isNoticia = false;
      const fixDateForAllBrowsers = dateString => dateString.replace(/-/g, '/');

      this._datosService.getCategoriasNoticias().subscribe(datos => {
        this.categorias = datos;


        this._datosService.getNoticias().subscribe(datos=>{
          this.noticias = datos;
          this.noticias = this.noticias.filter((noticia)=> noticia.publicado);


          //limpiar categorias sin noticias...
          this.categorias = this.categorias.filter((categoria)=> this.tieneNoticias(categoria.id));

          if(this._datosService.categoriaBlog != '') {
            this.noticiasFiltradas = this.noticias.filter((noticia)=> noticia.category_id == this._datosService.categoriaBlog );
            this.nombreCategoria = this.getCategoria(this._datosService.categoriaBlog);
          }
          else {
            this.noticiasFiltradas = this.noticias;
          }
          //ORDENO POR POSITION
          this.noticiasFiltradas.sort((val1, val2)=> {return Number(moment(val2.publishing_date)) - Number(moment(val1.publishing_date))});

          //SI ESTAMOS EN UNA NOTICIA...
          if(this.activatedRoute.snapshot.url.length > 1) {
            let rutaNoticia = this.activatedRoute.snapshot.url[1].path;
            let ogRuta = this.router.url;
            this._datosService.getNoticia(rutaNoticia).subscribe(datos=> {
              this.noticia = datos;

              this._datosService.updateTitle(this.noticia['meta_titulo']);
              //Updating Description tag dynamically with title
              this._datosService.updateDescription(this.noticia['meta_descripcion']);
              this.meta.updateTag({ property: 'og:url', content: ogRuta });
              this.meta.updateTag({ property: 'og:title', content: this.noticia['meta_titulo'] });
              this.meta.updateTag({ property: 'og:description', content: this.noticia['meta_descripcion'] });
              this.meta.updateTag({ property: 'og:image', content: this.noticia['imagenes'][0].path});
              this.meta.updateTag({ property: 'og:image:secure_url', content: this.noticia['imagenes'][0].path});
              this.meta.updateTag({ name: 'twitter:title', content: this.noticia['meta_titulo'] });
              this.meta.updateTag({ name: 'twitter:description', content: this.noticia['meta_descripcion'] });
              this.meta.updateTag({ name: 'twitter:image', content: this.noticia['imagenes'][0].path});
              this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image'});
              


              this.noticia['miCategoria'] = this.getCategoria(this.noticia['category_id']);
              this.isNoticia = true;
              //filtramos por su categoria y eliminamos la actual
              this.noticiasFiltradas = this.noticias.filter((noticia)=> noticia.category_id == this.noticia['category_id'] );
              this.noticiasFiltradas = this.noticias.filter((noticia)=> noticia.id != this.noticia['id'] );
            })
          }
          else {
            this._datosService.updateTitle('Blog Redondo Charcutería Carnicería online Valladolid|Lechazo|Cochinillo');
            this._datosService.updateOgUrl('');
            //Updating Description tag dynamically with title
            this._datosService.updateDescription('Redondo Carnicería, servicio a domicilio en Valladolid y provincia. Carne de ternera, lechazo, jamón, embutidos, vino, charcutería de elaboración propia.');
          }
        })
      })
    });

  }

  devuelveFecha(fecha) {
    return moment(fecha);
  }
  ordenarBlog(value) {
    if(value == 1) {
      this.noticiasFiltradas.sort((val1, val2)=> {return Number(moment(val2.publishing_date)) - Number(moment(val1.publishing_date))});
    } else {
      this.noticiasFiltradas.sort((val1, val2)=> {return Number(moment(val1.publishing_date)) - Number(moment(val2.publishing_date))});
    }
  }

  getCategoria(id) {
    let miCategoria = this.categorias.findIndex((categoria) => categoria.id == id );
    return (this.categorias[miCategoria]['nombre']);
  }

  sacaApartado() {
    setTimeout(() => {
      this.vistaApartado = true;
    }, 1500);
  }

  tieneNoticias(idCategoria) {
    let busca = this.noticias.map(function(noticia) { return noticia.category_id; }).indexOf(idCategoria);
    if(busca != -1) {
      return true;
    }
  }

  filtra(id) {
    this._datosService.filtraCategoriaBlog(id);
    this.noticiasFiltradas = this.noticias;
    if(id != '') {
      this.noticiasFiltradas = this.noticias.filter((noticia)=> noticia.category_id == this._datosService.categoriaBlog );
    }
    this.nombreCategoria = this.getCategoria(this._datosService.categoriaBlog);
  }

  getNombreCategoria() {
    return this.getCategoria(this._datosService.categoriaBlog);
  }



}
