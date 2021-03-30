import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class GetPodcastsByCategoryInput extends PickType(Podcast, [
  'category',
]) {}

@ObjectType()
export class GetPodcastsByCategoryOutput extends CoreOutput {
  @Field(type => [Podcast])
  podcasts?: Podcast[];
}
