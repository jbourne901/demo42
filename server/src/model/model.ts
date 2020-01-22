import IErrors from "./errors";

export interface IQueryResult {
    res: {
        result: string;
        errors: IErrors;
    };
}

export interface IQueryResultWithPayload<T> extends IQueryResult {
    res: {
        result: string;
        errors: IErrors;
        payload: T;
    };
}

export const UnknownErrorResult: IQueryResult = {
    res: {
        result: "Error",
        errors: {error: "Uknown error"}
    }
};

export const UnknownErrorResultWithPayload: IQueryResultWithPayload<any> = {
    res: {
        result: "Error",
        errors: {error: "Uknown error"},
        payload: {}
    }
};
