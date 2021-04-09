import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class GetCommentsInput {
  @Field(type => Int)
  podcastId: number;
}

@ObjectType()
export class GetCommentsOutput extends CoreOutput {
  @Field(type => [Comment])
  comments: Comment[];
}
