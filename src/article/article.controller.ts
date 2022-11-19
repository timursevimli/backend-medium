import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';
import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create.article.dto';
import { UpdateArticleDto } from './dto/update.article.dto';
import { IArticleResponse } from './types/article.response.interface';
import { IArticlesResponse } from './types/articles.response.interface';

@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Get('feed')
	@UseGuards(AuthGuard)
	async getFeed(
		@User('id') currentUserId: number,
		@Query() query: unknown,
	): Promise<IArticlesResponse> {
		return await this.articleService.getFeed(currentUserId, query);
	}

	@Get()
	async getArticles(
		@User('id') currentUserId: number,
		@Query() query: unknown,
	): Promise<IArticlesResponse> {
		return await this.articleService.getArticles(currentUserId, query);
	}

	@Get(':slug')
	async getArticle(@Param('slug') slug: string): Promise<IArticleResponse> {
		const article = await this.articleService.findBySlug(slug);
		return this.articleService.buildArticleResponse(article);
	}

	@Post()
	@UseGuards(AuthGuard)
	@UsePipes(new BackendValidationPipe())
	async create(
		@Body('article') createArticleDto: CreateArticleDto,
		@User() currentUser: UserEntity,
	): Promise<IArticleResponse> {
		const article = await this.articleService.create(
			createArticleDto,
			currentUser,
		);
		return this.articleService.buildArticleResponse(article);
	}

	@Delete(':slug')
	@UseGuards(AuthGuard)
	async delete(
		@User('id') curretUserId: number,
		@Param('slug') slug: string,
	): Promise<DeleteResult> {
		return await this.articleService.delete(curretUserId, slug);
	}

	@Put(':slug')
	@UseGuards(AuthGuard)
	@UsePipes(new BackendValidationPipe())
	async update(
		@Param('slug') slug: string,
		@User('id') currentUserId: number,
		@Body('article') updateArticleDto: UpdateArticleDto,
	): Promise<IArticleResponse> {
		const article = await this.articleService.update(
			slug,
			currentUserId,
			updateArticleDto,
		);

		return this.articleService.buildArticleResponse(article);
	}

	@Post(':slug/favorite')
	@UseGuards(AuthGuard)
	async addArticleToFavorites(
		@User('id') currentUserId: number,
		@Param('slug') slug: string,
	): Promise<IArticleResponse> {
		const article = await this.articleService.addArticleToFavorites(
			currentUserId,
			slug,
		);
		return this.articleService.buildArticleResponse(article);
	}

	@Delete(':slug/favorite')
	@UseGuards(AuthGuard)
	async removeArticleFromFavorites(
		@User('id') currentUserId: number,
		@Param('slug') slug: string,
	): Promise<IArticleResponse> {
		const article = await this.articleService.removeArticleFromFavorites(
			currentUserId,
			slug,
		);
		return this.articleService.buildArticleResponse(article);
	}
}
