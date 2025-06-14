import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1749892296094 implements MigrationInterface {
    name = 'InitialMigration1749892296094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."auth_provider_info_provider_enum" AS ENUM('google', 'apple', 'facebook')
        `);
        await queryRunner.query(`
            CREATE TABLE "auth_provider_info" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "provider" "public"."auth_provider_info_provider_enum" NOT NULL,
                "providerId" character varying NOT NULL,
                CONSTRAINT "PK_9e12924dbc66a935eb18300ef0f" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "auth_provider_info"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."auth_provider_info_provider_enum"
        `);
    }

}
