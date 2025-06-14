import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras  } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  userData = {
    usuario:"",
    password:""
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ingresar(form: NgForm) {
    if (form.valid) {
      localStorage.setItem('userData', JSON.stringify(this.userData));
      
      this.router.navigate(['/home'], {
        queryParams: { user: this.userData.usuario },
        state: { user: this.userData }
      });
    }
  }

  registrar() {
    this.router.navigate(['/registrar']);
  }

}
