import React from 'react';
import {RouteComponentProps, withRouter} from "react-router-dom";
import {IUser, UserDefault} from '../../../model/user';
import IErrors from '../../../model/errors';
import Service from "../../../service";
import { IUserService, IUserGetResult } from '../../../service/user';
import Loading from "../../loading";
import { IServiceResult } from '../../../service/service-result';
import ValidationError from "../../validation-error";
import EditField from '../../edit-field';
import { CancelTokenSource } from 'axios';

interface IParams {
   id: string;
}

interface IProps extends RouteComponentProps<IParams> {
}

interface IState {
    user?: IUser;
    isGetting: boolean;
    isSaving: boolean;
    errors?: IErrors;
    touched: boolean;
}

class UserEditInternal extends React.Component<IProps, IState> {
    svc: IUserService;
    getCancel?: CancelTokenSource;
    saveCancel?: CancelTokenSource;
    constructor(props: IProps) {
        super(props);
        this.state = {
            isGetting: false,
            isSaving: false,
            touched: false
        };
        this.svc = Service.user();
    }

    componentDidMount() {
        let id;
        if (this.props.match && this.props.match.params) {
            id = this.props.match.params.id;
        }
        if (id && id.length>0 && id !== "add") {
            console.log("componentDidMount id = "+id);
            this.startGetting();
            const cancellablePromise = this.svc.userGet(id);
            cancellablePromise.promise
                              .then( (res: IUserGetResult) => this.serviceGetCallback(res))
                              .catch( (err: any) => this.serviceGetError(err))
            if(this.getCancel) {
                this.getCancel.cancel();
            }
            this.getCancel = cancellablePromise.cancelControl;
        }
    }

    startGetting() {
        this.setState({isGetting: true});
    }

    stopGetting() {
        this.setState({isGetting: false});
    }

    serviceGetCallback(res: IUserGetResult) {
        console.log("servceGetCallback res=");
        console.dir(res);
        if(res.result === "OK") {
            return this.setState({
                user: {...res.payload},
                isGetting: false
            });
        }
    }

    serviceGetError(err: any) {
        console.log("serviceGetError err="+err);
        this.stopGetting();
    }

    onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const user = this.state.user || UserDefault;
        const errors = this.state.errors || {};
        delete errors.name;
        this.setState({
            user: {...user, name: e.target.value},
            errors: {...errors},
            touched: true
        });
    }

    onUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const user = this.state.user || UserDefault;
        const errors = this.state.errors || {};
        delete errors.username;
        this.setState({
            user: {...user, username: e.target.value},
            errors: {...errors},
            touched: true
        });
    }

    onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const user = this.state.user || UserDefault;
        const errors = this.state.errors || {};
        delete errors.password;
        this.setState({
            user: {...user, password: e.target.value},
            errors: {...errors},
            touched: true
        });
    }

    onPassword2Change(e: React.ChangeEvent<HTMLInputElement>) {
        const user = this.state.user || UserDefault;
        const errors = this.state.errors || {};
        delete errors.password2;
        this.setState({
            user: {...user, password2: e.target.value},
            errors: {...errors},
            touched: true
        });
    }

    onCancel() {
        this.props.history.push("/users");
    }

    startSaving() {
        this.setState({
            isSaving: true
        });
    }

    stopSaving() {
        this.setState({
            isSaving: false
        });
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        console.log("onSubmit");
        e.preventDefault();
        this.startSaving();
        const user = this.state.user || UserDefault;
        if(user) {
            console.dir(user);
            const cancellablePromise = this.svc.userSave(user);
            cancellablePromise.promise
                              .then( (res: IServiceResult) => this.serviceSaveCallback(res))
                              .catch( (err: any) => this.serviceSaveError(err));
            if(this.saveCancel) {
                this.saveCancel.cancel();
            }
            this.saveCancel = cancellablePromise.cancelControl;
        }
    }

    serviceSaveCallback(res: IServiceResult) {
        console.log("serviceSaveCallback");
        if(res.result === "OK") {
            return this.props.history.push("/users");
        }
        return this.setState({
                               errors: res.errors,
                               isSaving: false
                             });
    }

    serviceSaveError(error: any) {
        console.log("serviceSaveError error="+error);
        return this.setState({
                               errors: {error},
                               isSaving: false
                            });
    }

    public componentWillUnmount() {
        if(this.getCancel) {
            this.getCancel.cancel();
        }
        if(this.saveCancel) {
            this.saveCancel.cancel();
        }

    }

    public render() {
        if(this.state.isGetting || this.state.isSaving) {
            return <Loading />;
        }
        const user = this.state.user || UserDefault;
        const name = user.name || "";
        const username = user.username || "";
        const password = user.password || "";
        const password2 = user.password2 || "";

        const errors = this.state.errors || {};
        const nameError = errors.name || "";
        const usernameError = errors.username || "";
        const passwordError = errors.password || "";
        const password2Error = errors.password2 || "";
        const error = errors.error || "";
        

        return (
            <div className="container col-md-3">
                <h2>User Edit</h2>
                <form onSubmit={ (e:React.FormEvent<HTMLFormElement>) =>
                                         this.onSubmit(e) 
                               }
                >
                    <EditField label="Name" name="name" value={name} 
                               error={nameError}
                               onChange={ (e) => this.onNameChange(e) }
                    />
                    <EditField label="Username" name="username" value={username}
                               error={usernameError}
                               onChange={ (e) => this.onUsernameChange(e) }
                    />
                    <EditField label="Password" name="password" value={password}
                               error={passwordError} type="password"
                               onChange={ (e) => this.onPasswordChange(e) }
                    />
                    <EditField label="Confirm Password" name="password2" value={password2}
                               error={password2Error} type="password"
                               onChange={ (e) => this.onPassword2Change(e) }
                    />
                    <div>
                        <ValidationError name="error" error={error} />
                    </div>
                    <hr />
                    <div className="form-group-control">
                       <button type="submit">Save</button>
                       <button type="submit" onClick={ () => this.onCancel() }>
                           Cancel
                       </button>
                    </div>
                </form>
            </div>
        );
    }
}

const UserEdit = withRouter(UserEditInternal);

export default UserEdit;
