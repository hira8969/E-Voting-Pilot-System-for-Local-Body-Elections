import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard for authenticated routes
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

// Generic Role-based Route Guard with /unauthorized redirection
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    const user = authService.currentUser() || authService.getStoredUser();
    const currentRole = (user?.role || '').replace(/^ROLE_/, '').toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => r.replace(/^ROLE_/, '').toUpperCase());

    if (currentRole && normalizedAllowed.includes(currentRole)) {
      return true;
    }

    return router.createUrlTree(['/unauthorized']);
  };
};

// Guard for admin routes
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/unauthorized']);
  }

  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
