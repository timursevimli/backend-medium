import { FollowEntity } from '@app/profile/follow.entity';
import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/create.article.dto';
import { UpdateArticleDto } from './dto/update.article.dto';
import { IArticleResponse } from './types/article.response.interface';
import { IArticlesResponse } from './types/articles.response.interface';

@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(ArticleEntity)
		private readonly articleRepository: Repository<ArticleEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(FollowEntity)
		private readonly followRepository: Repository<FollowEntity>,
		private dataSource: DataSource,
	) {}

	buildArticleResponse(article: ArticleEntity): IArticleResponse {
		return { article };
	}

	private generateSlugFromTitle(title: string): string {
		return (
			title.replaceAll(' ', '-').toLowerCase() +
			'-' +
			((Math.random() * Math.pow(36, 6)) | 0).toString(36)
		);
	}

	async getArticles(
		currentUserId: number,
		query: unknown,
	): Promise<IArticlesResponse> {
		const queryBuilder = this.dataSource
			.getRepository(ArticleEntity)
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author')
			.orderBy('articles.createdAt', 'DESC');

		const articlesCount = await queryBuilder.getCount();

		if (query['favorited']) {
			const author = await this.userRepository.findOne({
				where: { username: query['favorited'] },
				relations: ['favorites'],
			});

			const ids = author.favorites.map((article) => article.id);
			if (ids.length > 0) {
				queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
			} else {
				queryBuilder.andWhere('1=0');
			}
		}

		if (query['author']) {
			const author = await this.userRepository.findOne({
				where: { username: query['author'] },
			});

			if (!author) {
				throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
			}

			queryBuilder.andWhere('articles.authorId = :id', { id: author.id });
		}

		if (query['limit']) {
			queryBuilder.limit(query['limit']);
		}

		if (query['offset']) {
			queryBuilder.offset(query['offset']);
		}

		if (query['tag']) {
			queryBuilder.andWhere('articles.tagList LIKE :tag', {
				tag: `%${query['tag']}%`,
			});
		}

		let favoriteIds: number[] = [];

		if (currentUserId) {
			const currentUser = await this.userRepository.findOne({
				where: { id: currentUserId },
				relations: ['favorites'],
			});
			favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
		}

		const articles = await queryBuilder.getMany();
		const articlesWithFavorites = articles.map((article) => {
			const favorited = favoriteIds.includes(article.id);
			return { ...article, favorited };
		});

		return { articles: articlesWithFavorites, articlesCount };
	}

	async findBySlug(slug: string): Promise<ArticleEntity> {
		const article = await this.articleRepository.findOne({
			where: { slug },
			relations: ['author'],
		});

		if (!article) {
			throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
		}

		return article;
	}

	async create(
		createArticleDto: CreateArticleDto,
		currentUser: UserEntity,
	): Promise<ArticleEntity> {
		const newArticle = new ArticleEntity();
		Object.assign(newArticle, createArticleDto);

		if (!newArticle.tagList) {
			newArticle.tagList = [];
		}

		newArticle.author = currentUser;
		newArticle.slug = this.generateSlugFromTitle(createArticleDto.title);

		return await this.articleRepository.save(newArticle);
	}

	async delete(currentUserId: number, slug: string): Promise<DeleteResult> {
		const article = await this.findBySlug(slug);

		if (article.author.id !== currentUserId) {
			throw new HttpException(
				'U need permission for delete this article',
				HttpStatus.CONFLICT,
			);
		}
		//or return await this.articleEntity.remove(article);
		return await this.articleRepository.delete({ slug });
	}

	async update(
		slug: string,
		currentUserId: number,
		updateArticleDto: UpdateArticleDto,
	): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);

		if (article.author.id !== currentUserId) {
			throw new HttpException(
				'U need permission for update this article',
				HttpStatus.CONFLICT,
			);
		}

		if (updateArticleDto.title) {
			updateArticleDto.slug = this.generateSlugFromTitle(
				updateArticleDto.title,
			);
		}

		Object.assign(article, updateArticleDto);
		return await this.articleRepository.save(article);
	}

	async addArticleToFavorites(
		currentUserId: number,
		slug: string,
	): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);

		const user = await this.userRepository.findOne({
			where: { id: currentUserId },
			relations: ['favorites', 'articles'],
		});

		const isNotFavorited =
			user.favorites.findIndex(
				(articleInFavorites) => articleInFavorites.id === article.id,
			) === -1;

		if (isNotFavorited) {
			user.favorites.push(article);
			article.favoritesCount++;
			await this.userRepository.save(user);
			await this.articleRepository.save(article);
		}
		return article;
	}

	async removeArticleFromFavorites(
		currentUserId: number,
		slug: string,
	): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);

		const user = await this.userRepository.findOne({
			where: { id: currentUserId },
			relations: ['favorites', 'articles'],
		});

		const articleIndex = user.favorites.findIndex(
			(articleInFavorites) => articleInFavorites.id === article.id,
		);

		if (articleIndex >= 0) {
			user.favorites.splice(articleIndex, 1);
			article.favoritesCount--;
			await this.userRepository.save(user);
			await this.articleRepository.save(article);
		}

		return article;
	}

	async getFeed(
		currentUserId: number,
		query: unknown,
	): Promise<IArticlesResponse> {
		const follows = await this.followRepository.find({
			where: { followerId: currentUserId },
		});

		if (follows.length === 0) {
			return { articles: [], articlesCount: 0 };
		}

		const followingUserIds: number[] = follows.map(
			(follow) => follow.followingId,
		);

		const queryBuilder = this.dataSource
			.getRepository(ArticleEntity)
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author')
			.where('articles.authorId IN (:...id)', {
				id: followingUserIds,
			})
			.orderBy('articles.createdAt', 'DESC');

		const articlesCount = await queryBuilder.getCount();

		if (query['limit']) {
			queryBuilder.limit(query['limit']);
		}

		if (query['offset']) {
			queryBuilder.offset(query['offset']);
		}

		const articles = await queryBuilder.getMany();

		return { articles, articlesCount };
	}
}
