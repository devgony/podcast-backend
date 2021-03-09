import {
  Field,
  InputType,
  IntersectionType,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from '../entities/user.entity';

@InputType()
export class SeeProfileInput extends PickType(User, ['id']) {}

@ObjectType()
export class SeeProfileOutput extends CoreOutput {
  @Field(type => User, { nullable: true })
  user?: User;
}
