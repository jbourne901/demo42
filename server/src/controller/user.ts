import {Request, Response, NextFunction} from "express";
import {UserRepository, IUserInfo, IUser} from "../model/user";
import Controller from "./controller";
import BowLog from "../framework/bow-log";

export default class UserController extends Controller {

    public static async userList(req: Request, res: Response, next: NextFunction) {
        const myself = UserController.getMyself("userList");
        BowLog.log1(myself, "");
        return UserRepository.userList()
                             .then( (users: IUserInfo[]) =>
                                     Controller.sendSuccessWithPayload(users, req, res, next)
                                  )
                             .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static userDelete(req: Request, res: Response, next: NextFunction) {
        const myself = UserController.getMyself("userDelete");
        console.dir(req.body);
        const id = req.body.id;
        BowLog.log1(myself, "userDelete id=" + id);
        return UserRepository.userDelete(id)
               .then( () => Controller.sendSuccess(req, res, next))
               .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static userGet(req: Request, res: Response, next: NextFunction) {
        const myself = UserController.getMyself("getUser");
        const id = req.body.id;
        BowLog.log1(myself, "userGet id=" + id);
        return UserRepository.userGet(id)
               .then( (user: IUser) => Controller.sendSuccessWithPayload(user, req, res, next))
               .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static async userSave(req: Request, res: Response, next: NextFunction) {
        const myself = this.getMyself("userSave");
        const user = req.body;
        BowLog.log1(myself, "user=");
        console.dir(user);

        if (user && user.id) {
            return UserController.userUpdate(user, req, res, next);
        }
        return UserController.userAdd(user, req, res, next);
    }

    protected static async userUpdate(user: IUser, req: Request, res: Response,
                                      next: NextFunction) {
        return UserRepository.userUpdate(user)
                             .then( () => UserController.sendSuccess(req, res, next))
                             .catch( (err: any) => this.processError(err, req, res, next) );
    }

    protected static async userAdd(user: IUser, req: Request, res: Response, next: NextFunction) {
        return UserRepository.userAdd(user)
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
