import ILabelled from "./labelled";

export default interface IPort extends ILabelled {
    connectedToId?: string;
}