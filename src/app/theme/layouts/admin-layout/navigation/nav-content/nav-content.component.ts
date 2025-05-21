// Angular import
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, Location, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { NavigationItem, NavigationItems } from '../navigation';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavCollapseComponent } from './nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { NavItemComponent } from './nav-item/nav-item.component';

// icon
import { IconService } from '@ant-design/icons-angular';
import {
  DashboardOutline,
  CreditCardOutline,
  LoginOutline,
  QuestionOutline,
  ChromeOutline,
  FontSizeOutline,
  ProfileOutline,
  BgColorsOutline,
  AntDesignOutline,
  FileTextOutline,
  FilterOutline,
  MailOutline,
  FileOutline,
  SearchOutline,
} from '@ant-design/icons-angular/icons';
import { ApiService } from 'src/app/demo/services/api/api.service';
import { loadStripe } from '@stripe/stripe-js';
import { StripeService } from 'src/app/demo/stripe/stripe/stripe.service';

@Component({
  selector: 'app-nav-content',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule, NavGroupComponent],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  // public props
  @Output() NavCollapsedMob: EventEmitter<string> = new EventEmitter();

  isSubscribed = false;
  stripePromise = loadStripe('pk_test_51R85AjQx0D7b1Bx53wn5U5CICy3ze6V3TPDUIa0k80hBIAjyPZ65PgFq1DDB7S4Q15gTdFn1Sze9U6d1YLDlpHeO00F6woqfPS');
  subscribeIsLoading = true ; 
  navigations: NavigationItem[];
  isAdmin = false
  isSimpleUser = false
  isPro = false

  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigation = NavigationItems;
  windowWidth = window.innerWidth;

  // Constructor
  constructor(
    private location: Location,
    private locationStrategy: LocationStrategy,
    private iconService: IconService,
    private apiService: ApiService,
    private paymentService: StripeService
  ) {
    this.iconService.addIcon(
      ...[
        DashboardOutline,
        CreditCardOutline,
        FontSizeOutline,
        LoginOutline,
        ProfileOutline,
        BgColorsOutline,
        AntDesignOutline,
        FileTextOutline,
        FilterOutline,
        ChromeOutline,
        QuestionOutline,
        MailOutline,
        FileOutline,
        SearchOutline
      ]
    );
    this.navigations = NavigationItems;
  }

  // Life cycle events
  async ngOnInit() {
    if (this.windowWidth < 1025) {
      (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
    }
    this.isAdminf();
    await this.checkSubscriptionStatus();
  }
  async isAdminf(){
    await this.apiService.getAuthorizedUserUser().then(
      (response) => {
        if(response.role == 'admin'){
          this.isAdmin = true;
        }
        if(response.role == 'user'){
          this.isSimpleUser = true
        }
        if(response.role == 'pro'){
          this.isPro = true
        }
      }
    ).catch(
      () =>this.isAdmin = false
    );
  }
  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 1025 && document.querySelector('app-navigation.coded-navbar').classList.contains('mob-open')) {
      this.NavCollapsedMob.emit();
    }
  }
  async redirectToCheckout() {
    try {
      const res = await this.paymentService.createCheckoutSession();
      if (res.id) {
        const stripe = await this.stripePromise;
        await stripe?.redirectToCheckout({ sessionId: res.id });
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  }

  async checkSubscriptionStatus() {
    this.subscribeIsLoading = true; // Start loading
    try {
      const res = await this.paymentService.checkSubscription();
      this.isSubscribed = res.subscribed;
    } catch (error) {
      console.error('Subscription check error:', error);
      this.isSubscribed = false;
    } finally {
      this.subscribeIsLoading = false; // Stop loading
    }
  }
}


