import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';
import { ITagResponse } from './types/tag.response.interface';

@Injectable()
export class TagsService {
	constructor(
		@InjectRepository(TagEntity)
		private readonly tagRepository: Repository<TagEntity>,
	) {}

	tagReponse(tags: string[]): ITagResponse {
		return { tags };
	}

	async getTags(): Promise<TagEntity[]> {
		return await this.tagRepository.find();
	}
}
