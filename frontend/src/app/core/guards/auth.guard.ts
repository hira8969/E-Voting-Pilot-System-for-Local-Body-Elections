import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard for authenticated voter routes
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login if not authenticated
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

// Guard for admin routes (prevents normal voters from accessing admin portal)
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  // If logged in as normal voter, redirect to voter dashboard
  if (authService.isAuthenticated()) {
    router.navigate(['/voter/dashboard']);
    return false;
  }

  // Otherwise redirect to login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
