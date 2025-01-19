import { AxiosResponse } from 'axios';
import {  AuthResponseData, LoginCredentials, RegisterCredentials, RegisterResponse, User, UserEvents } from '../types';
import apiClient from './api-client';

// Login the user with email/password and return the access token and user data
export const loginUserRequest = async (credentials: LoginCredentials): Promise<AxiosResponse> => {
  const response = await apiClient.post<AxiosResponse>('/auth/email/login', credentials);
  return response.data;
};

export const registerUserRequest = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>('/auth/email/register', credentials);
  return response.data.data;
};

export const forgotPasswordRequest = async (email: string): Promise<AxiosResponse> => {
  return await apiClient.post<AxiosResponse>('/auth/forgot/password', email);
};

// Fetch the currently logged-in user
export const fetchCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/user/me');
  return response.data;
};

// Fetch events for a user
export const fetchUserEventsRequest = async (userId: number): Promise<UserEvents[]> => {
  const response = await apiClient.get<UserEvents[]>(`/events/user/${userId}`);
  return response.data;
};


