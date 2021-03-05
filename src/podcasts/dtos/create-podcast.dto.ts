import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class CreatePodcastInput extends PickType(Podcast, [
  'title',
  'category',
  'rating',
  // 'episodes',
]) {}

@ObjectType()
export class CreatePodcastOutput extends CoreOutput {
  // @Field(type => Number)
  // id: number;
}
