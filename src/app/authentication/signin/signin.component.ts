import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Role, AuthService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['admin@software.com',Validators.required],
      password: [ 'admin@123!',Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  // adminSet() {
  //   this.authForm.get('username')?.setValue('admin@software.com');
  //   this.authForm.get('password')?.setValue('admin@123');
  // }
  // employeeSet() {
  //   this.authForm.get('username')?.setValue('employee@software.com');
  //   this.authForm.get('password')?.setValue('employee@123');
  // }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    console.log(this.f['username'].value)
    console.log(this.f['password'].value)
    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      console.log(this.authForm);
      this.subs.sink = this.authService
        .login(this.f['username'].value, this.f['password'].value)
        .subscribe(
          (res) => {
            if (res) {
              setTimeout(() => {
                const role = 'ADMIN';
                if ( role === Role.Admin) {
                  this.router.navigate(['/admin/projects']);
                } else if (role === Role.Employee) {
                  this.router.navigate(['/employee/dashboard']);
                } else if (role === Role.Client) {
                  this.router.navigate(['/client/dashboard']);
                } else {
                  this.router.navigate(['/authentication/signin']);
                }
                this.loading = false;
              }, 1000);
            } else {
              this.error = 'Invalid Login';
            }
          },
          (error) => {
            this.error = error;
            this.submitted = false;
            this.loading = false;
          }
        );
    }
  }
}
