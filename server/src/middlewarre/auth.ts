import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';

const KEYCLOAK_DOMAIN = process.env.KEYCLOAK_DOMAIN;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM;
const KEYCLOAK_AUDIENCE = process.env.KEYCLOAK_AUDIENCE || 'account';

if (!KEYCLOAK_DOMAIN || !KEYCLOAK_REALM) {
  throw new Error('Missing KEYCLOAK_DOMAIN or KEYCLOAK_REALM in environment variables.');
}

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `http://${KEYCLOAK_DOMAIN}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`,
  }) as any, 
  audience: KEYCLOAK_AUDIENCE,
  issuer: `http://${KEYCLOAK_DOMAIN}/realms/${KEYCLOAK_REALM}`,
  algorithms: ['RS256'],
});