import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class MarkEpisodeAsPlayedInput {
  @Field(type => Number)
  episodeId: number;
}

@ObjectType()
export class MarkEpisodeAsPlayedOutput extends CoreOutput {}
