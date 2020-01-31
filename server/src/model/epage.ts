import BowLog from "../framework/bow-log";
import Loggable from "../framework/loggable";
import DB from "../db";
import {IQueryResultWithPayload} from "./model";
import IActionNextSteps from "./actionnextsteps";
import ISession from "./session";

export interface IEPageInfo {
    id: string;
    name: string;
    label: string;
    type: string;
    entity: string;
}

export interface IEPageField {
   name: string;
   label: string;
   type: string;
}

export interface IEPage {
    id: string;
    name: string;
    label: string;
    type: string;
    query: string;
    redirecturl: string;
    idName: string;
    fields: IEPageField[];
    entity: string;
}

interface IEPageAction {
    query?: string;
    confirm?: string;
    nextpage: string;
    location: string;
    style: string;
}

export class EPageRepository extends Loggable {

    public static async epageGet(session: ISession, id: string) {
        const myself = this.getMyself("epageGet");
        BowLog.log1(myself, " id=" + id + " session=");
        BowLog.dir(myself, session);

        const query = "select * from EPageGetJSON($1, $2) res";
        const queryRes = await DB.db().one<IQueryResultWithPayload<IEPage>>(query, [id, session]);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;

        if (res.result === "OK") {
            return res.payload;
        }
        throw(res);
    }

    public static async epageList(session: ISession) {
        const myself = this.getMyself("epageList");
        BowLog.log1(myself, " session=");
        BowLog.dir(myself, session);

        const query = "select * from EPageListJSON($1) res";
        const queryRes = await DB.db().one<IQueryResultWithPayload<IEPageInfo[]>>(query, [session]);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;

        if (res.result === "OK") {
            return res.payload;
        }
        throw(res);
    }

    public static async entityList(session: ISession, id: string) {
        const myself = this.getMyself("entityList");
        BowLog.log1(myself, "id=" + id + " session=");
        BowLog.dir(myself, session);

        const query = "select * from EPageGetJSON($1, $2) res";
        const queryRes = await DB.db().one<IQueryResultWithPayload<IEPage>>(query, [id, session]);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;
        if (res.result === "OK") {
            const epage = res.payload;
            const query2 = "select * from " + epage.query + " res";
            BowLog.log4(myself, "query2=" + query2);

            const queryRes2 = await DB.db().one<IQueryResultWithPayload<any[]>>(query2, [session]);

            BowLog.log5(myself, "queryRes2=");
            BowLog.dir(myself, queryRes2);

            const res2 = queryRes2.res || queryRes2;

            if (res2.result === "OK") {
                return res2.payload;
            }
            throw(res2);
        }
        throw(res);
    }

    public static async entityGet(session: ISession, epageid: string, entityid: string) {
        const myself = this.getMyself("entityGet");
        BowLog.log1(myself, "epageid=" + epageid + " entityid=" + entityid + " session=");
        BowLog.dir(myself, session);

        const query = "select * from EPageGetJSON($1, $2) res";
        const queryRes = await DB.db().one<IQueryResultWithPayload<IEPage>>(query, [epageid, session]);

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;
        if (res.result === "OK") {
            const epage = res.payload;
            const query2 = "select * from " + epage.query + " res";
            BowLog.log4(myself, "query2=" + query2);

            const queryRes2 = await DB.db().one<IQueryResultWithPayload<any>>(query2, [entityid, session]);

            BowLog.log5(myself, "queryRes2=");
            BowLog.dir(myself, queryRes2);

            const res2 = queryRes2.res || queryRes2;

            if (res2.result === "OK") {
                return res2.payload;
            }
            throw(res2);
        }
        throw(res);
    }

    public static async action(session: ISession, epageactionid: string, params: any[], entityid?: string) {
        const myself = EPageRepository.getMyself("action");
        BowLog.log1(myself, "epageactionid=" + epageactionid + " params=" + " entityid = " + entityid);
        BowLog.dir(myself, params);
        BowLog.log2(myself, " session=");
        BowLog.dir(myself, session);

        const entid = entityid || 0;

        const query = "select * from EPageActionGetJSON($1, $2, $3) res";
        const queryRes = await DB.db()
                                 .one<IQueryResultWithPayload<IEPageAction>>(query,
                                               [epageactionid, entid, session]
                                 );

        BowLog.log3(myself, "queryRes=");
        BowLog.dir(myself, queryRes);
        const res = queryRes.res || queryRes;
        if (res.result === "OK") {
            const epageaction = res.payload;
            BowLog.log3(myself, "epageaction=");
            BowLog.dir(myself, epageaction);
            if ( epageaction && epageaction.query && epageaction.query.length > 0) {
                const query2 = "select * from " + epageaction.query + " res";
                BowLog.log4(myself, "query2=" + query2);

                const queryRes2 = await DB.db()
                   .one<IQueryResultWithPayload<IActionNextSteps>>(query2, [params, session]);

                BowLog.log5(myself, "queryRes2=");
                // BowLog.dir(myself, queryRes2);

                const res2 = queryRes2.res || queryRes2;

                if (res2.result !== "OK") {
                   throw(res2);
                }
            } else if (epageaction && epageaction.nextpage && epageaction.nextpage.length > 0) {
                BowLog.log5(myself, "nextsteps=" + epageaction.nextpage);
            }
            const nextSteps: IActionNextSteps = { nextpage: epageaction.nextpage };
            return nextSteps;
        } else {
            BowLog.error(myself, "--- query is blank and nextpage is blank");
        }
        throw(res);
    }

    protected static getClassname() {
        return "EPageRepository";
    }
}
