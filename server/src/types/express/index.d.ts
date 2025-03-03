// src/types/express/index.d.ts
import { User } from '../../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      auth?: {
        payload: {
          sub: string;
          nickname?: string;
          permissions?: string[];
          [key: string]: any;
        };
      };
    }
  }
}