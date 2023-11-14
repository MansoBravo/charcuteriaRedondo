import { Component,  OnInit, ViewChild, Input, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatosService } from '../app/services/datos.service';
import { Router, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';


import { Title ,Meta} from '@angular/platform-browser';

import { HeaderComponent} from '../app/components/header/header.component';

//Por default dejamos el español
let defaultLanguage = "es";
//Y como adicional el resto
const additionalLanguages = ['en'];
//Combinamos las traducciones disponibles al default.
const languages: string[] = [defaultLanguage].concat(additionalLanguages);

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./../assets/css/main.css'],
  encapsulation: ViewEncapsulation.None
})


export class AppComponent {
  title = 'Redondo Charcutería Carnicería';

  @ViewChild(HeaderComponent) header: HeaderComponent;
  //@ViewChild("cabecera") cabecera: ElementRef;

  constructor( public _datosService:DatosService, private translate: TranslateService, private router: Router, private meta:Meta) {

    /*
    this.meta.addTag({ name: 'title', content: 'Redondo Charcutería Carnicería online Valladolid|Lechazo|Cochinillo'});
    this.meta.addTag({ name: 'description', content: 'Redondo Carnicería, servicio a domicilio en Valladolid y provincia. Carne de ternera, lechazo, jamón, embutidos, vino, charcutería de elaboración propia.'});
    this.meta.addTag({ name: 'author', content: 'Euphorbia Comunicación'});
    this.meta.addTag({ name: 'keywords', content: ''});
*/
    if(localStorage.getItem('cookiesOpcionales') == "false") {
      window['ga-disable-UA-143095360-1'] = true;
      window['ga-disable-UA-144474209-1'] = true;
      window['ga-disable-AW-724011011'] = true;
      window['ga-disable-GTM-WZJ5D2J'] = true;
    }

    const navEndEvents = router.events.pipe (
      filter(event => event instanceof NavigationEnd),
    );

    navEndEvents.subscribe((event: NavigationEnd) => {

      gtag('config', 'AW-724011011'), {
        'page_path' : event.urlAfterRedirects
      }

      if(router.url == '/compraok') {
        gtag('event', 'conversion', {
            'send_to': 'AW-724011011/QUtdCN2pjKYBEIOQntkC',
            'transaction_id': ''
        });
      }

      if(router.url == '/contacto') {
        gtag('event', 'conversion', {
            'send_to': 'AW-724011011/y_vsCKbXi6YBEIOQntkC',
            'transaction_id': ''
        });
      }
    })

  }




  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    const number = window.scrollY;
    if (number > 300) {
      this.header.fixed = true;
    } else if (this.header.fixed && number < 10) {
      this.header.fixed = false;
    }
  }

  ngOnInit(): void {
       //Asignamos el lenguaje predefinido y los disponibles
       this.translate.setDefaultLang(defaultLanguage);
       this.translate.addLangs(additionalLanguages);
       //Nos basamos en el lenguaje del navegador para cambiar el lenguaje
       let initLang = this.translate.getBrowserLang();
       if (languages.indexOf(initLang) === -1) {
           initLang = defaultLanguage;

       }
       //En base a lo anterior asignamos el lenguaje a usar
       this.translate.use(initLang);
       this.router.events.subscribe((event: Event) => {
         switch(true) {
           case event instanceof NavigationStart: {
             break;
           }
           case event instanceof NavigationEnd:
           case event instanceof NavigationCancel:
           case event instanceof NavigationError: {

             window.scrollTo(0, 0);
             break;
           }
           default: {
             window.scrollTo(0, 0);
             break;
           }
         }
       });
  }

}
