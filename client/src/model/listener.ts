export type IHandlerFunc<T> = (payload?: T) => void;
export interface IListeners<T> {
    [handlerid: string]: IHandlerFunc<T>;
}

