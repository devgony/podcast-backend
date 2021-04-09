import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Podcast } from './podcast.entity';

@InputType('PodcastRatingInputType', { isAbstract: true })
@ObjectType()
@Entity()
@Index(['userId', 'podcastId'], { unique: true })
export class PodcastRating {
  @PrimaryGeneratedColumn()
  ratingId!: number;

  @Column()
  userId!: number;

  @Field(type => Int)
  @Column()
  podcastId!: number;

  @Column({ type: 'numeric', precision: 2, scale: 1, default: 0 })
  // @Column({ type: 'float8', default: 0.0 })
  rating!: number;

  @ManyToOne(() => User, user => user.podcastRatings, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Podcast, podcast => podcast.podcastRatings, {
    onDelete: 'CASCADE',
  })
  podcast!: Podcast;
}
