export type IHandlerFunc = () => void;
export interface IListeners {
    [handlerid: string]: IHandlerFunc;
}

