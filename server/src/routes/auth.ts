import express, {Request, Response, NextFunction} from "express";
import BowLog from "../framework/bow-log";
import AuthController from "../controller/auth";
import BowRouter from "./bow-router";

export default class AuthRouter extends BowRouter {
    public static getRouter() {
        const myself = this.getMyself("getRouter");
        const router = express.Router();

        router.post("/login", (req: Request, res: Response, next: NextFunction) =>
                                             AuthController.login(req, res, next));

        return router;
    }
    protected static getClassName() {
        return "AuthRouter";
    }
}
