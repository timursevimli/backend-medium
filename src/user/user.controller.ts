import { User } from '@app/user/decorators/user.decorator';
import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateDto } from './dto/update.dto';
import { AuthGuard } from './guards/auth.guard';
import { IUserResponse } from './types/user.response.interface';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('users')
	@UsePipes(new ValidationPipe())
	async register(@Body() registerDto: RegisterDto): Promise<IUserResponse> {
		const user = await this.userService.register(registerDto);
		return this.userService.userResponseBuilder(user);
	}

	@Post('users/login')
	@UsePipes(new ValidationPipe())
	async login(@Body() loginDto: LoginDto): Promise<IUserResponse> {
		const user = await this.userService.login(loginDto);
		return this.userService.userResponseBuilder(user);
	}

	@Get('user')
	@UseGuards(AuthGuard)
	async currentUser(@User() user: UserEntity): Promise<IUserResponse> {
		return this.userService.userResponseBuilder(user);
	}

	@Put('user')
	@UseGuards(AuthGuard)
	async update(
		@User('id') userId: number,
		@Body() updateDto: UpdateDto,
	): Promise<IUserResponse> {
		const user = await this.userService.updateUser(userId, updateDto);
		return this.userService.userResponseBuilder(user);
	}
}
