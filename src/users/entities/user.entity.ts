import * as bcrypt from 'bcrypt';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Episode } from 'src/podcasts/entities/episode.entity';
import { PodcastRating } from 'src/podcasts/entities/podcast-rating.entity';

export enum UserRole {
  Host = 'Host',
  Listener = 'Listener',
}

registerEnumType(UserRole, { name: 'UserRole' }); // for graphql

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(types => String)
  @IsEmail()
  email: string;

  @Column({ select: false }) // not to hash again?
  @Field(types => String)
  @IsString()
  password: string;

  // @Column({ enum: UserRole })
  @Column({ type: 'simple-enum', enum: UserRole })
  @Field(types => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field(types => Boolean)
  @IsBoolean()
  isVerified: boolean;

  @Field(type => [Podcast])
  @ManyToMany(type => Podcast)
  @JoinTable()
  subscribedPodcasts: Podcast[];

  @Field(type => [Episode])
  @ManyToMany(type => Episode)
  @JoinTable()
  playedEpisodes: Episode[];

  @OneToMany(() => PodcastRating, podcastRating => podcastRating.user)
  podcastRatings!: PodcastRating[];

  @OneToMany(() => Podcast, podcast => podcast.owner)
  podcasts!: Podcast[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
