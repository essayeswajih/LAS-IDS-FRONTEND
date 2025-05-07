// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { unauthorizedGuard } from './guards/unauthorized.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full',
      },
      {
        path: 'dashboard/default',
        loadComponent: () =>
          import('./demo/default/dashboard/dashboard.component').then((c) => c.DefaultComponent),
      },
      {
        path: 'typography',
        loadComponent: () =>
          import('./demo/ui-component/typography/typography.component'),
      },
      {
        path: 'user-managment',
        canActivate: [adminGuard], // Protect this route with adminGuard
        loadComponent: () =>
          import('./demo/default/dashboard/user-managment/user-managment.component'),
      },
      {
        path: 'contact-managment',
        canActivate: [adminGuard], // Protect this route with adminGuard
        loadComponent: () =>
          import('./demo/default/dashboard/contact-manager/contact-manager.component'),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./demo/other/profile/profile.component'),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./demo/other/contact/contact.component'),
      },
      {
        path: 'success',
        loadComponent: () =>
          import('./demo/stripe/success/success.component'),
      },
      {
        path: 'cancel',
        loadComponent: () =>
          import('./demo/stripe/cancel/cancel.component'),
      },
      {
        path: 'color',
        loadComponent: () =>
          import('./demo/ui-component/ui-color/ui-color.component'),
      },
      {
        path: 'logs',
        loadComponent: () => import('./demo/other/logs/logs.component'),
      },
      {
        path: 'filter',
        loadComponent: () => import('./demo/other/filter/filter.component'),
      },
      {
        path: 'reports',
        loadComponent: () => import('./demo/other/reports/reports.component'),
      },
      {
        path: 'intrusions/:reportId', 
        loadComponent: () => import('./demo/other/intrusions/intrusions.component')
      },
      {
        path: 'IP-Lookup', 
        loadComponent: () => import('./demo/other/who-is/who-is.component')
      },
      {
        path: 'sample-page',
        loadComponent: () =>
          import('./demo/other/sample-page/sample-page.component'),
      },
    ],
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        canActivate: [unauthorizedGuard],
        loadComponent: () =>
          import('./demo/authentication/login/login.component'),
      },
      {
        path: 'register',
        canActivate: [unauthorizedGuard], 
        loadComponent: () =>
          import('./demo/authentication/register/register.component'),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard/default' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
