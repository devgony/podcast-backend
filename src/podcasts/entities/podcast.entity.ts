import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { IsDecimal, IsNumber, IsString, Max, Min } from 'class-validator';
import { GraphQLFloat } from 'graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
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

  @Field(type => Category, { nullable: true })
  @ManyToOne(type => Category, category => category.podcasts, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  category?: Category;

  @Field(type => User)
  @ManyToOne(type => User, user => user.podcasts, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @Column({ type: 'numeric', precision: 2, scale: 1, default: 0 })
  // @Column({ type: 'float8', default: 0.0 })
  @Field(type => Float)
  @IsDecimal()
  @Min(0)
  @Max(5)
  rating: number;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsString()
  image?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsString()
  intro?: string;

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
