import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastService } from './podcast.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token-blabla'),
  verify: jest.fn(),
});

describe('PodcastService', () => {
  const podcastArgs = {
    title: 'testTitle',
    category: 'testCategory',
    rating: 1,
  };
  const episodeArgs = {
    content: 'testCategory',
  };
  const podcastId = 1;
  const episodeId = 2;
  let service: PodcastService;
  let podcastRepository: MockRepository<Podcast>;
  let episodeRepository: MockRepository<Episode>;
  let jwtService: JwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PodcastService,
        { provide: getRepositoryToken(Podcast), useValue: mockRepository() },
        { provide: getRepositoryToken(Episode), useValue: mockRepository() },
        { provide: JwtService, useValue: mockJwtService() },
      ],
    }).compile();
    service = module.get<PodcastService>(PodcastService);
    podcastRepository = module.get(getRepositoryToken(Podcast));
    episodeRepository = module.get(getRepositoryToken(Episode));
    jwtService = module.get<JwtService>(JwtService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getPodcasts', () => {
    it('should return podcasts', async () => {
      podcastRepository.find.mockResolvedValue(podcastArgs);
      const result = await service.getPodcasts();
      expect(result).toEqual({ ok: true, podcasts: podcastArgs });
    });
    it('should fail on exception', async () => {
      podcastRepository.find.mockRejectedValue(new Error('!@$%@!'));
      const result = await service.getPodcasts();
      expect(result).toEqual({ ok: false, error: 'Could not get podcasts' });
    });
  });
  describe('createPodcast', () => {
    it('should fail if podcast exists', async () => {
      podcastRepository.findOne.mockResolvedValue(podcastArgs);
      const result = await service.createPodcast(podcastArgs);
      expect(result).toEqual({
        ok: false,
        error: 'podcast with that title already exists',
      });
    });
    it('should create a new podcast', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      podcastRepository.create.mockReturnValue(podcastArgs);
      podcastRepository.save.mockResolvedValue(podcastArgs);
      const result = await service.createPodcast(podcastArgs);
      expect(podcastRepository.create).toHaveBeenCalledTimes(1);
      expect(podcastRepository.create).toHaveBeenCalledWith(podcastArgs);
      expect(podcastRepository.save).toHaveBeenCalledTimes(1);
      expect(podcastRepository.save).toHaveBeenCalledWith(podcastArgs);
      expect(result).toEqual({ ok: true });
    });
    it('should fail on exception', async () => {
      podcastRepository.findOne.mockRejectedValue(new Error('!@$%@!'));
      const result = await service.createPodcast(podcastArgs);
      expect(result).toEqual({ ok: false, error: 'Could not create podcast' });
    });
  });
  describe('getPodcast', () => {
    it('should fail if not found', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      const result = await service.getPodcast({ id: podcastId });
      expect(result).toEqual({ ok: false, error: 'Podcast not found' });
    });
    it('should return podcast by id', async () => {
      podcastRepository.findOne.mockResolvedValue(podcastArgs);
      const result = await service.getPodcast({ id: podcastId });
      expect(result).toEqual({ ok: true, podcast: podcastArgs });
    });
    it('should fail on exception', async () => {
      podcastRepository.findOne.mockRejectedValue(new Error('!@$%@!'));
      const result = await service.getPodcast({ id: podcastId });
      expect(result).toEqual({ ok: false, error: 'Could not get podcast' });
    });
  });
  describe('updatePodcast', () => {
    const newArgs = {
      title: 'newT',
      category: 'newC',
      rating: 5,
    };
    it('should fail if not found', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      const result = await service.updatePodcast({ id: podcastId });
      expect(result).toEqual({ ok: false, error: 'Podcast not found' });
    });
    it('should edit podcast', async () => {
      podcastRepository.findOne.mockResolvedValue(podcastArgs);
      const result = await service.updatePodcast({ id: podcastId, ...newArgs });
      expect(result).toEqual({ ok: true });
    });
    it('should fail on exception', async () => {
      podcastRepository.findOne.mockRejectedValue(new Error('!@$%@!'));
      const result = await service.updatePodcast({ id: podcastId, ...newArgs });
      expect(result).toEqual({ ok: false, error: 'Could not update podcast' });
    });
  });
  describe('deletePodcast', () => {
    it('should fail if not found', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      const result = await service.deletePodcast({ id: podcastId });
      expect(result).toEqual({ ok: false, error: 'Podcast not found' });
    });
    it('should delete podcast', async () => {
      podcastRepository.findOne.mockResolvedValue(podcastArgs);
      const result = await service.deletePodcast({ id: podcastId });
      expect(result).toEqual({ ok: true });
    });
    it('should fail on exception', async () => {
      podcastRepository.findOne.mockRejectedValue(new Error('!@$%@!'));
      const result = await service.deletePodcast({ id: podcastId });
      expect(result).toEqual({ ok: false, error: 'Could not delete podcast' });
    });
  });
  describe('getEpisodes', () => {
    it('should fail if Episodes not found', async () => {
      episodeRepository.find.mockResolvedValue(undefined);
      const result = await service.getEpisodes({ podcastId });
      expect(result).toEqual({
        ok: false,
        error: 'Not found. wrong poadcast id',
      });
    });
    it('should return episodes', async () => {
      episodeRepository.find.mockResolvedValue(episodeArgs);
      const result = await service.getEpisodes({ podcastId });
      expect(result).toEqual({ ok: true, episodes: episodeArgs });
    });
    it('should fail on exception', async () => {
      episodeRepository.find.mockRejectedValue(new Error('!@$%@!'));
      const result = await service.getEpisodes({ podcastId });
      expect(result).toEqual({ ok: false, error: 'Could not get episodes' });
    });
  });
  describe('createEpisode', () => {
    it('should fail if wrong podcast id', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      const result = await service.createEpisode({ podcastId, ...episodeArgs });
      expect(result).toEqual({
        ok: false,
        error: 'Not found. wrong poadcast id',
      });
    });
    it('should create episode', async () => {
      podcastRepository.findOne.mockResolvedValue(podcastArgs);
      const result = await service.createEpisode({ podcastId, ...episodeArgs });
      expect(result).toEqual({ ok: true });
    });
    it('should fail on exception', async () => {
      podcastRepository.findOne.mockRejectedValue(new Error('!@$%@!'));
      const result = await service.createEpisode({ podcastId, ...episodeArgs });
      expect(result).toEqual({ ok: false, error: 'Could not create episode' });
    });
  });
  describe('updateEpisode', () => {
    it('should fail if episode not found', async () => {
      episodeRepository.findOne.mockResolvedValue(undefined);
      const result = await service.updateEpisode({
        id: episodeId,
        ...episodeArgs,
      });
      expect(result).toEqual({ ok: false, error: 'Episode not found' });
    });
    it('should update episode', async () => {
      episodeRepository.findOne.mockResolvedValue(episodeArgs);
      const result = await service.updateEpisode({
        id: episodeId,
        ...episodeArgs,
      });
      expect(result).toEqual({ ok: true });
    });
    it('should fail on exception', async () => {
      episodeRepository.findOne.mockRejectedValue(new Error('!@$%@!'));
      const result = await service.updateEpisode({
        id: episodeId,
        ...episodeArgs,
      });
      expect(result).toEqual({ ok: false, error: 'Could not update episode' });
    });
  });
  describe('deleteEpisode', () => {
    it('should fail if episode not found', async () => {
      episodeRepository.findOne.mockResolvedValue(undefined);
      const result = await service.deleteEpisode({
        id: episodeId,
        ...episodeArgs,
      });
      expect(result).toEqual({ ok: false, error: 'Episode not found' });
    });
    it('should update episode', async () => {
      episodeRepository.findOne.mockResolvedValue(episodeArgs);
      const result = await service.deleteEpisode({
        id: episodeId,
        ...episodeArgs,
      });
      expect(result).toEqual({ ok: true });
    });
    it('should fail on exception', async () => {
      episodeRepository.findOne.mockRejectedValue(new Error('!@$%@!'));
      const result = await service.deleteEpisode({
        id: episodeId,
        ...episodeArgs,
      });
      expect(result).toEqual({ ok: false, error: 'Could not delete episode' });
    });
  });
});
