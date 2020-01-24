import { IHandlerFunc, IListeners } from "../model/listener";

export interface IObserver {
    registerListener(handlerid: string, handlerFunc: IHandlerFunc ): void;
    unregisterListener(handlerid: string, handlerFunc: IHandlerFunc ): void;
    trigger(): void;
}

export class Observer implements IObserver {
    private listeners: IListeners = {};

    public registerListener(handlerid: string, handlerFunc: IHandlerFunc) {
        this.listeners[handlerid] = handlerFunc;
    }

    public unregisterListener(handlerid: string) {
        delete this.listeners[handlerid];
    }

    public trigger() {
        Object.values(this.listeners).map( (f: IHandlerFunc) => f() );
    }
}