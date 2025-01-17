import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDatabaseSchema1737130273546 implements MigrationInterface {
  name = 'UpdateDatabaseSchema1737130273546';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "hash" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "sessionToken" text, "expires" TIMESTAMP, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("userId" SERIAL NOT NULL, "type" text NOT NULL, "provider" text, "providerAccountId" text, "refresh_token" character varying, "access_token" character varying, "expires_at" integer, "token_type" character varying, "scope" text, "id_token" character varying, "session_state" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c125a10eb349e53ffdb3834f3dc" PRIMARY KEY ("userId", "type"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_type_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "duration" integer DEFAULT '30', "url" text, "description" text, "active" boolean NOT NULL DEFAULT true, "videoCallSoftware" text DEFAULT 'Google Meet', "userId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d19c6061cb49d826dcd5bbd2a23" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."availability_day_enum" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')`,
    );
    await queryRunner.query(
      `CREATE TABLE "availability" ("id" SERIAL NOT NULL, "day" "public"."availability_day_enum" NOT NULL, "fromTime" character varying(5), "tillTime" character varying(5), "isActive" boolean DEFAULT true, "userId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_05a8158cf1112294b1c86e7f1d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "authenticator" ("credentialID" character varying NOT NULL, "userId" integer NOT NULL, "providerAccountId" character varying NOT NULL, "credentialPublicKey" character varying NOT NULL, "counter" integer NOT NULL DEFAULT '0', "credentialDeviceType" character varying DEFAULT 'Unknown', "credentialBackedUp" boolean NOT NULL DEFAULT false, "transports" character varying, CONSTRAINT "PK_d3a10d8eb4e3dffd34fe9c694ba" PRIMARY KEY ("credentialID", "userId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_groups_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, "firstName" character varying, "lastName" character varying, "emailVerified" TIMESTAMP, "image" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "status" "public"."user_status_enum" NOT NULL DEFAULT 'inactive', "groups" "public"."user_groups_enum" NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_type_enum" AS ENUM('personal', 'team', 'project')`,
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "type" "public"."event_type_enum" DEFAULT 'personal', "permissions" jsonb, "description" character varying, "location" character varying, "isRecurring" boolean DEFAULT false, "recurrencePattern" character varying, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4ccd63876554023ce6a4e863c2" ON "event" ("title") `,
    );
    await queryRunner.query(
      `CREATE TABLE "verification_token" ("identifier" character varying NOT NULL, "token" character varying, "expires" TIMESTAMP, CONSTRAINT "PK_ee0f4ed799dbd5aae77c7b8e600" PRIMARY KEY ("identifier"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_events" ("event_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_8f0129f0fada349745e8a14cb5b" PRIMARY KEY ("event_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d90e82a7c01f4b3a4cbf43a17" ON "user_events" ("event_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ee5fe78baa6daa8bd2fa2392f5" ON "user_events" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_type_entity" ADD CONSTRAINT "FK_440c009261eefabc630097df69c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" ADD CONSTRAINT "FK_42a42b693f05f17e56d1d9ba93f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "authenticator" ADD CONSTRAINT "FK_73234b7982147574458f0860361" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_events" ADD CONSTRAINT "FK_5d90e82a7c01f4b3a4cbf43a170" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_events" ADD CONSTRAINT "FK_ee5fe78baa6daa8bd2fa2392f53" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_events" DROP CONSTRAINT "FK_ee5fe78baa6daa8bd2fa2392f53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_events" DROP CONSTRAINT "FK_5d90e82a7c01f4b3a4cbf43a170"`,
    );
    await queryRunner.query(
      `ALTER TABLE "authenticator" DROP CONSTRAINT "FK_73234b7982147574458f0860361"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" DROP CONSTRAINT "FK_42a42b693f05f17e56d1d9ba93f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_type_entity" DROP CONSTRAINT "FK_440c009261eefabc630097df69c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ee5fe78baa6daa8bd2fa2392f5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5d90e82a7c01f4b3a4cbf43a17"`,
    );
    await queryRunner.query(`DROP TABLE "user_events"`);
    await queryRunner.query(`DROP TABLE "verification_token"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4ccd63876554023ce6a4e863c2"`,
    );
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TYPE "public"."event_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_groups_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "authenticator"`);
    await queryRunner.query(`DROP TABLE "availability"`);
    await queryRunner.query(`DROP TYPE "public"."availability_day_enum"`);
    await queryRunner.query(`DROP TABLE "event_type_entity"`);
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
  }
}
