import { Args, Mutation, PickType, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dtos/delete-episode.dto';
import {
  DeletePodcastInput,
  DeletePodcastOutput,
} from './dtos/delete-podcast.dto';
import { GetCategoriesOutput } from './dtos/get-categories';
import { GetEpisodesInput, GetEpisodesOutput } from './dtos/get-episodes.dto';
import { GetPodcastInput, GetPodcastOutput } from './dtos/get-podcast.dto';
import {
  GetPodcastsByCategoryInput,
  GetPodcastsByCategoryOutput,
} from './dtos/get-podcasts-by-category';
import { GetPodcastsOutput } from './dtos/get-podcasts.dto';
import { LikePodcastInput, LikePodcastOutput } from './dtos/like-podcast.dto';
import {
  ReviewPodcastInput,
  ReviewPodcastOutput,
} from './dtos/review-podcast.dto';
import {
  SearchPodcastsInput,
  SearchPodcastsOutput,
} from './dtos/search-podcasts.dto';
import {
  UpdateEpisodeInput,
  UpdateEpisodeOutput,
} from './dtos/update-episode.dto';
import {
  UpdatePodcastInput,
  UpdatePodcastOutput,
} from './dtos/update-podcast.dto';
import { Podcast } from './entities/podcast.entity';
import { PodcastService } from './podcast.service';

@Resolver(of => Podcast)
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query(returns => GetPodcastsOutput)
  @Role(['Any'])
  getPodcasts(): Promise<GetPodcastsOutput> {
    return this.podcastService.getPodcasts();
  }

  @Mutation(returns => CreatePodcastOutput)
  @Role(['Host'])
  createPodcast(
    @AuthUser() authUser: User,
    @Args('input') createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    return this.podcastService.createPodcast(authUser, createPodcastInput);
  }

  @Query(returns => GetPodcastOutput)
  @Role(['Any'])
  getPodcast(
    @Args('input') podcastInput: GetPodcastInput,
  ): Promise<GetPodcastOutput> {
    return this.podcastService.getPodcast(podcastInput);
  }

  @Mutation(returns => UpdatePodcastOutput)
  @Role(['Host'])
  updatePodcast(
    @Args('input') updatePodcastInput: UpdatePodcastInput,
  ): Promise<UpdatePodcastOutput> {
    return this.podcastService.updatePodcast(updatePodcastInput);
  }

  @Mutation(returns => DeletePodcastOutput)
  @Role(['Host'])
  deletePodcast(
    @Args('input') deletePodcastInput: DeletePodcastInput,
  ): Promise<DeletePodcastOutput> {
    return this.podcastService.deletePodcast(deletePodcastInput);
  }

  @Query(returns => GetEpisodesOutput)
  @Role(['Any'])
  getEpisodes(
    @Args('input') episodesInput: GetEpisodesInput,
  ): Promise<GetEpisodesOutput> {
    return this.podcastService.getEpisodes(episodesInput);
  }

  @Mutation(returns => CreateEpisodeOutput)
  @Role(['Host'])
  createEpisode(
    @Args('input') createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    return this.podcastService.createEpisode(createEpisodeInput);
  }

  @Mutation(returns => UpdateEpisodeOutput)
  @Role(['Host'])
  updateEpisode(
    @Args('input') updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<UpdateEpisodeOutput> {
    return this.podcastService.updateEpisode(updateEpisodeInput);
  }

  @Mutation(returns => DeleteEpisodeOutput)
  @Role(['Host'])
  deleteEpisode(
    @Args('input') deleteEpisodeInput: DeleteEpisodeInput,
  ): Promise<DeleteEpisodeOutput> {
    return this.podcastService.deleteEpisode(deleteEpisodeInput);
  }

  @Mutation(returns => LikePodcastOutput)
  @Role(['Listener']) // only listeners can like or dislike
  likePodcast(
    @AuthUser() { id: userId }: User,
    @Args('input') podcastId: number,
  ): Promise<LikePodcastOutput> {
    return this.podcastService.likePodcast({ userId, podcastId });
  }

  @Query(returns => SearchPodcastsOutput)
  @Role(['Listener'])
  searchPodcasts(
    @Args('input') searchPodcastsInput: SearchPodcastsInput,
  ): Promise<SearchPodcastsOutput> {
    return this.podcastService.searchPodcasts(searchPodcastsInput);
  }

  @Mutation(returns => ReviewPodcastOutput)
  @Role(['Listener'])
  reviewPodcastInput(
    @AuthUser() { id: userId }: User,
    @Args('input') reviewPodcastInput: ReviewPodcastInput,
  ): Promise<ReviewPodcastOutput> {
    return this.podcastService.reviewPodcast(userId, reviewPodcastInput);
  }

  @Query(returns => GetPodcastsByCategoryOutput)
  @Role(['Any'])
  getPodcastsByCategory(
    @Args('input') getPodcastsByCategoryInput: GetPodcastsByCategoryInput,
  ): Promise<GetPodcastsByCategoryOutput> {
    return this.podcastService.getPodcastsByCategory(
      getPodcastsByCategoryInput,
    );
  }

  // @Query(returns => GetCategoriesOutput)
  // @Role(['Any'])
  // getCategories(): Promise<GetCategoriesOutput> {
  //   return this.podcastService.getCategories();
  // }

  @Query(returns => GetCategoriesOutput)
  @Role(['Any'])
  getCategories(): Promise<GetCategoriesOutput> {
    return this.podcastService.getCategories();
  }
}
