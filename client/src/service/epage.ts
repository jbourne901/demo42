import {IEPage, IEPageInfo} from "../model/epage";
import axios from "axios";
import extractSvcData from "./extract-svc-data";
import {IServiceResultWithPayload} from "./service-result";
import IActionNextSteps from "../model/actionnextsteps";

export type IEPageListResult = IServiceResultWithPayload<IEPageInfo[]>;
export type IEPageGetResult = IServiceResultWithPayload<IEPage>;
export type IEntityListResult = IServiceResultWithPayload<any[]>;
export type IEntityGetResult = IServiceResultWithPayload<any[]>;

export type IActionResult = IServiceResultWithPayload<IActionNextSteps>;


export interface IEPageService {
    epageList(): Promise<IEPageListResult>;
    epageGet(epageid: string): Promise<IEPageGetResult>;
    entityList(epageid: string): Promise<IEntityListResult>;
    entityGet(epageid: string, entityid: string): Promise<IEntityGetResult>;
    generalAction(epageactionid: string): Promise<IActionResult>;
    itemAction(epageactionid: string, entityid: string): Promise<IActionResult>;
    entityAction(epageactionid: string, entity: any): Promise<IActionResult>;
}

export class EPageService implements IEPageService {
    private readonly BASE_URL: string;
    constructor() {
        this.BASE_URL=process.env.REACT_APP_API_URL + "/epage";
    }
    
    public epageList(): Promise<IEPageListResult> {
        const url = this.BASE_URL+"/list";
        console.log("epageList url="+url);
        return axios.post<IEPageListResult>(url)
                    .then( (res) => extractSvcData<IEPageListResult>(res) );
    }

    public epageGet(epageid: string) : Promise<IEPageGetResult> {
        const url = this.BASE_URL+"/get";
        console.log("epageGet url="+url+" epageid=" + epageid);
        return axios.post<IEPageGetResult>(url,{id: epageid})
                    .then( (res) => extractSvcData<IEPageGetResult>(res) );                                        
    }

    public entityList(epageid: string) : Promise<IEntityListResult> {
        const url = this.BASE_URL+"/entitylist";
        console.log("entityList url="+url+" epageid=" + epageid);
        return axios.post<IEntityListResult>(url,{id: epageid})
                    .then( (res) => extractSvcData<IEntityListResult>(res) );
    }

    public entityGet(epageid: string, entityid: string) {
        const url = this.BASE_URL+"/entityget";
        console.log("entityGet url="+url+" epageid=" + epageid + " entityid=" + entityid);
        return axios.post<IEntityListResult>(url,{id: epageid, entityid})
                    .then( (res) => extractSvcData<IEntityGetResult>(res) );
    }

    public generalAction(epageactionid: string): Promise<IActionResult> {
        const url = this.BASE_URL+"/generalaction";
        console.log("generalAction url="+url+" epageactionid=" + epageactionid);
        return axios.post<IActionResult>(url,{id: epageactionid})
                    .then( (res) => extractSvcData<IActionResult>(res) );
    }

    public itemAction(epageactionid: string, entityid: string): Promise<IActionResult> {
        const url = this.BASE_URL+"/itemaction";
        console.log("itemAction url=" + url + " epageactionid=" + epageactionid + " entityid=" + entityid);
        return axios.post<IActionResult>(url,{id: epageactionid, entityid})
                    .then( (res) => extractSvcData<IActionResult>(res) );
    }

    public entityAction(epageactionid: string, entity: any): Promise<IActionResult> {
        const url = this.BASE_URL+"/entityaction";
        console.log("entityAction url=" + url + " epageactionid=" + epageactionid + " entity=" + entity);
        return axios.post<IActionResult>(url,{id: epageactionid, entity})
                    .then( (res) => extractSvcData<IActionResult>(res) );
    }    
}
