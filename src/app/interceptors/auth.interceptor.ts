import { HttpInterceptorFn } from '@angular/common/http';
import { AUTH_TOKEN_KEY } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenBruto = localStorage.getItem(AUTH_TOKEN_KEY);
  const token = tokenBruto?.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      token,
      'x-access-token': token,
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
