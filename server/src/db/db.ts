import pgPromise, { IDatabase, IConnected } from "pg-promise";
import bluebird from "bluebird";
import dotenv from "dotenv";
import Loggable from "../framework/loggable";
import pg from "pg-promise/typescript/pg-subset";
import BowLog from "../framework/bow-log";

export default class DB extends Loggable {
    public static db() {
        return DB._DB.db;
    }
    protected static getClassName() {
        return "DB";
    }

    private static _DB: DB = new DB();
    private readonly db: IDatabase<pg.IClient>;

    constructor() {
        super();
        const myself = DB.getMyself("constructor");
        dotenv.config();
        const DB_URL = process.env.DB_URL || "";
        const pgp = pgPromise({promiseLib: bluebird});
        BowLog.log1(myself, "DB_URL=" + DB_URL);
        this.db = pgp(DB_URL);
    }
}
