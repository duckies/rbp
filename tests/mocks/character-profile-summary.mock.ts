import { CharacterProfileSummary } from '../../src/blizzard/interfaces/profile/character-profile/character-profile-summary.interface';

const CharacterProfileSummaryMock = (
  id: number,
  name: string,
): CharacterProfileSummary => ({
  _links: {
    self: {
      href:
        'https://us.api.blizzard.com/profile/wow/character/area-52/duckys?namespace=profile-us',
    },
  },
  id: id,
  name: name,
  gender: {
    type: 'FEMALE',
    name: 'Female',
  },
  faction: {
    type: 'HORDE',
    name: 'Horde',
  },
  race: {
    key: {
      href:
        'https://us.api.blizzard.com/data/wow/playable-race/10?namespace=static-8.3.0_32861-us',
    },
    name: 'Blood Elf',
    id: 10,
  },
  character_class: {
    key: {
      href:
        'https://us.api.blizzard.com/data/wow/playable-class/10?namespace=static-8.3.0_32861-us',
    },
    name: 'Monk',
    id: 10,
  },
  active_spec: {
    key: {
      href:
        'https://us.api.blizzard.com/data/wow/playable-specialization/270?namespace=static-8.3.0_32861-us',
    },
    name: 'Mistweaver',
    id: 270,
  },
  realm: {
    key: {
      href:
        'https://us.api.blizzard.com/data/wow/realm/1566?namespace=dynamic-us',
    },
    name: 'Area 52',
    id: 1566,
    slug: 'area-52',
  },
  guild: {
    key: {
      href:
        'https://us.api.blizzard.com/data/wow/guild/area-52/really-bad-players?namespace=profile-us',
    },
    name: 'Really Bad Players',
    id: 88463212,
    realm: {
      key: {
        href:
          'https://us.api.blizzard.com/data/wow/realm/1566?namespace=dynamic-us',
      },
      name: 'Area 52',
      id: 1566,
      slug: 'area-52',
    },
    faction: {
      type: 'HORDE',
      name: 'Horde',
    },
  },
  level: 120,
  experience: 0,
  achievement_points: 27370,
  achievements: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/achievements?namespace=profile-us',
  },
  titles: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/titles?namespace=profile-us',
  },
  pvp_summary: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/pvp-summary?namespace=profile-us',
  },
  encounters: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/encounters?namespace=profile-us',
  },
  media: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/character-media?namespace=profile-us',
  },
  last_login_timestamp: 1594584038000,
  average_item_level: 479,
  equipped_item_level: 478,
  specializations: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/specializations?namespace=profile-us',
  },
  statistics: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/statistics?namespace=profile-us',
  },
  mythic_keystone_profile: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/mythic-keystone-profile?namespace=profile-us',
  },
  equipment: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/equipment?namespace=profile-us',
  },
  appearance: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/appearance?namespace=profile-us',
  },
  collections: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/collections?namespace=profile-us',
  },
  active_title: {
    key: {
      href:
        'https://us.api.blizzard.com/data/wow/title/303?namespace=static-8.3.0_32861-us',
    },
    name: 'Lady of War',
    id: 303,
    display_string: '{name}, Lady of War',
  },
  reputations: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/reputations?namespace=profile-us',
  },
  quests: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/quests?namespace=profile-us',
  },
  achievements_statistics: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/achievements/statistics?namespace=profile-us',
  },
  professions: {
    href:
      'https://us.api.blizzard.com/profile/wow/character/area-52/duckys/professions?namespace=profile-us',
  },
});

export default CharacterProfileSummaryMock;
