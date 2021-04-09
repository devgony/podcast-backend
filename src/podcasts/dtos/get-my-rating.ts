import { Field, Float, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PodcastRating } from '../entities/podcast-rating.entity';

@InputType()
export class GetMyRatingInput extends PickType(PodcastRating, ['podcastId']) {}

@ObjectType()
export class GetMyRatingOutput extends CoreOutput {
  @Field(type => Float)
  rating?: number;
}
