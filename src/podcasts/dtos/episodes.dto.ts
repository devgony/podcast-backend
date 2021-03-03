import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class EpisodesInput extends PickType(Podcast, ['id']) {}

@ObjectType()
export class EpisodesOutput extends CoreOutput {
  @Field(type => [Episode], { nullable: true })
  episodes?: Episode[];
}
