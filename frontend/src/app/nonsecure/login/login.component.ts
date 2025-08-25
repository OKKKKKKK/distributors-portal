import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;

  router = inject(Router);

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    console.log(this.loginForm.value);
    if(this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe((res: any)=>{
      console.log(res);
      let token = res.accessToken;
      if(token) {
        localStorage.setItem('token', token);
        this.router.navigateByUrl("/customers");
      }
    })
  }
}
