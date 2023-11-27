import { MigrationInterface, QueryRunner } from "typeorm"

export class AddAdressColumn1701083716542 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE place_of_interest ADD COLUMN address VARCHAR(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE place_of_interest DROP COLUMN address`);
    }

}
