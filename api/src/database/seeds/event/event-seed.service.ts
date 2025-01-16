import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { StatusEnum } from '@/utils/shared/statuses.enum';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import {
  EventEntity,
  EventType,
} from '@/events/infrastructure/persistence/relational/entities/event.entity';

@Injectable()
export class EventSeedService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async run() {
    const existingEventsCount = await this.eventRepository.count();
    if (existingEventsCount > 0) {
      console.log('Events already seeded');
      return;
    }

    const user = await this.userRepository.findOne({
      where: { email: 'foujeupavel@gmail.com' }, // Adjust to match a seeded admin or user
    });

    if (!user) {
      throw new Error('User for event seeding not found.');
    }

    await this.eventRepository.save({
      title: 'Launch Event',
      description: 'An event to launch the product.',
      date: new Date('2025-01-20'),
      type: EventType.PERSONAL,
      location: 'Office',
      startTime: new Date('2025-01-11T08:00:00'),
      endTime: new Date('2025-01-11T17:00:00'),
      participants: [user],
      status: StatusEnum.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await this.eventRepository.save({
      title: 'Team Building Retreat',
      description: 'A retreat to build team morale.',
      date: new Date('2025-03-15'),
      location: 'Remote',
      type: EventType.PROJECT,
      startTime: new Date('2025-01-11T08:00:00'),
      endTime: new Date('2025-01-11T17:00:00'),
      participants: [user],
      status: StatusEnum.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    console.log('Events seeded successfully');
  }
}
