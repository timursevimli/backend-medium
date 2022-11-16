import { IExpressRequest } from '@app/types/express.request.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<IExpressRequest>();

		if (!request.user) {
			return null;
		}

		if (data) {
			return request.user[data as string];
		}

		return request.user;
	},
);
