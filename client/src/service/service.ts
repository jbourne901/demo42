import {IUserService, UserService} from "./user";
import {IAuthService, AuthService} from "./auth";
import {IEPageService, EPageService} from "./epage";

export default class Service {
    private static readonly _user: IUserService = new UserService();
    private static readonly _auth: IAuthService = new AuthService();
    private static readonly _epage: IEPageService = new EPageService();

    public static user(): IUserService {
        return this._user;
    }

    public static auth(): IAuthService {
        return this._auth;
    }

    public static epage(): IEPageService {
        return this._epage;
    }
}

