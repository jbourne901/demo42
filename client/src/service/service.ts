import {IUserService, UserService} from "./user";
import {IAuthService, AuthService} from "./auth";


export default class Service {
    private static readonly _user: IUserService = new UserService();
    private static readonly _auth: IAuthService = new AuthService();

    public static user(): IUserService {
        return this._user;
    }

    public static auth(): IAuthService {
        return this._auth;
    }
}
