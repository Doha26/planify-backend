/* eslint-disable @typescript-eslint/no-explicit-any */
import { JWT } from "next-auth/jwt";
import NextAuth, { AuthError } from "next-auth";
import { loginUserRequest } from "../services/user.service";
import Credentials from "next-auth/providers/credentials";
import { object, string } from "zod";

export class InvalidLoginError extends AuthError {
  constructor(code: string) {
    super();
    this.message = code;
    this.stack = undefined;
  }
}

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" }).min(
    1,
    "Password is required"
  ),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<any> => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        let response = null

        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

           response = await loginUserRequest({
            email,
            password,
          });

          const { user, token } = response.data;

          if (!user || !token) {
            return { error: 'UserNotFound' }
          }
          return { user, token };
        } catch (error: any) {

          return {"error": error.status === 422 ? 'UserNotFound': error.status}
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    jwt({ token, user }: any) {
      if (user) {
        return {
          ...token,
          ...user
        };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT, user: any }) {
      session.user = token.user
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
