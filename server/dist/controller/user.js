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
const user_1 = require("../model/user");
const controller_1 = __importDefault(require("./controller"));
const bow_log_1 = __importDefault(require("../framework/bow-log"));
class UserController extends controller_1.default {
    static listUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const myself = UserController.getClassName();
            bow_log_1.default.log1(myself, "GET /api/user ");
            return user_1.UserRepository.listUsers()
                .then((users) => controller_1.default.sendSuccessWithPayload(users, req, res, next))
                .catch((err) => controller_1.default.sendError(err, req, res, next));
        });
    }
    static addUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            const errors = yield user_1.UserRepository.validateUser(user);
            if (errors != null) {
                return UserController.sendErrors(errors, req, res, next);
            }
            const { name, username, password } = user;
            const newUser = {
                name,
                username,
                password
            };
            return user_1.UserRepository.addUser(newUser)
                .then(() => UserController.sendSuccess(req, res, next))
                .catch((err) => UserController.sendError(err, req, res, next));
        });
    }
    static getClassName() {
        return "UserController";
    }
}
exports.default = UserController;
/*
addUser(req, res, next));
updateUser(req, res, next));
deleteUser(req, res, next));
getUser(req, res, next));
listUsers(req, res, next));
*/
//# sourceMappingURL=user.js.map