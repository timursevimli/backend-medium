import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { RegisterDto } from './dto/register.dto';
import { IUserResponse } from './types/user.response.interface';
import { UserEntity } from './user.entity';
import { JWT_SECRET_KEY } from '@app/configs/jwt.secret.key';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async login(loginDto: LoginDto): Promise<UserEntity> {
		const errorResponse = {
			errors: { authentication: 'email or password is invalid' },
		};

		const user = await this.userRepository.findOne({
			where: { email: loginDto.email },
			select: ['bio', 'email', 'id', 'image', 'password', 'username'],
		});

		if (!user) {
			throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
		}

		const decode = await compare(loginDto.password, user.password);

		if (!decode) {
			throw new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
		}
		delete user.password;
		return user;
	}

	async register(registerDto: RegisterDto): Promise<UserEntity> {
		const errorResponse = {
			errors: { EmailOrUsername: 'has already been taken' },
		};

		const checkUserByEmail = await this.userRepository.findOne({
			where: { email: registerDto.email },
		});

		const checkUserByUsername = await this.userRepository.findOne({
			where: {
				username: registerDto.username,
			},
		});

		if (checkUserByEmail) {
			errorResponse.errors['email'] = 'has already been taken';
		}

		if (checkUserByUsername) {
			errorResponse.errors['username'] = 'has already been taken';
		}

		if (checkUserByEmail || checkUserByUsername) {
			throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
		}

		const newUser = new UserEntity();
		Object.assign(newUser, registerDto);
		return this.userRepository.save(newUser);
	}

	generateJwt(user: UserEntity): string {
		return sign(
			{
				id: user.id,
				username: user.username,
				email: user.email,
			},
			JWT_SECRET_KEY,
		);
	}

	userResponseBuilder(user: UserEntity): IUserResponse {
		return { user: { ...user, token: this.generateJwt(user) } };
	}

	findById(id: number): Promise<UserEntity> {
		return this.userRepository.findOne({ where: { id } });
	}

	async updateUser(userId: number, updateDto: UpdateDto): Promise<UserEntity> {
		const user = await this.findById(userId);
		Object.assign(user, updateDto);
		return await this.userRepository.save(user);
	}
}
