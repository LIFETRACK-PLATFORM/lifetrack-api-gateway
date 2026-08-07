export const REFRESH_TOKEN_COOKIE = 'refreshToken';
export const ACCESS_TOKEN_COOKIE = 'accessToken';

/** En local (http) secure=true impide que el navegador guarde cookies. */
export function cookieSecure(): boolean {
  if (process.env.COOKIE_SECURE === 'true') return true;
  if (process.env.COOKIE_SECURE === 'false') return false;
  return process.env.NODE_ENV === 'production';
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: 'strict' as const,
    path: '/',
  };
}

/**
 * Cookies de sesión emitidas antes de mover `path` de '/auth' a '/'.
 * Un `path` distinto no coincide en el borrado, así que quedan huérfanas
 * en el navegador y pueden sombrear (shadow) la cookie nueva. Se limpian
 * explícitamente en cada login/refresh/logout para auto-sanar sesiones viejas.
 */
export function legacySessionCookieOptions() {
  return {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: 'strict' as const,
    path: '/auth',
  };
}
