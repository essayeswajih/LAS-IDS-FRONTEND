import { ApiService } from 'src/app/demo/services/api/api.service';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://127.0.0.1:8000/auth/sign_in'; // Replace with your backend URL
  constructor(private toastr: ToastrService) {}
  async login(username: string, password: string): Promise<any> {
    try {
      const response = await axios.post(
        this.authUrl,
        new URLSearchParams({
          username: username,
          password: password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async signup(
      firstName: string, lastName:string, company:string,
      email: string, password: string
    ): Promise<any> {
    try {
      const response = await axios.post(
        this.authUrl.replace('sign_in', 'sign_up'), // Assuming 'sign_up' URL is similar to 'sign_in'
        {
          firstName: firstName,
          lastName: lastName,
          company: company,
          password: password,
          email: email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  setToken(value:string){
    localStorage.setItem('access_token', value);
  }
  getToken(): string | null {
    if(this.isValidToken()){
      return localStorage.getItem('access_token')
    }
    return null;
  }
  logout(){
    localStorage.removeItem('access_token')
    this.notAuthenticated()
    //go to login page
  }
  getUserId(): number | null {
    const accessToken = this.getToken()
    if (accessToken) {
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      return tokenPayload.id;
    }
    return null;

  }
  isValidToken(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false; // No token found, return false
    }

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);

      const expirationTime = parsedPayload.exp * 1000;
      const currentTime = Date.now();

      if (expirationTime < currentTime) {
        this.logout()
        return false;
      }

      return true;
    } catch (error) {
      this.logout()
      console.error('Error decoding the token:', error);
      return false;
    }
  }
  isAuthenticated(): boolean {
    return !!this.getUserId();
  }
  authenticated(){
    window.location.href='/'
  }
  notAuthenticated(){
    window.location.href='/login'
  }
}
