export interface IBlockTemplate {
    label: string;
    name: string;
    ports: string[];
}

export function template0(label: string) {
    const t: IBlockTemplate = {label, name: label, ports: ["OK"]};
    return t;
}