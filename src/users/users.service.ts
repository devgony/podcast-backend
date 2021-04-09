import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Episode } from 'src/podcasts/entities/episode.entity';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Connection, getConnection, Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import {
  DidISubscribeInput,
  DidISubscribeOutput,
} from './dtos/did-I-subscribe.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  MarkEpisodeAsPlayedInput,
  MarkEpisodeAsPlayedOutput,
} from './dtos/mark-episode-as-played.dto';
import { SeeProfileInput, SeeProfileOutput } from './dtos/see-profile.dto';
import { SeeSubscriptionsOutput } from './dtos/see-subscriptions.dto';
import {
  SubscribeToPodcastInput,
  SubscribeToPodcastOutput,
} from './dtos/subscribe-to-podcast.dto';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
    // @InjectRepository(subscribedPodcast) private readonly subscribedPodcasts: Repository<subscribedPodcast>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private connection: Connection,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const userExists = await this.users.findOne({ email });
      if (userExists) {
        return { ok: false, error: 'There is a user with that email already' };
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
      console.log(error);
      return { ok: false, error: "Couldn't create account" };
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
      console.log(error);
      return { ok: false, error: "Couldn't log user in" };
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
      return { ok: false, error: 'User Not Found' };
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

  async subscribeToPodcast(
    userId: number,
    { podcastId }: SubscribeToPodcastInput,
  ): Promise<SubscribeToPodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(podcastId);
      if (!podcast) {
        return { ok: false, error: 'Podcast not found.' };
      }
      const user = await this.users.findOne(userId, {
        relations: ['subscribedPodcasts'],
      });
      console.log(user);
      if (!user) {
        return { ok: false, error: 'User not found.' };
      }
      const filterdSubscribedPodcasts = user.subscribedPodcasts.filter(
        podcast => podcast.id !== podcastId,
      );
      const subscribeExists =
        user.subscribedPodcasts.length !== filterdSubscribedPodcasts.length;
      if (subscribeExists) {
        user.subscribedPodcasts = filterdSubscribedPodcasts;
        await this.users.save(user);
      } else {
        user.subscribedPodcasts.push(podcast);
        await this.users.save(user);
      }
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Could not subscribe' };
    }
  }

  async seeSubscriptions(userId: number): Promise<SeeSubscriptionsOutput> {
    try {
      const user = await this.users.findOne(userId, {
        relations: ['subscribedPodcasts'],
      });
      const subscribedPodcasts = user.subscribedPodcasts;
      console.log(user.subscribedPodcasts);
      // const subscribedPodcasts = await this.podcasts
      //   .createQueryBuilder('P')
      //   .innerJoin(
      //     'user_subscribed_podcasts_podcast',
      //     'M',
      //     'P.id = "M"."podcastId"',
      //   )
      //   .where('"M"."userId" = :userId', { userId })
      //   .getMany();
      if (!subscribedPodcasts) {
        return { ok: false, error: 'subscribedPodcasts not found' };
      }
      return { ok: true, subscribedPodcasts };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Could not see subscription.' };
    }
  }

  async markEpisodeAsPlayed(
    userId,
    { episodeId }: MarkEpisodeAsPlayedInput,
  ): Promise<MarkEpisodeAsPlayedOutput> {
    try {
      const episode = await this.episodes.findOne(episodeId);
      if (!episode) {
        return { ok: false, error: 'episode not found.' };
      }
      const user = await this.users.findOne(userId, {
        relations: ['playedEpisodes'],
      });
      if (!user) {
        return { ok: false, error: 'User not found.' };
      }
      user.playedEpisodes.push(episode);
      await this.users.save(user);
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Could not mark as played' };
    }
  }

  async didISubscribe(
    userId: number,
    { podcastId }: DidISubscribeInput,
  ): Promise<DidISubscribeOutput> {
    try {
      // const subscribedUser = await this.users
      //   .createQueryBuilder('user')
      //   .innerJoin(
      //     'user_subscribed_podcasts_podcast',
      //     'subscribedPodcast',
      //     'user.id = :userId',
      //     { userId },
      //   )
      //   .andWhere('subscribedPodcast.podcastId = :podcastId', { podcastId })
      //   .getOne();
      const userSubscribed = await getConnection()
        .createQueryBuilder('user_subscribed_podcasts_podcast', 'A')
        // .select('count(*)')
        .where('"userId" = :userId', { userId })
        .andWhere('"podcastId" = :podcastId', { podcastId })
        .getRawOne();
      return { ok: true, userSubcribed: Boolean(userSubscribed) };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Could not check whether subscribe or not' };
    }
  }
}
