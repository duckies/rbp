export interface ProfileKnownCharacters {
  characters: KnownCharacter[];
}

export interface KnownCharacter {
  name: string;
  realm: string;
  battlegroup: string;
  class: number;
  race: number;
  gender: number;
  level: number;
  achievementPoints: number;
  thumbnail: string;
  lastModified: number;
}