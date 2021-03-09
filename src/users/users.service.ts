import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { SeeProfileInput, SeeProfileOutput } from './dtos/see-profile.dto';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const userExists = await this.users.findOne({ email });
      if (userExists) {
        return { ok: false, error: ' There is a user with that email already' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      const verification = await this.verifications.save(
        this.verifications.create({ user }),
      );
      // send verification by email
      return { ok: true };
    } catch (error) {
      return { ok: false, error: "Can't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) {
        return { ok: false, error: 'User not found' };
      }
      const isCorrect = await user.checkPassword(password);
      if (!isCorrect) {
        return { ok: false, error: 'Wrong password!' };
      }
      const token = this.jwtService.sign(user.id);
      return { ok: true, token };
    } catch (error) {
      return { ok: false, error: "Can't log user in" };
    }
  }

  // helper function only
  // async findUserById(id: number): Promise<SeeProfileOutput> {
  //   try {
  //     const user = await this.users.findOneOrFail({ id });
  //     return { ok: true, user };
  //   } catch (error) {
  //     return { ok: false, error };
  //   }
  // }

  async seeProfile({ id }: SeeProfileInput): Promise<SeeProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ id });
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async editProfile(
    id,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne(id);
      if (email) {
        user.email = email;
        user.isVerified = false;
        await this.verifications.delete({ user: { id: user.id } });
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        // send email
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not update profile' };
    }
  }
}
