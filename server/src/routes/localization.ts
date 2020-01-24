import express, {Request, Response, NextFunction} from "express";
import LocalizationController from "../controller/localization";
import BowRouter from "./bow-router";
import BowLog from "../framework/bow-log";

export default class LocalizationRouter extends BowRouter {
    public static getRouter() {
        const myself = this.getMyself("getRouter");
        BowLog.log1(myself, "getRouter()");
        const router = express.Router();

        router.post("/all", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "POST /api/localization/all");
            return LocalizationController.listAll(req, res, next);
        });

        router.post("/alllanguages", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "POST /api/localization/alllanguages");
            return LocalizationController.listAllLanguages(req, res, next);
        });

        return router;
    }
    protected static getClassName() {
        return "LocalizationRouter";
    }
}
