export class UserFactory {
  id = 1;

  customAvatar = false;

  battletag = 'Someone#1000';

  roles = ['GUEST'];

  createdAt = new Date();

  updatedAt = new Date();

  public static build(opts: object = {}): UserFactory {
    return new UserFactory(opts);
  }

  public static buildList(length: number, opts: object = {}): UserFactory[] {
    return Array(length)
      .fill(null)
      .map(() => this.build(opts));
  }

  constructor(opts: object = {}) {
    Object.assign(this, opts);
  }
}
