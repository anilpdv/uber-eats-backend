import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { CreateAccountInput } from './dtos/create-account-dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { VerifyEmailInput } from './dtos/verify-email.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verfications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<[boolean, string?]> {
    try {
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        return [false, 'user with email already exist'];
      }

      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      const verfication = await this.verfications.save(
        this.verfications.create({ user }),
      );
      this.mailService.sendVerificationEmail(user.email, verfication.code);
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
      const user = await this.users.findOne({
        where: { email },
        select: ['password', 'id'],
      });
      if (!user) {
        return [false, 'user not found'];
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return [false, 'Wrong Password'];
      }

      const token = this.jwtService.sign({ id: user.id });

      return [true, '', token];
    } catch (error) {
      return [false, error];
    }
  }

  async findById(id: number): Promise<User> {
    return this.users.findOneBy({ id });
  }

  async editProfile(userId: number, editProfileInput: EditProfileInput) {
    const user = await this.users.findOneBy({ id: userId });
    if (editProfileInput.password) {
      user.password = editProfileInput.password;
    }

    if (editProfileInput.email) {
      user.email = editProfileInput.email;
      user.verified = false;
      const verfication = await this.verfications.save(
        this.verfications.create({ user }),
      );

      this.mailService.sendVerificationEmail(user.email, verfication.code);
    }

    return this.users.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
    try {
      const verification = await this.verfications.findOne({
        where: { code },
        relations: ['user'],
      });

      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verfications.delete(verification.id);
        return true;
      }
      throw new Error();
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
