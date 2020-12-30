import { Migration } from '@mikro-orm/migrations';

export class Migration20200804011356 extends Migration {
  async up(): Promise<void> {
    // Remove duplicate characters.
    this.addSql(`delete from form_character where id not in (
      select * from (
          select max(id) from form_character group by character_id
      ) tmp
  );`);

    // Form Comment
    this.addSql(
      'update "form_character" fc set id = fc.character_id where 1 = 1;',
    );

    // Form Character
    this.addSql(
      'update "form_character" fc set character_id = 120 where 1 = 1;',
    );

    this.addSql(
      'alter table "form_character" add column "last_login" timestamptz(0) null;',
    );
    this.addSql(
      'alter table "form_character" add column "last_modified" varchar(255) null;',
    );
    this.addSql(
      'alter table "form_character" add column "title" varchar(255) null;',
    );
    this.addSql(
      'alter table "form_character" rename column "character_id" to "level";',
    );
    this.addSql(
      'alter table "form_character" add column "num_mounts_collected" int4 null;',
    );
    this.addSql(
      'alter table "form_character" alter column "specializations" type jsonb;',
    );
    this.addSql(
      'alter table "form_character" alter column "raids" type jsonb;',
    );
    this.addSql(
      'alter table "form_character" alter column "equipment" type jsonb;',
    );
    this.addSql(
      'alter table "form_character" alter column "raider_io" type jsonb;',
    );
    this.addSql('alter table "form_character" drop column "is_main";');
    this.addSql(
      'alter table "form_character" drop constraint if exists "form_character_region_check";',
    );
    this.addSql(
      'alter table "form_character" alter column "region" type text using ("region"::text);',
    );
    this.addSql(
      `alter table "form_character" add constraint "form_character_region_check" check ("region" in ('us'));`,
    );

    // Form Question
    this.addSql(
      'alter table "form_question" drop constraint if exists "form_question_choices_check";',
    );
    this.addSql('alter table "form_question" drop column "choices";');
    this.addSql(
      'alter table "form_question" add column "choices" text[] null;',
    );

    // Guild Character
    this.addSql(
      'alter table "guild_character" rename column "faction" to "last_modified";',
    );
    this.addSql(
      'alter table "guild_character" rename column "guild_id" to "num_mounts_collected";',
    );
    this.addSql(
      'alter table "guild_character" add column "specialization_id" int4 null;',
    );
    this.addSql(
      'alter table "guild_character" add column "specialization_name" text null;',
    );
    this.addSql(
      'alter table "guild_character" add column "specializations" jsonb null;',
    );
    this.addSql('alter table "guild_character" add column "raids" jsonb null;');
    this.addSql(
      'alter table "guild_character" add column "equipment" jsonb null;',
    );
    this.addSql(
      'alter table "guild_character" add column "raider_io" jsonb null;',
    );
    this.addSql(
      'alter table "guild_character" add column "created_at" timestamptz(0) not null default now();',
    );
    this.addSql(
      'alter table "guild_character" add column "updated_at" timestamptz(0) not null default now();',
    );
    this.addSql(
      'alter table "guild_character" alter column "updated_at" drop default;',
    );
    this.addSql(
      'alter table "guild_character" alter column "created_at" drop default;',
    );
    this.addSql(
      'alter table "guild_character" drop constraint if exists "guild_character_region_check";',
    );
    this.addSql(
      'alter table "guild_character" alter column "region" type text using ("region"::text);',
    );
    this.addSql(
      `alter table "guild_character" add constraint "guild_character_region_check" check ("region" in ('us'));`,
    );
    this.addSql(
      'alter table "guild_character" drop constraint if exists "guild_character_level_check";',
    );
    this.addSql(
      'alter table "guild_character" alter column "level" type int2 using ("level"::int2);',
    );
    this.addSql(
      'alter table "guild_character" alter column "level" drop not null;',
    );
    this.addSql(
      'alter table "guild_character" drop constraint if exists "guild_character_race_id_check";',
    );
    this.addSql(
      'alter table "guild_character" alter column "race_id" type int2 using ("race_id"::int2);',
    );
    this.addSql(
      'alter table "guild_character" alter column "race_id" drop not null;',
    );
    this.addSql(
      'alter table "guild_character" drop constraint if exists "guild_character_race_name_check";',
    );
    this.addSql(
      'alter table "guild_character" alter column "race_name" type varchar(255) using ("race_name"::varchar(255));',
    );
    this.addSql(
      'alter table "guild_character" alter column "race_name" drop not null;',
    );
    this.addSql(
      'alter table "guild_character" drop constraint if exists "guild_character_class_id_check";',
    );
    this.addSql(
      'alter table "guild_character" alter column "class_id" type int2 using ("class_id"::int2);',
    );
    this.addSql(
      'alter table "guild_character" alter column "class_id" drop not null;',
    );
    this.addSql(
      'alter table "guild_character" drop constraint if exists "guild_character_class_name_check";',
    );
    this.addSql(
      'alter table "guild_character" alter column "class_name" type varchar(255) using ("class_name"::varchar(255));',
    );
    this.addSql(
      'alter table "guild_character" alter column "class_name" drop not null;',
    );
    this.addSql(
      'alter table "guild_character" drop constraint if exists "guild_character_gender_check";',
    );
    this.addSql(
      'alter table "guild_character" alter column "gender" type varchar(255) using ("gender"::varchar(255));',
    );
    this.addSql(
      'alter table "guild_character" alter column "gender" drop not null;',
    );
    this.addSql(
      'alter table "guild_character" drop constraint if exists "guild_character_average_item_level_check";',
    );
    this.addSql(
      'alter table "guild_character" alter column "average_item_level" type int4 using ("average_item_level"::int4);',
    );
    this.addSql(
      'alter table "guild_character" alter column "average_item_level" drop not null;',
    );
    this.addSql(
      'alter table "guild_character" drop constraint if exists "guild_character_equipped_item_level_check";',
    );
    this.addSql(
      'alter table "guild_character" alter column "equipped_item_level" type int4 using ("equipped_item_level"::int4);',
    );
    this.addSql(
      'alter table "guild_character" alter column "equipped_item_level" drop not null;',
    );
    this.addSql(
      'alter table "guild_character" drop constraint if exists "guild_character_last_login_check";',
    );
    this.addSql(
      'alter table "guild_character" alter column "last_login" type timestamptz(0) using ("last_login"::timestamptz(0));',
    );
    this.addSql(
      'alter table "guild_character" alter column "last_login" drop not null;',
    );
    this.addSql(
      'alter table "guild_character" drop constraint if exists "guild_character_guild_rank_check";',
    );
    this.addSql(
      'alter table "guild_character" alter column "guild_rank" type int2 using ("guild_rank"::int2);',
    );
    this.addSql(
      'alter table "guild_character" alter column "guild_rank" set not null;',
    );
    this.addSql(
      'alter table "guild_character" drop column "achievement_points";',
    );
    this.addSql('alter table "guild_character" drop column "guild_name";');
    this.addSql('alter table "guild_character" drop column "guild_realm";');
    this.addSql(
      'alter table "guild_character" drop column "active_spec_name";',
    );
    this.addSql('alter table "guild_character" drop column "spec_icon";');
    this.addSql(
      'alter table "guild_character" drop column "mounts_collected";',
    );
    this.addSql(
      'alter table "guild_character" drop column "mounts_not_collected";',
    );
    this.addSql('alter table "guild_character" drop column "pets_collected";');
    this.addSql(
      'alter table "guild_character" drop column "pets_not_collected";',
    );
    this.addSql('alter table "guild_character" drop column "honorable_kills";');
    this.addSql('alter table "guild_character" drop column "status";');
    this.addSql('alter table "guild_character" drop column "retries";');
    this.addSql(
      'alter table "guild_character" drop constraint "guild_character_account_id_foreign";',
    );
    this.addSql('alter table "guild_character" drop column "account_id";');
    this.addSql('alter table "guild_character" drop column "missing_since";');
    this.addSql('alter table "guild_character" drop column "is_deleted";');

    // Article
    this.addSql(
      'alter table "article" drop constraint if exists "article_author_id_check";',
    );
    this.addSql(
      'alter table "article" alter column "author_id" type int4 using ("author_id"::int4);',
    );
    this.addSql('update "article" set author_id = 1 where author_id is NULL;');
    this.addSql('alter table "article" alter column "author_id" set not null;');

    // Form Submission
    this.addSql(
      'alter table "form_submission" add column "main_character_id" int4 null;',
    );

    // Form Submission Characters
    this.addSql(
      'create table "form_submission_characters" ("form_submission_id" int4 not null, "form_character_id" int4 not null);',
    );
    this.addSql(
      'alter table "form_submission_characters" add constraint "form_submission_characters_pkey" primary key ("form_submission_id", "form_character_id");',
    );
    this.addSql(
      'insert into "form_submission_characters" (form_submission_id, form_character_id) SELECT submission_id, id from form_character;',
    );
    this.addSql(
      'alter table "form_character" drop constraint "form_character_submission_id_foreign";',
    );
    this.addSql('alter table "form_character" drop column "submission_id";');

    // Form Submission
    this.addSql(
      'alter table "form_submission" add constraint "form_submission_main_character_id_foreign" foreign key ("main_character_id") references "form_character" ("id") on update cascade on delete set null;',
    );
    this.addSql(
      'alter table "form_submission_characters" add constraint "form_submission_characters_form_submission_id_foreign" foreign key ("form_submission_id") references "form_submission" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "form_submission_characters" add constraint "form_submission_characters_form_character_id_foreign" foreign key ("form_character_id") references "form_character" ("id") on update cascade on delete cascade;',
    );
  }
}
