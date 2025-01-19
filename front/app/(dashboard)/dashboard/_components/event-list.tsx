'use client';

import { useEvents } from '@/hooks/useEvent';
import { useEffect } from 'react';

export function EventList() {
  const { events, loading, error, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <div key={event.id} className="bg-card rounded-lg p-4">
          <h2 className="text-lg font-bold">{event.title}</h2>
          <p>{event.description}</p>
          </div>
      ))}
    </div>
  );
}
