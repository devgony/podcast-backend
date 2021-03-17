import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class LikePodcastInput {
  @Field(type => Number)
  userId: number;
  @Field(type => Number)
  podcastId: number;
}

@ObjectType()
export class LikePodcastOutput extends CoreOutput {}
