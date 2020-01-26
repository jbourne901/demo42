import React from 'react';
import {withRouter, RouteComponentProps} from "react-router-dom";
import { IEPage, IEPageField, IEPageAction } from "../../../../model/epage";
import { withLanguageListener, ILanguageProps } from '../../../with-language-listener';
import { ILanguageInfo } from '../../../../model/language';

interface IProps extends RouteComponentProps, ILanguageProps {
    epage: IEPage;
    entity: any;
    itemactions: IEPageAction[];
    onItemAction(a:IEPageAction):void;
}

interface IState {
    language?: ILanguageInfo;
}

class EPageListItemInternal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

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
        const grp = this.props.epage.entity + "_list";
        const locKey = "buttonlabel_"+a.name;
        const locLabel = this.props.localization.getLocalization(grp, locKey) || a.label;
        return (
           <button key={key} onClick={ () => this.props.onItemAction(a) }>{locLabel}</button>
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

const tmp = withRouter(EPageListItemInternal);
const EPageListItem = withLanguageListener(tmp);

export default EPageListItem;