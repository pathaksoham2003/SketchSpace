import { Request } from "express";

export interface KeycloakAuth {
  email: string;
  username?:string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  [key: string]: any;
}

export interface AuthenticatedRequest extends Request {
  auth: KeycloakAuth;
}