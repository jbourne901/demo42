import IErrors from "../model/errors";

export interface IServiceResult {
    result: string;
    errors: IErrors;
}

export interface IServiceResultWithPayload<T> extends IServiceResult {
    payload: T;
};




