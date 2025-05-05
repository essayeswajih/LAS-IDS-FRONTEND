import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from 'src/app/demo/services/api/api.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  try {
    const user = await apiService.getAuthorizedUserUser();

    if (user.role === 'admin') {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  } catch (error) {
    router.navigate(['/']);
    return false;
  }
};
