import {Request, Response, NextFunction} from "express";
import {LocalizationRepository, ILocalizations, ILanguage} from "../model/localization";
import Controller from "./controller";
import BowLog from "../framework/bow-log";

export default class LocalizationController extends Controller {

    public static async listAll(req: Request, res: Response, next: NextFunction) {
        const myself = LocalizationController.getMyself("listAll");
        BowLog.log1(myself, "");
        return LocalizationRepository.listAll()
                .then( (localizations: ILocalizations) =>
                            Controller.sendSuccessWithPayload(localizations, req, res, next)
                     )
                .catch( (err: any) => this.processError(err, req, res, next) );
    }

    public static async listAllLanguages(req: Request, res: Response, next: NextFunction) {
        const myself = LocalizationController.getMyself("listAllLanguages");
        BowLog.log1(myself, "");
        return LocalizationRepository.listAllLanguages()
                .then( (languages: ILanguage[]) =>
                            Controller.sendSuccessWithPayload(languages, req, res, next)
                     )
                .catch( (err: any) => this.processError(err, req, res, next) );
    }

}
