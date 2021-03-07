# Podcast Backend

> ## Progress

### ✅ D2: Take a REST

### ✅ D3: GraphQL > Rest

### ✅ D4: TypeORM > Fake DB

---

> ## Note

### D4: TypeORM > Fake DB => nested relation

```ts
const episodes = await this.episodes.find({
  podcast: { id: podcastId },
});
```
