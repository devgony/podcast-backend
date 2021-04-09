import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import {
  DidISubscribeInput,
  DidISubscribeOutput,
} from './dtos/did-I-subscribe.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { GetMyListenersOutput } from './dtos/get-my-listeners';
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
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(returns => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation(returns => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query(returns => User)
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query(returns => SeeProfileOutput)
  @Role(['Any'])
  seeProfile(
    @Args('input') seeProfileInput: SeeProfileInput,
  ): Promise<SeeProfileOutput> {
    return this.usersService.seeProfile(seeProfileInput);
  }

  @Mutation(returns => EditProfileOutput)
  @Role(['Any'])
  editProfile(
    @AuthUser() { id }: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile({ id }, editProfileInput);
  }

  @Mutation(returns => SubscribeToPodcastOutput)
  @Role(['Listener'])
  subscribeToPodcast(
    @AuthUser() { id: userId }: User,
    @Args('input') subscribeToPodcastInput: SubscribeToPodcastInput,
  ): Promise<SubscribeToPodcastOutput> {
    return this.usersService.subscribeToPodcast(
      userId,
      subscribeToPodcastInput,
    );
  }

  @Query(returns => SeeSubscriptionsOutput)
  @Role(['Listener'])
  seeSubscriptions(@AuthUser() { id }: User): Promise<SeeSubscriptionsOutput> {
    return this.usersService.seeSubscriptions(id);
  }

  @Mutation(returns => MarkEpisodeAsPlayedOutput)
  @Role(['Listener'])
  markEpisodeAsPlayed(
    @AuthUser() { id: userId }: User,
    @Args('input') MarkEpisodeAsPlayedInput: MarkEpisodeAsPlayedInput,
  ): Promise<MarkEpisodeAsPlayedOutput> {
    return this.usersService.markEpisodeAsPlayed(
      userId,
      MarkEpisodeAsPlayedInput,
    );
  }

  @Query(returns => DidISubscribeOutput)
  @Role(['Listener'])
  didISubscribe(
    @AuthUser() { id }: User,
    @Args('input') didISubscribeInput: DidISubscribeInput,
  ): Promise<DidISubscribeOutput> {
    return this.usersService.didISubscribe(id, didISubscribeInput);
  }

  @Query(returns => GetMyListenersOutput)
  @Role(['Host'])
  getMyListeners(@AuthUser() owner: User): Promise<GetMyListenersOutput> {
    return this.usersService.getMyListeners(owner);
  }
}
