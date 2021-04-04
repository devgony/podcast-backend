import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Podcast } from './podcast.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsString()
  converImg?: string;

  @Column()
  @Field(type => String)
  @IsString()
  slug: string;

  @Field(type => [Podcast])
  @OneToMany(type => Podcast, podcast => podcast.category)
  podcasts: Podcast[];
}
