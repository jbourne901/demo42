import {IPortInfo} from "./port";

export interface IBlockTemplate {
    label: string;
    name: string;
    ports: IPortInfo[];
}
