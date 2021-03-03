import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';

@InputType()
export class CreateEpisodeInput extends PickType(Episode, ['content']) {
  @Field(type => Number)
  podcastId: number;
}

@ObjectType()
export class CreateEpisodeOutput extends CoreOutput {}
