import { Routes, RouterModule } from '@angular/router';


import { ProductosComponent } from '../app/components/productos/productos.component';
import { ProductoComponent } from '../app/components/producto/producto.component';
import { RedondoComponent } from '../app/components/redondo/redondo.component';
import { BlogComponent } from '../app/components/blog/blog.component';
import { ContactoComponent } from '../app/components/contacto/contacto.component';
import { AvisoComponent } from '../app/components/aviso/aviso.component';
import { CarritoComponent } from '../app/components/carrito/carrito.component';
import { CheckoutComponent } from "../app/components/checkout/checkout.component";
import { LoginComponent } from "../app/components/login/login.component";
import { RespuestaComponent } from "../app/components/respuesta/respuesta.component";
import { RecuperarComponent } from "../app/components/recuperar/recuperar.component";
import { Error404Component } from "../app/components/error404/error404.component";
import { PedidosComponent } from "../app/components/pedidos/pedidos.component";
import { ReviewsComponent } from "../app/components/reviews/reviews.component";
import { AuthGuard } from '../app/guards/auth.guards';
import { PreguntasRespuestasComponent } from './components/preguntas-respuestas/preguntas-respuestas.component';

const app_routes: Routes = [
  { path: '', component: ProductosComponent },
  { path: 'tienda', component: ProductosComponent },
  { path: 'tienda/:id', component: ProductosComponent },
  { path: 'tienda/:id/:id', component: ProductosComponent },
  { path: 'producto/:id', component: ProductoComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'redondo', component: RedondoComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:id', component: BlogComponent },
  { path: 'aviso-legal', component: AvisoComponent },
  { path: 'politica-de-privacidad', component: AvisoComponent },
  { path: 'politica-de-cookies', component: AvisoComponent },
  { path: 'politica-de-venta', component: AvisoComponent },
  { path: 'como-comprar', component: AvisoComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'restablecer-contrasena/:email/:token', component: RecuperarComponent },
  { path: 'compraok', component: RespuestaComponent },
  { path: 'comprako', component: RespuestaComponent },
  { path: 'error404', component: Error404Component },
  { path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
  { path: 'nuestros-clientes-opinan', component: ReviewsComponent },
  { path: 'preguntas-frecuentes', component: PreguntasRespuestasComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'error404' }
];


export const app_routing = RouterModule.forRoot(app_routes, { scrollPositionRestoration: 'enabled', initialNavigation: 'enabled' });
