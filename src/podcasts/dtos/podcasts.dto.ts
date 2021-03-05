import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entities/podcast.entity';

@ObjectType()
export class PodcastsOutput extends CoreOutput {
  @Field(type => [Podcast])
  podcasts?: Podcast[];
}
