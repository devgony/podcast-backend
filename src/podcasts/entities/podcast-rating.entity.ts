import { InputType, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Podcast } from './podcast.entity';

@Entity()
export class PodcastRating {
  @PrimaryGeneratedColumn()
  ratingId!: number;

  @Column()
  userId!: number;

  @Column()
  podcastId!: number;

  @Column()
  rating!: number;

  @ManyToOne(() => User, user => user.podcastRatings, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Podcast, podcast => podcast.podcastRatings, {
    onDelete: 'CASCADE',
  })
  podcast!: Podcast;
}
