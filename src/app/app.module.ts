import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule,
  MatExpansionModule, MatDatepickerModule, MatInputModule, MatTabsModule,
  MatTooltipModule, MatFormFieldModule, MatMenuModule, MatSnackBarModule, MatSelectModule, MatRadioModule, MatListModule, MatTableModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './helpers/http-error.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocationStrategy, HashLocationStrategy, DatePipe, registerLocaleData } from '@angular/common';

import { AuthGuard } from './guards/auth.guards';
import { JwtInterceptorProvider } from './helpers/jwt.interceptor';
import { ErrorInterceptorProvider } from './helpers/error.interceptor';
import { AlertService } from './services/alert.service';

// Rutas
import { app_routing } from './app.routes';

import { ModalModule } from './_modal';

import { AppComponent } from './app.component';
import { CookiesComponent } from './components/cookies/cookies.component';
import { HeaderComponent } from './components/header/header.component';
import { IconosComponent } from './components/iconos/iconos.component';
import { FormatocomasPipe } from './pipes/formatocomas.pipe';
import { ProductosComponent } from './components/productos/productos.component';
import { SanitizerPipe } from './pipes/sanitizer.pipe';
import { ProductoItemComponent } from './components/producto-item/producto-item.component';
import { ProductoComponent } from './components/producto/producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { PopupComponent } from './components/popup/popup.component';
import { BannerComponent } from './components/banner/banner.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { RecetasComponent } from './components/recetas/recetas.component';
import { RecetaComponent } from './components/receta/receta.component';
import { AvisoComponent } from './components/aviso/aviso.component';
import { FooterComponent } from './components/footer/footer.component';
import { AlertComponent } from './components/alert/alert.component';
import { RespuestaComponent } from './components/respuesta/respuesta.component';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { RedondoComponent } from './components/redondo/redondo.component';
import { BlogComponent } from './components/blog/blog.component';
import { Error404Component } from './components/error404/error404.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { WhatsappComponent } from './components/whatsapp/whatsapp.component';
import { VentanaDescuentoComponent } from './components/ventana-descuento/ventana-descuento.component';
import { PreguntasRespuestasComponent } from './components/preguntas-respuestas/preguntas-respuestas.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CookiesComponent,
    HeaderComponent,
    IconosComponent,
    FormatocomasPipe,
    ProductosComponent,
    SanitizerPipe,
    ProductoItemComponent,
    ProductoComponent,
    RecetasComponent,
    RecetaComponent,
    CarritoComponent,
    CheckoutComponent,
    LoginComponent,
    PopupComponent,
    BannerComponent,
    ContactoComponent,
    AvisoComponent,
    FooterComponent,
    AlertComponent,
    RespuestaComponent,
    RecuperarComponent,
    RedondoComponent,
    BlogComponent,
    Error404Component,
    PedidosComponent,
    PreguntasRespuestasComponent,
    ReviewsComponent,
    WhatsappComponent,
    VentanaDescuentoComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-universal-demystified' }),
    BrowserAnimationsModule, // new modules added here
    [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule, MatMenuModule,
      MatExpansionModule, MatInputModule, MatTabsModule, MatTooltipModule, MatFormFieldModule,
      MatSnackBarModule, MatSelectModule, MatRadioModule, MatListModule, MatTableModule],
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    app_routing,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    //{ provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: 'LOCALSTORAGE', useFactory: getLocalStorage },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    JwtInterceptorProvider,
    ErrorInterceptorProvider,
    AuthGuard,
    AlertService
    //{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getLocalStorage() {
  return (typeof window !== "undefined") ? window.localStorage : null;
}
