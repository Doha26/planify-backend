import { DefaultSession } from "next-auth";
import { User as CustomUser, UserRole, UserStatus, UserGroups, UserEvents } from "./index";
export declare module 'next-auth' {}

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string | null;
      firstName: string | null;
      lastName: string | null;
      role: UserRole;
      status: UserStatus;
      groups: UserGroups;
      provider: string;
      image: string | null;
      events: UserEvents [];
    } & DefaultSession["user"];
  }

  interface User extends CustomUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    role: UserRole;
    status: UserStatus;
    groups: UserGroups;
    provider: string;
    image: string | null;
    events: UserEvents [];
  }
}