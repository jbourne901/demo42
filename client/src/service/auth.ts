import {IAuthInfo} from "../model/auth";
import {ILogin} from "../model/login";
import { IServiceResultWithPayload, IServiceResult } from "./service-result";
import extractSvcData from "./extract-svc-data";
import jwt from "jsonwebtoken";
import Transport, {ICancellableTransportPromise} from "../framework/transport";

export type IAuthInfoServiceResult = IServiceResultWithPayload<IAuthInfo>;

export interface IAuthService  {
   login(login: ILogin): ICancellableTransportPromise<IServiceResult>;
   isLoggedIn(): boolean;
   getAuthName(): string;
   logout(): IServiceResult;
}

export class AuthService implements IAuthService {
    private readonly BASE_URL: string;
    constructor() {
        this.BASE_URL=process.env.REACT_APP_API_URL + "/auth";
    }

    public login(login: ILogin): ICancellableTransportPromise<IServiceResult> {
        const url = this.BASE_URL+"/login";
        console.log("Authservice.login url="+url);
        console.dir(login);
        //return axios.post<IAuthInfoServiceResult>(url, {login})
        const cancellablePromise = Transport.post<IAuthInfoServiceResult>(url, {login});
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
                window.localStorage.setItem("authName", authName);
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
        const res: IServiceResult = {result: "OK", errors: {} };
        return res;
    }
}
