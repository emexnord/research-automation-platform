import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1749892296094 implements MigrationInterface {
    name = 'InitialMigration1749892296094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // To make ENUM creation fail-safe in PostgreSQL, we must check if the type exists
        // before trying to create it, as "CREATE TYPE IF NOT EXISTS" is not supported.
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auth_provider_info_provider_enum') THEN
                    CREATE TYPE "public"."auth_provider_info_provider_enum" AS ENUM('google', 'apple', 'facebook');
                END IF;
            END$$;
        `);

        // Use CREATE TABLE IF NOT EXISTS to prevent errors if the table already exists.
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "auth_provider_info" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "provider" "public"."auth_provider_info_provider_enum" NOT NULL,
                "providerId" character varying NOT NULL,
                CONSTRAINT "PK_9e12924dbc66a935eb18300ef0f" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Use DROP ... IF EXISTS to prevent errors if the object is already gone.
        // The order is important: drop the table before dropping the type it depends on.
        await queryRunner.query(`
            DROP TABLE IF EXISTS "auth_provider_info"
        `);
        await queryRunner.query(`
            DROP TYPE IF EXISTS "public"."auth_provider_info_provider_enum"
        `);
    }

}