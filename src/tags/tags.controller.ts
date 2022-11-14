import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ITagResponse } from './types/tag.response.interface';

@Controller('tags')
export class TagsController {
	constructor(private readonly tagService: TagsService) {}

	@Get()
	async getTags(): Promise<ITagResponse> {
		const tags = await this.tagService.getTags();
		const tagName = tags.map((tag) => tag.name);
		return this.tagService.tagReponse(tagName);
	}
}
