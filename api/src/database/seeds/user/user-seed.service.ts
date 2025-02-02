import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { RoleEnum } from '@/utils/shared/roles.enum';
import { StatusEnum } from '@/utils/shared/statuses.enum';
import { EventEntity } from '@/events/persistance/entities/event.entity';
import { UserEntity } from '@/users/persistance/entities/user.entity';
import { SessionEntity } from '@/session/persistance/entities/session.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<UserEntity>,
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  async run() {
    await this.sessionRepository.delete({});
    // Delete all users before seed to avoir seed confits on user email if schema already exist
    await this.repository.delete({});

    const countAdmin = await this.repository.count({
      where: {
        role: RoleEnum.ADMIN,
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const events = await this.eventRepository.find();

      await this.repository.save(
        this.repository.create({
          firstName: 'Super',
          lastName: 'Admin',
          email: 'foujeupavel@gmail.com',
          password,
          role: RoleEnum.ADMIN,
          status: StatusEnum.ACTIVE,
          events,
          provider: 'email',
          socialId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          groups: [RoleEnum.ADMIN],
        }),
      );
    }

    const countUser = await this.repository.count({
      where: {
        role: RoleEnum.USER,
      },
    });

    if (!countUser) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password,
          role: RoleEnum.ADMIN,
          status: StatusEnum.ACTIVE,
        }),
      );
    }
  }
}
