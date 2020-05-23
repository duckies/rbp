import { Migration } from 'mikro-orm';

export class Migration20200502020028 extends Migration {
  async up(): Promise<void> {
    // this.addSql('create index if not exists on raid (id) where "is_featured" = TRUE;');

    /**
     * Cleanup Queries: Harmless or default dropping.
     */
    this.addSql('alter table "form" drop constraint if exists "form_updated_at_check";');
    this.addSql(
      'alter table "form" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql('alter table "form" alter column "updated_at" drop default;');

    this.addSql('alter table "form_character" drop constraint if exists "form_character_region_check";');
    this.addSql('alter table "form_character" alter column "region" type text using ("region"::text);');
    this.addSql(
      'alter table "form_character" add constraint "form_character_region_check" check ("region" in (\'us\'));',
    );
    this.addSql('alter table "form_character" drop constraint if exists "form_character_updated_at_check";');
    this.addSql(
      'alter table "form_character" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql('alter table "form_character" alter column "updated_at" drop default;');
    this.addSql(
      'alter table "form_character" drop constraint if exists "form_character_submission_id_check";',
    );
    this.addSql(
      'alter table "form_character" alter column "submission_id" type int4 using ("submission_id"::int4);',
    );
    this.addSql('alter table "form_character" alter column "submission_id" drop not null;');

    this.addSql('alter table "form_question" drop constraint if exists "form_question_file_types_check";');
    this.addSql(
      'alter table "form_question" alter column "file_types" type text[] using ("file_types"::text[]);',
    );

    this.addSql('alter table "user" drop constraint if exists "user_roles_check";');
    this.addSql('alter table "user" alter column "roles" type text[] using ("roles"::text[]);');
  }
}
