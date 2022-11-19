import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '@app/user/user.entity';
import { FollowEntity } from '@app/profile/follow.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity]),
	],
	providers: [ArticleService],
	controllers: [ArticleController],
})
export class ArticleModule {}
