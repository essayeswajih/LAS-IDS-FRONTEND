// angular import
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(){}

  firstName = '';
  lastName = '';
  company = 'Progress Group LTD';
  email = 'info@EssayesWajih.com';
  password = '';

  async register(): Promise<void> {
    try {
      const response = await this.authService.signup(
        this.firstName, this.lastName, this.company,
        this.email, this.password);
      this.toastr.success('Go to login', 'Register successful!');
      this.router.navigate(["/login"]);
    } catch (error) {
      console.error('Register failed', error);
      if(error?.detail == 'Email exist.') this.toastr.error('Error', 'Invalid exist.');
      
      else (
        this.toastr.error('Error', 'Register failed')
      )
    }
  }

    // public method
    SignUpOptions = [
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
