import { Field, Float, ObjectType } from '@nestjs/graphql';
import { type } from 'node:os';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
class ReviewInfo {
  @Field(type => String)
  email?: string;

  @Field(type => String)
  title?: string;

  @Field(type => Float)
  rating?: number;
}

@ObjectType()
export class GetMyListenersOutput extends CoreOutput {
  @Field(type => [ReviewInfo])
  reviewInfos?: ReviewInfo[];
}
