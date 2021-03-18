import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class SubscribeToPodcastInput {
  @Field(type => Number)
  podcastId: number;
}

@ObjectType()
export class SubscribeToPodcastOutput extends CoreOutput {}
