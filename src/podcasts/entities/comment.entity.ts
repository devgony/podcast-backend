import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Podcast } from './podcast.entity';

@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CoreEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  podcastId!: number;

  @Field(type => String)
  @Column()
  comment!: string;

  @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Podcast, podcast => podcast.comments, {
    onDelete: 'CASCADE',
  })
  podcast!: Podcast;
}
