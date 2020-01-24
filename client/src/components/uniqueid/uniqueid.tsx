import React from 'react';
import shortid from "shortid";

export interface IUniqueId {
    uniqueid: string;
}

export const withUniqueId = (WrappedComponent: any) => (props: any) => {
    const uniqueid = shortid.generate();
    const p = {...props, uniqueid};
    return (
        <WrappedComponent {...p}/>
    );
}

