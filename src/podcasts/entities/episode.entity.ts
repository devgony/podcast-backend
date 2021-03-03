import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('EpdisodeInputType', { isAbstract: true })
@ObjectType()
export class Episode {
  @Field(type => Number)
  id: number;
  @Field(type => String)
  content: string;
}
