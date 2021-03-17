import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
// import { PodcastController } from './podcast.controller.ts.bak';
import { PodcastResolver } from './podcast.resolver';
import { PodcastService } from './podcast.service';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast, Episode, User])],
  providers: [PodcastService, PodcastResolver],
})
export class PodcastModule {}
