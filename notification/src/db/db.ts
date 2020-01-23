import pgPromise, { IDatabase, IConnected, ILostContext } from "pg-promise";
import bluebird from "bluebird";
import dotenv from "dotenv";
import Loggable from "../framework/loggable";
import {IClient} from "pg-promise/typescript/pg-subset";
import BowLog from "../framework/bow-log";

type IConnection = IConnected<any, IClient>;
type IDB = IDatabase<any, IClient>;
type IConnResolve = (value: IConnection) => void;
type IReject = (err: any) => void;

export type IListener = (event: string) => void;

export default class DB extends Loggable {
    protected static getClassName() {
        return "DB";
    }

    private readonly db: IDB;
    private connection: IConnection | null = null;
    private listener: IListener;

    constructor(lnr: IListener) {
        super();
        const myself = DB.getMyself("constructor");
        BowLog.log(myself, "lnr=" + lnr);
        this.listener = lnr;
        dotenv.config();
        const DB_URL = process.env.DB_URL || "";
        const pgp = pgPromise({promiseLib: bluebird});
        BowLog.log1(myself, "DB_URL=" + DB_URL);
        this.db = pgp(DB_URL);
    }

    public start() {
        const myself = DB.getMyself("start");
        BowLog.log(myself, "");
        this.reconnect("0", "1")
            .then( (obj) => BowLog.log1(myself, "Successful Initial Connection") )
            .catch( (err: any) => BowLog.error(myself, "Failed Initial Connection") );
    }

    protected reconnect(strdelay: string, strmaxAttempts: string) {
        const delay = parseInt(strdelay, 10) > 0 ? parseInt(strdelay, 10) : 0;
        const maxAttempts = parseInt(strmaxAttempts, 10) > 0 ? parseInt(strmaxAttempts, 10) : 1;
        return this.reconnectInt(delay, maxAttempts);
    }

    protected reconnectInt(delay: number, maxAttempts: number) {
        return new Promise( (resolve: IConnResolve, reject: IReject) =>
            setTimeout( () => this.reconnectHandler(resolve, reject, delay, maxAttempts),
                        delay
                      )
                          );
    }

    protected reconnectHandler(resolve: IConnResolve, reject: IReject, delay: number, maxAttempts: number) {
        const myself = DB.getMyself("reconnectHandler");
        this.db.connect({direct: true, onLost: (err: any, e: ILostContext) => this.onConnectionLost(err, e) })
            .then( (obj: IConnection) => this.reconnectCallback(obj, resolve))
            .catch( (err: any) => this.reconnectError(err, resolve, reject, delay, maxAttempts) );
    }

    protected reconnectError(err: any, resolve: IConnResolve, reject: IReject, delay: number, maxAttempts: number) {
        const myself = DB.getMyself("reconnectError");
        BowLog.error(myself, "Error Connecting: " + err);
        maxAttempts = maxAttempts - 1;
        if (maxAttempts > 0) {
            this.reconnectInt(delay, maxAttempts)
                .then(resolve)
                .catch(reject);
        } else {
                reject(err);
        }
    }

    protected onConnectionLost(err: any, e: ILostContext) {
        const myself = DB.getMyself("onConnectionLost");
        BowLog.log(myself, "Connectivity Problem: err=" + err);
        this.connection = null;
        this.removeListeners(e.client);
        this.reconnectInt(5000, 10)
            .then(() =>
                BowLog.log2(myself, "Successfully Reconnected")
            )
            .catch( (err1: any) => {
                BowLog.error(myself, "Connection Lost Permanently " + err1);
                process.exit();
            });
    }

    protected reconnectCallback(obj: IConnection, resolve: IConnResolve) {
        this.connection = obj;
        resolve(obj);
        return this.setListeners(obj.client);
    }

    protected setListeners(client: IClient) {
        const myself = DB.getMyself("setListeners");

        client.on("notification", (...args: any) => this.onNotification(args) );
        if (this.connection) {
            return this.connection.none("LISTEN datachange")
            .catch( (err: any) => BowLog.log2(myself, err) );
        }
    }

    protected removeListeners(client: IClient) {
        client.removeListener("notification", this.onNotification);
    }

    protected onNotification(...args: any) {
        const myself = DB.getMyself("onNotification");
        BowLog.log(myself, "onNotification listener = " + this.listener);
        BowLog.dir(myself, args);
        if (args && args.length > 0) {
            const arg = args[0];
            BowLog.log(myself, "arg=");
            BowLog.dir(myself, arg);
            if (arg && arg.length > 0) {
                const msg = arg[0];
                BowLog.log(myself, "msg=");
                BowLog.dir(myself, msg);
                if (msg && msg.payload && msg.payload.length > 0) {
                    if (this.listener) {
                        BowLog.log(myself, "onNotification sending " + msg.payload);
                        this.listener(msg.payload);
                    }
                }
            }
        }
    }
}
