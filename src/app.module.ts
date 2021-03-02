import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PodcastModule } from './podcasts/podcast.module';

@Module({
  imports: [PodcastModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
