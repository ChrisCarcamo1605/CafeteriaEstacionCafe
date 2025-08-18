export class User {
  userId: bigint;
  rolId: bigint;
  username: string;
  password: string;
  active: boolean;

  constructor(
    userId: bigint,
    rolId: bigint,
    username: string,
    password: string,
    active: boolean
  ) {
    this.userId = userId;
    this.rolId = rolId;
    this.username = username;
    this.password = password;
    this.active = active;
  }
}
