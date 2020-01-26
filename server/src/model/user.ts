import DB from "../db";
import BowLog from "../framework/bow-log";
import Loggable from "../framework/loggable";
import {IQueryResult, IQueryResultWithPayload} from "./model";
import bcrypt from "bcryptjs";
import jwt, {SignOptions} from "jsonwebtoken";
import ISession from "./session";

export interface ILogin {
    username?: string;
    password?: string;
}

export interface IAuth {
    token: string;
}

export interface IUser {
    username?: string;
    password?: string;
    password2?: string;
    name: string;
    id?: string;
}

export interface IUserInfo {
    username: string;
    name: string;
    sessionkey: string;
    id: string;
}

export interface IAuthUser {
    name: string;
    id: string;
    sessionkey: string;
}

export class UserRepository extends Loggable {
    public static async userAdd(session: ISession, user: IUser) {
        const myself = this.getMyself("userAdd");
        BowLog.log1(myself, " user=");
        BowLog.dir(myself, user);
        BowLog.log1(myself, " session=");
        BowLog.dir(myself, session);

        const username = user.username || "";
        const name = user.name || "";
        const password = user.password || "";
        const password2 = user.password2 || "";
        const doc = {username, name, password, password2};
        const query = "select * from UserAddJSON($1, $2) res";
        const queryRes = await DB.db().one<IQueryResult>(query, [doc, session]);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;

        if (res.result === "OK") {
            return;
        }
        throw(res);
    }

    public static async userUpdate(session: ISession, user: IUser) {
        const myself = this.getMyself("userUpdate");
        BowLog.log1(myself, " user=" );
        BowLog.dir(myself, user);
        BowLog.log1(myself, " session=" );
        BowLog.dir(myself, session);

        const username = user.username || "";
        const name = user.name || "";
        const password = user.password || "";
        const password2 = user.password2 || "";
        const id = user.id || "";

        const doc = { username,  name,  password, password2, id };
        BowLog.log2(myself, "doc=");
        BowLog.dir(myself, doc);

        const query = "select * from UserUpdateJSON($1, $2) res";
        const queryRes = await DB.db().one<IQueryResult>(query, [doc, session]);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;

        if (res.result === "OK") {
            return;
        }
        throw(res);
    }

    public static async userDelete(session: ISession, id: string) {
        const myself = this.getMyself("userDelete");
        BowLog.log1(myself, " id=" + id + " session=");
        BowLog.dir(myself, session);

        const query = "select * from userDeleteJSON($1,$2) res";
        const queryRes = await DB.db().one<IQueryResult>(query, [id, session]);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;

        if (res.result === "OK") {
            return;
        }
        throw(res);
    }

    public static async userGet(session: ISession, id: string) {
        const myself = this.getMyself("userGet");
        BowLog.log1(myself, " id=" + id + " session=");
        BowLog.dir(myself, session);

        const query = "select * from userGetJSON($1, $2) res";
        const queryRes = await DB.db().one<IQueryResultWithPayload<IUser>>(query, [id, session]);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;

        if (res.result === "OK") {
            return res.payload;
        }
        throw(res);
    }

    public static async userList(session: ISession) {
        const myself = this.getMyself("userList");
        BowLog.log1(myself, "session=");
        BowLog.dir(myself, session);

        const query = "select * from userListJSON($1) res";
        const queryRes = await DB.db().one<IQueryResultWithPayload<IUserInfo[]>>(query, [session]);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;

        if (res.result === "OK") {
            return res.payload;
        }
        throw(res);
    }

    public static async userLogin(session: ISession, login: ILogin) {
        const myself = this.getMyself("userLogin");
        BowLog.log1(myself, "login=");
        BowLog.dir(myself, login);
        BowLog.log1(myself, "session=");
        BowLog.dir(myself, session);

        const username = login.username || "";
        const password = login.password || "";
        const doc = {username, password};
        BowLog.log2(myself, "doc=");
        BowLog.dir(myself, doc);

        const query = "select * from UserLoginJSON($1, $2) res";
        const queryRes = await DB.db().one<IQueryResultWithPayload<IAuthUser>>(query, [doc, session]);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;
        if (res.result === "OK") {
            BowLog.log6(myself, "payload=");
            BowLog.dir(myself, res.payload);
            const secret = process.env.JWT_SECRET as string;
            const signOpts: SignOptions = { expiresIn: 31556926 };
            const token = jwt.sign( res.payload, secret, signOpts);
            const auth: IAuth = { token: "Bearer " + token };
            return auth;
        }
        throw(res);
    }

    protected static async hashPassword(password: string) {
        const myself = this.getMyself("hashPassword");
        // const salt = await bcrypt.genSalt(10);
        const salt = process.env.SALT || "";
        BowLog.log3(myself, " salt=" + salt);
        const hashpassword = await bcrypt.hash(password, salt);
        BowLog.log4(myself, " hashpassword=" + hashpassword);
        return hashpassword;
    }

    protected static getClassname() {
        return "UserRepository";
    }
}
