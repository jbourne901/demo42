import {Request, Response, NextFunction} from "express";
import {EPageRepository, IEPageInfo, IEPage} from "../model/epage";
import Controller from "./controller";
import BowLog from "../framework/bow-log";
import IActionNextSteps from "../model/actionnextsteps";

export default class EPageController extends Controller {

    public static async epageList(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("epageList");
        BowLog.log1(myself, "POST /api/epage/list ");
        return EPageRepository.epageList()
                             .then( (pages: IEPageInfo[]) =>
                                     Controller.sendSuccessWithPayload(pages, req, res, next)
                                  )
                             .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static epageGet(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("epageGet");
        const id = req.body.id;
        BowLog.log1(myself, "epageGet id=" + id);
        return EPageRepository.epageGet(id)
               .then( (page: IEPage) =>
                    Controller.sendSuccessWithPayload<IEPage>(page, req, res, next)
               )
               .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static async entityList(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("entityList");
        const id = req.body.id;
        BowLog.log1(myself, "POST /api/epage/entitylist id" + id);
        return EPageRepository.entityList(id)
                               .then( (entities: any[]) =>
                                     Controller.sendSuccessWithPayload(entities, req, res, next)
                                  )
                               .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static async entityGet(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("entityGet");
        const id = req.body.id;
        const entityid = req.body.entityid;
        BowLog.log1(myself, "POST /api/epage/entityget id" + id + " entityid = " + entityid);
        return EPageRepository.entityGet(id, entityid)
                               .then( (entity: any) =>
                                     Controller.sendSuccessWithPayload(entity, req, res, next)
                                  )
                               .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static async generalAction(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("generalAction");
        const epageactionid = req.body.id;
        BowLog.log1(myself, "POST /api/epage/generalaction epageactionid" + epageactionid);
        return EPageController.action(epageactionid, [], req, res, next);
    }

    public static async itemAction(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("generalAction");
        const epageactionid = req.body.id;
        const entityid = req.body.entityid;
        BowLog.log1(myself, "POST /api/epage/generalaction epageactionid" +
                            epageactionid + " entityid=" + entityid);
        return EPageController.action(epageactionid, [entityid], req, res, next, entityid);
    }

    public static async entityAction(req: Request, res: Response, next: NextFunction) {
        const myself = EPageController.getMyself("entityAction");
        const epageactionid = req.body.id;
        const entity = req.body.entity;
        BowLog.log1(myself, "POST /api/epage/entityaction epageactionid" + epageactionid +
                            " entity=");
        // BowLog.dir(myself, entity);
        return EPageController.action(epageactionid, [entity], req, res, next);
    }

    public static async action(epageactionid: string, params: any[], req: Request,
                               res: Response, next: NextFunction, entityid?: string) {
        return EPageRepository.action(epageactionid, params, entityid)
                              .then( (payload: IActionNextSteps) =>
                                      Controller.sendSuccessWithPayload(payload, req, res, next)
                                   )
                              .catch( (err: any) => this.processError(err, req, res, next) );
    }

    protected static getClassName() {
        return "EPageController";
    }
}
