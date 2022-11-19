import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1668277639880 implements MigrationInterface {
	name = 'SeedDb1668277639880';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO tags (name) VALUES ('dragons'), ('coffee'),('nestjs')`,
		);

		//password is 123
		await queryRunner.query(
			`INSERT INTO users (email, password, username) VALUES ('a@a.ua','$2b$10$Mz8Js3bsqa9CwfXVjIg/Uuw/Y0KkcyY3vZRtm91P/.JL0srmLC83e','alesko')`,
		);

		await queryRunner.query(
			`INSERT INTO users (email, password, username) VALUES ('kiev@kiev.ua','$2b$10$Mz8Js3bsqa9CwfXVjIg/Uuw/Y0KkcyY3vZRtm91P/.JL0srmLC83e','kiev')`,
		);

		await queryRunner.query(
			`INSERT INTO users (email, password, username) VALUES ('chernihiv@chernihiv.ua','$2b$10$Mz8Js3bsqa9CwfXVjIg/Uuw/Y0KkcyY3vZRtm91P/.JL0srmLC83e','chernihiv')`,
		);

		await queryRunner.query(
			`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('i-love-typescript','I Love TypeScript', 'Typescript is good', 'Typescript is a JS compiler',  'typescript,javascript', 1)`,
		);

		await queryRunner.query(
			`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('i-love-nestjs','I Love NestJS', 'NestJS is good', 'NestJS is most cute cat in the world',  'nestjs,express', 1)`,
		);
	}

	public async down(): Promise<void> {}
}
