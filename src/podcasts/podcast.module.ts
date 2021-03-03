import { Module } from '@nestjs/common';
// import { PodcastController } from './podcast.controller.ts.bak';
import { PodcastResolver } from './podcast.resolver';
import { PodcastService } from './podcast.service';

@Module({
  imports: [],
  providers: [PodcastService, PodcastResolver],
})
export class PodcastModule {}
