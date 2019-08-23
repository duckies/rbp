import { MigrationInterface, QueryRunner } from 'typeorm';

export class CharacterIndexMigration1566506354934
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE INDEX LOWER_CHAR_LOOKUP ON character (lower(region), lower(realm), lower(name));',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP INDEX LOWER_CHAR_LOOKUP;');
  }
}
