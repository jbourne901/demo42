import {IServiceResultWithPayload} from "./service-result";
import {ICancellableTransportPromise} from "../framework/transport";
import { ICommonService, CommonService } from "./common-service";
import {IBlockTemplate} from "../model/flowchart/template";

export type IFlowchartTemplateListResult = IServiceResultWithPayload<IBlockTemplate[]>;

export interface IFlowchartService extends ICommonService {
    scriptTemplateList(): ICancellableTransportPromise<IFlowchartTemplateListResult>;
}

export class IFlowchartService extends CommonService implements IFlowchartService {
    private readonly BASE_URL: string;
    constructor() {
        super();
        this.BASE_URL=process.env.REACT_APP_API_URL + "/flowchart";
    }
    
    scriptTemplateList(): ICancellableTransportPromise<IFlowchartTemplateListResult> {
        const url = this.BASE_URL+"/scripttemplates";
        console.log("scriptTemplateList url="+url);
        return this.postWithSession<IFlowchartTemplateListResult>(url, {});
    }
}
