"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserType = void 0;
class UserType {
    constructor(userTypeId, name, permissionLevel) {
        this.name = name;
        this.userTypeId = userTypeId;
        this.permissionLevel = permissionLevel;
    }
}
exports.UserType = UserType;
