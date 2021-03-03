import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
  podcasts(): PodcastsOutput {
    return this.podcastService.podcasts();
  }

  @Mutation(returns => CreatePodcastOutput)
  createPodcast(
    @Args('input') createPodcastInput: CreatePodcastInput,
  ): CreatePodcastOutput {
    return this.podcastService.createPodcast(createPodcastInput);
  }

  @Query(returns => PodcastOutput)
  getPodcast(@Args('input') podcastInput: PodcastInput): PodcastOutput {
    return this.podcastService.getPodcast(podcastInput.id);
  }

  @Mutation(returns => UpdatePodcastOutput)
  updatePodcast(
    @Args('input') updatePodcastInput: UpdatePodcastInput,
  ): UpdatePodcastOutput {
    return this.podcastService.updatePodcast(updatePodcastInput);
  }

  @Mutation(returns => DeletePodcastOutput)
  detelePodcast(
    @Args('input') deletePodcastInput: DeletePodcastInput,
  ): DeletePodcastOutput {
    return this.podcastService.detelePodcast(deletePodcastInput.id);
  }

  @Query(returns => EpisodesOutput)
  episodes(@Args('input') episodesInput: EpisodesInput): EpisodesOutput {
    return this.podcastService.episodes(episodesInput);
  }

  @Mutation(returns => CreateEpisodeOutput)
  createEpisode(
    @Args('input') createEpisodeInput: CreateEpisodeInput,
  ): CreateEpisodeOutput {
    return this.podcastService.createEpisode(createEpisodeInput);
  }

  @Mutation(returns => UpdateEpisodeOutput)
  updateEpisode(
    @Args('input') updateEpisodeInput: UpdateEpisodeInput,
  ): UpdateEpisodeOutput {
    return this.podcastService.updateEpisode(updateEpisodeInput);
  }

  @Mutation(returns => DeleteEpisodeOutput)
  deleteEpisode(
    @Args('input') deleteEpisodeInput: DeleteEpisodeInput,
  ): DeleteEpisodeOutput {
    return this.podcastService.deleteEpisode(deleteEpisodeInput);
  }
}
