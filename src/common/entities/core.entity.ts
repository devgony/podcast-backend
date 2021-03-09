import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field(Type => Int)
  id: number;

  @CreateDateColumn()
  @Field(type => Date)
  createdAt: Date;

  @CreateDateColumn()
  @Field(type => Date)
  updatedAt: Date;
}
