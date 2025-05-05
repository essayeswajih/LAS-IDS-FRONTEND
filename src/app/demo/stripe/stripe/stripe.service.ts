import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { AuthService } from '../../services/auth/auth.service';
import axios, { AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  constructor(private auth: AuthService) {}
  private baseUrl: any = "http://localhost:8000/api/v1/stripe/";

  private headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.auth.getToken()
  };

async createCheckoutSession(): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}create-checkout-session`,
        {},  // Empty body as per your original
        { headers: this.headers }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }

  async checkSubscription(): Promise<{ subscribed: boolean }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}check-subscription`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
}