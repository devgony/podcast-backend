import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DidISubscribeInput {
  @Field(type => Number)
  podcastId: number;
}

@ObjectType()
export class DidISubscribeOutput extends CoreOutput {
  @Field(type => Boolean)
  userSubcribed?: boolean;
}
