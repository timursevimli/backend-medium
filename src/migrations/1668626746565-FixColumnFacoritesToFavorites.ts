import { MigrationInterface, QueryRunner } from "typeorm";

export class FixColumnFacoritesToFavorites1668626746565 implements MigrationInterface {
    name = 'FixColumnFacoritesToFavorites1668626746565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "facoritesCount" TO "favoritesCount"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "favoritesCount" TO "facoritesCount"`);
    }

}
