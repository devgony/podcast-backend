import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class SearchPodcastsInput {
  @Field(type => String)
  searchKeyword: string;
}

@ObjectType()
export class SearchPodcastsOutput extends CoreOutput {
  @Field(type => Number)
  count?: number;

  @Field(type => [Podcast])
  podcasts?: Podcast[];
}
