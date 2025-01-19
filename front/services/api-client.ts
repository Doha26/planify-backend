// front/src/lib/api-client.ts
import axios from 'axios';
import { config } from '../config';
import { auth } from '../lib/auth';

const apiClient = axios.create({
  baseURL: `${config.api.url}/api/v1/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const session: any = await auth();
    if (session?.user?.token) {
      config.headers.Authorization = `Bearer ${session.user.token}`;
    }
  }
  return config;
});

export default apiClient;
