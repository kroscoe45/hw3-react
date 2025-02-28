import dotenv from 'dotenv';
dotenv.config();

export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN || '',
  audience: process.env.AUTH0_AUDIENCE || '',
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
};