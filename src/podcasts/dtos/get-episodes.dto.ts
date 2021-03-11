import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class GetEpisodesInput {
  @Field(type => Number)
  podcastId: number;
}

@ObjectType()
export class GetEpisodesOutput extends CoreOutput {
  @Field(type => [Episode], { nullable: true })
  episodes?: Episode[];
}
