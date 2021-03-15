import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Verification } from 'src/users/entities/verification.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import got from 'got';
import { pipe } from 'rxjs';

// jest.mock('got', () => {
//   return {
//     post: jest.fn(),
//   };
// });

const GRAPHQL_ENDPOINT = '/graphql';

const testUser = {
  email: 'testUser@gmail.com',
  password: '1234',
};
describe('App (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let verificationsRepository: Repository<Verification>;
  let podcastsRepository: Repository<Podcast>;
  let jwtToken: string;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const privateTest = (query: string) =>
    baseTest().set('X-JWT', jwtToken).send({ query });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    verificationsRepository = module.get<Repository<Verification>>(
      getRepositoryToken(Verification),
    );
    podcastsRepository = module.get<Repository<Podcast>>(
      getRepositoryToken(Podcast),
    );
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });
  describe('Users Resolver', () => {
    describe('createAccount', () => {
      it('should created account', () => {
        return publicTest(`
        mutation {
          createAccount(input: {
            email: "${testUser.email}",
            password: "${testUser.password}",
            role: Host
          }) {
            ok
            error
          }
        }
      `)
          .expect(200)
          .expect(res => {
            expect(res.body.data.createAccount.ok).toBe(true);
            expect(res.body.data.createAccount.error).toBe(null);
          });
      });
      it('should fail if account already exists', () => {
        return publicTest(`
      mutation {
        createAccount(input: {
          email: "${testUser.email}",
          password: "${testUser.password}",
          role: Host
        }) {
          ok
          error
        }
      }
    `)
          .expect(200)
          .expect(res => {
            expect(res.body.data.createAccount.ok).toBe(false);
            expect(res.body.data.createAccount.error).toEqual(
              expect.any(String),
            );
          });
      });
    });
    describe('login', () => {
      it('should login with correct credentials', () => {
        return publicTest(`
        mutation {
          login(input: {
            email: "${testUser.email}",
            password: "${testUser.password}",
          }) {
            ok
            error
            token
          }
        }
      `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: { login },
              },
            } = res;
            expect(login.ok).toBe(true);
            expect(login.error).toBe(null);
            expect(login.token).toEqual(expect.any(String));
            jwtToken = login.token;
          });
      });
      it('should not be able to login with wrong credentials', () => {
        return publicTest(`
      mutation {
        login(input: {
          email: "${testUser.email}",
          password: "wrong",
        }) {
          ok
          error
          token
        }
      }
      `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: { login },
              },
            } = res;
            expect(login.ok).toBe(false);
            expect(login.error).toBe('Wrong password!');
            expect(login.token).toBe(null);
          });
      });
    });

    describe('me', () => {
      it('should find my profile', () => {
        return privateTest(`
        {
          me {
            email
          }
        }
        `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  me: { email },
                },
              },
            } = res;
            expect(email).toBe(testUser.email);
          });
      });
      it('should not allow logged out user', () => {
        return publicTest(`
          {
            me {
              email
            }
          }
          `)
          .expect(200)
          .expect(res => {
            const {
              body: { errors },
            } = res;
            const [error] = errors;
            expect(error.message).toBe('Forbidden resource');
          });
      });
    });

    describe('seeProfile', () => {
      let userId: number;
      beforeAll(async () => {
        const [user] = await usersRepository.find(); // get first user
        userId = user.id;
      });
      it("should see a user's profile", () => {
        return privateTest(`
        {
          seeProfile(input: {
            id: ${userId}
          }) {
            ok
            error
            user {
              id
            }
          }
        }
        `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  seeProfile: {
                    ok,
                    error,
                    user: { id },
                  },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(id).toBe(userId);
          });
      });
      it('should not find a profile', () => {
        return privateTest(`
      {
        seeProfile(input: {
          id: 999
        }) {
          ok
          error
          user {
            id
          }
        }
      }
      `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  seeProfile: { ok, error, user },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe('User Not Found');
            expect(user).toBe(null);
          });
      });
    });
    describe('editProfile', () => {
      const NEW_EMAIL = 'superbNew@gmail.com';
      it('should change email', () => {
        return privateTest(`
        mutation {
          editProfile(input: {
            email: "${NEW_EMAIL}",
            password: "123456"
          }) {
            ok
            error
          }
        }
      `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  editProfile: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should have new email', () => {
        return privateTest(`
        {
          me {
            email
          }
        }
      `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  me: { email },
                },
              },
            } = res;
            expect(email).toBe(NEW_EMAIL);
          });
      });
    });
  });
  describe('Podcasts Resolver', () => {
    const testPodcast = {
      title: 'testTitle',
      rating: 1.5,
      category: 'testCategory',
    };
    let podcastId: number;
    const testEpisode = {
      content: 'testContent',
    };
    let episodeId: number;
    describe('createPodcast', () => {
      it('should create podcast', () => {
        return privateTest(`
        mutation {
          createPodcast(input: {
            title: "${testPodcast.title}",
            rating: ${testPodcast.rating},
            category: "${testPodcast.category}"
          }) {
            ok
            error
          }
        }
        `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  createPodcast: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should fail if podcast already exists', () => {
        return privateTest(`
        mutation {
          createPodcast(input: {
            title: "${testPodcast.title}",
            rating: ${testPodcast.rating},
            category: "${testPodcast.category}"
          }) {
            ok
            error
          }
        }
        `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  createPodcast: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe('podcast with that title already exists');
          });
      });
    });
    describe('getPodcasts', () => {
      it('should return podcasts', () => {
        return privateTest(`
          {
            getPodcasts {
              ok
              error
              podcasts {
                title
              }
            }
          }
        `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  getPodcasts: { ok, error, podcasts },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(podcasts).toEqual(expect.any(Array));
          });
      });
    });
    describe('getPodcast', () => {
      beforeAll(async () => {
        const [podcast] = await podcastsRepository.find();
        podcastId = podcast.id;
      });
      it('should return a podcast', () => {
        return privateTest(`
          {
            getPodcast(input: {
              id: ${podcastId}
            }) {
              ok
              error
              podcast {
                id
              }
            }
          }
        `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  getPodcast: { ok, error, podcast },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(podcast.id).toBe(podcastId);
          });
      });
      it('should not find podcast with wrong id', () => {
        return privateTest(`
        {
          getPodcast(input: {
            id: 999
          }) {
            ok
            error
            podcast {
              id
            }
          }
        }
        `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  getPodcast: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe('Podcast not found');
          });
      });
    });
    describe('updatePodcast', () => {
      const newPodcast = {
        title: 'newTitle',
        rating: 5.0,
        category: 'newCategory',
      };
      it('should update podcast', () => {
        return privateTest(`
        mutation {
          updatePodcast(input: {
            id: ${podcastId},
            title: "${newPodcast.title}",
            rating: ${newPodcast.rating},
            category: "${newPodcast.category}",
          }) {
            ok
            error
          }
        }
        `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  updatePodcast: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should have new podcast', () => {
        return privateTest(`
        {
          getPodcast(input: {
            id: ${podcastId}
          }) {
            ok
            error
            podcast {
              title
              rating
              category
            }
          }
        }
      `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  getPodcast: { ok, error, podcast },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(podcast.title).toBe(newPodcast.title);
            expect(podcast.rating).toBe(newPodcast.rating);
            expect(podcast.category).toBe(newPodcast.category);
          });
      });
    });
    describe('createEpisode', () => {
      it('should create episode', () => {
        return privateTest(`
          mutation {
            createEpisode(input: {
              podcastId: ${podcastId}
              content: "${testEpisode.content}"
            }) {
              ok
              error
            }
          }
          `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  createEpisode: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should not found parent PodcastId', () => {
        return privateTest(`
          mutation {
            createEpisode(input: {
              podcastId: 99999
              content: "${testEpisode.content}"
            }) {
              ok
              error
            }
          }
          `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  createEpisode: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe('Not found. wrong poadcast id');
          });
      });
    });
    describe('getEpisodes', () => {
      it('should return epdisodes', () => {
        return privateTest(`
          {
            getEpisodes(input: {
              podcastId: ${podcastId}
            }) {
              ok
              error
              episodes {
                id
                content
              }
            }
          }
          `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  getEpisodes: { ok, error, episodes },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(episodes).toEqual(expect.any(Array));
            expect(episodes[0].content).toBe(testEpisode.content);
            episodeId = episodes[0].id;
          });
      });
    });
    describe('updateEpisode', () => {
      const newEpisode = {
        content: 'newContent',
      };
      it('should update episode', () => {
        return privateTest(`
          mutation {
            updateEpisode(input: {
              id: ${episodeId}
              content: "${newEpisode.content}"
            }) {
              ok
              error
            }
          }
          `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  updateEpisode: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should have new episode', () => {
        return privateTest(`
          {
            getEpisodes(input: {
              podcastId: ${podcastId}
            }) {
              ok
              error
              episodes {
                id
                content
              }
            }
          }
          `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  getEpisodes: { ok, error, episodes },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(episodes[0].content).toBe(newEpisode.content);
          });
      });
    });
    describe('deleteEpisode', () => {
      it('should delete episode', () => {
        return privateTest(`
          mutation {
            deleteEpisode(input: {
              id: ${episodeId}
            }) {
              ok
              error
            }
          }
          `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  deleteEpisode: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should not find episode', () => {
        return privateTest(`
          mutation {
            deleteEpisode(input: {
              id: 9999
            }) {
              ok
              error
            }
          }
          `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  deleteEpisode: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe('Episode not found');
          });
      });
    });
    describe('deletePodcast', () => {
      it('should delete podcast', () => {
        return privateTest(`
          mutation {
            deletePodcast(input: {
              id: ${podcastId}
            }) {
              ok
              error
            }
          }
          `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  deletePodcast: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should not find podcast', () => {
        return privateTest(`
        mutation {
          deletePodcast(input: {
            id: 999999
          }) {
            ok
            error
          }
        }
        `)
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  deletePodcast: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe('Podcast not found');
          });
      });
    });
  });
});
