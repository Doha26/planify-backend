"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginCredentials, RegisterCredentials } from "../types";
import toast from "react-hot-toast";
import { getAuthError } from "@/lib/auth-error";
import {
  forgotPasswordRequest,
} from "@/services/user.service";
import { z } from "zod";
import { authenticateAction, registerAction } from "@/lib/user-actions";

const loginSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(4, 'Password must be at least 4 characters').min(1, 'Password is required'),
});

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateCredentials = (data: unknown) => {
    try {
      return loginSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        fieldErrors.forEach((err) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      }
      return null;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const toastId = toast.loading("Signing in...");
    try {
      setLoading(true);
      setError(null);

      const validatedCredentials = validateCredentials(credentials);
      if (!validatedCredentials) {
        toast.error('Please check your input', { id: toastId });
        return false;
      }

      const result = await authenticateAction(credentials.email, credentials.password);

      if (!result.ok) {
        const authError = getAuthError(result.error as any);
        toast.error(authError.message, { id: toastId });
        setError(result?.error);
        return false;
      }

      toast.success("Signed in successfully", { id: toastId });
      router.push("/dashboard");
      return true;
    } catch (error) {
      toast.error('Unknown', { id: toastId });
      setError("An unexpected error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerCredentials: RegisterCredentials) => {
    const toastId = toast.loading("Creating account...");
    try {
      setLoading(true);
      setError(null);

      // Register user
      const response = await registerAction(registerCredentials);

      console.log('RESPONSE_REGISTER', response);

      if (typeof response === 'string') {
        toast.error("Unable to create user account", { id: toastId });
        return false;
      }

      toast.success("Account created successfully", { id: toastId });

      // Auto login after registration

      const { email, password } = registerCredentials;
      return login({
        email,
        password,
      });
    } catch (error: any) {
      setError(error.message || "Registration failed");
      toast.error(error.message, { id: toastId });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    const toastId = toast.loading("Sending reset instructions...");

    try {
      setLoading(true);
      const response = await forgotPasswordRequest(email);

      if (response.status !== 204) {
        toast.error("An error occured. Unable to send you reset instructions", {
          id: toastId,
        });
      }

      toast.success("Password reset instructions sent to your email", {
        id: toastId,
      });
      return true;
    } catch (error) {
      const authError = getAuthError(error as any);
      toast.error(authError.message, { id: toastId });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  return {
    session,
    status,
    error,
    loading,
    login,
    register,
    logout,
    isAuthenticated: status === "authenticated",
  };
};
