import {Request, Response, NextFunction} from "express";
import BowLog from "../framework/bow-log";
import Loggable from "../framework/loggable";
import IErrors from "../model/errors";

export default class Controller extends Loggable {
    protected static getClassName() {
        return "Controller";
    }

    protected static sendSuccess(req: Request, res: Response, next: NextFunction) {
        res.json({result: "OK"});
    }

    protected static sendSuccessWithPayload<T>(payload: T,
                                               req: Request,
                                               res: Response,
                                               next: NextFunction) {
        res.json({payload, result: "OK"});
    }

    protected static sendError(error: any,
                               req: Request,
                               res: Response,
                               next: NextFunction) {
        res.status(500).json({result: "Error", errors: {error}});
    }

    protected static sendErrors(errors: IErrors,
                                req: Request,
                                res: Response,
                                next: NextFunction) {
        res.json({result: "Error", errors});
    }

}
