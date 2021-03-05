import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
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
import { UpdateEpisodeInput } from './dtos/update-episode.dto';
import {
  UpdatePodcastInput,
  UpdatePodcastOutput,
} from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';

const DEFAULT_DATA = {
  id: 1614785562236,
  title: 'defaultTitle',
  rating: 1.5,
  category: 'default',
  episodes: [
    {
      id: 1614785602712,
      content: 'defaultEpisodeContent',
    },
  ],
};

@Injectable()
export class PodcastService {
  constructor(
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
  ) {}
  // private podcasts: Podcast[] = [DEFAULT_DATA];

  async getPodcasts(): Promise<PodcastsOutput> {
    try {
      const podcasts = await this.podcasts.find();
      return {
        ok: true,
        podcasts,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async createPodcast(
    createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    try {
      await this.podcasts.save(this.podcasts.create(createPodcastInput));
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async getPodcast({ id }: PodcastInput): Promise<PodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(id);
      if (!podcast) {
        return {
          ok: false,
          error: 'Podcast not found',
        };
      }
      return { ok: true, podcast };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async updatePodcast(
    updatePodcastInput: UpdatePodcastInput,
  ): Promise<UpdatePodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(updatePodcastInput.id);
      if (!podcast) {
        return { ok: false, error: 'Podcast not found' };
      }
      await this.podcasts.save([updatePodcastInput]);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async detelePodcast({
    id,
  }: DeletePodcastInput): Promise<DeletePodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(id);
      if (!podcast) {
        return { ok: false, error: 'Podcast not found' };
      }
      await this.podcasts.delete(id);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async getEpisodes({ podcastId }: EpisodesInput): Promise<EpisodesOutput> {
    try {
      const episodes = await this.episodes.find({
        podcast: { id: podcastId },
      });
      if (!episodes) {
        return { ok: false, error: 'Episode not found' };
      }
      return { ok: true, episodes };
    } catch (error) {
      return { ok: false, error };
    }
  }

  // async getEpisode(podcastId: number, episodeId: number) {
  //   const episode = this.getPodcast(podcastId).podcast.episodes.find(
  //     episode => episode.id === +episodeId,
  //   );
  //   if (!episode) {
  //     throw new NotFoundException(`episode ID: ${episodeId} does not exist.`);
  //   }
  //   return episode;
  // }

  async createEpisode(
    createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    try {
      const podcast = await this.podcasts.findOne({
        id: createEpisodeInput.podcastId,
      });
      if (!podcast) {
        return { ok: false, error: 'Podcast to create episode not found' };
      }
      await this.episodes.save(
        this.episodes.create({ ...createEpisodeInput, podcast }),
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async updateEpisode(
    updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<UpdatePodcastOutput> {
    try {
      const episode = await this.episodes.findOne(updateEpisodeInput.id);
      if (!episode) {
        return { ok: false, error: 'Episode not found' };
      }
      await this.episodes.save([{ ...updateEpisodeInput }]);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async deleteEpisode(
    deleteEpisodeInput: DeleteEpisodeInput,
  ): Promise<DeleteEpisodeOutput> {
    try {
      const episode = await this.episodes.findOne(deleteEpisodeInput.id);
      if (!episode) {
        return { ok: false, error: 'Episode not found' };
      }
      await this.episodes.delete(deleteEpisodeInput.id);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
