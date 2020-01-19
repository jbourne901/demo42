"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const create_error_1 = __importDefault(require("create-error"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const mongooseAsync_1 = __importDefault(require("./framework/mongooseAsync"));
const loggable_1 = __importDefault(require("./framework/loggable"));
const user_1 = __importDefault(require("./routes/user"));
const bow_log_1 = __importDefault(require("./framework/bow-log"));
class App extends loggable_1.default {
    static start() {
        const myself = this.getMyself("start");
        dotenv_1.default.config({ debug: true });
        let PORT = 0;
        if (process.env.BIND_PORT) {
            PORT = Number.parseInt(process.env.BIND_PORT || "", 10);
        }
        const HOST = process.env.BIND_HOST || "";
        const DB_URL = process.env.DB_URL || "";
        bow_log_1.default.log1(myself, "port=" + PORT + " host=" + HOST + " db_url=" + DB_URL);
        mongooseAsync_1.default.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        const app = express_1.default();
        app.set("port", PORT);
        app.use(morgan_1.default("dev"));
        app.use(cors_1.default());
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use("/api/user", user_1.default.getRouter());
        const notFoundHandler = (req, res, next) => {
            bow_log_1.default.log1(myself, "notFoundHandler");
            next(create_error_1.default());
        };
        app.use(notFoundHandler);
        const errorHandler = (err, req, res, next) => {
            bow_log_1.default.log1(myself, "Error 404 " + req.url);
            console.dir(req.body);
            const status = err.status || 500;
            return res.status(status).end();
        };
        app.use(errorHandler);
        app.listen(PORT, HOST, () => {
            console.log("listening");
        });
    }
    static getClassName() {
        return "App";
    }
}
App.start();
//# sourceMappingURL=server.js.map