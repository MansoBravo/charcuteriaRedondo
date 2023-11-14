import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';
import { AlertService } from '../../services/alert.service';
import { DatosService } from '../../services/datos.service';
import { CarritoService } from '../../services/carrito.service';
import { Subscription } from 'rxjs/Subscription';
import { Producto } from '../../model/producto';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})


export class CheckoutComponent implements OnInit {

  vistaApartado:boolean = false;
  token:string;
  sms:boolean = false;
  smstipo:string = "";
  selected: any;
  carritovaciotmpl: any;

  enviando:boolean = false;

  //DATOS CARRITO
  public carrito: Array<Producto> = [];
  public subscription: Subscription;
  public total: number;
  public totalFinal: number;
  public totalGastos: number;
  public numProductos: number;
  public numProductosGranel: number;

  //DATOS CLIENTE
  datosUsuario:any;


  //DATOS DE LA COMPRA
  order:any[];
  datosOrder:any;

  formMatcher: any;
  datosForm:FormGroup;
  username = FormControl;
  nombre = FormControl;
  email = FormControl;
  razon = FormControl;
  telefono = FormControl;
  envioObservaciones = FormControl;
  nif = FormControl;
  dirFacturacion = FormControl;
  provinciaFacturacion = FormControl;
  paisFacturacion = FormControl;
  poblacionFacturacion = FormControl;
  cpFacturacion = FormControl;

  utilizarMismosDatos = FormControl;

  nombreEnvio = FormControl;
  dirEnvio = FormControl;
  provinciaEnvio = FormControl;
  paisEnvio = FormControl;
  poblacionEnvio = FormControl;
  cpEnvio = FormControl;
  formaDePago = FormControl;
  formaDeEnvio = FormControl;

  submitted:boolean = false;



  //DATOS DEL ENVIO
  paisesEnvio:any[];
  provinciasEnvio:any[];
  //pagosActivos:any[] = [ 'transferencia'];
  pagosActivos:any[] = [ 'contrarembolso'];
  enviosActivos:any[] = [ 'envio', 'recoger-1', 'recoger-2', 'recoger-3'];

  formasDeEnvio = {
    "envio": {
      id: 1,
      nombre: "ENVÍO A DOMICILIO (5€ en compras inferiores a 60€)",
      codigo: "envio",
      iconos: [],
      mensaje: false
    },
    "recoger-1": {
      id: 2,
      nombre: "RECOGIDA EN JOAQUÍN MARÍA JALÓN 18",
      codigo: "recoger-1",
      iconos: [],
      mensaje: false
    },
    "recoger-2": {
      id: 3,
      nombre: "RECOGIDA EN PORTILLO DEL PRADO 17",
      codigo: "recoger-2",
      iconos: [],
      mensaje: false
    },
    "recoger-3": {
      id: 2,
      nombre: "RECOGIDA EN MATEO SEOANE SOBRAL 3",
      codigo: "recoger-3",
      iconos: [],
      mensaje: false
    }
  };
  

  formasDePago = {
  "tarjeta": {
    id: 1,
    nombre: "TARJETA",
    codigo: "tarjeta",
    iconos: ['/assets/images/pagos/visa.png','/assets/images/pagos/visaelectron.png','/assets/images/pagos/maestro.png','/assets/images/pagos/mastercard.png'],
    mensaje: false
  },
  "paypal": {
    id: 2,
    nombre: "PAYPAL",
    codigo: "paypal",
    iconos: ['/assets/images/pagos/paypal.png'],
    mensaje: false
  },
  "contrarembolso": {
    id: 3,
    nombre: "PAGO CONTRA REEMBOLSO",
    codigo: "contrarembolso",
    iconos: [/*'images/pagos/contrareembolso.png'*/],
    mensaje: {
      tipo: 'danger',
      texto: '<h4><b>¡ATENCIÓN!</b></h4> Las compras realizadas cuyo pago sea contrareembolso, llevarán un incremento a cobrar en la entrega de la mercancia, de un 3% del importe de la compra. Teniendo siempre un coste mínimo de 3 € por compra.'
    }
  },
  "transferencia": {
    id: 4,
    nombre: "TRANSFERENCIA BANCARIA",
    codigo: "transferencia",
    iconos: ['/assets/images/pagos/transferencia.png'],
    mensaje: false
  }
  };

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public alertService:AlertService,
    public fb:FormBuilder,
    public _datosService:DatosService,
    public carritoService: CarritoService,
    public autenticacionService:AutenticacionService) {

      this.datosForm = fb.group({
        //AQUI CREAR TODOS LOS CAMPOS DEL datosForm
          "username": ["", Validators.required],
          "email": ["", Validators.required],
          "telefono":[""],
          "envioObservaciones":[""],

          "nombre": ["", Validators.required],
          "razon":[""],
          "nif":[""],
          "dirFacturacion":["", Validators.required],
          "cpFacturacion":["", Validators.required],
          "poblacionFacturacion":["", Validators.required],
          "provinciaFacturacion":["", Validators.required],
          "paisFacturacion":["", Validators.required],

          "utilizarMismosDatos":[false],

          "nombreEnvio":[""],
          "dirEnvio":[""],
          "cpEnvio":[""],
          "poblacionEnvio":[""],
          "provinciaEnvio":[""],
          "paisEnvio":[""],

          "formaDePago":["", Validators.required],
          "formaDeEnvio":["", Validators.required],

      });

     }

  ngOnInit() {
    this._datosService.ponSeccion('checkout');
    this.vistaApartado = false;
    this.token = JSON.parse(localStorage.getItem('token'));


    this.sacaApartado();
    this.getDatos();
    this.subscribeCarrito();
/*
    this.datosForm.get('utilizarMismosDatos').valueChanges.subscribe(
      (resultado: boolean) => {
        if(!resultado) {
          console.log('soy false');
          this.datosForm.get('nombreEnvio').setValidators( [Validators.required]);
          //this.datosForm.get('nombreEnvio').setValue(this.datosForm.get('nombre').value);
          this.datosForm.get('dirEnvio').setValidators([Validators.required]);
          //this.datosForm.get('dirEnvio').setValue(this.datosForm.get('dirFacturacion').value);
          this.datosForm.get('localidadEnvio').setValidators([Validators.required]);
          //this.datosForm.get('localidadEnvio').setValue(this.datosForm.get('localidadFacturacion').value);
          this.datosForm.get('provinciaEnvio').setValidators([Validators.required]);
          //this.datosForm.get('provinciaEnvio').setValue(this.datosForm.get('provinciaFacturacion').value);
          this.datosForm.get('paisEnvio').setValidators([Validators.required]);
          //this.datosForm.get('paisEnvio').setValue(this.datosForm.get('paisFacturacion').value);
          this.datosForm.get('cpEnvio').setValidators([Validators.required]);
          //this.datosForm.get('cpEnvio').setValue(this.datosForm.get('cpFacturacion').value);
        }
        else {
          this.datosForm.get('nombreEnvio').clearValidators();
          this.datosForm.get('dirEnvio').clearValidators();
          this.datosForm.get('localidadEnvio').clearValidators();
          this.datosForm.get('provinciaEnvio').clearValidators();
          this.datosForm.get('paisEnvio').clearValidators();
          this.datosForm.get('cpEnvio').clearValidators();
          this.datosForm.get('nombreEnvio').setValue(null);
          this.datosForm.get('dirEnvio').setValue(null);
          this.datosForm.get('localidadEnvio').setValue(null);
          this.datosForm.get('provinciaEnvio').setValue(null);
          this.datosForm.get('paisEnvio').setValue(null);
          this.datosForm.get('cpEnvio').setValue(null);
        }

        this.datosForm.updateValueAndValidity();
      }


    )*/

  }

  cargaFormulario() {
    this.datosForm.get('username').setValue(this.datosUsuario['nombre']);
    this.datosForm.get('nombre').setValue(this.datosUsuario['nombre']);
    this.datosForm.get('razon').setValue(this.datosUsuario['razon']);
    this.datosForm.get('email').setValue(this.datosUsuario['email']);
    this.datosForm.get('nif').setValue(this.datosUsuario['dni']);
    this.datosForm.get('telefono').setValue(this.datosUsuario['telefono']);
    this.datosForm.get('dirFacturacion').setValue(this.datosUsuario['direccion']);
    this.datosForm.get('paisFacturacion').setValue(this.datosUsuario['id_pais']);
    this.datosForm.get('provinciaFacturacion').setValue(this.datosUsuario['id_provincia']);
    this.datosForm.get('poblacionFacturacion').setValue(this.datosUsuario['poblacion']);
    this.datosForm.get('cpFacturacion').setValue(this.datosUsuario['codigo_postal']);

    //LOS DE ENVÍO LOS COPIAMOS DE LOS DE FACTURACIÓN...
    this.datosForm['nombreEnvio'] = this.datosForm['nombre'];
    this.datosForm.controls['nombreEnvio'].setValue(this.datosForm.controls['nombre'].value);
    this.datosForm.controls['dirEnvio'].setValue(this.datosForm.controls['dirFacturacion'].value);
    this.datosForm.controls['cpEnvio'].setValue(this.datosForm.controls['cpFacturacion'].value);
    this.datosForm.controls['poblacionEnvio'].setValue(this.datosForm.controls['poblacionFacturacion'].value);
    this.datosForm.controls['provinciaEnvio'].setValue(this.datosForm.controls['provinciaFacturacion'].value);
    this.datosForm.controls['paisEnvio'].setValue(this.datosForm.controls['paisFacturacion'].value);

    this.datosForm.updateValueAndValidity();
  }


  sacaApartado() {
    setTimeout(() => {
      this.vistaApartado = true;
    }, 1000);
  }



  getDatos() {
    this._datosService.getPaises().subscribe(data=>{
      this.paisesEnvio = data;
      this.provinciasEnvio = data[0].provincias[48];

      this.paisEnvio = data[0];
      this.provinciaEnvio = data[0].provincias[48]
      console.log(this.paisEnvio);

    });

    this.autenticacionService.getUsuarioDatos().subscribe(data => {
        this.datosUsuario = data.datos;

        this.carritoService.getOrderCarrito().subscribe(data=> {
          this.datosOrder = data;
          console.log('los datos de order', this.datosOrder);
          this.cargaFormulario();
        });
    },
      error => {
        this.router.navigate(['/login']);
      }
    );

  }

  getProvincias(idPais) {
    let indicePais = this.paisesEnvio.findIndex((indicePais) => indicePais.idPais == idPais );
    let lasprovincias = this.paisesEnvio[indicePais]['provincias'];

    return this.paisesEnvio[indicePais]['provincias'];
  }

  subscribeCarrito() {
    this.carritoService.getCarrito().subscribe(data => {
      this.carrito = data;
      this.total = this.carritoService.getTotal();

      this.numProductos = this.carritoService.getTotalProductos();
      this.numProductosGranel = this.carritoService.getTotalProductosGranel();
      if(this.datosForm.value.formaDeEnvio == 'recoger') {
        this.totalGastos = 0;
        this.totalFinal = this.carritoService.getTotal();
      }
      else {
        this.totalGastos = this.carritoService.getTotalGastos();
        this.totalFinal = this.carritoService.getTotalFinal();
      }

    },
      error => alert(error));
  }


  // convenience getter for easy access to form fields
     get f() { return this.datosForm.controls; }

  cmpDatos() {
    //COMPROBAR SI DATOS ENVIO SON VACIOS PARA RELLENAR
    //if(this.datosForm.controls['utilizarMismosDatos'].value) {} siempre así los recoge

    this.datosForm['nombreEnvio'] = this.datosForm['nombre'];
    this.datosForm.controls['nombreEnvio'].setValue(this.datosForm.controls['nombre'].value);
    this.datosForm.controls['dirEnvio'].setValue(this.datosForm.controls['dirFacturacion'].value);
    this.datosForm.controls['cpEnvio'].setValue(this.datosForm.controls['cpFacturacion'].value);
    this.datosForm.controls['poblacionEnvio'].setValue(this.datosForm.controls['poblacionFacturacion'].value);
    this.datosForm.controls['provinciaEnvio'].setValue(this.datosForm.controls['provinciaFacturacion'].value);
    this.datosForm.controls['paisEnvio'].setValue(this.datosForm.controls['paisFacturacion'].value);


    this.submitted = true;
    // stop here if form is invalid
    if (this.datosForm.invalid) {
        this.sms = true;
        this.smstipo = 'error';
        return;
    }
    else {
      this.enviando = true;
      window.scroll(0,0);
      //ESTABLECEMOS DATOS DE PEDIDO
      this.datosOrder['telefono'] = this.datosForm.value.telefono;
      this.datosOrder['razon'] = this.datosForm.value.razon;
      this.datosOrder['nif_dir_facturacion'] = this.datosForm.value.nif;
      this.datosOrder['envioObservaciones'] = this.datosForm.value.envioObservaciones;

      this.datosOrder['nombre'] = this.datosForm.value.username;
      this.datosOrder['nombre_dir_facturacion'] = this.datosForm.value.nombre;
      this.datosOrder['direccion_dir_facturacion'] = this.datosForm.value.dirFacturacion;
      this.datosOrder['localidad_dir_facturacion'] = this.datosForm.value.poblacionFacturacion;
      this.datosOrder['pais_dir_facturacion'] = this.datosForm.value.paisFacturacion;
      this.datosOrder['provincia_dir_facturacion'] = this.datosForm.value.provinciaFacturacion;
      this.datosOrder['codigo_dir_facturacion'] = this.datosForm.value.cpFacturacion;

      this.datosOrder['nombre_dir_envio'] = this.datosForm.value.nombreEnvio;
      this.datosOrder['direccion_dir_envio'] = this.datosForm.value.dirEnvio;
      this.datosOrder['localidad_dir_envio'] = this.datosForm.value.poblacionEnvio;
      this.datosOrder['pais_dir_envio'] = this.datosForm.value.paisEnvio;
      this.datosOrder['provincia_dir_envio'] = this.datosForm.value.provinciaEnvio;
      this.datosOrder['codogo_dir_envio'] = this.datosForm.value.cpEnvio;

      this.datosOrder['formaDePago'] = this.datosForm.value.formaDePago;
      this.datosOrder['formaDeEnvio'] = this.datosForm.value.formaDeEnvio;


      //ESTABLECEMOS NUEVOS DATOS DE USUARIO
      this.datosUsuario['nombre'] = this.datosForm.value.username;
      this.datosUsuario['dni'] = this.datosForm.value.nif;
      this.datosUsuario['razon'] = this.datosForm.value.razon;
      this.datosUsuario['telefono'] = this.datosForm.value.telefono;
      this.datosUsuario['direccion'] = this.datosForm.value.dirFacturacion;
      this.datosUsuario['poblacion'] = this.datosForm.value.poblacionFacturacion;
      this.datosUsuario['codigo_postal'] = this.datosForm.value.cpFacturacion;
      this.datosUsuario['id_provincia'] = this.datosForm.value.provinciaFacturacion;
      this.datosUsuario['id_pais'] = this.datosForm.value.paisFacturacion;



      this.carritoService.postDatosUsuario(this.datosUsuario).subscribe(data => {
        console.log('resultado de enviar datos de usaurio', data);

          this.carritoService.postDatosCarrito(this.datosOrder).subscribe(data => {
            console.log('resultado de enviar datos de order', data);
            this.procesaCompra();
          });
      });


    }
  }



  procesaCompra(){
    //COMPROBAMOS SI EN LA ORDER YA HAY ARTCIULOS
    this.carritoService.getOrderCarrito().subscribe(data=> {
      this.order = data;

      let articulosExistentes = data.articulos.length;

      console.log('en procesaCompra al getOrderCarrito obtenemos que hay ', articulosExistentes)

      if(!data.articulos.length) {
        this.insertaArticulos();
      }
      else {
        //BORRAR ARTÍCULOS
        let articulosBorrados:number = 0;
        for (let articulo of data.articulos) {
          this.carritoService.deleteArticulo(articulo.id).subscribe(data=> {
            articulosBorrados ++;
          })
        }
        this.insertaArticulos();
      }
    })

  }

  async insertaArticulos() {
    //GUARDAR TODOS LOS ARTÍCULOS DEL CARRITO EN EL ORDER
    let numInsertados: number = 0;
    let articulosEnCarrito = this.carrito.length;

    console.log("al insertaArticulos sabemos que articulosEnCarrito hay", articulosEnCarrito);

      for (let articulo of this.carrito) {
        await this.carritoService.postArticuloUnidades(articulo.id, articulo.unidades).subscribe(data=> {
            numInsertados ++;

            if(numInsertados == articulosEnCarrito) {
              this.notificar();
            }
        })
      }
  }


  async notificar() {
    /**
     * Handler para la respuesta cuando se llama a notificar-pedido
     * @param param0 los datos de la respuesta del servidor
     */
    const onNotificacionRespuesta = ({status = ''} = {}) => {

      if (status === 'success') {
        this.carritoService.reestableceCarrito();
        this.carritoService.clearCarrito();
        this.carritoService.actualizarCarrito();

        this.router.navigate(['/compraok']);
      }
    }

    // NOTA: cuando tenga pasarla de pago, hay que corregir el error 500 del servidor y revisar
    await this.carritoService.notificarPedido().subscribe(onNotificacionRespuesta, onNotificacionRespuesta);
  }

  CompruebaEnvio() {
    //VOLVEMOS A CALCULAR CARRITO TENIENDO EN CUENTA EL TIPO DE ENVÍO
    this.subscribeCarrito();
  }


}
