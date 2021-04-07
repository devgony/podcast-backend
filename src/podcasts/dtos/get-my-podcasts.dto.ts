import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entities/podcast.entity';

@ObjectType()
export class GetMyPodcastsOutput extends CoreOutput {
  @Field(type => [Podcast])
  podcasts?: Podcast[];
}
