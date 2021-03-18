import { mergeType } from '@graphql-tools/merge';
import {
  Field,
  InputType,
  IntersectionType,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { User } from '../entities/user.entity';

@ObjectType()
export class SeeSubscriptionsOutput extends CoreOutput {
  @Field(type => [Podcast], { nullable: true })
  subscribedPodcasts?: Podcast[];
}
