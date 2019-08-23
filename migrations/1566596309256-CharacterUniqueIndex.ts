import { MigrationInterface, QueryRunner } from 'typeorm';

export class CharacterUniqueIndex1566596309256 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE INDEX lower_char_index ON character (lower(region), lower(realm), lower(name));',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP INDEX lower_char_index;');
  }
}
