import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RecipeModule } from './recipe/recipe.module';
import { ArticleModule } from './article/article.module';
import { CollectionModule } from './collection/collection.module';
import { FollowModule } from './follow/follow.module';
import { AiModule } from './ai/ai.module';
import { CommonModule } from './common/common.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    UploadModule,
    PrismaModule,
    UserModule,
    RecipeModule,
    ArticleModule,
    CollectionModule,
    FollowModule,
    AiModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
