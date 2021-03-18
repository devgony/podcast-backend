import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Episode } from 'src/podcasts/entities/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification, Podcast, Episode])],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
