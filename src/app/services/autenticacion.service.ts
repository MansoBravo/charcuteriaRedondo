import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { DatosService } from '../services/datos.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  public datosUsuario:any [];

  constructor(public http: HttpClient, public _datosService:DatosService) {  }

    //Login
    login(username: string, password: string) {
        return this.http.post<any>(this._datosService.urlApi + 'autentificacion/login/', { username: username, password: password })
            .map(user => {
                if (user && user.datos.token) {
                    localStorage.setItem('token', JSON.stringify(user.datos.token));
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('authenticated', 'si');
                }
                return user;
            });
    }


    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authenticated');
    }

    //registro
    registro(username: string, password: string, password2:string) {
        return this.http.post<any>(this._datosService.urlApi + '/autentificacion/registro/', { username: username, password: password, password_repeat: password2 })
            .map(user => {
                if (user && user.datos.token) {
                    localStorage.setItem('token', JSON.stringify(user.datos.token));
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('authenticated', 'si');
                }
                return user;
            });
    }

    getUsuarioDatos() {
       let AuthToken = 'Bearer ' + JSON.parse(localStorage.getItem('token'));
       let url:string = this._datosService.urlApi + `usuario/ `;
       //let headers = new HttpHeaders({Authorization: AuthToken})
       return this.http.get(url)
       .map((resp:any) =>{
          return resp;
        });
     }

     getUsuarioOrders() {
        let AuthToken = 'Bearer ' + JSON.parse(localStorage.getItem('token'));
        let url:string = this._datosService.urlApi + `/orders/ `;
        //let headers = new HttpHeaders({Authorization: AuthToken})
        return this.http.get(url)
        .map((resp:any) =>{
           return resp;
         });
      }
 

     //Login
     recuperarPassword(username: string) {
         return this.http.post<any>(this._datosService.urlApi + 'autentificacion/recuperar-password/', { username: username })
             .map(resp => {
                 return resp;
             });
     }

     //comprobar link a restablecer
     checkRestablecerContrasena(email: string, token) {
         return this.http.post<any>(this._datosService.urlApi + 'autentificacion/restablecer-contrasena/', { email: email, token:token })
             .map(resp => {
                 return resp;
             });
     }


     //restablecer contraseña
     restablecerContrasena(email, token, password, password2) {
         return this.http.post<any>(this._datosService.urlApi + 'autentificacion/restablecer-contrasena/', {email: email, token: token, password: password, password_repeat: password2})
             .map(resp => {
                 return resp;
             });
     }
}
