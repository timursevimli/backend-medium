import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { IProfileResponse } from './types/profile.response.interface';

@Controller('profiles')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get(':username')
	async getProfile(
		@User('id') currentUserId: number,
		@Param('username') profileUsername: string,
	): Promise<IProfileResponse> {
		const profile = await this.profileService.getProfile(
			currentUserId,
			profileUsername,
		);
		return this.profileService.buildProfileResponce(profile);
	}

	@Post(':username/follow')
	@UseGuards(AuthGuard)
	async follow(
		@User('id') currentUserId: number,
		@Param('username') profileUsername: string,
	): Promise<IProfileResponse> {
		const profile = await this.profileService.followProfile(
			currentUserId,
			profileUsername,
		);
		return this.profileService.buildProfileResponce(profile);
	}

	@Delete(':username/follow')
	@UseGuards(AuthGuard)
	async unFollow(
		@User('id') currentUserId: number,
		@Param('username') profileUsername: string,
	): Promise<IProfileResponse> {
		const profile = await this.profileService.unfollowProfile(
			currentUserId,
			profileUsername,
		);
		return this.profileService.buildProfileResponce(profile);
	}
}
