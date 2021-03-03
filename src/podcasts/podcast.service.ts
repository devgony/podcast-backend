import { Injectable, NotFoundException } from '@nestjs/common';
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
  private podcastsDB: Podcast[] = [DEFAULT_DATA];

  podcasts(): PodcastsOutput {
    return { podcasts: this.podcastsDB };
  }

  createPodcast(createPodcastInput: CreatePodcastInput): CreatePodcastOutput {
    const id = Date.now();
    this.podcastsDB.push({
      id,
      ...createPodcastInput,
    });
    return { id };
  }

  getPodcast(podcastId: number): PodcastOutput {
    const podcast = this.podcastsDB.find(podcast => podcast.id === +podcastId);
    if (!podcast) {
      throw new NotFoundException(`Podcast ID: ${podcastId} does not exist.`);
    }
    return { podcast };
  }

  updatePodcast(updatePodcastInput: UpdatePodcastInput): UpdatePodcastOutput {
    const { podcast } = this.getPodcast(updatePodcastInput.podcastId);
    this.detelePodcast(updatePodcastInput.podcastId);
    this.podcastsDB.push({ ...podcast, ...updatePodcastInput });
    return { ok: true };
  }

  detelePodcast(podcastId: number): DeletePodcastOutput {
    this.getPodcast(podcastId);
    this.podcastsDB = this.podcastsDB.filter(
      podcast => podcast.id !== +podcastId,
    );
    return { ok: true };
  }

  episodes({ id: podcastId }: EpisodesInput): EpisodesOutput {
    const { podcast } = this.getPodcast(podcastId);
    return { ok: true, episodes: podcast.episodes };
  }

  getEpisode(podcastId: number, episodeId: number) {
    const episode = this.getPodcast(podcastId).podcast.episodes.find(
      episode => episode.id === +episodeId,
    );
    if (!episode) {
      throw new NotFoundException(`episode ID: ${episodeId} does not exist.`);
    }
    return episode;
  }

  createEpisode(createEpisodeInput: CreateEpisodeInput): CreateEpisodeOutput {
    if (this.getPodcast(createEpisodeInput.podcastId).podcast.episodes) {
      this.getPodcast(createEpisodeInput.podcastId).podcast.episodes.push({
        id: Date.now(),
        content: createEpisodeInput.content,
      });
      return { ok: true };
    } else {
      return { ok: false };
    }
  }

  updateEpisode({ podcastId, episodeId, ...episodeData }: UpdateEpisodeInput) {
    const episode = this.getEpisode(podcastId, episodeId);
    this.deleteEpisode({ podcastId, episodeId });
    this.podcastsDB
      .find(podcast => podcast.id === +podcastId)
      .episodes.push({ ...episode, ...episodeData });
    return { ok: true };
  }

  deleteEpisode({
    podcastId,
    episodeId,
  }: DeleteEpisodeInput): DeleteEpisodeOutput {
    this.getEpisode(podcastId, episodeId);
    this.podcastsDB = this.podcastsDB.map(podcast => ({
      ...podcast,
      episodes: podcast.episodes.filter(episode => episode.id !== +episodeId),
    }));
    return { ok: true };
  }
}
