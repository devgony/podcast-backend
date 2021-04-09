import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class WriteCommentInput {
  //   @Field(type => Int)
  //   userId: number;

  @Field(type => Int)
  podcastId: number;

  @Field(type => String)
  comment: string;
}

@ObjectType()
export class WriteCommentOutput extends CoreOutput {}
