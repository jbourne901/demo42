import DB from "../db";
import BowLog from "../framework/bow-log";
import Loggable from "../framework/loggable";
import {IQueryResultWithPayload} from "./model";

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
    public static async listAll() {
        const myself = this.getMyself("listAll");
        BowLog.log1(myself, "");
        const query = "select * from LocalizationListAllJSON() res";
        const queryRes = await DB.db().one<ILocalizationListAllResult>(query);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;

        if (res.result === "OK") {
            return res.payload;
        }
        throw(res);
    }

    public static async listAllLanguages() {
        const myself = this.getMyself("listAllLanguages");
        BowLog.log1(myself, "");
        const query = "select * from LanguageListAllJSON() res";
        const queryRes = await DB.db().one<ILanguagesListAllResult>(query);

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
