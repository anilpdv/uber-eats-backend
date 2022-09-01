import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { CreateAccountInput } from './dtos/create-account-dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<[boolean, string?]> {
    try {
      const exists = await this.users.findOneBy({ email });
      if (exists) {
        return [false, 'user with email already exist'];
      }

      await this.users.save(this.users.create({ email, password, role }));
      return [true];
    } catch (err) {
      return [false, 'unable to create user'];
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<[boolean, string?, string?]> {
    try {
      const user = await this.users.findOneBy({ email });
      if (!user) {
        return [false, 'user not found'];
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return [false, 'Wrong Password'];
      }

      const token = await jwt.sign(
        { id: user.id },
        this.config.get('SECRET_KEY'),
      );

      return [true, '', token];
    } catch (error) {
      return [false, error];
    }
  }
}
