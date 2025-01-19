// lib/toast.ts
import toast from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'loading';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

const defaultOptions: ToastOptions = {
  duration: 5000,
  position: 'top-right',
};

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      ...defaultOptions,
      ...options,
      style: {
        background: '#22c55e',
        color: '#fff',
      },
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      ...defaultOptions,
      duration: 7000, // Longer duration for errors
      ...options,
      style: {
        background: '#ef4444',
        color: '#fff',
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      ...defaultOptions,
      style: {
        background: '#3b82f6',
        color: '#fff',
      },
    });
  },

  // For CRUD Operations
  created: (entity: string) => {
    toast.success(`${entity} created successfully`, {
      ...defaultOptions,
      style: {
        background: '#22c55e',
        color: '#fff',
      },
    });
  },

  updated: (entity: string) => {
    toast.success(`${entity} updated successfully`, {
      ...defaultOptions,
      style: {
        background: '#22c55e',
        color: '#fff',
      },
    });
  },

  deleted: (entity: string) => {
    toast.success(`${entity} deleted successfully`, {
      ...defaultOptions,
      style: {
        background: '#22c55e',
        color: '#fff',
      },
    });
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        ...defaultOptions,
        ...options,
      }
    );
  },
};
