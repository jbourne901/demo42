import React from 'react';
import {withRouter, RouteComponentProps } from "react-router-dom";
import {IEPageService, IEntityListResult, IEPageGetResult, IActionResult} from "../../../service/epage";

import Service from "../../../service";
import {IEPage, IEPageField, IEPageAction} from '../../../model/epage';
import EPageListItem from "./list-item";
import "./intlist.css";
import insertVars from '../../../framework/insert-vars';
import { CancelTokenSource } from 'axios';
import { ILanguageProps } from '../../with-language-listener';
import { ILanguageInfo } from '../../../model/language';
import { withLanguageListener } from '../../with-language-listener/with-language-listener';
import { INotificationService } from '../../../service/notification';
import {withUniqueId, IUniqueId} from "../../uniqueid";

interface IParam {
    id: string;
}
interface IProps extends RouteComponentProps, ILanguageProps, IUniqueId {
    epageid: string;
}

interface IState {
    isLoading: boolean;
    epage?: IEPage;
    entities: any[];
    language?: ILanguageInfo;
}

class EPageIntListInternal extends React.Component<IProps, IState> {
    private epageSvc: IEPageService;
    private notificationSvc: INotificationService;
    private epageGetCancel?: CancelTokenSource;
    private entityListCancel?: CancelTokenSource;
    private generalActionCancel?: CancelTokenSource;
    private itemActionCancel?: CancelTokenSource;    

    constructor(props: IProps) {
        super(props);
        this.epageSvc  = Service.epage();
        this.notificationSvc = Service.notification();
        this.state = {
            isLoading: false,
            entities: []
        };
    }

    public componentDidMount() {
        console.log("EPageIntList - componentDidMount props=");
        const props = this.props;
        console.dir(props);
        this.refreshEPage();        
    }
 
    protected refreshEPage() {
        console.log("refreshEPage");
        this.startLoading();
        const epageid = this.props.epageid;
        if(epageid && epageid.length>0) {
            const cancellablePromise = this.epageSvc.epageGet(epageid);
            cancellablePromise.promise
                              .then( (res: IEPageGetResult) => this.serviceGetCallback(res))
                              .catch( (err) => this.serviceGetError(err));
            if(this.epageGetCancel) {
                this.epageGetCancel.cancel();
            }
            this.epageGetCancel = cancellablePromise.cancelControl;
        }
    }

    startLoading() {
        console.log("EPageIntList - startLoading");
        this.setState({
            isLoading: true
        });
    }

    stopLoading() {
        console.log("EPageIntList - stopLoading");
        this.setState({
            isLoading: false
        });
    }

    serviceGetCallback(res: IEPageGetResult) {
        if(res.result === "OK") {
            console.log("serviceGetCallback payload=");
            console.dir(res.payload);
            this.setState({isLoading: false, epage: res.payload});
            if(res.payload.entity) {
                this.notificationSvc.register(res.payload.entity, 
                                              this.props.uniqueid,
                                              () => this.refreshEntities() 
                                             );
            }            
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
            const cancellablePromise = this.epageSvc.entityList(epageid);
            cancellablePromise.promise
                              .then( (res: IEntityListResult) => this.serviceListCallback(res) )
                              .catch( (err: any) => this.serviceListError(err));
            if(this.entityListCancel) {
                this.entityListCancel.cancel();
            }
            this.entityListCancel = cancellablePromise.cancelControl;
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
        const grp = (this.state.epage?.entity+"_list").toLowerCase();
        const locKey = ("column_"+c.label).toLowerCase();
        const locLabel = this.props.localization.getLocalization(grp, locKey);
        return (
            <th className="col-md-2" key={c.name}>
               {locLabel}
            </th>
        );        
    }

    protected formatGeneralAction(pa: IEPageAction) {
        return (
           <button key={pa.id} onClick={ () => this.onGeneralAction(pa)}>
                {pa.label}
           </button>
        );        
    }

    protected onGeneralAction(pa: IEPageAction) {
        if(pa.confirm) {
            const grp = (this.state.epage?.entity+"_list").toLowerCase();
            const locKey = pa.confirm;
            const locConfirmTemplate = this.props.localization.getLocalization(grp, locKey);
            if(locConfirmTemplate) {
                const locConfirm = insertVars(locConfirmTemplate, {entity: this.state.epage?.entity});
                if(!window.confirm(locConfirm)) {
                    return;
                }    
            } else {
                return;
            }
        }
        this.startLoading();
        const cancellablePromise = this.epageSvc.generalAction(pa.id);
        cancellablePromise.promise
                          .then( (res: IActionResult) => this.actionCallback(res) )
                          .catch( (err: any) => this.actionError(err) );    
        if(this.generalActionCancel) {
            this.generalActionCancel.cancel();
        }
        this.generalActionCancel = cancellablePromise.cancelControl;
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
                    const grp = (this.state.epage?.entity+"_list").toLowerCase();
                    const locKey = action.confirm;
                    const locConfirmTemplate = this.props.localization.getLocalization(grp, locKey);
                    const conf = insertVars(locConfirmTemplate, {...entity, entity: this.state.epage?.entity});
                    console.log("onItemAction grp="+action.confirm+" locConfirmTemplate="+locConfirmTemplate
                                +" conf=" + conf);
        
//                    const conf = insertVars(action.confirm, entity);
                    if(!window.confirm(conf)) {
                        return;
                    }
                }
                this.startLoading();
                const cancellablePromise = this.epageSvc.itemAction( epageactionid, entityid );
                cancellablePromise.promise
                                  .then( (res) => this.actionCallback(res) )
                                  .catch( (err) => this.actionError(err) );
                if(this.itemActionCancel) {
                    this.itemActionCancel.cancel();
                }
                this.itemActionCancel = cancellablePromise.cancelControl;
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
        console.log("EPageIntList - componentWillUnmount");
        if(this.epageGetCancel) {
            this.epageGetCancel.cancel();
        }
        if(this.entityListCancel) {
            this.entityListCancel.cancel();
        }
        if(this.generalActionCancel) {
            this.generalActionCancel.cancel();
        }
        if(this.itemActionCancel) {
            this.itemActionCancel.cancel();
        }
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
        const grp = (epage?.entity+"_list").toLowerCase();
        const actionsLabel = this.props.localization.getLocalization(grp, "column_actions");

        console.log("render pageactions=");
        console.dir(pageactions);

        return (
            <div className="container">
                <h2>{label}</h2>
                <hr/>
                {generalactions.map( (pa: IEPageAction) => this.formatGeneralAction(pa) )}
                <hr/>
                <table className="table table-bordered table-responsive intlist-table">
                    <thead>
                        <tr>
                            {fields.map( (c) => this.formatHeader(c))}
                            <th className="col-md-1">{actionsLabel}</th>
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

const tmp = withLanguageListener(EPageIntListInternal)
const tmp2 = withUniqueId(tmp);
const EPageIntList = withRouter(tmp2);

export default EPageIntList;