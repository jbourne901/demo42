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
        BowLog.log1(myself, "req=");
        BowLog.dir(myself, req);

        try {
            const login = req.body;

            const username = req.body.username;
            const password = req.body.password;
            const user = await UserRepository.findOneByUsername(username);
            BowLog.log2(myself, " user=");

            if (user == null) {
                return Controller.sendError("Login failed", req, res, next);
            }
            const isMatch = await bcrypt.compare(password, user.password);

            BowLog.log3(myself, "isMatch=" + isMatch);

            if (! isMatch) {
                return Controller.sendError("Login failed", req, res, next);
            }

            const payload = { id: user._id, name: user.name };
            BowLog.log4(myself, "payload=" + payload);
            const secret = process.env.JWT_SECRET as string;
            const signOpts: SignOptions = { expiresIn: 31556926 };
            const token = jwt.sign( payload, secret, signOpts);
            const auth: IAuth = { token: "Bearer " + token };
            return Controller.sendSuccessWithPayload(auth, req, res, next);
        } catch ( err ) {
            return this.sendError(err, req, res, next);
        }
    }

    protected static getClassName() {
        return "AuthController";
    }
}
