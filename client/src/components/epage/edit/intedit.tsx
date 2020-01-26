import React from 'react';
import {withRouter, RouteComponentProps} from "react-router-dom";
import { IEPage, IEPageField, IEPageAction } from '../../../model/epage';
import Loading from '../../loading';
import IErrors from '../../../model/errors';
import EditField from "../../edit-field";
import ValidationError from "../../validation-error";
import { IEPageService, IEPageGetResult, IEntityGetResult, IActionResult } from '../../../service/epage';
import Service from '../../../service';
import {CancelTokenSource} from "axios";
import {withLanguageListener, ILanguageProps } from '../../with-language-listener/with-language-listener';
import { ILanguageInfo } from '../../../model/language';

interface IProps extends RouteComponentProps, ILanguageProps {
    epageid: string;
    entityid?: string;
}

interface IState {
    epage?: IEPage;
    isLoading: boolean;
    entity?: any;
    errors: IErrors,
    touched: boolean;
    language?: ILanguageInfo;
}

class EPageIntEditInternal extends React.Component<IProps, IState> {

    
    private svc: IEPageService;
    private epageGetCancel?: CancelTokenSource;
    private entityGetCancel?: CancelTokenSource;
    private pageActionCancel?: CancelTokenSource;
    

    constructor(props: IProps) {
        super(props);
        console.log("EPageIntEdit - constructor");
        
        this.svc = Service.epage();

        this.state = {
            isLoading: false,
            errors: {},
            touched: false
        };        
    }

    public static getDerivedStateFromProps(props: IProps, state: IState) {
        return {
            language: props.language
        };
    }

    protected startLoading() {
        this.setState({
            isLoading: true
        });
    }

    protected stopLoading() {
        this.setState({
            isLoading: true
        });
    }

    public componentDidMount() {
        const epageid = this.props.epageid;
        console.log("EPageIntEdit - componentDidMount epageid="+epageid);
        this.startLoading();
        const cancellablePromise = this.svc.epageGet(epageid);
        cancellablePromise.promise
            .then( (res) => this.epageGetCallback(res) )
            .catch( (err) => this.serviceError(err) );
        if(this.epageGetCancel) {
            this.epageGetCancel.cancel();
        }
        this.epageGetCancel = cancellablePromise.cancelControl;
    }

    protected serviceError(err: any) {
        console.error("serviceError err=");
        console.dir(err);
        this.stopLoading();
    }

    protected epageGetCallback(res: IEPageGetResult) {
        const entityid = this.props.entityid;
        console.log("epageGetCallback res=");
        console.dir(res);
        if(res.result === "OK" && res.payload) {
            const epage = res.payload;
            if(entityid) {
                this.setState({ epage: {...epage} });
                const cancellablePromise = this.svc.entityGet(epage.id, entityid)
                cancellablePromise.promise
                                  .then( (res) => this.entityGetCallback(res) )
                                  .catch( (err: any) => this.serviceError(err) );
                if(this.entityGetCancel) {
                    this.entityGetCancel.cancel();
                }
                this.entityGetCancel = cancellablePromise.cancelControl;
            } else {
                console.log("epageGetCallback - entityid is blank - new entity - setting to defaults");
                this.setState({
                    isLoading: false,
                    epage: {...epage}
                });
            }
            return;
        }
        console.error("epageGetCallback - epage is blank");
        this.serviceError("Error");
    }

    protected entityGetCallback(res: IEntityGetResult) {
        console.log("entityGetCallback res=");
        console.dir(res);
        if(res && res.result === "OK" && res.payload) {
            this.setState({
                isLoading: false,
                entity: res.payload
            });
            return;
        }
        console.error("entityGetCallback payload is blank");
        this.serviceError("Error");
    }

    protected formatField(f: IEPageField) {        
        const epage = this.state.epage;
        let epageid = "";
        if(epage) {
            epageid = epage.id;            
        }
        const key = epageid + "_" + f.name;
        let value = "";
        const entity = this.state.entity;
        let error = "";
        if(entity) {
            value = entity[f.name] || "";
        }
        error = this.state.errors[f.name];
        const type = f.type || "text";
        // console.log("formatField key="+key+" label="+f.label+" name="+f.name+" value="+value+" error="+error+" type="+type);
        // console.dir(this.state.errors);   
        const grp = (epage?.entity+"_edit").toLowerCase();
        let fldname = ("fieldname_"+f.name).toLowerCase()
        const localizedLabel = this.props.localization.getLocalization(grp, fldname) || f.label;        
        let localizedError = error;
        const tmp1 = this.props.localization.getLocalization(grp, error);
        if(tmp1 && tmp1.length>0) {
            localizedError = tmp1;
        }

        return (
            <EditField key={key} label={localizedLabel} name={f.name} value={value} type={type}
               error={localizedError}
               onChange={ (e) => this.onChange(e) }
            />
        );
    }

    protected onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const name = e.target.name;
        const value = e.target.value;

        const entity = {...(this.state.entity || {}) };
        const errors = {...this.state.errors};
        entity[name] = value;
        delete errors[name];
        this.setState({entity, errors, touched: false});
    }
    protected onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    }

    protected formatAction(a: IEPageAction) {
        const key = a.name;
        const grp = (this.state.epage?.entity+"_edit").toLowerCase();
        const lbl = ("buttonlabel_"+a.label).toLowerCase();
        const localizedLabel = this.props.localization.getLocalization(grp, lbl) || a.label;
        return (
            <button key={key} type="button" onClick={ () => this.onAction(a)}>{localizedLabel}</button>
        )
    }

    protected onAction(a: IEPageAction) {
        console.log("onAction a=");
        console.dir(a);
        const entity = this.state.entity || {};
        console.log("entity=");
        console.log(entity);
        this.startLoading();
        const cancellablePromise = this.svc.entityAction(a.id, entity);
        cancellablePromise.promise
                          .then( (res) => this.actionCallback(res) )
                          .catch( (err) => this.actionErrors(err) );
        if(this.pageActionCancel) {
            this.pageActionCancel.cancel();
        }
        this.pageActionCancel = cancellablePromise.cancelControl;
    }

    protected actionCallback(res: IActionResult) {
        console.log("actionCallback res=");
        console.dir(res);
        if(res && res.result === "OK" && res.payload) {
            if(res.payload.nextpage) {
                const url = res.payload.nextpage;
                console.log("actionCallback redirecting to "+url);
                this.props.history.push(url);
                return;
            }
            console.log("nextpage is blank - doing nothing");
            this.stopLoading();
        }
        if(res.errors) {
            return this.actionErrors(res);
        }
        console.error("actionCallback payload is blank and errors are blank")
        this.serviceError("Error");
    }

    protected actionErrors(res: any) {
        console.log("actionErrors - res=");
        console.dir(res);
        if(res.errors) {
            return this.setState({
                                   isLoading: false,
                                   errors: {...res.errors}
            });
        }
        console.log("actionErrors - errors is blank, dont know what to do");
        this.stopLoading();        
    }

    public componentWillUnmount() {
        if(this.epageGetCancel) {
            this.epageGetCancel.cancel();
        }
        if(this.entityGetCancel) {
            this.entityGetCancel.cancel();
        }
        if(this.pageActionCancel) {
            this.pageActionCancel.cancel();
        }
    }

    public render() {
        console.log("EPageIntEdit render");
        if(this.state.isLoading) {
            return <Loading />;
        }
        if(!this.state.epage) {
            return <Loading />;
        }

        const epage = this.state.epage;
        const fields = epage.fields;
        const error = this.state.errors.error;
        const actions = epage.pageactions;

        const grp = (this.state.epage.entity).toLowerCase();        
        const header = epage.label.toLowerCase();
        const localizedHeader = this.props.localization.getLocalization(grp, header) || "Edit";
        
        return (
            <div className="container col-md-6">
                <h2>{localizedHeader}</h2>
                <form onSubmit={ (e:React.FormEvent<HTMLFormElement>) =>
                                         this.onSubmit(e) 
                               }
                >
                    {fields.map( (f)=> this.formatField(f))}
                    <div>
                        <ValidationError name="error" error={error} />
                    </div>
                    <hr />
                    <div className="form-group-control">
                        {actions.map( (a) => this.formatAction(a))}
                    </div>
                </form>
            </div>
        );
    }   
}

const tmp = withLanguageListener(EPageIntEditInternal);
const EPageIntEdit = withRouter(tmp);

export default EPageIntEdit;
