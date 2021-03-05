import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Episode } from './podcasts/entities/episode.entity';
import { Podcast } from './podcasts/entities/podcast.entity';
import { PodcastModule } from './podcasts/podcast.module';

@Module({
  imports: [
    PodcastModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      logging: true,
      synchronize: true,
      entities: [Podcast, Episode],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
