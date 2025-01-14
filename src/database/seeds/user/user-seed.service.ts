import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { RoleEnum } from '@/utils/shared/roles.enum';
import { StatusEnum } from '@/utils/shared/statuses.enum';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { EventEntity } from '@/events/infrastructure/persistence/relational/entities/event.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  async run() {
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
