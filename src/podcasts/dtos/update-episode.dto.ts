import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';
import { CreateEpisodeInput } from './create-episode.dto';

@InputType()
export class UpdateEpisodeInput extends PartialType(Episode) {}

@ObjectType()
export class UpdateEpisodeOutput extends CoreOutput {}
