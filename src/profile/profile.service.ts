import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowEntity } from './follow.entity';
import { IProfileResponse } from './types/profile.response.interface';
import { ProfileType } from './types/profile.type';

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(FollowEntity)
		private readonly followRepository: Repository<FollowEntity>,
	) {}

	buildProfileResponce(profile: ProfileType): IProfileResponse {
		delete profile.email;
		return { profile };
	}

	async getProfile(
		currentUserId: number,
		profileUsername: string,
	): Promise<ProfileType> {
		const user = await this.userRepository.findOne({
			where: { username: profileUsername },
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		if (currentUserId) {
			const follow = await this.followRepository.findOne({
				where: { followerId: currentUserId, followingId: user.id },
			});

			if (follow) {
				return { ...user, following: true };
			}
		}

		return { ...user, following: false };
	}

	async followProfile(
		currentUserId: number,
		profileUsername: string,
	): Promise<ProfileType> {
		const user = await this.userRepository.findOne({
			where: { username: profileUsername },
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		if (user.id === currentUserId) {
			throw new HttpException(
				'You cant follow yourself',
				HttpStatus.BAD_REQUEST,
			);
		}

		const follow = await this.followRepository.findOne({
			where: { followerId: currentUserId, followingId: user.id },
		});

		if (!follow) {
			const followToCreate = new FollowEntity();
			followToCreate.followerId = currentUserId;
			followToCreate.followingId = user.id;
			await this.followRepository.save(followToCreate);
		}

		return { ...user, following: true };
	}

	async unfollowProfile(
		currentUserId: number,
		profileUsername: string,
	): Promise<ProfileType> {
		const user = await this.userRepository.findOne({
			where: { username: profileUsername },
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		const follow = await this.followRepository.findOne({
			where: { followerId: currentUserId, followingId: user.id },
		});

		if (follow) {
			await this.followRepository.delete(follow);
		}

		return { ...user, following: false };
	}
}
