export const REFRESH_TOKEN_COOKIE = 'refreshToken';
export const ACCESS_TOKEN_COOKIE = 'accessToken';

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: true,
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
    secure: true,
    sameSite: 'strict' as const,
    path: '/auth',
  };
}
