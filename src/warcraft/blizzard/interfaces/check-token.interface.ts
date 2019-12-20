export interface BlizzardTokenCheck {
  exp: number;
  user_name: string;
  authorities: string[];
  client_id: string;
  scope: string[];
}
