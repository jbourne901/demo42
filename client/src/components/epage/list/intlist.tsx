import React from 'react';
import {withRouter, RouteComponentProps } from "react-router-dom";
import {IEPageService, IEntityListResult, IEPageGetResult, IActionResult} from "../../../service/epage";

import Service from "../../../service";
import {INotificationService} from "../../../service/notification";
import {IEPage, IEPageField, IEPageAction} from '../../../model/epage';
import EPageListItem from "./list-item";
import "./intlist.css";
import insertVars from '../../../framework/insert-vars';
import withUniqueid from "../../with-uniqueid";

interface IParam {
    id: string;
}
interface IProps extends RouteComponentProps {
    epageid: string;
    uniqueid: string;
}

interface IState {
    isLoading: boolean;
    epage?: IEPage;
    entities: any[];
}

class EPageIntListInternal extends React.Component<IProps, IState> {
    private svc: IEPageService;
    private notification: INotificationService;

    public componentDidMount() {
        console.log("EPageIntList - componentDidMount props=");
        const props = this.props;
        console.dir(props);
        this.refreshEPage();
    }

    constructor(props: IProps) {
        super(props);
        this.svc  = Service.epage();
        this.notification = Service.notification();
        this.state = {
            isLoading: false,
            entities: [],
        };
    }

    protected refreshEPage() {
        console.log("refreshEPage");
        this.startLoading();
        const epageid = this.props.epageid;
        if(epageid && epageid.length>0) {
            this.svc.epageGet(epageid)
                .then( (res: IEPageGetResult) => this.serviceGetCallback(res))
                .catch( (err) => this.serviceGetError(err));
        }
    }

    startLoading() {
        this.setState({
            isLoading: true
        });
    }

    stopLoading() {
        this.setState({
            isLoading: false
        });
    }

    serviceGetCallback(res: IEPageGetResult) {
        if(res.result === "OK") {
            console.log("serviceGetCallback payload=");
            console.dir(res.payload);
            this.setState({isLoading: false, epage: res.payload});
            this.notification.register(res.payload.entity, this.props.uniqueid, () => this.refreshEntities() );
            this.refreshEntities();
            return;
        }
        this.serviceGetError("Error");
    }

    serviceGetError(err: any) {
        this.stopLoading();
        console.log("serviceGetError err=");
        console.dir(err);
    }

    refreshEntities() {
        this.startLoading();
        const epage = this.state.epage;        
        if(epage) {
            const epageid = epage.id;
            this.svc.entityList(epageid)
                .then( (res: IEntityListResult) => this.serviceListCallback(res) )
                .catch( (err: any) => this.serviceListError(err));
        }
    }

    serviceListCallback(res: IEntityListResult) {
        console.log("serviceListCallback res=");
        console.dir(res);
        if(res.result==="OK") {
            this.setState({
                isLoading: false,
                entities: res.payload
            });
            return;
        }
        this.serviceListError("Error");
    }

    serviceListError(err: any) {
        console.log("serviceListError err=");
        console.dir(err);
        this.stopLoading();
    }

    protected formatHeader(c: IEPageField) {
        return (
            <td key={c.name}>
               {c.label}
            </td>
        );        
    }

    protected formatGeneralAction(pa: IEPageAction) {
        return (
           <button key={pa.id} onClick={ () => this.onGeneralAction(pa)}>{pa.label}</button>
        );        
    }

    protected onGeneralAction(pa: IEPageAction) {
        if(pa.confirm) {
            if(!window.confirm(pa.confirm)) {
                return;
            }
        }
        this.startLoading();
        this.svc.generalAction(pa.id)
                .then( (res: IActionResult) => this.actionCallback(res) )
                .catch( (err: any) => this.actionError(err) );    
    }

    protected actionCallback(res: IActionResult) {
        console.log("actionCallback res=");
        console.dir(res);
        if(res.result==="OK") {
            this.stopLoading();
            if(res.payload.nextpage && res.payload.nextpage.length>0) {
                const url = res.payload.nextpage;
                console.log("actionCallback redirecting to "+url);
                this.props.history.push(url);
                return;
            }
            console.log("actionCallback not redirecting , just refreshing page ");
            this.refreshEntities();
            return;
        }
        this.actionError("Error");
    }

    protected actionError(err: any) {
        console.log("actionError err="+err);
        this.stopLoading();
    }

    protected onItemAction(action: IEPageAction, entity: any) {
        console.log("onItemAction action=");
        console.dir(action);
        console.log(" entity=");
        console.dir(entity);

        const epageactionid = action.id;
        if(this.state.epage && this.state.epage.pkname) {
            const pkname = this.state.epage.pkname;
            const entityid = entity[pkname];
            if(epageactionid && entityid) {
                if(action.confirm) {
                    const conf = insertVars(action.confirm, entity);
                    if(!window.confirm(conf)) {
                        return;
                    }
                }
                this.startLoading();
                return this.svc.itemAction( epageactionid, entityid )        
                            .then( (res) => this.actionCallback(res) )
                            .catch( (err) => this.actionError(err) );
            }
        }
        console.error("onItemAction - unable to determine epageactionid or entityid");
        this.actionError("Error");
    }
 
    protected formatEntity(e: any, itemactions: IEPageAction[]) {
        const epage = this.state.epage;
        if(epage) {
            const pkname = epage.pkname;
            const entityid = e[pkname];

            return (
                <EPageListItem key={entityid} epage={epage} 
                               entity={e} itemactions={itemactions}
                               onItemAction = { (a: IEPageAction) => this.onItemAction(a, e) }
                />
            );    
        }
    }

    public componentWillUnmount() {
        this.notification.unregister(this.props.uniqueid);
    }

    public render() {
        const epage = this.state.epage;
        console.log("render epage=");
        console.dir(epage);
        let label="";
        let fields: IEPageField[] = [];
        let pageactions: IEPageAction[] = [];
        let generalactions: IEPageAction[] = [];
        let itemactions: IEPageAction[] = [];
        if(epage) {
            label = epage.label || "";
            fields = epage.fields || [];
            pageactions = epage.pageactions;
            generalactions = pageactions.filter((a) => !a.isitemaction);
            itemactions = pageactions.filter((a) => a.isitemaction);
        }
        const entities = this.state.entities;

        console.log("render pageactions=");
        console.dir(pageactions);

        return (
            <div>
                <h2>{label}</h2>
                <hr/>
                {generalactions.map( (pa: IEPageAction) => this.formatGeneralAction(pa) )}
                <hr/>
                <table className="intlist-table">
                    <thead>
                        <tr>
                            {fields.map( (c) => this.formatHeader(c))}
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {entities.map( (e) => this.formatEntity(e, itemactions))}
                    </tbody>
                </table>
            </div>
        );
    }    
}

const tmp = withUniqueid(EPageIntListInternal)
const EPageIntList = withRouter(tmp);

export default EPageIntList;