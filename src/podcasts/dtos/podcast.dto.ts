import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class PodcastInput extends PickType(Podcast, ['id']) {}

@ObjectType()
export class PodcastOutput {
  @Field(type => Podcast, { nullable: true })
  podcast?: Podcast;
}
