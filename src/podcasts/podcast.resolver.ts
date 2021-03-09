import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
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
import { EpisodesInput, EpisodesOutput } from './dtos/episodes.dto';
import { PodcastInput, PodcastOutput } from './dtos/podcast.dto';
import { PodcastsOutput } from './dtos/podcasts.dto';
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

@Resolver()
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query(returns => PodcastsOutput)
  @Role(['Any'])
  getPodcasts(): Promise<PodcastsOutput> {
    return this.podcastService.getPodcasts();
  }

  @Mutation(returns => CreatePodcastOutput)
  @Role(['Host'])
  createPodcast(
    @Args('input') createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    return this.podcastService.createPodcast(createPodcastInput);
  }

  @Query(returns => PodcastOutput)
  @Role(['Any'])
  getPodcast(
    @Args('input') podcastInput: PodcastInput,
  ): Promise<PodcastOutput> {
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
  detelePodcast(
    @Args('input') deletePodcastInput: DeletePodcastInput,
  ): Promise<DeletePodcastOutput> {
    return this.podcastService.detelePodcast(deletePodcastInput);
  }

  @Query(returns => EpisodesOutput)
  @Role(['Any'])
  getEpisodes(
    @Args('input') episodesInput: EpisodesInput,
  ): Promise<EpisodesOutput> {
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
}
