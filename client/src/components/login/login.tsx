import React from 'react';
import {withRouter, Redirect, RouteComponentProps} from "react-router-dom";
import IErrors from '../../model/errors';
import Loading from '../loading';
import EditField from "../edit-field";
import ValidationError from '../validation-error';
import {ILogin, LoginDefault} from "../../model/login";
import { IAuthService } from "../../service/auth";
import Service from "../../service";
import {ILocalizationService, ILocalizationLocal} from "../../service/localization";
import Language from "../language";
import { CancelTokenSource } from 'axios';
import {IServiceResult} from "../../service/service-result"
import withLanguageListener, { ILanguageProps } from '../with-language-listener/with-language-listener';
import { ILanguageInfo } from '../../model/language';

interface IProps extends RouteComponentProps, ILanguageProps {
}

interface IState {
    errors: IErrors;
    isLoading: boolean;
    touched: boolean;
    login?: ILogin,
    isLoggedIn: boolean;
    language?: ILanguageInfo;
}

class LoginInternal extends React.Component<IProps, IState> {
    authSvc: IAuthService;
    authSvcCancel?: CancelTokenSource;
    localizationSvc: ILocalizationService;
    local: ILocalizationLocal;

    private static readonly LOCALIZATION_KEY = "loginform";

    public static getDerivedStateFromProps(props: IProps, state: IState) {
        return {
            language: props.language
        };
    }

    constructor(props: IProps) {
        super(props);
        this.authSvc = Service.auth();

        this.localizationSvc = Service.localization();
        this.local = this.localizationSvc.local(LoginInternal.LOCALIZATION_KEY);

        this.state = {
            isLoading: false,
            errors: {},
            touched: false,
            isLoggedIn: false,
            language: props.language
        };
    }

    public componentWillUnmount() {
        if(this.authSvcCancel) {
            this.authSvcCancel.cancel();
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

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.startLoading();
        const login = this.state.login || LoginDefault;
        const cancellablePromise = this.authSvc.login(login);
        cancellablePromise.promise
                          .then( (res: IServiceResult) => this.serviceCallback(res) )
                          .catch( (err: any) => this.serviceError(err) );
        if(this.authSvcCancel) {
            this.authSvcCancel.cancel();
        }
        this.authSvcCancel = cancellablePromise.cancelControl;
    }

    serviceCallback(res: IServiceResult) {
        console.log("serviceCallback res=");
        console.dir(res);
        if(res && res.result === "OK") {
            console.log("serviceCallback isLoggedIn = "+this.authSvc.isLoggedIn());
            this.setState({
                isLoading: false,
                isLoggedIn: true                
            })
            return;
        }
        this.setState({
            isLoading: false,
            errors: res.errors
        });
    }

    serviceError(res: any) {
        console.log("serviceError error=");
        console.dir(res);
        let errors={error: res};
        if(res && res.errors) {
            errors=res.errors;
        }
        return this.setState({errors});
    }

    onUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const login = {...(this.state.login || LoginDefault) };
        login.username = e.target.value;
        const errors = {...(this.state.errors || {} ) };
        delete errors.username;
        this.setState({
            touched: true,
            login,
            errors
        });
    }

    onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const login = {...(this.state.login || LoginDefault) };
        login.password = e.target.value;
        const errors = {...(this.state.errors || {} ) };
        delete errors.password;
        this.setState({
            touched: true,
            login,
            errors
        });
    }


    public render() {
        if(this.state.isLoading) {
            console.log("login form - Loading");
            return (<Loading />);
        }
        if(this.state.isLoggedIn) {
            return <Redirect to="/" />;
        }
        const login = this.state.login || LoginDefault;
        const username = login.username || "";
        const password = login.password || "";

        const errors = this.state.errors || {};
        const usernameError = errors.username || "";
        const passwordError = errors.password || "";
        const error = errors.error || "";
        
        const pageheader = this.local("pageheader") || "Login";
        const label_username = this.local("fieldlabel_username") || "Username";
        const label_password = this.local("fieldlabel_password") || "Password";
        const buttonlabel_login = this.local("buttonlabel_login") || "Login";
        return (
            <div className="container">                
                <nav className="navbar navbar-inverse navbar-expand-lg">
                   <div className="container-fluid">
                      <div className="navbar-header">
                         <a className="navbar-brand" href="/#">SOLO</a>
                      </div>
                      <ul className="nav navbar-nav navbar-right">
                        <Language />
                      </ul>
                   </div>
                </nav>
                <h2>{pageheader}</h2>
                <form className="col-sm-6"
                    onSubmit={ (e: React.FormEvent<HTMLFormElement>) => this.onSubmit(e)} >
                    <EditField label={label_username} name="username" value={username}
                               error={usernameError}
                               onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                          this.onUsernameChange(e) 
                                        }
                    />

                    <EditField label={label_password} name="password" value={password}
                               error={passwordError} type="password"
                               onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                          this.onPasswordChange(e) 
                                        }
                    />
                    <ValidationError name="error" error={error} />
                    <hr />
                    <div className="form-control-group">
                        <button type="submit">{buttonlabel_login}</button>
                    </div>
                </form>
            </div>
        )
    }
}

const tmp = withLanguageListener(LoginInternal);
const Login = withRouter(tmp);

export default Login;