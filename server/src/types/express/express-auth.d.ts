// types/express/express-auth.d.ts
import "express";

declare module "express" {
  interface Request {
    auth?: {
      email: string;
      preferred_username?: string;
      given_name?: string;
      family_name?: string;
      name?: string;
      [key: string]: any;
    };
  }
}
