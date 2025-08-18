"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(userId, rolId, username, password, active) {
        this.userId = userId;
        this.rolId = rolId;
        this.username = username;
        this.password = password;
        this.active = active;
    }
}
exports.User = User;
