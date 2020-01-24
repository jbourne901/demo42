import axios, { CancelTokenSource } from "axios";
import extractSvcData from "../service/extract-svc-data";

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
}

export default Transport;