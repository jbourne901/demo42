import {IUser, IUserInfo} from "../model/user";
//import axios from "axios";
//import extractSvcData from "./extract-svc-data";
import {IServiceResult, IServiceResultWithPayload} from "./service-result";
import Transport, {ICancellableTransportPromise} from "../framework/transport";


export type IUserListResult = IServiceResultWithPayload<IUserInfo[]>;
export type IUserGetResult = IServiceResultWithPayload<IUser>;

export interface IUserService {
    userList(): ICancellableTransportPromise<IUserListResult>;
    userDelete(id: string): ICancellableTransportPromise<IServiceResult>;
    userGet(id: string): ICancellableTransportPromise<IUserGetResult>;
    userSave(user: IUser): ICancellableTransportPromise<IServiceResult>;
}

export class UserService implements IUserService {
    private readonly BASE_URL: string;
    constructor() {
        this.BASE_URL=process.env.REACT_APP_API_URL + "/user";
    }
    
    userList(): ICancellableTransportPromise<IUserListResult> {
        const url = this.BASE_URL+"/list";
        console.log("userList url="+url);
        //return axios.post<IUserListResult>(url)
        return Transport.post<IUserListResult>(url, {});
    }

    userDelete(id: string): ICancellableTransportPromise<IServiceResult> {
        const url = this.BASE_URL+"/delete";
        console.log("userDelete url="+url);
        //return axios.post<IServiceResult>(url,{id})
        return Transport.post<IServiceResult>(url,{id});
    }

    userGet(id: string) : ICancellableTransportPromise<IUserGetResult> {
        const url = this.BASE_URL+"/get";
        console.log("userGet url="+url);
        //return axios.post<IUserGetResult>(url,{id})
        return Transport.post<IUserGetResult>(url,{id});
    }

    userSave(user: IUser) : ICancellableTransportPromise<IServiceResult> {
        let url = this.BASE_URL+"/save";
        console.log("userSave url="+url);
        //return axios.post<IServiceResult>(url,user)
        return Transport.post<IServiceResult>(url,user);
    }    
}
