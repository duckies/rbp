import { Migration } from 'mikro-orm';

/**
 * Migration from TypeORM to MikroORM
 */

export class Migration20200501211724 extends Migration {
  async up(): Promise<void> {
    /**
     * Article
     */

    this.addSql('alter table "article" rename column "authorId" to "author_id";');
    this.addSql('alter table "article" rename column "createdAt" to "created_at";');
    this.addSql('alter table "article" rename column "updatedAt" to "updated_at";');

    /**
     * WoW Asset
     */

    this.addSql('alter table "wow_assets" rename to "wow_asset";');
    this.addSql('alter table "wow_asset" drop constraint if exists "wow_asset_type_check";');
    this.addSql('alter table "wow_asset" alter column "type" type text using ("type"::text);');
    this.addSql(
      'alter table "wow_asset" add constraint "wow_asset_type_check" check ("type" in (\'icon\', \'spell\'));',
    );

    /**
     * Guild Character
     */

    this.addSql('alter table "character" rename to "guild_character";');
    this.addSql('alter table "guild_character" rename column "specIcon" to "spec_icon";');
    this.addSql('alter table "guild_character" rename column "mountsCollected" to "mounts_collected";');
    this.addSql(
      'alter table "guild_character" rename column "mountsNotCollected" to "mounts_not_collected";',
    );
    this.addSql('alter table "guild_character" rename column "petsCollected" to "pets_collected";');
    this.addSql('alter table "guild_character" rename column "petsNotCollected" to "pets_not_collected";');
    this.addSql('alter table "guild_character" rename column "honorableKills" to "honorable_kills";');
    this.addSql('alter table "guild_character" rename column "accountId" to "account_id";');
    this.addSql('alter table "guild_character" rename column "missingSince" to "missing_since";');
    this.addSql('alter table "guild_character" rename column "isDeleted" to "is_deleted";');
    this.addSql('alter table "guild_character" drop constraint if exists "guild_character_realm_check";');
    this.addSql('alter table "guild_character" alter column "realm" type text using ("realm"::text);');
    this.addSql(
      "alter table \"guild_character\" add constraint \"guild_character_realm_check\" check (\"realm\" in ('lightbringer', 'cenarius', 'uther', 'kilrogg', 'proudmoore', 'hyjal', 'frostwolf', 'nerzhul', 'kiljaeden', 'blackrock', 'tichondrius', 'silver-hand', 'doomhammer', 'icecrown', 'deathwing', 'kelthuzad', 'eitrigg', 'garona', 'alleria', 'hellscream', 'blackhand', 'whisperwind', 'archimonde', 'illidan', 'stormreaver', 'malganis', 'stormrage', 'zuljin', 'medivh', 'durotan', 'bloodhoof', 'khadgar', 'dalaran', 'elune', 'lothar', 'arthas', 'mannoroth', 'warsong', 'shattered-hand', 'bleeding-hollow', 'skullcrusher', 'argent-dawn', 'sargeras', 'azgalor', 'magtheridon', 'destromath', 'gorgonnash', 'dethecus', 'spinebreaker', 'bonechewer', 'dragonmaw', 'shadowsong', 'silvermoon', 'windrunner', 'cenarion-circle', 'nathrezim', 'terenas', 'burning-blade', 'gorefiend', 'eredar', 'shadowmoon', 'lightnings-blade', 'eonar', 'gilneas', 'kargath', 'llane', 'earthen-ring', 'laughing-skull', 'burning-legion', 'thunderlord', 'malygos', 'thunderhorn', 'aggramar', 'crushridge', 'stonemaul', 'daggerspine', 'stormscale', 'dunemaul', 'boulderfist', 'suramar', 'dragonblight', 'draenor', 'uldum', 'bronzebeard', 'feathermoon', 'bloodscalp', 'darkspear', 'azjolnerub', 'perenolde', 'eldrethalas', 'spirestone', 'shadow-council', 'scarlet-crusade', 'firetree', 'frostmane', 'gurubashi', 'smolderthorn', 'skywall', 'runetotem', 'moonrunner', 'detheroc', 'kalecgos', 'ursin', 'dark-iron', 'greymane', 'wildhammer', 'staghelm', 'emerald-dream', 'maelstrom', 'twisting-nether', 'chogall', 'guldan', 'kaelthas', 'alexstrasza', 'kirin-tor', 'ravencrest', 'balnazzar', 'azshara', 'agamaggan', 'lightninghoof', 'nazjatar', 'malfurion', 'aegwynn', 'akama', 'chromaggus', 'draka', 'drakthul', 'garithos', 'hakkar', 'khaz-modan', 'mugthol', 'korgath', 'kul-tiras', 'malorne', 'rexxar', 'thorium-brotherhood', 'arathor', 'madoran', 'trollbane', 'muradin', 'veknilash', 'senjin', 'baelgun', 'duskwood', 'zuluhed', 'steamwheedle-cartel', 'norgannon', 'thrall', 'anetheron', 'turalyon', 'haomarush', 'scilla', 'ysondre', 'ysera', 'dentarg', 'andorhal', 'executus', 'dalvengyr', 'black-dragonflight', 'altar-of-storms', 'uldaman', 'aerie-peak', 'onyxia', 'demon-soul', 'gnomeregan', 'anvilmar', 'the-venture-co', 'sentinels', 'jaedenar', 'tanaris', 'alterac-mountains', 'undermine', 'lethon', 'blackwing-lair', 'arygos', 'echo-isles', 'the-forgotten-coast', 'fenris', 'anubarak', 'blackwater-raiders', 'vashj', 'korialstrasz', 'misha', 'darrowmere', 'ravenholdt', 'bladefist', 'shuhalo', 'winterhoof', 'sisters-of-elune', 'maiev', 'rivendare', 'nordrassil', 'tortheldrin', 'cairne', 'draktharon', 'antonidas', 'shandris', 'moon-guard', 'nazgrel', 'hydraxis', 'wyrmrest-accord', 'farstriders', 'borean-tundra', 'queldorei', 'garrosh', 'moknathal', 'nesingwary', 'drenden', 'drakkari', 'ragnaros', 'quelthalas', 'azuremyst', 'auchindoun', 'coilfang', 'shattered-halls', 'blood-furnace', 'the-underbog', 'terokkar', 'blades-edge', 'exodar', 'area-52', 'velen', 'the-scryers', 'zangarmarsh', 'fizzcrank', 'ghostlands', 'grizzly-hills', 'galakrond', 'dawnbringer', 'goldrinn', 'nemesis', 'azralon', 'tol-barad', 'gallywix', 'caelestrasz', 'amanthul', 'barthilas', 'thaurissan', 'frostmourne', 'khazgoroth', 'dreadmaul', 'nagrand', 'dathremar', 'jubeithos', 'gundrak', 'saurfang'));",
    );
    this.addSql('alter table "guild_character" drop constraint if exists "guild_character_faction_check";');
    this.addSql(
      'alter table "guild_character" alter column "faction" type varchar(255) using ("faction"::varchar(255));',
    );
    this.addSql('alter table "guild_character" alter column "faction" drop not null;');
    this.addSql('alter table "guild_character" drop constraint if exists "guild_character_retries_check";');
    this.addSql('alter table "guild_character" alter column "retries" type int4 using ("retries"::int4);');
    this.addSql('alter table "guild_character" alter column "retries" drop default;');

    /**
     * File Upload
     */

    this.addSql('alter table "file_upload" rename column "submissionId" to "submission_id";');
    this.addSql('alter table "file_upload" drop constraint "FK_705c786b42c94cc4cd86451b911";');
    this.addSql('alter table "file_upload" rename column "authorId" to "author_id";');
    this.addSql('alter table "file_upload" alter column "author_id" set not null;');
    this.addSql('alter table file_upload drop constraint if exists "FK_a1fabce5be410fe414926f12f77";');
    this.addSql('alter table "file_upload" drop constraint if exists "file_upload_submission_id_check";');
    this.addSql(
      'alter table "file_upload" add constraint "file_upload_submission_id_check" foreign key ("submission_id") references "form_submission" ("id") on update cascade on delete set null;',
    );
    this.addSql(
      'alter table "file_upload" add constraint "file_upload_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;',
    );

    /**
     * Form
     */

    this.addSql('alter table "form" rename column "createdOn" to "created_at";');
    this.addSql(
      'alter table "form" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql('alter table "form" rename column "lastUpdated" to "updated_at";');
    this.addSql(
      'alter table "form" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );

    /**
     * Form Character
     */

    this.addSql('alter table "form_character" rename column "raiderIO" to "raider_io";');
    this.addSql('alter table "form_character" rename column "isMain" to "is_main";');
    this.addSql('alter table "form_character" rename column "updatedAt" to "updated_at";');
    this.addSql('alter table "form_character" rename column "submissionId" to "submission_id";');
    this.addSql('alter table "form_character" alter column "submission_id" set not null;');
    this.addSql(
      'alter table "form_character" add column "raids" json null, add column "created_at" timestamptz(0) default now() not null;',
    );
    this.addSql('alter table "form_character" drop constraint if exists "form_character_realm_check";');
    this.addSql('alter table "form_character" alter column "realm" type text using ("realm"::text);');
    this.addSql(
      "alter table \"form_character\" add constraint \"form_character_realm_check\" check (\"realm\" in ('lightbringer', 'cenarius', 'uther', 'kilrogg', 'proudmoore', 'hyjal', 'frostwolf', 'nerzhul', 'kiljaeden', 'blackrock', 'tichondrius', 'silver-hand', 'doomhammer', 'icecrown', 'deathwing', 'kelthuzad', 'eitrigg', 'garona', 'alleria', 'hellscream', 'blackhand', 'whisperwind', 'archimonde', 'illidan', 'stormreaver', 'malganis', 'stormrage', 'zuljin', 'medivh', 'durotan', 'bloodhoof', 'khadgar', 'dalaran', 'elune', 'lothar', 'arthas', 'mannoroth', 'warsong', 'shattered-hand', 'bleeding-hollow', 'skullcrusher', 'argent-dawn', 'sargeras', 'azgalor', 'magtheridon', 'destromath', 'gorgonnash', 'dethecus', 'spinebreaker', 'bonechewer', 'dragonmaw', 'shadowsong', 'silvermoon', 'windrunner', 'cenarion-circle', 'nathrezim', 'terenas', 'burning-blade', 'gorefiend', 'eredar', 'shadowmoon', 'lightnings-blade', 'eonar', 'gilneas', 'kargath', 'llane', 'earthen-ring', 'laughing-skull', 'burning-legion', 'thunderlord', 'malygos', 'thunderhorn', 'aggramar', 'crushridge', 'stonemaul', 'daggerspine', 'stormscale', 'dunemaul', 'boulderfist', 'suramar', 'dragonblight', 'draenor', 'uldum', 'bronzebeard', 'feathermoon', 'bloodscalp', 'darkspear', 'azjolnerub', 'perenolde', 'eldrethalas', 'spirestone', 'shadow-council', 'scarlet-crusade', 'firetree', 'frostmane', 'gurubashi', 'smolderthorn', 'skywall', 'runetotem', 'moonrunner', 'detheroc', 'kalecgos', 'ursin', 'dark-iron', 'greymane', 'wildhammer', 'staghelm', 'emerald-dream', 'maelstrom', 'twisting-nether', 'chogall', 'guldan', 'kaelthas', 'alexstrasza', 'kirin-tor', 'ravencrest', 'balnazzar', 'azshara', 'agamaggan', 'lightninghoof', 'nazjatar', 'malfurion', 'aegwynn', 'akama', 'chromaggus', 'draka', 'drakthul', 'garithos', 'hakkar', 'khaz-modan', 'mugthol', 'korgath', 'kul-tiras', 'malorne', 'rexxar', 'thorium-brotherhood', 'arathor', 'madoran', 'trollbane', 'muradin', 'veknilash', 'senjin', 'baelgun', 'duskwood', 'zuluhed', 'steamwheedle-cartel', 'norgannon', 'thrall', 'anetheron', 'turalyon', 'haomarush', 'scilla', 'ysondre', 'ysera', 'dentarg', 'andorhal', 'executus', 'dalvengyr', 'black-dragonflight', 'altar-of-storms', 'uldaman', 'aerie-peak', 'onyxia', 'demon-soul', 'gnomeregan', 'anvilmar', 'the-venture-co', 'sentinels', 'jaedenar', 'tanaris', 'alterac-mountains', 'undermine', 'lethon', 'blackwing-lair', 'arygos', 'echo-isles', 'the-forgotten-coast', 'fenris', 'anubarak', 'blackwater-raiders', 'vashj', 'korialstrasz', 'misha', 'darrowmere', 'ravenholdt', 'bladefist', 'shuhalo', 'winterhoof', 'sisters-of-elune', 'maiev', 'rivendare', 'nordrassil', 'tortheldrin', 'cairne', 'draktharon', 'antonidas', 'shandris', 'moon-guard', 'nazgrel', 'hydraxis', 'wyrmrest-accord', 'farstriders', 'borean-tundra', 'queldorei', 'garrosh', 'moknathal', 'nesingwary', 'drenden', 'drakkari', 'ragnaros', 'quelthalas', 'azuremyst', 'auchindoun', 'coilfang', 'shattered-halls', 'blood-furnace', 'the-underbog', 'terokkar', 'blades-edge', 'exodar', 'area-52', 'velen', 'the-scryers', 'zangarmarsh', 'fizzcrank', 'ghostlands', 'grizzly-hills', 'galakrond', 'dawnbringer', 'goldrinn', 'nemesis', 'azralon', 'tol-barad', 'gallywix', 'caelestrasz', 'amanthul', 'barthilas', 'thaurissan', 'frostmourne', 'khazgoroth', 'dreadmaul', 'nagrand', 'dathremar', 'jubeithos', 'gundrak', 'saurfang'));",
    );
    this.addSql('alter table "form_character" drop constraint if exists "form_character_region_check";');
    this.addSql('alter table "form_character" alter column "region" type text using ("region"::text);');
    this.addSql(
      'alter table "form_character" add constraint "form_character_region_check" check ("region" in (\'us\'));',
    );
    this.addSql('alter table "form_character" alter column "region" drop default;');
    this.addSql('alter table "form_character" drop constraint if exists "form_character_equipment_check";');
    this.addSql('alter table "form_character" alter column "equipment" type json using ("equipment"::json);');
    this.addSql(
      'alter table "form_character" drop constraint if exists "form_character_specializations_check";',
    );
    this.addSql(
      'alter table "form_character" alter column "specializations" type json using ("specializations"::json);',
    );
    this.addSql('alter table "form_character" alter column "raider_io" type json using "raider_io"::json;');
    this.addSql('alter table "form_character" alter column "updated_at" type timestamptz(0);');
    this.addSql('alter table "form_character" drop constraint if exists "form_character_created_at_check";');
    this.addSql('alter table "form_character" alter column "created_at" drop default;');
    this.addSql('alter table "form_character" drop constraint "FK_749f1a8f35755efc0a36f817f21";');

    /**
     * Form Comment
     */

    this.addSql(
      'create table "form_comment" ("id" serial primary key, "message" varchar(255) not null, "user_id" int4 not null, "author_id" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );
    this.addSql(
      'alter table "form_comment" add constraint "form_comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "form_comment" add constraint "form_comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;',
    );

    /**
     * Form Question
     */

    this.addSql('alter table "form_question" rename column "hasAnswers" to "has_answers";');
    this.addSql('alter table "form_question" rename column "formId" to "form_id";');
    this.addSql('alter table "form_question" add column "file_types" text[] null;');
    this.addSql('alter table "form_question" drop constraint if exists "form_question_id_check";');
    this.addSql(
      'alter table "form_question" alter column "id" type varchar(255) using ("id"::varchar(255));',
    );
    this.addSql('alter table "form_question" drop constraint if exists "PK_5bc5aa86b9da4b82b41726d8126";');
    this.addSql('alter table "form_question" alter column "id" drop default;');
    this.addSql('alter table "form_question" drop constraint if exists "form_question_choices_check";');
    this.addSql('alter table "form_question" drop column "choices";');
    this.addSql('alter table "form_question" add column "choices" json;');
    this.addSql('alter table "form_question" drop constraint if exists "form_question_type_check";');
    this.addSql('alter table "form_question" alter column "type" type text using ("type"::text);');
    this.addSql(
      "alter table \"form_question\" add constraint \"form_question_type_check\" check (\"type\" in ('TextInput', 'TextArea', 'Checkbox', 'Select', 'Radio', 'Upload'));",
    );
    this.addSql('alter table "form_question" add constraint "form_question_pkey" primary key ("id");');
    this.addSql('alter table "form_question" rename column "createdAt" to "created_at";');
    this.addSql(
      'alter table "form_question" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql('alter table "form_question" alter column "created_at" drop default;');
    this.addSql('alter table "form_question" rename column "updatedAt" to "updated_at";');
    this.addSql(
      'alter table "form_question" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql('alter table "form_question" alter column "updated_at" drop default;');
    this.addSql('alter table "form_question" drop column "fileTypes";');

    /**
     * Form Submission
     */

    this.addSql('alter table "form_submission" rename column "formId" to "form_id";');
    this.addSql('alter table "form_submission" rename column "authorId" to "author_id";');
    this.addSql('alter table form_submission rename column "createdAt" to created_at;');
    this.addSql(
      'alter table "form_submission" alter column "created_at" type timestamptz(0) using created_at::timestamptz(0);',
    );
    this.addSql(
      'alter table "form_submission" add column "updated_at" timestamptz(0) default now() not null;',
    );
    this.addSql('alter table "form_submission" alter column "created_at" drop default;');
    this.addSql('alter table "form_submission" alter column "updated_at" drop default;');
    this.addSql('alter table "form_submission" drop constraint if exists "form_submission_status_check";');
    this.addSql('alter table "form_submission" alter column "status" type text using ("status"::text);');
    this.addSql(
      "alter table \"form_submission\" add constraint \"form_submission_status_check\" check (\"status\" in ('open', 'approved', 'rejected', 'cancelled'));",
    );
    this.addSql('alter table "form_submission" alter column "status" drop default;');
    this.addSql('alter table "form_submission" drop constraint if exists "form_submission_answers_check";');
    this.addSql('alter table "form_submission" alter column "answers" type json using ("answers"::json);');

    /**
     * Raid
     */

    this.addSql('alter table "raid" rename column "isFeatured" to "is_featured";');
    this.addSql('alter table "raid" add column "created_at" timestamptz(0) default now() not null;');
    this.addSql('alter table "raid" alter column "created_at" drop default;');
    this.addSql('alter table "raid" rename column "updatedAt" to "updated_at";');
    this.addSql(
      'alter table "raid" alter column "updated_at" type timestamptz(0) using updated_at::timestamptz(0);',
    );
    this.addSql('alter table "raid" alter column "updated_at" drop default;');
    this.addSql('alter table "raid" drop constraint if exists "raid_expansion_check";');
    this.addSql('alter table "raid" alter column "expansion" type text using ("expansion"::text);');
    this.addSql(
      'alter table "raid" add constraint "raid_expansion_check" check ("expansion" in (\'Shadowlands\', \'Battle for Azeroth\', \'Legion\'));',
    );
    this.addSql('alter table "raid" drop constraint if exists "raid_order_check";');
    this.addSql('alter table "raid" alter column "order" type int4 using ("order"::int4);');
    this.addSql('alter table "raid" alter column "order" drop default;');

    /**
     * User
     */

    this.addSql('alter table "user" rename column "nickname" to "blizzard_token";');
    this.addSql('alter table "user" rename column "createdAt" to "created_at";');
    this.addSql('alter table "user" rename column "updatedAt" to "updated_at";');
    this.addSql(
      'alter table "user" alter column "created_at" type timestamptz(0), alter column "updated_at" type timestamptz(0);',
    );
    this.addSql('alter table "user" alter column "created_at" drop default;');
    this.addSql('alter table "user" alter column "updated_at" drop default;');
    this.addSql('alter table "user" drop constraint if exists "user_discord_username_check";');
    this.addSql(
      'alter table "user" alter column "discord_username" type varchar(255) using ("discord_username"::varchar(255));',
    );
    this.addSql('alter table "user" alter column "discord_username" set not null;');
    this.addSql('alter table "user" drop constraint if exists "user_discord_discriminator_check";');
    this.addSql(
      'alter table "user" alter column "discord_discriminator" type varchar(255) using ("discord_discriminator"::varchar(255));',
    );
    this.addSql('alter table "user" alter column "discord_discriminator" set not null;');
    this.addSql('alter table "user" drop constraint if exists "user_roles_check";');
    this.addSql('alter table "user" alter column "roles" type text[] using ("roles"::text[]);');
    this.addSql('alter table "user" alter column "roles" drop default;');
    this.addSql('alter table "user" drop column "battletag";');
    this.addSql('alter table "user" drop column "blizzardid";');
    this.addSql('alter table "user" drop column "blizzardtoken";');
    this.addSql('alter table "user" drop column "blizzardTokenExpiration";');
    this.addSql('alter table "user" drop column "lastLogin";');
    this.addSql('alter table "user" drop column "knownCharacters";');
    this.addSql('alter table "user" drop column "knownCharactersLastUpdated";');
    this.addSql('alter table "user" drop constraint "FK_536c0ea6753ec73bd3af86b98d6";');
    this.addSql('alter table "user" drop constraint "REL_536c0ea6753ec73bd3af86b98d";');
    this.addSql('alter table "user" drop column "mainCharacterId";');

    // Incomplete feature removal.
    this.addSql('drop table if exists "form_submission_read" cascade;');
  }
}
