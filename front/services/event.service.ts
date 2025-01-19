// services/event.service.ts

import type { Event, CreateEventDTO, UpdateEventDTO } from '@/types/event';
import apiClient from './api-client';

export class EventService {
  static async getEvents(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const response = await apiClient.get('/events', { params });
    return response.data;
  }

  static async getEvent(id: string) {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  }

  static async createEvent(data: CreateEventDTO) {
    const response = await apiClient.post('/events', data);
    return response.data;
  }

  static async updateEvent(id: string, data: UpdateEventDTO) {
    const response = await apiClient.patch(`/events/${id}`, data);
    return response.data;
  }

  static async deleteEvent(id: string) {
    await apiClient.delete(`/events/${id}`);
  }
}
