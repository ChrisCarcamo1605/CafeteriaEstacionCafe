export class UserType {
  userTypeId: bigint;
  name: string;
  permissionLevel: number;

  constructor(userTypeId: bigint, name: string, permissionLevel: number) {
    this.name = name;
    this.userTypeId = userTypeId;
    this.permissionLevel = permissionLevel;
  }
}
