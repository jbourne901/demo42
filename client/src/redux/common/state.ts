import IErrors from "../../model/errors";

export interface IState {
    isLoading: boolean;
    result: string;
    errors: IErrors;    
}

export interface IStateWithPayload<T> extends IState {
    payload: T;
}

export const DefaultStateValue: IState = {
    isLoading: false,
    result: "",
    errors: {}
};
