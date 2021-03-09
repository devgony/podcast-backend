# Podcast Backend

> ## Progress

### ✅ D2: Take a REST

### ✅ D3: GraphQL > Rest

### ✅ D4: TypeORM > Fake DB

### ✅ D5: User Time!

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
