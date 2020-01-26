import {Request, Response, NextFunction} from "express";
import {LocalizationRepository, ILocalizations, ILanguage} from "../model/localization";
import Controller from "./controller";
import BowLog from "../framework/bow-log";

export default class LocalizationController extends Controller {

    public static async listAll(req: Request, res: Response, next: NextFunction) {
        const myself = LocalizationController.getMyself("listAll");
        const session = req.body.session;
        BowLog.log1(myself, " session=");
        BowLog.dir(myself, session);
        return LocalizationRepository.listAll(session)
                .then( (localizations: ILocalizations) =>
                            Controller.sendSuccessWithPayload(localizations, req, res, next)
                     )
                .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static async listAllLanguages(req: Request, res: Response, next: NextFunction) {
        const myself = LocalizationController.getMyself("listAllLanguages");
        const session = req.body.session;
        BowLog.log1(myself, " session=");
        BowLog.dir(myself, session);
        return LocalizationRepository.listAllLanguages(session)
                .then( (languages: ILanguage[]) =>
                            Controller.sendSuccessWithPayload(languages, req, res, next)
                     )
                .catch( (err: any) => this.processError(err, req, res, next) );
    }

}
