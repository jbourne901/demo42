"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = __importStar(require("bluebird"));
const mongoose_1 = __importDefault(require("mongoose"));
const bow_log_1 = __importDefault(require("./bow-log"));
const loggable_1 = __importDefault(require("./loggable"));
class MongooseAsync extends loggable_1.default {
    static getClassName() {
        return "mongooseAsync";
    }
    constructor() {
        super();
        Bluebird.Promise.promisifyAll(mongoose_1.default);
    }
    createSchema(fields) {
        return new mongoose_1.default.Schema(fields);
    }
    createModel(name, schema) {
        return mongoose_1.default.model(name, schema);
    }
    connect(url, options) {
        const myself = MongooseAsync.getMyself("connect");
        bow_log_1.default.log1(myself, "");
        return mongoose_1.default.connect(url, options);
    }
}
exports.MongooseAsync = MongooseAsync;
const mongooseAsync = new MongooseAsync();
exports.default = mongooseAsync;
//# sourceMappingURL=mongooseAsync.js.map