import IUserInfo from "../model/user-info";
import {IUser} from "../model/user";
import axios from "axios";
import extractSvcData from "./extract-svc-data";
import {IServiceResult, IServiceResultWithPayload} from "./service-result";

export type IUserListResult = IServiceResultWithPayload<IUserInfo[]>;
export type IUserGetResult = IServiceResultWithPayload<IUser>;

export interface IUserService {
    userList(): Promise<IUserListResult>;
    userDelete(userId: string): Promise<IServiceResult>;
    userGet(userId: string): Promise<IUserGetResult>;
    userSave(user: IUser): Promise<IServiceResult>;
}

export class UserService implements IUserService {
    private readonly BASE_URL: string;
    constructor() {
        this.BASE_URL=process.env.REACT_APP_API_URL + "/user";
    }
    
    userList(): Promise<IUserListResult> {
        const url = this.BASE_URL+"/list";
        console.log("userList url="+url);
        return axios.post<IUserListResult>(url)
                    .then( (res) => extractSvcData<IUserListResult>(res) );                                        
    }

    userDelete(userId: string): Promise<IServiceResult> {
        const url = this.BASE_URL+"/delete";
        console.log("userDelete url="+url);
        return axios.post<IServiceResult>(url,{userId})
                    .then( (res) => extractSvcData<IServiceResult>(res) );                                        
    }

    userGet(userId: string) : Promise<IUserGetResult> {
        const url = this.BASE_URL+"/get";
        console.log("userGet url="+url);
        return axios.post<IUserGetResult>(url,{userId})
                    .then( (res) => extractSvcData<IUserGetResult>(res) );                                        
    }

    userSave(user: IUser) : Promise<IServiceResult> {
        let url = this.BASE_URL+"/save";
        console.log("userSave url="+url);
        return axios.post<IServiceResult>(url,user)
                    .then( (res) => extractSvcData<IServiceResult>(res) );                                        
    }    
}
