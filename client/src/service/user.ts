import {IUser, IUserInfo} from "../model/user";
//import axios from "axios";
//import extractSvcData from "./extract-svc-data";
import {IServiceResult, IServiceResultWithPayload} from "./service-result";
import {ICancellableTransportPromise} from "../framework/transport";
import { ICommonService, CommonService } from "./common-service";


export type IUserListResult = IServiceResultWithPayload<IUserInfo[]>;
export type IUserGetResult = IServiceResultWithPayload<IUser>;

export interface IUserService extends ICommonService {
    userList(): ICancellableTransportPromise<IUserListResult>;
    userDelete(id: string): ICancellableTransportPromise<IServiceResult>;
    userGet(id: string): ICancellableTransportPromise<IUserGetResult>;
    userSave(user: IUser): ICancellableTransportPromise<IServiceResult>;
}

export class UserService extends CommonService implements IUserService {
    private readonly BASE_URL: string;
    constructor() {
        super();
        this.BASE_URL=process.env.REACT_APP_API_URL + "/user";
    }
    
    userList(): ICancellableTransportPromise<IUserListResult> {
        const url = this.BASE_URL+"/list";
        console.log("userList url="+url);
        //return axios.post<IUserListResult>(url)
        return this.postWithSession<IUserListResult>(url, {});
    }

    userDelete(id: string): ICancellableTransportPromise<IServiceResult> {
        const url = this.BASE_URL+"/delete";
        console.log("userDelete url="+url);
        //return axios.post<IServiceResult>(url,{id})
        return this.postWithSession<IServiceResult>(url,{id});
    }

    userGet(id: string) : ICancellableTransportPromise<IUserGetResult> {
        const url = this.BASE_URL+"/get";
        console.log("userGet url="+url);
        //return axios.post<IUserGetResult>(url,{id})
        return this.postWithSession<IUserGetResult>(url,{id});
    }

    userSave(user: IUser) : ICancellableTransportPromise<IServiceResult> {
        let url = this.BASE_URL+"/save";
        console.log("userSave url="+url);
        //return axios.post<IServiceResult>(url,user)
        return this.postWithSession<IServiceResult>(url,user);
    }    
}
