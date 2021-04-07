# Podcast Backend

> ## Progress

### ✅ D2: Take a REST

### ✅ D3: GraphQL > Rest

### ✅ D4: TypeORM > Fake DB

### ✅ D9: User Time!

#### requirements for the user authentication

```
- Users should be able to login with a password.
- There should be only **one** user entity but your entity should support two roles 'Host' and 'Listener'.
- Create Guards to protect private resolvers.
- Use JWT as authentication method.
- Create a decorator to get the logged in user.
```

#### resolvers needing to implement

```
- createAccount
- login
- editProfile
- seeProfile
```

### ✅ D12: Unit Testing!

```
- podcasts.service.spec.ts
- jwt.service.spec.ts
- users.service.spec.ts
```

### ✅ D16: Unit Testing!

- E2E test the users.resolver.ts and podcasts.resolver.ts

### ✅ D17: Roles!

- New update!: To test Listener role, `likePodcast` resolver is created
- `likePodcast` can be called `only` by user with `Listener role`
- `likePodcast` will like the podcast if never been liked, otherwise dislike

### ✅ D18-The Last Resolvers

> #### Protected by Listener Role

> #### Create new resolver

`podcast.resolver.ts`

#### searchPodcasts (by title)

#### reviewPodcast

- Created podcastRating entity with rating column as N:M mapper
- After updating podcastRating, get average and update rating of the podcast

`user.resolver.ts`

#### subscribeToPodcast

#### seeSubscriptions

#### markEpisodeAsPlayed (like a Netflix movie that has been watched)

### ✅ D19-Deploy!

- heroku doesn't support sqlite => if production, use postgres
- if production, default value of playground is false => manually set true

```
// app.module.ts
playground: true,
introspection: true,
```

---

> ## Note

### Installation

```
npm i bcrypt @types/bcrypt --dev-only
npm i --save @nestjs/config
npm i cross-env
touch .env.dev .env.prod .env.test
echo .env.dev >> .gitignore
npm i joi
nest g mo auth
```

### D4: TypeORM > Fake DB => nested relation

```ts
const episodes = await this.episodes.find({
  podcast: { id: podcastId },
});
```

### D18-The Last Resolvers

- QueryBuilder sample

```ts
const subscribedUser = await this.users
  .createQueryBuilder('user')
  .innerJoin(
    'user_subscribed_podcasts_podcast',
    'subscribedPodcast',
    'user.id = :userId',
    { userId },
  )
  .andWhere('subscribedPodcast.podcastId = :podcastId', { podcastId })
  .getOne();
```

- To Handle drop constraint error, set `onDelete: 'cascade'` at `ManyToOne`
