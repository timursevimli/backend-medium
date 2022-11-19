import { UserType } from '@app/user/types/user.type.interface';

export type ProfileType = UserType & { following: boolean };
