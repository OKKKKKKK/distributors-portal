import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: false,
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  snackbarService = inject(SnackbarService);
  router = inject(Router);

  user$ = this.authService.user$;
  error$ = this.authService.error$;
  submitted$ = signal(false);

  userForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    name: ['', Validators.required],
    role: ['customer' as const, Validators.required],
  });

  constructor() {
    effect(() => {
      if(!this.submitted$()) return;
      const user = this.authService.user$();
      console.log(user);
      if (user) {
        this.snackbarService.show(user.message);
        this.router.navigate(['/login']);
        this.submitted$.set(false);
      }
    });
  }

  registerUser() {
    if (this.userForm.invalid) {
      return;
    }
        this.submitted$.set(true);

    this.authService.register(this.userForm.getRawValue());
  }
}
