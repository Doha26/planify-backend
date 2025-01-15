import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import ms from 'ms';
import crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthProvidersEnum } from './auth-providers.enum';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { NullableType } from '@/utils/types/nullable.type';
import { LoginResponseDto } from './dto/login-response.dto';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { UsersService } from '@/users/users.service';
import { AllConfigType } from '@/config/config.type';
import { Session } from '@/session/domain/session';
import { SessionService } from '@/session/session.service';
import { StatusEnum } from '@/utils/shared/statuses.enum';
import { UserDomain as User } from '@/users/domain/user';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private configService: ConfigService<AllConfigType>,
    private mailService: MailService,
  ) {}

  /**
   * Validates user login with email and password.
   *
   * @param loginDto Contains the user's email and password.
   * @returns A LoginResponseDto containing the tokens, user data, and expiration time.
   * @throws UnprocessableEntityException If the email is not found, the provider is invalid,
   * or the password is incorrect.
   */
  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: `needLoginViaProvider:${user.provider}`,
        },
      });
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.create({
      user,
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  /**
   * Registers a new user and sends a confirmation email.
   *
   * @param dto Registration data, including email, password, and other optional fields.
   * @returns The newly created user or null if the registration fails.
   * @throws UnprocessableEntityException If user creation fails or email sending encounters issues.
   */
  async register(dto: AuthRegisterLoginDto): Promise<User | null> {
    let user: User | null = null;
    try {
      if (!dto.email) {
        throw new UnprocessableEntityException('Email is required');
      }

      user = await this.usersService.create({
        ...dto,
        email: dto.email,
        role: dto.role,
        status: dto.status,
        events: dto.events,
        provider: 'email',
        socialId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        groups: dto.groups,
      });

      if (!user) {
        throw new UnprocessableEntityException('User creation failed');
      }
      const hash = await this.jwtService.signAsync(
        {
          confirmEmailUserId: user.id,
        },
        {
          secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
            infer: true,
          }),
        },
      );
      await this.mailService.userSignUp({
        to: dto.email,
        data: {
          hash,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        // This is an expected validation failure
        throw error;
      }

      // Handle errors related to user creation
      if (
        error.message.includes('user creation failed') ||
        error.message.includes('email')
      ) {
        throw new UnprocessableEntityException(
          'Failed to register user or send confirmation email',
        );
      }

      // Handle unexpected errors like database failures, etc.
      throw new InternalServerErrorException(
        'An unexpected error occurred during registration',
      );
    }
  }

  /**
   * Confirms a user's email using a verification hash.
   *
   * @param hash The hash sent to the user's email for verification.
   * @throws UnprocessableEntityException If the hash is invalid.
   * @throws NotFoundException If the user associated with the hash is not found or inactive.
   */
  async confirmEmail(hash: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `Unable to find user assocated with this hash`,
      });
    }

    if (user?.status !== StatusEnum.INACTIVE) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        error: `This user account is already active`,
      });
    }

    user.status = StatusEnum.ACTIVE;

    const updateUserDto: UpdateUserDto = {
      ...user,
      events: user.events?.map((event) => event.id),
    };

    await this.usersService.update(user.id, updateUserDto);
  }

  /**
   * Confirms a user's new email using a verification hash.
   *
   * @param hash The hash sent to the new email for verification.
   * @throws UnprocessableEntityException If the hash is invalid.
   * @throws NotFoundException If the user associated with the hash is not found.
   */
  async confirmNewEmail(hash: string): Promise<void> {
    let userId: User['id'];
    let newEmail: User['email'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
        newEmail: User['email'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
      newEmail = jwtData.newEmail;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `notFound`,
      });
    }

    user.email = newEmail;
    user.status = StatusEnum.ACTIVE;

    const updateUserDto: UpdateUserDto = {
      ...user,
      events: user.events?.map((event) => event.id),
    };

    await this.usersService.update(user.id, updateUserDto);
  }

  /**
   * Initiates a password recovery process by sending a reset link.
   *
   * @param email The user's email address.
   * @throws UnprocessableEntityException If the email is not found in the system.
   */

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'emailNotExists',
        },
      });
    }
  }

  /**
   * Resets a user's password using a reset hash.
   *
   * @param hash The hash sent to the user's email for password reset.
   * @param password The new password to be set.
   * @throws UnprocessableEntityException If the hash is invalid or the user is not found.
   */
  async resetPassword(hash: string, password: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
      });

      userId = jwtData.forgotUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `notFound`,
        },
      });
    }

    user.password = password;

    await this.sessionService.deleteByUserId({
      userId: user.id,
    });

    const updateUserDto: UpdateUserDto = {
      ...user,
      events: user.events?.map((event) => event.id),
    };

    await this.usersService.update(user.id, updateUserDto);
  }

  /**
   * Retrieves the current authenticated user's information.
   *
   * @param userJwtPayload The JWT payload containing the user's ID and session data.
   * @returns The authenticated user's details or null if the user is not found.
   */

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return await this.usersService.findById(userJwtPayload.id);
  }

  /**
   * Updates a user's profile information, including password and email changes.
   *
   * @param userJwtPayload The JWT payload containing the user's ID.
   * @param userDto The updated user data.
   * @returns The updated user details or null if the user is not found.
   * @throws UnprocessableEntityException If password validation fails or email is already taken.
   */
  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    const currentUser = await this.usersService.findById(userJwtPayload.id);

    if (!currentUser) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'userNotFound',
        },
      });
    }

    if (userDto.password) {
      if (!userDto.oldPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'missingOldPassword',
          },
        });
      }

      if (!currentUser.password) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'incorrectOldPassword',
          },
        });
      }

      const isValidOldPassword = await bcrypt.compare(
        userDto.oldPassword,
        currentUser.password,
      );

      if (!isValidOldPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'incorrectOldPassword',
          },
        });
      } else {
        await this.sessionService.deleteByUserIdWithExclude({
          userId: currentUser.id,
          excludeSessionId: userJwtPayload.sessionId,
        });
      }
    }

    if (userDto.email && userDto.email !== currentUser.email) {
      const userByEmail = await this.usersService.findByEmail(userDto.email);

      if (userByEmail && userByEmail.id !== currentUser.id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailExists',
          },
        });
      }
    }

    delete userDto.email;
    delete userDto.oldPassword;

    await this.usersService.update(userJwtPayload.id, userDto);

    return this.usersService.findById(userJwtPayload.id);
  }

  /**
   * Refreshes an access token using a valid session ID and hash.
   *
   * @param data Contains the session ID and hash.
   * @returns An object with new access and refresh tokens and expiration time.
   * @throws UnauthorizedException If the session or hash is invalid.
   */
  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId' | 'hash'>,
  ): Promise<Omit<LoginResponseDto, 'user'>> {
    const session = await this.sessionService.findById(data.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.usersService.findById(session.user.id);

    if (!user?.role) {
      throw new UnauthorizedException();
    }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      role: user.role,
      sessionId: session.id,
      hash,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  /**
   * Soft-deletes a user's account by marking it as removed.
   *
   * @param user The user to be soft-deleted.
   */
  async softDelete(user: User): Promise<void> {
    await this.usersService.remove(user.id);
  }

  /**
   * Logs out the user by deleting the specified session.
   *
   * @param data Contains the session ID to be deleted.
   * @returns A promise that resolves once the session is deleted.
   */
  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return await this.sessionService.deleteById(data.sessionId);
  }

  /**
   * Generates access and refresh tokens with expiration data.
   *
   * @param data Contains user ID, role, session ID, and hash for token creation.
   * @returns An object with tokens and expiration time.
   */
  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
    hash: Session['hash'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
