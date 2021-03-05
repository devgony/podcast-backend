import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Episode } from './episode.entity';

@InputType('PodcastInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Podcast {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @Column()
  @Field(type => String)
  title: string;

  @Column()
  @Field(type => String)
  category: string;

  @Column()
  @Field(type => Number)
  rating: number;

  @Field(type => [Episode])
  @OneToMany(type => Episode, episode => episode.podcast)
  episodes: Episode[];
}
