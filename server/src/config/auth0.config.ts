import dotenv from 'dotenv';

dotenv.config();

export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN || '',
  audience: process.env.AUTH0_AUDIENCE || '',
  clientId: process.env.AUTH0_CLIENT_ID || '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
};