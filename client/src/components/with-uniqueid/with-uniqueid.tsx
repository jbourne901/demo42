import React from 'react';
import shortid from "shortid";

const withUniqueid = (WrappedComponent: any) => (props: any) => {
    const uniqueid = shortid.generate();
    const p = {...props, uniqueid};
    return (
        <WrappedComponent {...p}/>
    );
}

export default withUniqueid;
