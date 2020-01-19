"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controller/user"));
const bow_router_1 = __importDefault(require("./bow-router"));
const bow_log_1 = __importDefault(require("../framework/bow-log"));
class UserRouter extends bow_router_1.default {
    static getRouter() {
        const myself = this.getMyself("getRouter");
        bow_log_1.default.log1(myself, "getRouter()");
        const router = express_1.default.Router();
        /*
                router.post("/", (req: Request, res: Response, next: NextFunction) =>
                                UserController.addUser(req, res, next));
                router.put("/:id", (req: Request, res: Response, next: NextFunction) =>
                                UserController.updateUser(req, res, next));
        
                router.delete("/:id", (req: Request, res: Response, next: NextFunction) =>
                                UserController.deleteUser(req, res, next));
        
                router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
                                UserController.getUser(req, res, next));
        */
        router.get("/list", (req, res, next) => {
            bow_log_1.default.log1(myself, "GET /api/users");
            return user_1.default.listUsers(req, res, next);
        });
        return router;
    }
    static getClassName() {
        return "UserRouter";
    }
}
exports.default = UserRouter;
//# sourceMappingURL=user.js.map