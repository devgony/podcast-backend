import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreateEpisodeInput } from './create-episode.dto';

@InputType()
export class UpdateEpisodeInput extends PartialType(CreateEpisodeInput) {
  @Field(type => Number)
  episodeId: number;
}

@ObjectType()
export class UpdateEpisodeOutput extends CoreOutput {}
