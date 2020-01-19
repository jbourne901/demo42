import React from 'react';
import "./validation-error.css";

interface IProps {
    name: string;
    error: string;
}

const ValidationError: React.FC<IProps> = (props: IProps) => {
    if(props.error && props.error.length>0) {
        return (
                <div className="validation-error">
                    {props.error}
                </div>
              );
    }
    return null;
}

export default ValidationError;