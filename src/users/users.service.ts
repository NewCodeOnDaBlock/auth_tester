import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
// import { User } from '@users/entity/user.entity';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = createUserDto;

    const existingUser = await this.em.findOne(User, { email });
    if (existingUser) {
      throw new ConflictException('Email is already in use.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.em.create(User, {
      ...rest,
      email,
      password: hashedPassword,
      emailVerified: false,
    });

    await this.em.persistAndFlush(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.em.find(User, {});
    return users;
  }

  async findById(id: string): Promise<User> {
    const user = await this.em.findOne(User, { id });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.em.findOne(User, { email });
    return user;
  }

  async hashRefreshToken(token: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(token, saltRounds);
  }

  async compareRefreshToken(
    plainRefreshToken: string,
    hashedRefreshToken: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainRefreshToken, hashedRefreshToken);
  }

  async update(userData: UpdateUserDto, id: string): Promise<User> {
    const { password, ...newUserData } = userData;
    const user: User | undefined = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    Object.assign(user, newUserData);

    if (password) {
      await this.updatePassword(id, password);
    }

    await this.em.flush();
    return user;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);
    user.password = await bcrypt.hash(newPassword, 10);
    await this.em.flush();
  }

  async confirmEmail(email: string): Promise<User | undefined> {
    const user = await this.em.findOne(User, { email });
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found.`);
    }
    user.emailVerified = true;
    await this.em.flush();
    return user;
  }

  async delete(id: string): Promise<void> {
    const userToDelete = await this.em.getReference(User, id);
    console.log('userToDelete', userToDelete);
    await this.em.remove(userToDelete).flush();
    if (!userToDelete) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    console.info(`User with ID "${id}" has been deleted.`);
  }

  async findByVerificationToken(
    emailverificationToken: string,
  ): Promise<User | undefined> {
    const user = await this.em.findOne(User, {
      emailverificationToken: emailverificationToken,
    });
    return user;
  }
}
