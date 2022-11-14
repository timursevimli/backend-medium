import { UserType } from './user.type.interface';

export interface IUserResponse {
	user: UserType & { token: string };
}
