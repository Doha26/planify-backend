/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { AuthResponseData, RegisterCredentials, RegisterResponse } from "@/types";
import { registerUserRequest } from "@/services/user.service";
import { signIn } from "./auth";

export async function authenticateAction(
  email: string,
  password: string
): Promise<any> {
  try {
    return await signIn("credentials", {
      email,
      password
    });

    
  } catch (error: any) {
    console.log('RESULT_AUTH_HERE',error);
    return {
        ok: false,
        error: error?.status === 422 ? "UserNotFound" : error?.status,
      };
    
  }
}

export async function registerAction(
  registerCredentials: RegisterCredentials
): Promise<RegisterResponse | { error: string }> {
  try {
    return await registerUserRequest(registerCredentials);
  } catch (error: any) {
    return { error: error.status };
  }
}
