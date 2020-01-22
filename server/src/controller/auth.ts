import express from "express";
import BowLog from "../framework/bow-log";
import { UserRepository, IAuth } from "../model/user";
import Controller from "./controller";

export default class AuthController extends Controller {

    public static async login(req: express.Request,
                              res: express.Response,
                              next: express.NextFunction) {
        const myself = this.getMyself("login");
        const login = req.body.login;
        BowLog.log1(myself, "+++login");
        BowLog.dir(myself, login);

        return UserRepository.userLogin(login)
                             .then( (payload: IAuth) => this.sendSuccessWithPayload(payload, req, res, next))
                             .catch( (err: any) => this.processError(err, req, res, next) );
    }

    protected static getClassName() {
        return "AuthController";
    }
}
