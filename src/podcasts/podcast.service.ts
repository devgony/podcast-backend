import { Injectable, NotFoundException } from '@nestjs/common';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';

@Injectable()
export class PodcastService {
  private podcasts: Podcast[] = [];
  private episodes: Episode[] = [];

  allPodcasts(): Podcast[] {
    return this.podcasts;
  }

  createPodcast(podcastData: Podcast) {
    this.podcasts.push({
      id: this.podcasts.length + 1,
      ...podcastData,
    });
  }

  getPodcast(podcastId: string): Podcast {
    const podcast = this.podcasts.find((podcast) => podcast.id === +podcastId);
    if (!podcast) {
      throw new NotFoundException(`Podcast ID: ${podcastId} does not exist.`);
    }
    return podcast;
  }

  updatePodcast(podcastId: string, podcastData) {
    const podcast = this.getPodcast(podcastId);
    this.detelePodcast(podcastId);
    this.podcasts.push({ ...podcast, ...podcastData });
    return 'updatePodcast';
  }

  detelePodcast(podcastId: string) {
    this.getPodcast(podcastId);
    this.podcasts = this.podcasts.filter(
      (podcast) => podcast.id !== +podcastId,
    );
  }

  allEpisodes(podcastId: string) {
    const podcast = this.getPodcast(podcastId);
    return podcast.episodes;
  }

  getEpisode(podcastId: string, episodeId: string) {
    const episode = this.getPodcast(podcastId).episodes.find(
      (episode) => episode.id === +episodeId,
    );
    if (!episode) {
      throw new NotFoundException(`episode ID: ${episodeId} does not exist.`);
    }
    return episode;
  }

  createEpisode(podcastId: string, episodeData) {
    this.getPodcast(podcastId).episodes.push({
      id: this.getPodcast(podcastId).episodes.length + 1,
      ...episodeData,
    });
  }

  updateEpisode(podcastId: string, episodeId: string, episodeData) {
    const episode = this.getEpisode(podcastId, episodeId);
    this.deleteEpisode(podcastId, episodeId);
    this.podcasts
      .find((podcast) => podcast.id === +podcastId)
      .episodes.push({ ...episode, ...episodeData });
  }

  deleteEpisode(podcastId: string, episodeId: string) {
    this.getEpisode(podcastId, episodeId);
    this.podcasts = this.podcasts.map((podcast) => ({
      ...podcast,
      episodes: podcast.episodes.filter((episode) => episode.id !== +episodeId),
    }));
    console.log(this.podcasts);
  }
}
