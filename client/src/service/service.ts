import {IUserService, UserService} from "./user";


export default class Service {
    private static readonly _user: IUserService = new UserService();

    public static user(): IUserService {
        return this._user;
    }
}
