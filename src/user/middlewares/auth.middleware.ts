import { JWT_SECRET_KEY } from '@app/configs/jwt.secret.key';
import { IExpressRequest } from '@app/types/express.request.interface';
import { UserService } from '@app/user/user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly userService: UserService) {}

	async use(
		req: IExpressRequest,
		_: Response,
		next: NextFunction,
	): Promise<void> {
		if (!req.headers.authorization) {
			req.user = null;
			return next();
		}
		const token = req.headers.authorization.split(' ')[1];

		try {
			const decode = verify(token, JWT_SECRET_KEY);
			const user = await this.userService.findById(decode['id']);
			req.user = user;
		} catch (e) {
			req.user = null;
		} finally {
			next();
		}
	}
}
