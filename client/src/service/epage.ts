import {IEPage, IEPageInfo} from "../model/epage";
import {IServiceResultWithPayload} from "./service-result";
import IActionNextSteps from "../model/actionnextsteps";
import { ICancellableTransportPromise } from "../framework/transport";
import { ICommonService, CommonService } from "./common-service";

export type IEPageListResult = IServiceResultWithPayload<IEPageInfo[]>;
export type IEPageGetResult = IServiceResultWithPayload<IEPage>;
export type IEntityListResult = IServiceResultWithPayload<any[]>;
export type IEntityGetResult = IServiceResultWithPayload<any[]>;

export type IActionResult = IServiceResultWithPayload<IActionNextSteps>;


export interface IEPageService extends ICommonService {
    epageList(): ICancellableTransportPromise<IEPageListResult>;
    epageGet(epageid: string): ICancellableTransportPromise<IEPageGetResult>;
    entityList(epageid: string): ICancellableTransportPromise<IEntityListResult>;
    entityGet(epageid: string, entityid: string): ICancellableTransportPromise<IEntityGetResult>;
    generalAction(epageactionid: string): ICancellableTransportPromise<IActionResult>;
    itemAction(epageactionid: string, entityid: string): ICancellableTransportPromise<IActionResult>;
    entityAction(epageactionid: string, entity: any): ICancellableTransportPromise<IActionResult>;
}

export class EPageService extends CommonService implements IEPageService {
    private readonly BASE_URL: string;
    constructor() {
        super();
        this.BASE_URL=process.env.REACT_APP_API_URL + "/epage";
    }
    
    public epageList(): ICancellableTransportPromise<IEPageListResult> {
        const url = this.BASE_URL+"/list";
        // console.log("epageList url=" + url);
        //return axios.post<IEPageListResult>(url)

        return this.postWithSession<IEPageListResult>(url, {});
    }

    public epageGet(epageid: string) : ICancellableTransportPromise<IEPageGetResult> {
        const url = this.BASE_URL+"/get";
        // console.log("epageGet url="+url+" epageid=" + epageid);

        //return axios.post<IEPageGetResult>(url,{id: epageid})
        return this.postWithSession<IEPageGetResult>(url,{id: epageid});
    }

    public entityList(epageid: string) : ICancellableTransportPromise<IEntityListResult> {
        const url = this.BASE_URL+"/entitylist";
        // console.log("entityList url="+url+" epageid=" + epageid);
        //return axios.post<IEntityListResult>(url,{id: epageid})
        return this.postWithSession<IEntityListResult>(url,{id: epageid});
    }

    public entityGet(epageid: string, entityid: string): ICancellableTransportPromise<IEntityGetResult> {
        const url = this.BASE_URL+"/entityget";
        // console.log("entityGet url="+url+" epageid=" + epageid + " entityid=" + entityid);
        //return axios.post<IEntityGetResult>(url,{id: epageid, entityid})
        return this.postWithSession<IEntityGetResult>(url,{id: epageid, entityid});
    }

    public generalAction(epageactionid: string): ICancellableTransportPromise<IActionResult> {
        const url = this.BASE_URL+"/generalaction";
        // console.log("generalAction url="+url+" epageactionid=" + epageactionid);        
        //return axios.post<IActionResult>(url,{id: epageactionid})
        return this.postWithSession<IActionResult>(url,{id: epageactionid});
    }

    public itemAction(epageactionid: string, entityid: string): ICancellableTransportPromise<IActionResult> {
        const url = this.BASE_URL+"/itemaction";
        // console.log("itemAction url=" + url + " epageactionid=" + epageactionid + " entityid=" + entityid);        
        //return axios.post<IActionResult>(url,{id: epageactionid, entityid})
        return this.postWithSession<IActionResult>(url,{id: epageactionid, entityid});
    }

    public entityAction(epageactionid: string, entity: any): ICancellableTransportPromise<IActionResult> {
        const url = this.BASE_URL+"/entityaction";
        // console.log("entityAction url=" + url + " epageactionid=" + epageactionid + " entity=" + entity);
        //return axios.post<IActionResult>(url,{id: epageactionid, entity})
        return this.postWithSession<IActionResult>(url,{id: epageactionid, entity});
    }    
}
