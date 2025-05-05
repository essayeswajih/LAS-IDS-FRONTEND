// angular import
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule,SharedModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {

  email = 'info@EssayesWajih.com';
  password = '';

  constructor(private authService: AuthService,private toastr: ToastrService) {}

  async login(): Promise<void> {
    try {
      const response = await this.authService.login(this.email, this.password);
      this.authService.setToken(response?.access_token)
      this.authService.authenticated()
      this.toastr.success('Welcome', 'Login successful');
    } catch (error) {
      console.error('Login failed', error);
      this.toastr.error('Error', 'Login failed');
    }
  }
    // public method
  SignInOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
  ];
}
