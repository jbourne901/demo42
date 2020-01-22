import express, {Request, Response, NextFunction} from "express";
import EPageController from "../controller/epage";
import BowRouter from "./bow-router";
import BowLog from "../framework/bow-log";

export default class EPageRouter extends BowRouter {
    public static getRouter() {
        const myself = this.getMyself("getRouter");
        BowLog.log1(myself, "getRouter()");
        const router = express.Router();

        router.post("/list", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "POST /api/epage/list");
            return EPageController.epageList(req, res, next);
        });

        router.post("/get", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "++POST /api/epage/get");
            EPageController.epageGet(req, res, next);
        });

        router.post("/entitylist", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "POST /api/epage/entitylist");
            return EPageController.entityList(req, res, next);
        });

        router.post("/entityget", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "POST /api/epage/entityget");
            return EPageController.entityGet(req, res, next);
        });

        router.post("/generalaction", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "POST /api/epage/generalaction");
            return EPageController.generalAction(req, res, next);
        });

        router.post("/itemaction", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "POST /api/epage/itemaction");
            return EPageController.itemAction(req, res, next);
        });

        router.post("/entityaction", (req: Request, res: Response, next: NextFunction) => {
            BowLog.log1(myself, "POST /api/epage/entityaction");
            return EPageController.entityAction(req, res, next);
        });

        return router;
    }

    protected static getClassName() {
        return "EPageRouter";
    }
}
