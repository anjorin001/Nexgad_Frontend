export type JwtPayload = {
  sub?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
  [k: string]: any;
};

export function decodeJwt<T = JwtPayload>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt<{ exp?: number }>(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
}
