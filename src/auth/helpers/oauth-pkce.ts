import { createHash, randomBytes } from 'crypto';
import { cookieSecure } from '../constants/session-cookies';

export type OAuthPkceSession = {
  state: string;
  codeVerifier: string;
  codeChallenge: string;
};

export function createOAuthPkceSession(): OAuthPkceSession {
  const codeVerifier = randomBytes(32).toString('base64url');
  const codeChallenge = createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  const state = randomBytes(16).toString('base64url');

  return { state, codeVerifier, codeChallenge };
}

export const OAUTH_STATE_COOKIE = 'oauth_state';
export const OAUTH_VERIFIER_COOKIE = 'oauth_code_verifier';
export const OAUTH_PROVIDER_COOKIE = 'oauth_provider';

export function oauthSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: 'lax' as const,
    path: '/auth',
    maxAge: 10 * 60 * 1000,
  };
}
