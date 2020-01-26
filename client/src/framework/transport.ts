import axios, { CancelTokenSource } from "axios";
import extractSvcData from "../service/extract-svc-data";
import { ISession } from "../model/session";

export interface ICancellableTransportPromise<T> {
    promise: Promise<T>;
    cancelControl: CancelTokenSource;
}


export class Transport {
    public static post<T>(url: string, params: any) {
        const cancel = axios.CancelToken;
        const source = cancel.source();
        const promise = axios.post<T>(url, params, {cancelToken: source.token})
                                  .then( (res) => extractSvcData<T>(res));
        
        const cancellablePromise: ICancellableTransportPromise<T> = {
            promise,
            cancelControl: source            
        };
        return cancellablePromise;
    }

    public static postWithSession<T>(url: string, session: ISession, params: any) {
        return Transport.post<T>(url, {session, ...params})
    }
}

export default Transport;