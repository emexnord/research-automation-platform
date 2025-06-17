import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskTables1749892296095 implements MigrationInterface {
    name = 'CreateTaskTables1749892296095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check and create task_priority enum if not exists
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority_enum') THEN
                    CREATE TYPE "public"."task_priority_enum" AS ENUM('low', 'medium', 'high');
                END IF;
            END $$;
        `);

        // Check and create task_status enum if not exists
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status_enum') THEN
                    CREATE TYPE "public"."task_status_enum" AS ENUM('todo', 'progress', 'review', 'done');
                END IF;
            END $$;
        `);

        // Create tasks table if not exists
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text,
                "taskId" character varying NOT NULL,
                "assigneeId" uuid,
                "labels" jsonb NOT NULL DEFAULT '[]',
                "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'medium',
                "status" "public"."task_status_enum" NOT NULL DEFAULT 'todo',
                "teamId" uuid NOT NULL,
                "dueDate" TIMESTAMP,
                "estimatedHours" double precision,
                "actualHours" double precision NOT NULL DEFAULT 0,
                "assignmentHistory" jsonb NOT NULL DEFAULT '[]',
                "activity" jsonb NOT NULL DEFAULT '[]',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_tasks" PRIMARY KEY ("id"),
                CONSTRAINT "FK_tasks_assignee" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE SET NULL,
                CONSTRAINT "FK_tasks_team" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE
            )
        `);

        // Create subtasks table if not exists
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "subtasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text,
                "completed" boolean NOT NULL DEFAULT false,
                "parentTaskId" uuid NOT NULL,
                "assigneeId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_subtasks" PRIMARY KEY ("id"),
                CONSTRAINT "FK_subtasks_parent" FOREIGN KEY ("parentTaskId") REFERENCES "tasks"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_subtasks_assignee" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE SET NULL
            )
        `);

        // Create task_comments table if not exists
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "task_comments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "content" text NOT NULL,
                "taskId" uuid NOT NULL,
                "authorId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_task_comments" PRIMARY KEY ("id"),
                CONSTRAINT "FK_task_comments_task" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_task_comments_author" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE
            )
        `);

        // Create related_tasks table if not exists
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "related_tasks" (
                "task_id" uuid NOT NULL,
                "related_task_id" uuid NOT NULL,
                CONSTRAINT "PK_related_tasks" PRIMARY KEY ("task_id", "related_task_id"),
                CONSTRAINT "FK_related_tasks_task" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_related_tasks_related" FOREIGN KEY ("related_task_id") REFERENCES "tasks"("id") ON DELETE CASCADE
            )
        `);

        // Create indexes if they don't exist
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_tasks_team'
                ) THEN
                    CREATE INDEX "IDX_tasks_team" ON "tasks" ("teamId");
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_tasks_assignee'
                ) THEN
                    CREATE INDEX "IDX_tasks_assignee" ON "tasks" ("assigneeId");
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_tasks_status'
                ) THEN
                    CREATE INDEX "IDX_tasks_status" ON "tasks" ("status");
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_subtasks_parent'
                ) THEN
                    CREATE INDEX "IDX_subtasks_parent" ON "subtasks" ("parentTaskId");
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_subtasks_assignee'
                ) THEN
                    CREATE INDEX "IDX_subtasks_assignee" ON "subtasks" ("assigneeId");
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_task_comments_task'
                ) THEN
                    CREATE INDEX "IDX_task_comments_task" ON "task_comments" ("taskId");
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_task_comments_author'
                ) THEN
                    CREATE INDEX "IDX_task_comments_author" ON "task_comments" ("authorId");
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes if they exist
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_task_comments_author'
                ) THEN
                    DROP INDEX "IDX_task_comments_author";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_task_comments_task'
                ) THEN
                    DROP INDEX "IDX_task_comments_task";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_subtasks_assignee'
                ) THEN
                    DROP INDEX "IDX_subtasks_assignee";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_subtasks_parent'
                ) THEN
                    DROP INDEX "IDX_subtasks_parent";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_tasks_status'
                ) THEN
                    DROP INDEX "IDX_tasks_status";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_tasks_assignee'
                ) THEN
                    DROP INDEX "IDX_tasks_assignee";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE schemaname = 'public' AND indexname = 'IDX_tasks_team'
                ) THEN
                    DROP INDEX "IDX_tasks_team";
                END IF;
            END $$;
        `);

        // Drop tables if they exist
        await queryRunner.query(`DROP TABLE IF EXISTS "related_tasks"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "task_comments"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "subtasks"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);

        // Drop enums if they exist
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status_enum') THEN
                    DROP TYPE "public"."task_status_enum";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority_enum') THEN
                    DROP TYPE "public"."task_priority_enum";
                END IF;
            END $$;
        `);
    }
}