import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreatePodcastInput } from './create-podcast.dto';

@InputType()
export class UpdatePodcastInput extends PartialType(CreatePodcastInput) {
  @Field(type => Number)
  podcastId: number;
}

@ObjectType()
export class UpdatePodcastOutput extends CoreOutput {}
