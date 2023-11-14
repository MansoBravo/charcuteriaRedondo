import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  apartados: any = ['nuestros-clientes-opinan', 'redondo', 'como-comprar', 'blog'];
  legales: any = ['aviso-legal', 'politica-de-privacidad', 'politica-de-cookies', 'politica-de-venta'];
  categorias: any = [];
  categoriasPrincipales: any = [];
  emailNewsletterForm: FormGroup;
  textoCorreo: String;

  constructor(private carritoService: CarritoService, public _datosService: DatosService,
    private fb: FormBuilder,) {
  }

  ngOnInit() {

    this.emailNewsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      permisos: [false, Validators.requiredTrue]
    });

    //Cargamos las categorias...
    this._datosService.getCategorias().subscribe(datos => {
      this.categorias = datos;
      //ORDENO POR POSITION
      this.categorias.sort((val1, val2) => { return val2.position - val1.position });

      //filtro por las principales...
      this.categoriasPrincipales = this.categorias.filter((categoria) => categoria.owner_id == 0);
    });
  }

  correo_bienvenida() {

    var correo = this.emailNewsletterForm.value["email"];
    this._datosService.getCorreosTexto().subscribe(
      resp => {
        this.textoCorreo = resp;

        let datos = [{ "asunto": "Bienvenid@ a nuestra newsletter", "texto": this.textoCorreo, "destinatario": correo }];
        this._datosService.enviarCorreosAutomaticos(datos).subscribe(
          resp => {
            console.log(resp);
          }
        );

      }
    );

  }

}
