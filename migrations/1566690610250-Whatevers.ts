import {MigrationInterface, QueryRunner} from "typeorm";

export class Whatevers1566690610250 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "character" DROP CONSTRAINT "UNIQUE_CHARACTER"`);
        await queryRunner.query(`ALTER TABLE "character" DROP COLUMN "realm"`);
        await queryRunner.query(`CREATE TYPE "character_realm_enum" AS ENUM('Lightbringer', 'Cenarius', 'Uther', 'Kilrogg', 'Proudmoore', 'Hyjal', 'Frostwolf', 'Ner'zhul', 'Kil'jaeden', 'Blackrock', 'Tichondrius', 'Silver Hand', 'Doomhammer', 'Icecrown', 'Deathwing', 'Kel'Thuzad', 'Eitrigg', 'Garona', 'Alleria', 'Hellscream', 'Blackhand', 'Whisperwind', 'Archimonde', 'Illidan', 'Stormreaver', 'Mal'Ganis', 'Stormrage', 'Zul'jin', 'Medivh', 'Durotan', 'Bloodhoof', 'Khadgar', 'Dalaran', 'Elune', 'Lothar', 'Arthas', 'Mannoroth', 'Warsong', 'Shattered Hand', 'Bleeding Hollow', 'Skullcrusher', 'Argent Dawn', 'Sargeras', 'Azgalor', 'Magtheridon', 'Destromath', 'Gorgonnash', 'Dethecus', 'Spinebreaker', 'Bonechewer', 'Dragonmaw', 'Shadowsong', 'Silvermoon', 'Windrunner', 'Cenarion Circle', 'Nathrezim', 'Terenas', 'Burning Blade', 'Gorefiend', 'Eredar', 'Shadowmoon', 'Lightning's Blade', 'Eonar', 'Gilneas', 'Kargath', 'Llane', 'Earthen Ring', 'Laughing Skull', 'Burning Legion', 'Thunderlord', 'Malygos', 'Thunderhorn', 'Aggramar', 'Crushridge', 'Stonemaul', 'Daggerspine', 'Stormscale', 'Dunemaul', 'Boulderfist', 'Suramar', 'Dragonblight', 'Draenor', 'Uldum', 'Bronzebeard', 'Feathermoon', 'Bloodscalp', 'Darkspear', 'Azjol-Nerub', 'Perenolde', 'Eldre'Thalas', 'Spirestone', 'Shadow Council', 'Scarlet Crusade', 'Firetree', 'Frostmane', 'Gurubashi', 'Smolderthorn', 'Skywall', 'Runetotem', 'Moonrunner', 'Detheroc', 'Kalecgos', 'Ursin', 'Dark Iron', 'Greymane', 'Wildhammer', 'Staghelm', 'Emerald Dream', 'Maelstrom', 'Twisting Nether', 'Cho'gall', 'Gul'dan', 'Kael'thas', 'Alexstrasza', 'Kirin Tor', 'Ravencrest', 'Balnazzar', 'Azshara', 'Agamaggan', 'Lightninghoof', 'Nazjatar', 'Malfurion', 'Aegwynn', 'Akama', 'Chromaggus', 'Draka', 'Drak'thul', 'Garithos', 'Hakkar', 'Khaz Modan', 'Mug'thol', 'Korgath', 'Kul Tiras', 'Malorne', 'Rexxar', 'Thorium Brotherhood', 'Arathor', 'Madoran', 'Trollbane', 'Muradin', 'Vek'nilash', 'Sen'jin', 'Baelgun', 'Duskwood', 'Zuluhed', 'Steamwheedle Cartel', 'Norgannon', 'Thrall', 'Anetheron', 'Turalyon', 'Haomarush', 'Scilla', 'Ysondre', 'Ysera', 'Dentarg', 'Andorhal', 'Executus', 'Dalvengyr', 'Black Dragonflight', 'Altar of Storms', 'Uldaman', 'Aerie Peak', 'Onyxia', 'Demon Soul', 'Gnomeregan', 'Anvilmar', 'The Venture Co', 'Sentinels', 'Jaedenar', 'Tanaris', 'Alterac Mountains', 'Undermine', 'Lethon', 'Blackwing Lair', 'Arygos', 'Echo Isles', 'The Forgotten Coast', 'Fenris', 'Anub'arak', 'Blackwater Raiders', 'Vashj', 'Korialstrasz', 'Misha', 'Darrowmere', 'Ravenholdt', 'Bladefist', 'Shu'halo', 'Winterhoof', 'Sisters of Elune', 'Maiev', 'Rivendare', 'Nordrassil', 'Tortheldrin', 'Cairne', 'Drak'Tharon', 'Antonidas', 'Shandris', 'Moon Guard', 'Nazgrel', 'Hydraxis', 'Wyrmrest Accord', 'Farstriders', 'Borean Tundra', 'Quel'dorei', 'Garrosh', 'Mok'Nathal', 'Nesingwary', 'Drenden', 'Drakkari', 'Ragnaros', 'Quel'Thalas', 'Azuremyst', 'Auchindoun', 'Coilfang', 'Shattered Halls', 'Blood Furnace', 'The Underbog', 'Terokkar', 'Blade's Edge', 'Exodar', 'Area 52', 'Velen', 'The Scryers', 'Zangarmarsh', 'Fizzcrank', 'Ghostlands', 'Grizzly Hills', 'Galakrond', 'Dawnbringer', 'Goldrinn', 'Nemesis', 'Azralon', 'Tol Barad', 'Gallywix', 'Caelestrasz', 'Aman'Thul', 'Barthilas', 'Thaurissan', 'Frostmourne', 'Khaz'goroth', 'Dreadmaul', 'Nagrand', 'Dath'Remar', 'Jubei'Thos', 'Gundrak', 'Saurfang')`);
        await queryRunner.query(`ALTER TABLE "character" ADD "realm" "character_realm_enum" NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."_user_roles_enum" RENAME TO "user_roles_enum_old"`);
        await queryRunner.query(`CREATE TYPE "user_roles_enum" AS ENUM('GUILD_MASTER', 'OFFICER', 'OFFICER_ALT', 'RAIDER_(BANK)', 'RAIDER', 'RECRUIT', 'FAN', 'PLAYER_ALT', 'GUEST')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" TYPE "user_roles_enum"[] USING "roles"::"text"::"user_roles_enum"[]`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '{GUEST}'`);
        await queryRunner.query(`DROP TYPE "user_roles_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '{GUEST}'`);
        await queryRunner.query(`ALTER TABLE "character" ADD CONSTRAINT "UNIQUE_CHARACTER" UNIQUE ("name", "realm", "region")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "character" DROP CONSTRAINT "UNIQUE_CHARACTER"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '{Guest}'`);
        await queryRunner.query(`CREATE TYPE "user_roles_enum_old" AS ENUM('Guild Master', 'Officer', 'Officer Alt', 'Raider (Bank)', 'Raider', 'Recruit', 'Fan', 'Player Alt', 'Guest')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" TYPE "user_roles_enum_old"[] USING "roles"::"text"::"user_roles_enum_old"[]`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '{GUEST}'`);
        await queryRunner.query(`DROP TYPE "user_roles_enum"`);
        await queryRunner.query(`ALTER TYPE "user_roles_enum_old" RENAME TO  "_user_roles_enum"`);
        await queryRunner.query(`ALTER TABLE "character" DROP COLUMN "realm"`);
        await queryRunner.query(`DROP TYPE "character_realm_enum"`);
        await queryRunner.query(`ALTER TABLE "character" ADD "realm" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "character" ADD CONSTRAINT "UNIQUE_CHARACTER" UNIQUE ("region", "name", "realm")`);
    }

}
