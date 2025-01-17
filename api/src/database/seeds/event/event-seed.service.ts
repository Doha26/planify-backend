import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { StatusEnum } from '@/utils/shared/statuses.enum';
import {
  EventEntity,
  EventPermission,
  EventType,
} from '@/events/persistance/entities/event.entity';
import { UserEntity } from '@/users/persistance/entities/user.entity';

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
      permissions: { 1: [EventPermission.ALL] },
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
      permissions: { 1: [EventPermission.ALL] },
      status: StatusEnum.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    console.log('Events seeded successfully');
  }
}
