// types/event.ts
export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    organizerId: string;
    capacity: number;
    price: number;
    status: 'draft' | 'published' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type CreateEventDTO = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;
  export type UpdateEventDTO = Partial<CreateEventDTO>;
  