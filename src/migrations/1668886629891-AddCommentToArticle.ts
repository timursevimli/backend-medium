import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentToArticle1668886629891 implements MigrationInterface {
    name = 'AddCommentToArticle1668886629891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "body" character varying NOT NULL, "articleId" integer NOT NULL, "commentorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
