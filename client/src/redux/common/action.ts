import IErrors from "../../model/errors";

export interface IAction {
    type: string;
    result: string;
    errors: IErrors    
};

export interface IActionWithPayload<T> extends IAction {
    payload: T
};

