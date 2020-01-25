import React from 'react';
import ValidationError from '../validation-error';

interface IProps {
    label: string;
    name: string;
    value: string;
    error: string;
    type?: string;
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

const EditField: React.FC<IProps> = (props: IProps) => {
    const {label, name, value, error, onChange} = props;
    const type = props.type || "text";

    return (
        <div className="form-group mx-sm-3">
            <label>{label}: </label>
            <input type={type} name={name} value={value} onChange={onChange} 
               className="form-control"
            />
            <ValidationError name={name} error={error} />
        </div>
        
    );
}

export default EditField;