import { DefaultSession, DefaultJWT } from "next-auth";
import { User } from "./user";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
    accessToken: string;
    iat: number;
    exp: number;
    jti: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: User;
    accessToken: string;
    iat: number;
    exp: number;
    jti: string;
  }
}
