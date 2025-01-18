import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
      user: {
        id?: string;
        email: string;
        role: "admin" | "user";
        status: "active" | "inactive";
        groups: "admin" | "user";
      } & DefaultSession["user"];
    }
  
    interface User {
      id?: string;
      email?: string | null;
      role: "admin" | "user";
      status: "active" | "inactive";
      groups: "admin" | "user";
    }
  }
  