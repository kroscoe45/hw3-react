import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { auth0Config } from '../config/auth0';

// Basic JWT validation middleware
export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${auth0Config.domain}/.well-known/jwks.json`
  }) as any, // Using 'any' to bypass type issues for minimal setup
  audience: auth0Config.audience,
  issuer: auth0Config.issuerBaseURL,
  algorithms: ['RS256']
});