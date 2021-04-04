import { Field, IntersectionType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entities/podcast.entity';

@ObjectType()
export class GetCategoriesOutput extends CoreOutput {
  @Field(type => [String])
  categories: String[];
}
