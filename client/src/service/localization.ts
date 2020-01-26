import {ILocalizations} from "../model/localization";
//import axios from "axios";
//import extractSvcData from "./extract-svc-data";
import {IServiceResultWithPayload} from "./service-result";
import {ILanguage, DefaultLanguages} from "../model/language";
import { Observer } from "./observer";
import { IHandlerFunc } from "../model/listener";
import {ICancellableTransportPromise} from "../framework/transport";
import { ICommonService , CommonService } from "./common-service";

export type ILocalizationsResult = IServiceResultWithPayload<ILocalizations>;

export type ILanguagesResult = IServiceResultWithPayload<ILanguage[]>;

export type ILocalizationLocal = (key: string) => string;

export interface ILocalizationService extends ICommonService {
    reloadLocalizations(): ICancellableTransportPromise<void>;
    reloadLanguages(): ICancellableTransportPromise<void>;
    setLanguage(language: string): void;
    getLanguage(): string;
    languages(): ILanguage[];
    getLocalization(grp: string, key: string): string;
    local(grp: string): ILocalizationLocal;
    registerLanguageListener(handlerid: string, handlerFunc: IHandlerFunc<number>): void;
    unregisterLanguageListener(handlerid: string): void;
    registerLocalizationListener(handlerid: string, handlerFunc: IHandlerFunc<number>): void;
    unregisterLocalizationListener(handlerid: string): void;
}

export class LocalizationService extends CommonService implements ILocalizationService {
    private readonly languageObserver = new Observer<number>();
    private readonly localizationObserver = new Observer<number>();
    private readonly BASE_URL: string;
    private static readonly CURRENT_LANGUAGE_KEY = "currentlanguage";
    private static readonly LANGUAGES_KEY = "languages";
    private static readonly LOCALIZATION_KEY = "localization";
    private static readonly GLOBAL_KEY = "global";
    private static readonly DEFAULT_LANG = "en";

    constructor() {
        super();
        this.BASE_URL=process.env.REACT_APP_API_URL + "/localization";
    }
    
    public reloadLanguages(): ICancellableTransportPromise<void> {
        const url = this.BASE_URL+"/alllanguages";
        console.log("reloadLanguages url="+url);
        //return axios.post<ILanguagesResult>(url)
        const promise1 = this.postWithSession<ILanguagesResult>(url, {});
        const p = promise1.promise
                          .then( (res) => this.reloadLanguagesCallback(res) )
                          .catch( (err: any) => this.reloadLanguagesError(err) );
        const cancellablePromise: ICancellableTransportPromise<void> = {
            promise: p,
            cancelControl: promise1.cancelControl
        };
        return cancellablePromise;
    }

    protected reloadLanguagesCallback(res: ILanguagesResult) {
        console.log("reloadLanguagesCallback res=");
        console.dir(res);
        if(res && res.result === "OK" && res.payload && res.payload.length>0) {
            const langjson = JSON.stringify(res.payload);
            window.localStorage[LocalizationService.LANGUAGES_KEY] = langjson;
        }
    }

    protected reloadLanguagesError(err: any) {
        console.log("reloadLanguagesError err=");
        console.error(err);
    }


    public reloadLocalizations(): ICancellableTransportPromise<void> {
        const url = this.BASE_URL+"/all";
        console.log("reloadLocalizations url="+url);
        //return axios.post<ILocalizationsResult>(url)
        const promise1 = this.postWithSession<ILocalizationsResult>(url, {});
        const p = promise1.promise
                          .then( (res) => this.reloadLocalizationsCallback(res) )
                          .catch( (err: any) => this.reloadLocalizationsError(err) );
        const cancellablePromise: ICancellableTransportPromise<void> = {
            promise: p,
            cancelControl: promise1.cancelControl
        };
        return cancellablePromise;
    }    

    protected reloadLocalizationsCallback(res: ILocalizationsResult) {
        console.log("reloadLocalizationsCallback res=");
        console.dir(res);
        if(res && res.result === "OK") {
            const loc: ILocalizations = res.payload;
            console.log("reloadLocalizationsCallback");
            console.dir(loc);
            const locjson = JSON.stringify(loc);
            console.log("reloadLocalizationsCallback locjson="+locjson);
            window.localStorage[LocalizationService.LOCALIZATION_KEY] = locjson;
        }
    }

    protected reloadLocalizationsError(err: any) {
        console.error("reloadError err=");
        console.dir(err);
    }

    public setLanguage(language: string) {
        window.localStorage[LocalizationService.CURRENT_LANGUAGE_KEY] = language;
        this.languageObserver.trigger();
    }

    public getLanguage() {
        return window.localStorage[LocalizationService.CURRENT_LANGUAGE_KEY] || 
               LocalizationService.DEFAULT_LANG;
    }

    public languages() {
        let langjs = window.localStorage[LocalizationService.LANGUAGES_KEY];
        if (langjs) {
            const langs = JSON.parse(langjs);
            return langs;
        }
        return DefaultLanguages;
    }
    public local(grp: string) {
        return (key: string) => this.getLocalization(grp, key);
    }

    public getLocalization(grp: string, key: string) {
        const language = this.getLanguage();
        const localization = JSON.parse(window.localStorage[LocalizationService.LOCALIZATION_KEY]) || {};
        let k = grp+"."+key+"."+language;
        let value = localization[k];
        if(value) {
            return value;
        }
        console.warn("getLocalization - unable to find localization for key "+k);
        k = grp+"."+key+"."+LocalizationService.DEFAULT_LANG;
        value = localization[k];
        if(value) {
            return value;
        }
        k = "global."+key+"."+language;
        value = localization[k];
        if(value) {
            return value;
        }
        k = "global."+key+"."+LocalizationService.DEFAULT_LANG;
        value = localization[k];
        if(value) {
            return value;
        }
        return undefined;
    }

    public registerLanguageListener( handlerid: string, handlerFunc: IHandlerFunc<number>) {
        this.languageObserver.registerListener(handlerid, handlerFunc);
    }

    public unregisterLanguageListener( handlerid: string) {
        this.languageObserver.unregisterListener(handlerid);
    }

    public registerLocalizationListener( handlerid: string, handlerFunc: IHandlerFunc<number>) {
        this.localizationObserver.registerListener(handlerid, handlerFunc);
    }

    public unregisterLocalizationListener( handlerid: string) {
        this.localizationObserver.unregisterListener(handlerid);
    }
}
