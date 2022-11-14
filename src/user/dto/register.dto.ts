import { IsEmail, IsNotEmpty } from 'class-validator';
export class RegisterDto {
	@IsNotEmpty()
	readonly username: string;

	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	readonly password: string;
}
