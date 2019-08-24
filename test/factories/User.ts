export class UserFactory {
  id = 1;
  customAvatar = false;
  battletag = 'Someone#1000';
  roles = ['GUEST'];
  createdAt = new Date();
  updatedAt = new Date();
  
  public static build(opts: any = {}) {
    return new UserFactory(opts);
  }

  public static buildList(length: number, opts: any = {}) {
    return Array.apply(null, { length }).map(() => this.build(opts));
  }

  constructor(opts: any = {}) {
    Object.assign(this, opts);
  }
}