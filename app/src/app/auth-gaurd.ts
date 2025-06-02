import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

let selectedRole: 'admin' | 'user' | null = null;

export const setSelectedRole = (role: 'admin' | 'user') => {
  selectedRole = role;
};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const expectedRole = route.routeConfig?.path as 'admin' | 'user';

  if (selectedRole === expectedRole) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};