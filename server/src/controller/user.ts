import {Request, Response, NextFunction} from "express";
import {UserRepository, IUserInfo, IUser} from "../model/user";
import Controller from "./controller";
import BowLog from "../framework/bow-log";

export default class UserController extends Controller {

    public static async listUsers(req: Request, res: Response, next: NextFunction) {
        const myself = UserController.getClassName();
        BowLog.log1(myself, "GET /api/user ");
        return UserRepository.listUsers()
                             .then( (users: IUserInfo[]) =>
                                     Controller.sendSuccessWithPayload(users, req, res, next)
                                  )
                             .catch( (err: any) =>
                                     Controller.sendError(err, req, res, next)
                                   );
    }

    public static deleteUser(req: Request, res: Response, next: NextFunction) {
        const myself = UserController.getMyself("deleteUser");
        console.dir(req.body);
        const id = req.body.userId;
        BowLog.log1(myself, "deleteUser userId=" + id);
        return UserRepository.deleteUser(id)
               .then( () => Controller.sendSuccess(req, res, next))
               .catch( (err: any) => Controller.sendError(err, req, res, next));
    }

    public static getUser(req: Request, res: Response, next: NextFunction) {
        const myself = UserController.getMyself("getUser");
        const userId = req.body.userId;
        BowLog.log1(myself, "getUser userId=" + userId);
        return UserRepository.getUser(userId)
               .then( (user: IUser) => Controller.sendSuccessWithPayload(user, req, res, next))
               .catch( (err: any) => Controller.sendError(err, req, res, next));
    }

    public static async saveUser(req: Request, res: Response, next: NextFunction) {
        const myself = this.getMyself("saveUser");
        const user = req.body;
        BowLog.log1(myself, "user=");
        console.dir(user);
        const errors = await UserRepository.validateUser(user);
        if (errors != null) {
            BowLog.error(myself, "errors=" );
            console.dir(errors);
            return UserController.sendErrors(errors, req, res, next);
        }

        if (user && user.userId && user.userId.length > 0) {
            return UserController.updateUser(user, req, res, next);
        }
        return UserController.addUser(user, req, res, next);
    }

    protected static async updateUser(user: IUser, req: Request, res: Response,
                                      next: NextFunction) {
        const {userId, name, username, password} = user;
        const saveUser = {
            userId,
            name,
            username,
            password
        };
        return UserRepository.updateUser(saveUser)
                             .then( () => UserController.sendSuccess(req, res, next))
                             .catch( (err: any) => UserController.sendError(err, req, res, next));
    }

    protected static async addUser(user: IUser, req: Request, res: Response, next: NextFunction) {
        const {name, username, password} = user;
        const newUser = {
            name,
            username,
            password
        };
        return UserRepository.addUser(newUser)
                             .then( () => UserController.sendSuccess(req, res, next))
                             .catch( (err: any) => UserController.sendError(err, req, res, next));
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
