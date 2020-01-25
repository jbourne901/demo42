import { IHandlerFunc, IListeners } from "../model/listener";

export interface IObserver<T> {
    registerListener(handlerid: string, handlerFunc: IHandlerFunc<T> ): void;
    unregisterListener(handlerid: string ): void;
    trigger(): void;
}

export class Observer<T> implements IObserver<T> {
    private listeners: IListeners<T> = {};

    public registerListener(handlerid: string, handlerFunc: IHandlerFunc<T>) {
        this.listeners[handlerid] = handlerFunc;
    }

    public unregisterListener(handlerid: string) {
        delete this.listeners[handlerid];
    }

    public trigger(t?: T) {
        Object.values(this.listeners).map( (f: IHandlerFunc<T>) => f(t) );
    }
}