import {Request, Response, NextFunction} from "express";
import {EPageRepository, IEPageInfo, IEPage} from "../model/epage";
import Controller from "./controller";
import BowLog from "../framework/bow-log";
import IActionNextSteps from "../model/actionnextsteps";
import ISession from "../model/session";

export default class EPageController extends Controller {

    public static async epageList(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("epageList");
        const session = req.body.session;
        BowLog.log1(myself, "POST /api/epage/list session=");
        BowLog.dir(myself, session);
        return EPageRepository.epageList(session)
                             .then( (pages: IEPageInfo[]) =>
                                     Controller.sendSuccessWithPayload(pages, req, res, next)
                                  )
                             .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static epageGet(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("epageGet");
        const id = req.body.id;
        const session = req.body.session;
        BowLog.log1(myself, "epageGet id=" + id + " session=");
        BowLog.dir(myself, session);
        return EPageRepository.epageGet(session, id)
               .then( (page: IEPage) =>
                    Controller.sendSuccessWithPayload<IEPage>(page, req, res, next)
               )
               .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static async entityList(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("entityList");
        const id = req.body.id;
        const session = req.body.session;
        BowLog.log1(myself, "POST /api/epage/entitylist id" + id + " session=");
        BowLog.dir(myself, session);
        return EPageRepository.entityList(session, id)
                               .then( (entities: any[]) =>
                                     Controller.sendSuccessWithPayload(entities, req, res, next)
                                  )
                               .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static async entityGet(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("entityGet");
        const id = req.body.id;
        const entityid = req.body.entityid;
        const session = req.body.session;
        BowLog.log1(myself, "POST /api/epage/entityget id" + id + " entityid = " +
                    entityid + " session=");
        BowLog.dir(myself, session);
        return EPageRepository.entityGet(session, id, entityid)
                               .then( (entity: any) =>
                                     Controller.sendSuccessWithPayload(entity, req, res, next)
                                  )
                               .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static async generalAction(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("generalAction");
        const epageactionid = req.body.id;
        const session = req.body.session;
        BowLog.log1(myself, "POST /api/epage/generalaction epageactionid" +
             epageactionid + " session=");
        BowLog.dir(myself, session);
        return EPageController.action(session, epageactionid, undefined, req, res, next);
    }

    public static async itemAction(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("generalAction");
        const epageactionid = req.body.id;
        const entityid = req.body.entityid;
        const session = req.body.session;
        BowLog.log1(myself, "POST /api/epage/generalaction epageactionid" +
                            epageactionid + " entityid=" + entityid + " session=");
        BowLog.dir(myself, session);
        return EPageController.action(session, epageactionid, entityid, req, res, next, entityid);
    }

    public static async entityAction(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("entityAction");
        const epageactionid = req.body.id;
        const entity = req.body.entity;
        const session = req.body.session;
        BowLog.log1(myself, "POST /api/epage/entityaction epageactionid" + epageactionid +
                            " entity=");
        // BowLog.dir(myself, entity);
        BowLog.log2(myself, "session=");
        BowLog.dir(myself, session);
        return EPageController.action(session, epageactionid, entity, req, res, next);
    }

    public static async action(session: ISession, epageactionid: string,
                               params: any, req: Request,
                               res: Response, next: NextFunction, entityid?: string) {
        const myself = this.getMyself("action");
        BowLog.log(myself, "session=");
        BowLog.dir(myself, session);
        return EPageRepository.action(session, epageactionid, params, entityid)
                              .then( (payload: IActionNextSteps) =>
                                      Controller.sendSuccessWithPayload(payload, req, res, next)
                                   )
                              .catch( (err: any) => this.processError(err, req, res, next) );
    }

    protected static getClassName() {
        return "EPageController";
    }
}
