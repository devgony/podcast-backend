import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class ReviewPodcastInput extends PickType(Podcast, ['rating']) {
  //   @Field(type => Number)
  //   userId: number;

  @Field(type => Number)
  podcastId: number;
}

@ObjectType()
export class ReviewPodcastOutput extends CoreOutput {}
