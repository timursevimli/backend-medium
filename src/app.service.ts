import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		return `
			<div>
				<h1>Hello World From NestJS</h1>
			</div>
		`;
	}
}
