
'use client';

import { useState } from 'react';
import { EventService } from '@/services/event.service';
import type { Event, CreateEventDTO, UpdateEventDTO } from '@/types/event';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async (params?: { page?: number; limit?: number }) => {
    try {
      setLoading(true);
      const data = await EventService.getEvents(params);
      setEvents(data);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (data: CreateEventDTO) => {
    try {
      setLoading(true);
      const newEvent = await EventService.createEvent(data);
      setEvents([...events, newEvent]);
      return newEvent;
    } catch (err) {
      setError('Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
  };
}
