import {MigrationInterface, QueryRunner} from "typeorm";

export class test1633573864731 implements MigrationInterface {
    name = 'test1633573864731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "username" character varying(255) NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bands" ("id" uuid NOT NULL, "name" character varying(255) NOT NULL, "username" character varying(255) NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_befb882c1551240e638479dcd70" UNIQUE ("username"), CONSTRAINT "PK_9355783ed6ad7f73a4d6fe50ea1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "followers" ("usersId_1" uuid NOT NULL, "usersId_2" uuid NOT NULL, CONSTRAINT "PK_f0ef6820b5ee4e23bf7bbfdcaaf" PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c05037a5736eed05fa8d553a57" ON "followers" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_4fc9ae6b0234a7442e45eb4da5" ON "followers" ("usersId_2") `);
        await queryRunner.query(`CREATE TABLE "bands-users" ("bandsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_c34a7cb9e3b49557450da6d9a30" PRIMARY KEY ("bandsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ebb3c4a59d63e2f871f8b87388" ON "bands-users" ("bandsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9c538c4a4b45868a5b51c3890f" ON "bands-users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "followers" ADD CONSTRAINT "FK_c05037a5736eed05fa8d553a57c" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "followers" ADD CONSTRAINT "FK_4fc9ae6b0234a7442e45eb4da53" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bands-users" ADD CONSTRAINT "FK_ebb3c4a59d63e2f871f8b873884" FOREIGN KEY ("bandsId") REFERENCES "bands"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bands-users" ADD CONSTRAINT "FK_9c538c4a4b45868a5b51c3890f8" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bands-users" DROP CONSTRAINT "FK_9c538c4a4b45868a5b51c3890f8"`);
        await queryRunner.query(`ALTER TABLE "bands-users" DROP CONSTRAINT "FK_ebb3c4a59d63e2f871f8b873884"`);
        await queryRunner.query(`ALTER TABLE "followers" DROP CONSTRAINT "FK_4fc9ae6b0234a7442e45eb4da53"`);
        await queryRunner.query(`ALTER TABLE "followers" DROP CONSTRAINT "FK_c05037a5736eed05fa8d553a57c"`);
        await queryRunner.query(`DROP INDEX "IDX_9c538c4a4b45868a5b51c3890f"`);
        await queryRunner.query(`DROP INDEX "IDX_ebb3c4a59d63e2f871f8b87388"`);
        await queryRunner.query(`DROP TABLE "bands-users"`);
        await queryRunner.query(`DROP INDEX "IDX_4fc9ae6b0234a7442e45eb4da5"`);
        await queryRunner.query(`DROP INDEX "IDX_c05037a5736eed05fa8d553a57"`);
        await queryRunner.query(`DROP TABLE "followers"`);
        await queryRunner.query(`DROP TABLE "bands"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
