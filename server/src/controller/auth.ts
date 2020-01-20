import express from "express";
import BowLog from "../framework/bow-log";
import { UserRepository, IAuth } from "../model/user";
import bcrypt from "bcryptjs";
import jwt, {SignOptions} from "jsonwebtoken";
import Controller from "./controller";

export default class AuthController extends Controller {

    public static async login(req: express.Request,
                              res: express.Response,
                              next: express.NextFunction) {
        const myself = this.getMyself("login");

        try {
            const login = req.body.login;
            BowLog.log1(myself, "+++login");
            BowLog.dir(myself, login);

            const username = login.username;
            const password = login.password;
            const userDoc = await UserRepository.findOneByUsername(username);
            if (!userDoc) {
                return Controller.sendError("Login failed", req, res, next);
            }
            BowLog.log2(myself, " userDoc.username=" + userDoc.username + " userDoc.password=" + userDoc.password + " userDoc.name=" + userDoc.name);
            const user = UserRepository.doc2User(userDoc);
            BowLog.log3(myself, " user=");
            BowLog.dir(myself, user);

            if (!user) {
                return Controller.sendError("Login failed", req, res, next);
            }
            BowLog.log4(myself, "passwrod=" + password + " user.password=" + user.password);
            const isMatch = await bcrypt.compare(password || "", user.password || "");

            BowLog.log4(myself, "isMatch=" + isMatch);

            if (! isMatch) {
                // return Controller.sendError("Login failed", req, res, next);
            }

            const payload = { id: user.userId, name: user.name };
            BowLog.log6(myself, "payload=");
            BowLog.dir(myself, payload);
            const secret = process.env.JWT_SECRET as string;
            const signOpts: SignOptions = { expiresIn: 31556926 };
            const token = jwt.sign( payload, secret, signOpts);
            const auth: IAuth = { token: "Bearer " + token };
            return Controller.sendSuccessWithPayload(auth, req, res, next);
        } catch ( err ) {
            BowLog.error(myself, "err=");
            BowLog.dir(myself, err);
            return this.sendError(err, req, res, next);
        }
    }

    protected static getClassName() {
        return "AuthController";
    }
}
