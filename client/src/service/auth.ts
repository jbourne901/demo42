import {IAuthInfo} from "../model/auth";
import {ILogin} from "../model/login";
import { IServiceResultWithPayload, IServiceResult } from "./service-result";
import extractSvcData from "./extract-svc-data";
import jwt from "jsonwebtoken";
import {ICancellableTransportPromise} from "../framework/transport";
import {ISession, NoSession} from "../model/session";
import { ICommonService, CommonService } from "./common-service";

export type IAuthInfoServiceResult = IServiceResultWithPayload<IAuthInfo>;

export interface IAuthService extends ICommonService {
   login(login: ILogin): ICancellableTransportPromise<IServiceResult>;
   isLoggedIn(): boolean;
   getAuthName(): string;
   logout(): IServiceResult;
   session(): ISession;
}

export class AuthService extends CommonService implements IAuthService {
    private readonly BASE_URL: string;
    constructor() {
        super();
        this.BASE_URL=process.env.REACT_APP_API_URL + "/auth";
    }

    public login(login: ILogin): ICancellableTransportPromise<IServiceResult> {
        const url = this.BASE_URL+"/login";
        console.log("Authservice.login url="+url);
        console.dir(login);
        const cancellablePromise = this.postWithSession<IAuthInfoServiceResult>(url,{login});
        const promise = cancellablePromise.promise
                                          .then( (res) => this.processAuthResult(res) )
                                          .catch( (err) => this.processLoginError(err) );
        const cancellablePromise2: ICancellableTransportPromise<IServiceResult> = 
                          {cancelControl: cancellablePromise.cancelControl, promise};
        return cancellablePromise2;
    }

    protected processLoginError(resp: any): IServiceResult {
        console.log("processLoginError resp=");
        console.dir(resp);
        let res: IServiceResult;
        if(resp && resp.response && resp.response.data) {
            console.log("extracting response from resp");
            res =  extractSvcData<IServiceResult>(resp.response);
            console.dir(res);
            throw(res);
        }
        throw(resp);
    }

    processAuthResult(authRes: IAuthInfoServiceResult) {
        console.log("processAuthResult authRes=");
        console.dir(authRes);

        console.log("processAuthResult authRes=");
        console.dir(authRes);

        if(authRes && authRes.result === "OK" && authRes.payload) {
            const token = authRes.payload.token;
            window.localStorage.setItem("isLoggedIn","1");
            let tokenData=token;
            if(token.startsWith("Bearer ")) {
                tokenData = token.substring(7);
            }
            const decoded = jwt.decode(tokenData, {complete: true} );
            console.log("decoded = ");
            console.dir(decoded);
            if(decoded && typeof decoded === "object" && decoded.payload) {
                const auth = decoded.payload;
                const authName = auth.name;
                const sessionkey: string = auth.sessionkey;
                const session: ISession = {sessionkey};
                window.localStorage.setItem("authName", authName);
                window.localStorage.setItem("session", JSON.stringify(session));
            }            
        }
        const svcResult: IServiceResult = {
            result: authRes.result || "Error",
            errors: authRes.errors || {}
        };
        return svcResult;
    }

    public isLoggedIn(): boolean {
        return (window.localStorage.getItem("isLoggedIn") === "1" );
    }

    public getAuthName(): string {
        return window.localStorage.getItem("authName") || "";
    }

    public logout() {
        window.localStorage.removeItem("authName");
        window.localStorage.removeItem("isLoggedIn");
        window.localStorage.removeItem("session");
        const res: IServiceResult = {result: "OK", errors: {} };
        return res;
    }

    public session() {
        console.log("AuthService.session()");
        const sessionstr = window.localStorage["session"]; 
        let session = NoSession;
        if(sessionstr && sessionstr.length>0) {
            session = JSON.parse(sessionstr);
        }
        return session;
    }
}
