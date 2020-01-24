import {IUserService, UserService} from "./user";
import {IAuthService, AuthService} from "./auth";
import {IEPageService, EPageService} from "./epage";
import {INotificationService, NotificationService} from "./notification";
import {ILocalizationService, LocalizationService} from "./localization";

export default class Service {
    private static readonly _user: IUserService = new UserService();
    private static readonly _auth: IAuthService = new AuthService();
    private static readonly _epage: IEPageService = new EPageService();
    private static readonly _notification: INotificationService = new NotificationService();
    private static readonly _localization: ILocalizationService = new LocalizationService();

    public static user(): IUserService {
        return this._user;
    }

    public static auth(): IAuthService {
        return this._auth;
    }

    public static epage(): IEPageService {
        return this._epage;
    }

    public static notification(): INotificationService {
        return this._notification;
    }

    public static localization(): ILocalizationService {
        return this._localization;
    }

}

