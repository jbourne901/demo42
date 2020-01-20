import {IAuthInfo} from "../model/auth";
import {ILogin} from "../model/login";
import { IServiceResultWithPayload, IServiceResult } from "./service-result";
import axios, {AxiosResponse} from "axios";
import extractSvcData from "./extract-svc-data";
import jwt from "jsonwebtoken";

export type IAuthInfoServiceResult = IServiceResultWithPayload<IAuthInfo>;

export interface IAuthService  {
   login(login: ILogin): Promise<IAuthInfoServiceResult>;
   isLoggedIn(): boolean;
   getAuthName(): string;
   logout(): Promise<IServiceResult>;
}

export class AuthService implements IAuthService {
    private readonly BASE_URL: string;
    constructor() {
        this.BASE_URL=process.env.REACT_APP_API_URL + "/auth";
    }

    public login(login: ILogin) {
        const url = this.BASE_URL+"/login";
        console.log("Authservice.login url="+url);
        console.dir(login);
        return axios.post<IAuthInfoServiceResult>(url, {login})
                    .then( (res) => this.processAuthResult(res) )
                    .catch( (err) => this.processLoginError(err) );
    }

    protected processLoginError(resp: any) {
        console.log("processLoginError resp=");
        console.dir(resp);
        if(resp && resp.response && resp.response.data) {
            console.log("extracting response from resp");
            const res =  extractSvcData<IServiceResult>(resp.response);
            console.dir(res);
            return res;
        }
        return resp;
    }

    processAuthResult(res: AxiosResponse<IAuthInfoServiceResult>) {
        console.log("processAuthResult res=");
        console.dir(res);

        const authRes = extractSvcData<IAuthInfoServiceResult>(res);
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
        return authRes;
    }

    public isLoggedIn(): boolean {
        return (window.localStorage.getItem("isLoggedIn") === "1" );
    }

    public getAuthName(): string {
        return window.localStorage.getItem("authName") || "";
    }

    public async logout() {
        window.localStorage.removeItem("authName");
        window.localStorage.removeItem("isLoggedIn");
        const res: IServiceResult = {result: "OK", errors: {} };
        return res;
    }
}
