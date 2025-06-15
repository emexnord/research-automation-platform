import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1749893580774 implements MigrationInterface {
    name = 'InitialMigration1749893580774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "shared_links" (
                "link_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "item_id" uuid NOT NULL,
                "item_type" character varying(10) NOT NULL,
                "shared_by_user_id" uuid NOT NULL,
                "share_date" TIMESTAMP NOT NULL,
                "expiry_date" TIMESTAMP,
                "permission_type" character varying(20) NOT NULL,
                "password_protected" boolean NOT NULL DEFAULT false,
                "password_hash" text,
                CONSTRAINT "PK_d36c01abb8c438d8bc5ffecf0b5" PRIMARY KEY ("link_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "files" (
                "file_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "filename" character varying(255) NOT NULL,
                "file_type" character varying(100) NOT NULL,
                "file_size" bigint NOT NULL,
                "storage_key" character varying(255) NOT NULL,
                "upload_date" TIMESTAMP NOT NULL,
                "last_modified" TIMESTAMP NOT NULL,
                "parent_folder_id" uuid,
                "description" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_a753eb40fcc8cd925fe9c9aded4" PRIMARY KEY ("file_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "folders" (
                "folder_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "folder_name" character varying(255) NOT NULL,
                "parent_folder_id" uuid,
                "description" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_16824911a9dfe625e0b38d4c0d5" PRIMARY KEY ("folder_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "file_folder_shares" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "item_id" uuid NOT NULL,
                "item_type" character varying(10) NOT NULL,
                "shared_with_user_id" uuid NOT NULL,
                "permission_type" character varying(20) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e9d89e3eaeb474f921b57daefcd" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "file_folder_shares"
        `);
        await queryRunner.query(`
            DROP TABLE "folders"
        `);
        await queryRunner.query(`
            DROP TABLE "files"
        `);
        await queryRunner.query(`
            DROP TABLE "shared_links"
        `);
        await queryRunner.query(`
            DROP TABLE "auth_provider_info"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."auth_provider_info_provider_enum"
        `);
    }

}
