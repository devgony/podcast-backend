import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { Podcast } from './entities/podcast.entity';
import { PodcastService } from './podcast.service';

@Controller()
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Get('/podcasts')
  allPodcasts() {
    return this.podcastService.allPodcasts();
  }

  @Post('/podcasts')
  createPodcast(@Body() podcastData: Podcast) {
    return this.podcastService.createPodcast(podcastData);
  }

  @Get('/podcasts/:id')
  getPodcast(@Param('id') podcastId: string) {
    return this.podcastService.getPodcast(podcastId);
  }

  @Patch('/podcasts/:id')
  updatePodcast(@Param('id') podcastId: string, @Body() podcastData) {
    return this.podcastService.updatePodcast(podcastId, podcastData);
  }

  @Delete('/podcasts/:id')
  detelePodcast(@Param('id') podcastId: string) {
    return this.podcastService.detelePodcast(podcastId);
  }

  @Get('/podcasts/:id/episodes')
  allEpisodes(@Param('id') podcastId: string) {
    return this.podcastService.allEpisodes(podcastId);
  }

  @Post('/podcasts/:id/episodes')
  createEpisode(@Param('id') podcastId: string, @Body() episodeData) {
    return this.podcastService.createEpisode(podcastId, episodeData);
  }

  @Patch('/podcasts/:id/episodes/:episodeId')
  updateEpisode(
    @Param('id') podcastId: string,
    @Param('episodeId') episodeId: string,
    @Body() episodeData,
  ) {
    return this.podcastService.updateEpisode(podcastId, episodeId, episodeData);
  }

  @Delete('/podcasts/:id/episodes/:episodeId')
  deleteEpisode(
    @Param('id') podcastId: string,
    @Param('episodeId') episodeId: string,
  ) {
    return this.podcastService.deleteEpisode(podcastId, episodeId);
  }
}
