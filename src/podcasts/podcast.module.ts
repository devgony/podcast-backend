import { Module } from '@nestjs/common';
import { PodcastController } from './podcast.controller';
import { PodcastService } from './podcast.service';

@Module({
  imports: [],
  controllers: [PodcastController],
  providers: [PodcastService],
})
export class PodcastModule {}
