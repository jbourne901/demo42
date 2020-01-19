import express, {Request, Response, NextFunction} from "express";
import UserController from "../controller/user";
import BowRouter from "./bow-router";
import BowLog from "../framework/bow-log";

export default class UserRouter extends BowRouter {
    public static getRouter() {
        const myself = this.getMyself("getRouter");
        BowLog.log1(myself, "getRouter()");
        const router = express.Router();

        router.post("/list", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "POST /api/user/list");
            return UserController.listUsers(req, res, next);
        });

        router.post("/delete", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "POST /api/user/delete");
            UserController.deleteUser(req, res, next);
        });

        router.post("/get", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "++POST /api/user/get");
            UserController.getUser(req, res, next);
        });

        router.post("/save", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "++POST /api/user/save");
            UserController.saveUser(req, res, next);
        });

        return router;
    }
    protected static getClassName() {
        return "UserRouter";
    }
}
