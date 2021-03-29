import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Max, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Episode } from './episode.entity';
import { PodcastRating } from './podcast-rating.entity';

@InputType('PodcastInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Podcast extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column()
  @Field(type => String)
  @IsString()
  category: string;

  @Column({ default: 0 })
  @Field(type => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsString()
  image?: string;

  @Field(type => [Episode])
  @OneToMany(type => Episode, episode => episode.podcast)
  episodes: Episode[];

  @Field(type => [User])
  @ManyToMany(type => User, { eager: true })
  @JoinTable()
  likedBy: User[];

  @OneToMany(() => PodcastRating, podcastRating => podcastRating.podcast)
  podcastRatings!: PodcastRating[];
}
