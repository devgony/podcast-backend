import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Raw, Repository } from 'typeorm';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dtos/delete-episode.dto';
import {
  DeletePodcastInput,
  DeletePodcastOutput,
} from './dtos/delete-podcast.dto';
import { GetCategoriesOutput } from './dtos/get-categories.dto';
import { GetEpisodesInput, GetEpisodesOutput } from './dtos/get-episodes.dto';
import { GetMyPodcastsOutput } from './dtos/get-my-podcasts.dto';
import { GetMyRatingInput, GetMyRatingOutput } from './dtos/get-my-rating';
import { GetPodcastInput, GetPodcastOutput } from './dtos/get-podcast.dto';
import {
  GetPodcastsByCategoryInput,
  GetPodcastsByCategoryOutput,
} from './dtos/get-podcasts-by-category.dto';
import { GetPodcastsOutput } from './dtos/get-podcasts.dto';
import { LikePodcastInput, LikePodcastOutput } from './dtos/like-podcast.dto';
import {
  ReviewPodcastInput,
  ReviewPodcastOutput,
} from './dtos/review-podcast.dto';
import {
  SearchPodcastsInput,
  SearchPodcastsOutput,
} from './dtos/search-podcasts.dto';
import { UpdateEpisodeInput } from './dtos/update-episode.dto';
import {
  UpdatePodcastInput,
  UpdatePodcastOutput,
} from './dtos/update-podcast.dto';
import { WriteCommentInput, WriteCommentOutput } from './dtos/write-comment';
import { Category } from './entities/category.entity';
import { Comment } from './entities/comment.entity';
import { Episode } from './entities/episode.entity';
import { PodcastRating } from './entities/podcast-rating.entity';
import { Podcast } from './entities/podcast.entity';
import { CategoryRepository } from './repositories/category.repository';

const DEFAULT_DATA = {
  id: 1614785562236,
  title: 'defaultTitle',
  rating: 1.5,
  category: 'default',
  episodes: [
    {
      id: 1614785602712,
      content: 'defaultEpisodeContent',
    },
  ],
};

@Injectable()
export class PodcastService {
  constructor(
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Comment) private readonly comments: Repository<Comment>,
    private readonly categories: CategoryRepository,
    @InjectRepository(PodcastRating)
    private readonly podcastRatings: Repository<PodcastRating>,
  ) {}
  // private podcasts: Podcast[] = [DEFAULT_DATA];

  async getPodcasts(): Promise<GetPodcastsOutput> {
    try {
      const podcasts = await this.podcasts.find({
        order: { updatedAt: 'DESC' },
      });
      return {
        ok: true,
        podcasts,
      };
    } catch (error) {
      return { ok: false, error: 'Could not get podcasts' };
    }
  }

  async createPodcast(
    owner: User,
    createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    try {
      // const podcastExists = await this.podcasts.findOne({
      //   title: createPodcastInput.title,
      // });
      // if (podcastExists) {
      //   return { ok: false, error: 'podcast with that title already exists' };
      // }
      const newPodcast = this.podcasts.create(createPodcastInput);
      const category = await this.categories.getOrCreate(
        createPodcastInput.categoryName,
      );
      newPodcast.category = category;
      newPodcast.owner = owner;
      await this.podcasts.save(newPodcast);
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Could not create podcast' };
    }
  }

  async getPodcast({ id }: GetPodcastInput): Promise<GetPodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(id, {
        relations: ['episodes', 'owner'],
      });
      if (!podcast) {
        return {
          ok: false,
          error: 'Podcast not found',
        };
      }
      console.log(':+:+:+:+:+:+:+:+:+:+', podcast.rating);
      return { ok: true, podcast };
    } catch (error) {
      return { ok: false, error: 'Could not get podcast' };
    }
  }

  async updatePodcast(
    owner: User,
    updatePodcastInput: UpdatePodcastInput,
  ): Promise<UpdatePodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(updatePodcastInput.id, {
        where: { owner },
      });
      if (!podcast) {
        return { ok: false, error: 'Podcast not found or You are not owner' };
      }
      await this.podcasts.save([updatePodcastInput]);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not update podcast' };
    }
  }

  async deletePodcast(
    owner: User,
    { id }: DeletePodcastInput,
  ): Promise<DeletePodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(id, { where: { owner } });
      if (!podcast) {
        return { ok: false, error: 'Podcast not found or you are not owner' };
      }
      await this.podcasts.delete(id);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not delete podcast' };
    }
  }

  async getEpisodes({
    podcastId,
  }: GetEpisodesInput): Promise<GetEpisodesOutput> {
    try {
      const episodes = await this.episodes.find({
        where: { podcast: { id: podcastId } },
        // relations: ['podcast'],
        order: { updatedAt: 'DESC' },
      });
      if (!episodes) {
        return { ok: false, error: 'Not found. wrong poadcast id' };
      }
      return { ok: true, episodes };
    } catch (error) {
      return { ok: false, error: 'Could not get episodes' };
    }
  }

  // async getEpisode(podcastId: number, episodeId: number) {
  //   const episode = this.getPodcast(podcastId).podcast.episodes.find(
  //     episode => episode.id === +episodeId,
  //   );
  //   if (!episode) {
  //     throw new NotFoundException(`episode ID: ${episodeId} does not exist.`);
  //   }
  //   return episode;
  // }

  async createEpisode(
    createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    try {
      const podcast = await this.podcasts.findOne({
        id: createEpisodeInput.podcastId,
      });
      if (!podcast) {
        return { ok: false, error: 'Not found. wrong poadcast id' };
      }
      await this.episodes.save(
        this.episodes.create({ ...createEpisodeInput, podcast }),
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not create episode' };
    }
  }

  async updateEpisode(
    updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<UpdatePodcastOutput> {
    try {
      const episode = await this.episodes.findOne(updateEpisodeInput.id);
      if (!episode) {
        return { ok: false, error: 'Episode not found' };
      }
      // await this.episodes.update(
      //   { id: updateEpisodeInput.id },
      //   { ...updateEpisodeInput },
      // );
      await this.episodes.save([{ ...updateEpisodeInput }]);
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Could not update episode' };
    }
  }

  async deleteEpisode(
    deleteEpisodeInput: DeleteEpisodeInput,
  ): Promise<DeleteEpisodeOutput> {
    try {
      const episode = await this.episodes.findOne(deleteEpisodeInput.id);
      if (!episode) {
        return { ok: false, error: 'Episode not found' };
      }
      await this.episodes.delete(deleteEpisodeInput.id);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not delete episode' };
    }
  }

  async likePodcast({
    userId,
    podcastId,
  }: LikePodcastInput): Promise<LikePodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id: podcastId });
      const user = await this.users.findOne(userId);
      const filterdLikedBy = podcast.likedBy.filter(user => user.id !== userId);
      const likeExists = podcast.likedBy.length !== filterdLikedBy.length;
      if (likeExists) {
        // already liked? => dislike
        podcast.likedBy = filterdLikedBy;
        this.podcasts.save(podcast);
        return { ok: true };
      }
      // do like
      podcast.likedBy.push(user);
      await this.podcasts.save(podcast);
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Could not like/dislike it' };
    }
  }

  async searchPodcasts({
    searchKeyword,
  }: SearchPodcastsInput): Promise<SearchPodcastsOutput> {
    try {
      const [podcasts, count] = await this.podcasts.findAndCount({
        where: {
          title: Raw(
            title => `upper(${title}) LIKE '%${searchKeyword.toUpperCase()}%'`,
          ),
        },
        order: { updatedAt: 'ASC' },
      });
      return { ok: true, podcasts, count };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Could not search podcast' };
    }
  }

  async reviewPodcast(
    userId: number,
    { podcastId, rating }: ReviewPodcastInput,
  ): Promise<ReviewPodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(podcastId);
      if (!podcast) {
        return { ok: false, error: 'Podcast not found.' };
      }
      const userExists = await this.users.findOne(userId);
      if (!userExists) {
        return { ok: false, error: 'User not found.' };
      }
      const podcastRating = await this.podcastRatings.findOne({
        userId,
        podcastId,
      });
      if (podcastRating) {
        await this.podcastRatings.save({ ...podcastRating, rating });
      } else {
        await this.podcastRatings.save({ userId, podcastId, rating });
      }
      // update avgRating of the podcast
      const { avg } = await this.podcastRatings
        .createQueryBuilder('podcastRating')
        // .select('round(cast(avg(rating) as numeric), 1)', 'avg')
        .select('round(avg(rating), 1)', 'avg')
        .where('"podcastId" = :podcastId', { podcastId })
        .getRawOne();
      console.log(avg);
      await this.podcasts.update(podcastId, { rating: avg });
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Could not review' };
    }
  }

  async getPodcastsByCategory({
    slug,
  }: GetPodcastsByCategoryInput): Promise<GetPodcastsByCategoryOutput> {
    try {
      const category = await this.categories.findOne({
        where: { slug },
      });
      // relations: ['category'],
      const podcasts = await this.podcasts.find({
        take: 20,
        where: { category },
        relations: ['category'],
        order: { updatedAt: 'DESC' },
      });
      return { ok: true, podcasts };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Could not get Podcast by category' };
    }
  }

  async getCategories(): Promise<GetCategoriesOutput> {
    try {
      const categories = await this.categories.find({ order: { name: 'ASC' } });
      return { ok: true, categories };
    } catch (error) {
      console.log(error);
      return { ok: false, error: "Can't get categories" };
    }
  }

  async getMypodcasts({ id }: User): Promise<GetMyPodcastsOutput> {
    try {
      const podcasts = await this.podcasts.find({
        where: { owner: id },
        order: { updatedAt: 'DESC' },
      });
      return { ok: true, podcasts };
    } catch (error) {
      console.log(error);
      return { ok: false, error: "Can't get Podcasts" };
    }
  }

  async getMyRating(
    userId: number,
    { podcastId }: GetMyRatingInput,
  ): Promise<GetMyRatingOutput> {
    try {
      const podcastRatings = await this.podcastRatings.findOne({
        userId,
        podcastId,
      });
      console.log('----------', podcastRatings);
      if (!podcastRatings) {
        return { ok: true, rating: 0 };
      }
      return { ok: true, rating: podcastRatings.rating };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Could not get my rating' };
    }
  }

  async writeComment(
    userId: number,
    writeCommentInput: WriteCommentInput,
  ): Promise<WriteCommentOutput> {
    try {
      await this.comments.insert({ userId, ...writeCommentInput });
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Could not write comment' };
    }
  }
}
