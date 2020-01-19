"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongooseAsync_1 = __importDefault(require("../framework/mongooseAsync"));
const bow_log_1 = __importDefault(require("../framework/bow-log"));
const loggable_1 = __importDefault(require("../framework/loggable"));
const userSchema = mongooseAsync_1.default.createSchema({
    username: String,
    password: String,
    name: String
});
const UserModel = mongooseAsync_1.default.createModel("User", userSchema);
class UserRepository extends loggable_1.default {
    static findOneByUsername(username) {
        const myself = this.getMyself("findOneByUsername");
        bow_log_1.default.log1(myself, " username=" + username);
        return UserModel.findOneAsync({ username });
    }
    static usernameExists(username) {
        const myself = this.getMyself("usernameExists");
        bow_log_1.default.log1(myself, +" username=" + username);
        return this.findOneByUsername(username)
            .then((userDoc) => Promise.resolve((userDoc != null)));
    }
    static anotherUsernameExists(id, username) {
        const myself = this.getMyself("anotherUsernameExists");
        bow_log_1.default.log1(myself, "id = " + id + " username=" + username);
        const where1 = { username };
        const where2 = { _id: { $ne: id } };
        const where = { where1, where2 };
        return UserModel.findOneAsync(where)
            .then((userDoc) => Promise.resolve((userDoc != null)));
    }
    static addUser(user) {
        const myself = this.getMyself("addUser");
        bow_log_1.default.log1(myself, " user=" + user);
        const userDoc = new UserModel({
            username: user.username,
            password: user.password,
            name: user.name
        });
        return userDoc.saveAsync();
    }
    static updateUser(user) {
        const myself = this.getMyself("updateUser");
        bow_log_1.default.log1(myself, " user=" + user);
        return UserModel.findByIdAndUpdateAsync(user.userId, {
            username: user.username,
            password: user.password,
            name: user.name
        });
    }
    static deleteUser(id) {
        const myself = this.getMyself("deleteUser");
        bow_log_1.default.log1(myself, " id=" + id);
        return UserModel.findByIdAndDeleteAsync(id);
    }
    static getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const myself = this.getMyself("getUser");
            bow_log_1.default.log1(myself, " id=" + id);
            const u = yield UserModel.findByIdAsync(id);
            const user = {
                username: u.username,
                name: u.name,
                userId: u._id
            };
            return user;
        });
    }
    static listUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const myself = this.getMyself("listUsers");
            bow_log_1.default.log1(myself, "");
            const userDocs = yield UserModel.findAsync();
            const users = userDocs.map((u) => {
                return {
                    username: u.username,
                    name: u.name,
                    userId: u._id
                };
            });
            return users;
        });
    }
    static validateUser(u) {
        return __awaiter(this, void 0, void 0, function* () {
            let isValid = true;
            const errors = {};
            if (!u) {
                errors.error = "An error occured";
                return errors;
            }
            if (!u.username || u.username.length === 0) {
                errors.name = "Username is required";
                isValid = false;
            }
            if (!u.password || u.password.length === 0) {
                errors.password = "Password is required";
                isValid = false;
            }
            if (u.password2 !== u.password) {
                errors.password2 = "Passwords dont match";
                isValid = false;
            }
            if (!errors.username) {
                if (u.userId && u.username &&
                    (yield UserRepository.anotherUsernameExists(u.userId, u.username))) {
                    errors[name] = "Username must be unique";
                    isValid = false;
                }
                if (!u.userId && u.username &&
                    (yield UserRepository.usernameExists(u.username))) {
                    errors[name] = "Username must be unique";
                    isValid = false;
                }
            }
            if (isValid) {
                return undefined;
            }
            return errors;
        });
    }
    static getClassname() {
        return "UserRepository";
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.js.map