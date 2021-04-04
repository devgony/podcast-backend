import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Episode } from './podcasts/entities/episode.entity';
import { Podcast } from './podcasts/entities/podcast.entity';
import { PodcastModule } from './podcasts/podcast.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { Verification } from './users/entities/verification.entity';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { PodcastRating } from './podcasts/entities/podcast-rating.entity';
import { Category } from './podcasts/entities/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production', 'test').required(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    PodcastModule,
    GraphQLModule.forRoot({
      playground: true,
      introspection: true,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
        };
      },
    }),
    TypeOrmModule.forRoot({
      ...(process.env.NODE_ENV === 'production'
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
          }
        : {
            type: 'postgres',
            url: process.env.DATABASE_URL,
          }),
      logging:
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test',
      synchronize: true,
      // process.env.NODE_ENV !== 'production',
      entities: [Podcast, Episode, Verification, User, PodcastRating, Category],
    }),
    UsersModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
