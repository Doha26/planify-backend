import { AxiosResponse } from "axios";

export enum UserRole {
    admin = 'admin',
    user = 'user'
  }
  
  export enum UserStatus {
    active = 'active',
    inactive = 'inactive'
  }
  
  export enum UserGroups {
    admin = 'admin',
    user = 'user'
  }
  
  export enum EventType {
    personal = 'personal',
    team = 'team',
    project = 'project'
  }
  
  export enum AvailabilityDay {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday'
  }

  interface RequestSuccessResponse {
    ok: true;
    error: null;
    status: number;
  }
  
  // Define the error response
  interface RequestErrorResponse {
    ok: false;
    error: string;
    status: number;
  }
  
  export interface AuthResponseData  {
    ok: boolean;
    error?: null;
    token?: string;
    user?: User;
  }

  export interface RegisterResponseData {
    user: User;
  }

  export type AuthResponse = AxiosResponse & (RequestSuccessResponse & AuthResponseData | RequestErrorResponse);
  export type RegisterResponse = AxiosResponse & (RequestSuccessResponse & RegisterResponseData | RequestErrorResponse);
  
  

  export interface LoginCredentials {
    email: string;
    password: string;
  }

  export interface RegisterCredentials extends LoginCredentials {
    firstName: string;
    lastName: string;
    provider: string;
    socialId: string | null;
    groups: UserGroups[];
    events: UserEvents [];
    role: UserRole;
  }

  export interface User {
    token:string;
    refreshToken:string;
    tokenExpires: number;
    id: number;
    email: string | null;
    password: string | null;
    provider: string;
    socialId: string | null;
    firstName: string | null;
    lastName: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: UserRole;
    status: UserStatus;
    groups: UserGroups;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    
    // Relations
    sessions?: SessionUser[];
    accounts?: Account[];
    events?: UserEvents[];
    eventTypes?: EventTypeEntity[];
    availability?: Availability[];
  }
  
  export interface SessionUser {
    id: number;
    userId: number;
    hash: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    sessionToken: string | null;
    expires: Date | null;
    
    // Relations
    user?: User;
  }

  export interface Session {
    user: User;
    expires: string;
    accessToken: string;
  }
  
  export interface Account {
    userId: number;
    type: string;
    provider: string | null;
    providerAccountId: string | null;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
    createdAt: Date;
    updatedAt: Date;
    
    // Relations
    user?: User;
  }
  
  export interface Event {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    startTime: Date;
    endTime: Date;
    type: EventType;
    permissions: any | null; // You might want to type this more specifically
    description: string | null;
    location: string | null;
    isRecurring: boolean;
    recurrencePattern: string | null;
    
    // Relations
    userEvents?: UserEvents[];
  }
  
  export interface UserEvents {
    userId: number;
    eventId: number;
    
    // Relations
    user?: User;
    event?: Event;
  }
  
  export interface EventTypeEntity {
    id: number;
    title: string;
    duration: number;
    url: string | null;
    description: string | null;
    active: boolean;
    videoCallSoftware: string;
    userId: number | null;
    createdAt: Date;
    
    // Relations
    user?: User;
  }
  
  export interface Availability {
    id: string;
    day: AvailabilityDay;
    fromTime: string | null;
    tillTime: string | null;
    isActive: boolean;
    userId: number | null;
    createdAt: Date;
    updatedAt: Date;
    
    // Relations
    user?: User;
  }
  
  export interface VerificationToken {
    identifier: string;
    token: string;
    expires: Date;
  }