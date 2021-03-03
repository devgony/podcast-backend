import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteEpisodeInput {
  @Field(type => Number)
  podcastId: number;
  @Field(type => Number)
  episodeId: number;
}

@ObjectType()
export class DeleteEpisodeOutput extends CoreOutput {}
