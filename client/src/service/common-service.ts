import {Transport, ICancellableTransportPromise} from "../framework/transport";
import Service from "./service";

export interface ICommonService {
    post<T>(url: string, params: any): ICancellableTransportPromise<T>;
    postWithSession<T>(url: string, params: any): ICancellableTransportPromise<T>;
}

export class CommonService implements ICommonService {
    public post<T>(url: string, params: any): ICancellableTransportPromise<T> {
        console.log("post url=" + url);

        return Transport.post<T>(url, params);
    }

    public postWithSession<T>(url: string, params: any): ICancellableTransportPromise<T> {
        console.log("CommonService.postWithSession url="+url);
        const session = Service.auth().session();
        console.log("post url=" + url + " session=");
        console.dir(session);

        return Transport.postWithSession<T>(url, session, params);
    }
}