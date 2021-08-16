import { ClientCredentialResponse } from './interfaces/token-response.interface.js';

const TOKEN_EXPIRE_THRESHOLD_MS = 500;

export class Token {
  private readonly token: string;
  private readonly tokenType: string;
  private readonly expiresIn: number;
  private readonly createdOn: number;

  constructor(data: ClientCredentialResponse) {
    this.token = data.access_token;
    this.tokenType = data.token_type;
    this.expiresIn = data.expires_in * 1000;
    this.createdOn = Date.now();
  }

  public get isValid() {
    return !!this.token && !this.isExpired;
  }

  public get isExpired() {
    return (
      Date.now() > this.createdOn + this.expiresIn - TOKEN_EXPIRE_THRESHOLD_MS
    );
  }

  public get AuthorizationString() {
    return `${this.tokenType} ${this.token}`;
  }
}
