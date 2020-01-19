import mongooseAsync, {IDocumentAsync} from "../framework/mongooseAsync";
import BowLog from "../framework/bow-log";
import Loggable from "../framework/loggable";
import IErrors from "../model/errors";

export type Username = string;
export type Password = string;
export type Password2 = string;

export interface ILogin {
    username?: Username;
    password?: Password;
}

export interface IAuth {
    token: string;
}

export interface IUser {
    username?: Username;
    password?: Password;
    password2?: Password2;
    name: string;
    userId?: string;
}

export interface IUserInfo {
    username: string;
    name: string;
    userId: string;
}

export interface IUserDocument extends IDocumentAsync {
    _id: string;
    username: string;
    password: string;
    name: string;
}

const userSchema = mongooseAsync.createSchema<IUserDocument>({
    username: String,
    password: String,
    name: String
});

const UserModel = mongooseAsync.createModel("User", userSchema);

export class UserRepository extends Loggable {
    public static findOneByUsername(username: Username) {
        const myself = this.getMyself("findOneByUsername");
        BowLog.log1(myself, " username=" + username);

        return UserModel.findOneAsync({username});
    }

    public static async usernameExists(username: Username) {
        const myself = this.getMyself("usernameExists");
        BowLog.log1(myself, +" username=" + username);

        const userDoc = await this.findOneByUsername(username);
        BowLog.log1(myself, "userDoc = ");
        console.dir(userDoc);
        const fnd = (userDoc != null);
        return fnd;
    }

    public static anotherUsernameExists(id: string, username: Username) {
        const myself = this.getMyself("anotherUsernameExists");
        BowLog.log1(myself, "id = " + id + " username=" + username);

        const where1 = {username};
        const where2 = {_id: {$ne: id} };
        const where = { where1, where2 };

        return UserModel.findOneAsync(where)
                        .then( (userDoc: IUserDocument) => Promise.resolve( (userDoc != null)));
    }

    public static addUser(user: IUser) {
        const myself = this.getMyself("addUser");
        BowLog.log1(myself, " user=" + user);

        const userDoc = new UserModel({
             username: user.username,
             password: user.password,
             name: user.name
        });
        return userDoc.saveAsync();
    }
    public static updateUser(user: IUser) {
        const myself = this.getMyself("updateUser");
        BowLog.log1(myself, " user=" + user);

        return UserModel.findByIdAndUpdateAsync(user.userId, {
                                                           username: user.username,
                                                           password: user.password,
                                                           name: user.name
                                                          }
                                                );
    }

    public static deleteUser(id: string) {
        const myself = this.getMyself("deleteUser");
        BowLog.log1(myself, " id=" + id);

        return UserModel.findByIdAndDeleteAsync(id);
    }

    public static async getUser(id: string) {
        const myself = this.getMyself("getUser");
        BowLog.log1(myself, " id=" + id);

        const u = await UserModel.findByIdAsync(id);
        u.password = ""; // we dont return password for security reasons
        const user = UserRepository.doc2User(u);
        return user;
    }

    public static doc2User(u: IUserDocument) {
        return {
            username: u.username,
            name: u.name,
            password: u.password,
            userId: u._id
         };
    }

    public static async listUsers() {
        const myself = this.getMyself("listUsers");
        BowLog.log1(myself, "");

        const userDocs = await UserModel.findAsync();
        const users = userDocs.map( (u: IUserDocument) => UserRepository.doc2UserInfo(u) );
        return users;
    }

    public static doc2UserInfo(u: IUserDocument) {
        return {
            username: u.username,
            name: u.name,
            userId: u._id
         };
    }

    public static async validateUser(u: IUser) {
        const myself = UserRepository.getMyself("validateUser");
        console.dir(u);

        let isValid: boolean = true;
        const errors: IErrors = {};

        if (!u) {
            errors.error = "An error occured";
            return errors;
        }

        BowLog.log1(myself, "username=" + u.username);
        if (!u.username || u.username.length === 0) {
            errors.name = "Username is required";
            isValid = false;
        }

        if (!u.password || u.password.length === 0) {
            errors.password = "Password is required";
            isValid = false;
        }

        if (u.password2 !== u.password) {
            errors.password2 = "Passwords dont match";
            isValid = false;
        }

        if (!errors.username) {
            if (u.userId && u.userId.length > 0 && u.username &&
                await UserRepository.anotherUsernameExists(u.userId, u.username)) {
                   errors.username = "Username must be unique";
                   isValid = false;
            }

            if ((!u.userId || u.userId.length === 0) && u.username &&
                await UserRepository.usernameExists(u.username)) {
                   errors.username = "Username must be unique";
                   isValid = false;
            }
        }

        if (isValid) {
            return undefined;
        }
        return errors;
    }

    protected static getClassname() {
        return "UserRepository";
    }
}
