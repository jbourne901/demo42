export interface IEPageInfo {
    id: string;
    label: string;
    name: string;
    type: string;
    url: string;
    entity: string;
};


export interface IEPageAction {
    id: string;
    name: string;
    label: string;
    type: string;
    isitemaction: boolean;
    query: string;
    confirm: string;
}

export interface IEPageField {
    name: string;
    label: string;
    type: string;
}

export interface IEPage {
    id: string;
    name: string;
    label: string;
    query: string;
    pkname: string;
    fields: IEPageField[];
    pageactions: IEPageAction[];
    entity: string;
};

export const IEPageDefault: IEPage = {
    id: "",
    name: "",
    label: "",
    query: "",
    pkname: "",
    fields: [],
    pageactions: [],
    entity: ""
};

