import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Category } from '../entities/category.entity';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class GetPodcastsByCategoryInput extends PickType(Category, ['slug']) {}

@ObjectType()
export class GetPodcastsByCategoryOutput extends CoreOutput {
  @Field(type => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}
