import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Podcast } from './podcast.entity';

@InputType('EpdisodeInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Episode extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column()
  @Field(type => String)
  @IsString()
  content: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  audio?: string;

  @Field(type => Podcast)
  @ManyToOne(type => Podcast, podcast => podcast.episodes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  podcast: Podcast;
}
