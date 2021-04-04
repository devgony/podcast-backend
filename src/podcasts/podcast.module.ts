import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Category } from './entities/category.entity';
import { Episode } from './entities/episode.entity';
import { PodcastRating } from './entities/podcast-rating.entity';
import { Podcast } from './entities/podcast.entity';
// import { PodcastController } from './podcast.controller.ts.bak';
import { PodcastResolver } from './podcast.resolver';
import { PodcastService } from './podcast.service';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Podcast,
      Episode,
      User,
      PodcastRating,
      CategoryRepository,
    ]),
  ],
  providers: [PodcastService, PodcastResolver],
})
export class PodcastModule {}
