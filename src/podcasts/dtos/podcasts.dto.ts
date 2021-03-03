import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';

@ObjectType()
export class PodcastsOutput {
  @Field(type => [Podcast])
  podcasts?: Podcast[];
}
