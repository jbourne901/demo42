import React from 'react';
import {withRouter, RouteComponentProps} from "react-router-dom";
import { IEPage, IEPageField, IEPageAction } from "../../../../model/epage";

interface IProps extends RouteComponentProps {
    epage: IEPage;
    entity: any;
    itemactions: IEPageAction[];
    onItemAction(a:IEPageAction):void;
}

class EPageListItemInternal extends React.Component<IProps> {

    protected formatEntityCell(field: IEPageField) {
        const entity = this.props.entity;
        const epage = this.props.epage;
        const pkname = epage.pkname;
        const entityid = entity[pkname];
        let value="";
        if (entity) {
            value = entity[field.name];
        }
        const key = entityid + "_" + field.name;
        return (
             <td key={key}>{value}</td>
        );
    }

    protected formatItemAction(a: IEPageAction) {
        const entity = this.props.entity;
        const epage = this.props.epage;
        const pkname = epage.pkname;
        const entityid = entity[pkname];
        const key = entityid + "_" + a.name;
        return (
           <button key={key} onClick={ () => this.props.onItemAction(a) }>{a.label}</button>
        );        
    }

    public render() {
        const epage = this.props.epage || {};
        const fields = epage.fields || [];
        const itemactions = this.props.itemactions || [];

        return (
            <tr>
            {fields.map( (field) => this.formatEntityCell(field) )}
               <th>
                  {itemactions.map( (a: IEPageAction) => this.formatItemAction(a) )}
               </th>
            </tr>
        );
    }
}

const EPageListItem = withRouter(EPageListItemInternal);

export default EPageListItem;