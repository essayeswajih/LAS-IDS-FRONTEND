import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../demo/services/api/api.service';

export const unauthorizedGuard: CanActivateFn = async (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  try {
    const response = await apiService.getAuthorizedUserUser();

    // If the response indicates the user is authorized, redirect to dashboard
    if (response) {
      router.navigate(['/dashboard/default']);
      console.log(response)
      return false; // Prevent access to the current route
    }
  } catch (error) {
    console.error('Error checking authorization:', error);
    //router.navigate(['/login']);
  }

  return true; // Allow access if user is not authorized
};
