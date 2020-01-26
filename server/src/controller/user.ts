import {Request, Response, NextFunction} from "express";
import {UserRepository, IUserInfo, IUser} from "../model/user";
import Controller from "./controller";
import BowLog from "../framework/bow-log";

export default class UserController extends Controller {

    public static async userList(req: Request, res: Response, next: NextFunction) {
        const myself = UserController.getMyself("userList");
        const session = req.body.session;
        BowLog.log1(myself, " session=");
        BowLog.dir(myself, session);
        return UserRepository.userList(session)
                             .then( (users: IUserInfo[]) =>
                                     Controller.sendSuccessWithPayload(users, req, res, next)
                                  )
                             .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static async userDelete(req: Request, res: Response, next: NextFunction) {
        const myself = UserController.getMyself("userDelete");
        console.dir(req.body);
        const id = req.body.id;
        const session = req.body.session;
        BowLog.log1(myself, "userDelete id=" + id + " session=");
        BowLog.dir(myself, session);
        try {
            await UserRepository.userDelete(session, id);
            return Controller.sendSuccess(req, res, next);
        } catch (err) {
            return this.processError(err, req, res, next);
        }
    }

    public static userGet(req: Request, res: Response, next: NextFunction) {
        const myself = UserController.getMyself("getUser");
        const id = req.body.id;
        const session = req.body.session;
        BowLog.log1(myself, "userGet id=" + id + " session=");
        BowLog.dir(myself, session);
        return UserRepository.userGet(session, id)
               .then( (user: IUser) => Controller.sendSuccessWithPayload(user, req, res, next))
               .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static async userSave(req: Request, res: Response, next: NextFunction) {
        const myself = this.getMyself("userSave");
        const user = req.body;
        BowLog.log1(myself, "user=");
        BowLog.dir(myself, user);

        if (user && user.id) {
            return UserController.userUpdate(user, req, res, next);
        }
        return UserController.userAdd(user, req, res, next);
    }

    protected static async userUpdate(user: IUser, req: Request, res: Response,
                                      next: NextFunction) {
        const myself = this.getMyself("userUpdate");
        const session = req.body.session;
        BowLog.log1(myself, "session=");
        BowLog.dir(myself, session);

        return UserRepository.userUpdate(session, user)
                             .then( () => UserController.sendSuccess(req, res, next))
                             .catch( (err: any) => this.processError(err, req, res, next) );
    }

    protected static async userAdd(user: IUser, req: Request, res: Response, next: NextFunction) {
        const myself = this.getMyself("userAdd");
        const session = req.body.session;
        BowLog.log1(myself, "session=");
        BowLog.dir(myself, session);

        return UserRepository.userAdd(session, user)
                             .then( () => UserController.sendSuccess(req, res, next))
                             .catch( (err: any) => this.processError(err, req, res, next) );
    }

    protected static getClassName() {
        return "UserController";
    }
}
/*
addUser(req, res, next));
updateUser(req, res, next));
deleteUser(req, res, next));
getUser(req, res, next));
listUsers(req, res, next));
*/
