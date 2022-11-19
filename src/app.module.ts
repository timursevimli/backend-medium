import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from '@app/configs/orm.config';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagsModule } from '@app/tags/tags.module';
import { UserModule } from '@app/user/user.module';
import { AuthMiddleware } from '@app/user/middlewares/auth.middleware';
import { ArticleModule } from '@app/article/article.module';
import { ProfileModule } from '@app/profile/profile.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(ormConfig),
		TagsModule,
		UserModule,
		ArticleModule,
		ProfileModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer
			.apply(AuthMiddleware)
			.forRoutes({ path: '*', method: RequestMethod.ALL });
	}
}
