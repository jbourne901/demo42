import DB from "../db";
import BowLog from "../framework/bow-log";
import Loggable from "../framework/loggable";
import {IQueryResultWithPayload} from "./model";
import ISession from "./session";

export interface ILocalizations {
    [key: string]: string;
}

export interface ILanguage {
    language: string;
    name: string;
}

export type ILocalizationListAllResult = IQueryResultWithPayload<ILocalizations>;
export type ILanguagesListAllResult = IQueryResultWithPayload<ILanguage[]>;

export class LocalizationRepository extends Loggable {
    public static async listAll(session: ISession) {
        const myself = this.getMyself("listAll");
        BowLog.log1(myself, "session=");
        BowLog.dir(myself, session);
        const query = "select * from LocalizationListAllJSON($1) res";
        const queryRes = await DB.db().one<ILocalizationListAllResult>(query, [session]);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;

        if (res.result === "OK") {
            return res.payload;
        }
        throw(res);
    }

    public static async listAllLanguages(session: ISession) {
        const myself = this.getMyself("LocalizationRepository.listAllLanguages");
        BowLog.log1(myself, "session=");
        BowLog.dir(myself, session);

        const query = "select * from LanguageListAllJSON($1) res";
        const queryRes = await DB.db().one<ILanguagesListAllResult>(query, [session]);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;

        if (res.result === "OK") {
            return res.payload;
        }
        throw(res);
    }

    protected static getClassname() {
        return "LocalizationRepository";
    }
}
