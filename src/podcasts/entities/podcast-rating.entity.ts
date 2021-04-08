import { Float, InputType, ObjectType } from '@nestjs/graphql';
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
