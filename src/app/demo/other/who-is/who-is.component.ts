import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { SharedModule } from '../../../theme/shared/shared.module';
import axios from 'axios';


@Component({
  selector: 'app-who-is',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './who-is.component.html',
  styleUrl: './who-is.component.scss'
})
export default class WhoIsComponent {
  ipAddress: string = '';
  ipDetails: IPDetails | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  async fetchIPDetails() {
    if (!this.ipAddress.trim()) {
      this.errorMessage = 'Please enter an IP address.';
      this.ipDetails = null;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.ipDetails = null;

    try {
      const response = await axios.get<IPDetails>(`https://ipapi.co/${this.ipAddress}/json/`);
      const data = response.data;

      if (data.error) {
        this.errorMessage = data.reason || 'Invalid IP address.';
        this.ipDetails = null;
      } else {
        this.ipDetails = data;
      }
    } catch (error) {
      this.errorMessage = 'Failed to fetch IP details. Please check the IP address and try again.';
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.fetchIPDetails();
    }
  }
}
export interface IPDetails {
  ip?: string;
  network?: string;
  version?: string;
  city?: string;
  region?: string;
  country?: string;
  country_name?: string;
  country_code?: string;
  country_capital?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  utc_offset?: string;
  currency?: string;
  currency_name?: string;
  languages?: string;
  asn?: string;
  org?: string;
  error?: boolean;
  reason?: string;
}