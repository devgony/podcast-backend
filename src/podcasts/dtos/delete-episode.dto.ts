import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';

@InputType()
export class DeleteEpisodeInput extends PickType(Episode, ['id']) {}

@ObjectType()
export class DeleteEpisodeOutput extends CoreOutput {}
