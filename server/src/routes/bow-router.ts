import Loggable from "../framework/loggable";
import express from "express";
import BowLog from "../framework/bow-log";

export default class BowRouter extends Loggable {
    public static sendError(statusCode: number, error: any, res: express.Response) {
        const myself = this.getMyself("sendErrors");
        BowLog.error(myself, error);
        return res.status(statusCode).json({error});
    }

    protected static getClassName() {
        return "BowRouter";
    }
}
