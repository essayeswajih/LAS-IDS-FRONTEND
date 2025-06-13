import { Component } from '@angular/core';
import { StripeService } from '../stripe/stripe.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export default class SuccessComponent {
  constructor(
    private paymentService: StripeService){}
  ngOnInit() {
    this.checkSubscriptionStatus();
  }
       async checkSubscriptionStatus() {
  try {
    const res = await this.paymentService.checkSubscription();

    if (res && typeof res.subscribed === 'boolean') {
      } else {
        console.warn('⚠️ Invalid response from checkSubscription:', res);
      }
    } catch (error) {
      console.error('❌ Subscription check error:', error);
    }
  }
}

