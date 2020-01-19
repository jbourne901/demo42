"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loggable_1 = __importDefault(require("../framework/loggable"));
const bow_log_1 = __importDefault(require("../framework/bow-log"));
class BowRouter extends loggable_1.default {
    static sendError(statusCode, error, res) {
        const myself = this.getMyself("sendErrors");
        bow_log_1.default.error(myself, error);
        return res.status(statusCode).json({ error });
    }
    static getClassName() {
        return "BowRouter";
    }
}
exports.default = BowRouter;
//# sourceMappingURL=bow-router.js.map