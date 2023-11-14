import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
})
export class Error404Component implements OnInit {

  apartados:any = ['tienda', 'redondo', 'contacto', 'blog'];

  constructor() { }

  ngOnInit() {
  }

}
