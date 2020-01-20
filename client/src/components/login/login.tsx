import React from 'react';
import {withRouter, RouteComponentProps} from "react-router-dom";
import IErrors from '../../model/errors';
import Loading from '../loading';
import EditField from "../edit-field";
import ValidationError from '../validation-error';
import {ILogin, LoginDefault} from "../../model/login";
import { IAuthService, IAuthInfoServiceResult } from '../../service/auth';
import Service from "../../service";

interface IProps extends RouteComponentProps {
    onLogin(): void;
}

interface IState {
    errors: IErrors;
    isLoading: boolean;
    touched: boolean;
    login?: ILogin,
}

class LoginInternal extends React.Component<IProps, IState> {
    svc: IAuthService;
    constructor(props: IProps) {
        super(props);
        this.svc = Service.auth();
        this.state = {
            isLoading: false,
            errors: {},
            touched: false
        };
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
        this.svc.login(login)
            .then( (res: IAuthInfoServiceResult) => this.serviceCallback(res) )
            .catch( (err) => this.serviceError(err) );
    }

    serviceCallback(res: IAuthInfoServiceResult) {
        console.log("serviceCallback res=");
        console.dir(res);
        if(res && res.result === "OK") {
            console.log("serviceCallback isLoggedIn = "+this.svc.isLoggedIn());
            this.props.onLogin();
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
            return (<Loading />);
        }        
        const login = this.state.login || LoginDefault;
        const username = login.username || "";
        const password = login.password || "";

        const errors = this.state.errors || {};
        const usernameError = errors.username || "";
        const passwordError = errors.password || "";
        const error = errors.error || "";

        return (
            <div>
                <h2>Login</h2>
                <form onSubmit={ (e: React.FormEvent<HTMLFormElement>) => this.onSubmit(e)} >
                    <EditField label="Username" name="username" value={username}
                               error={usernameError}
                               onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                          this.onUsernameChange(e) 
                                        }
                    />

                    <EditField label="Password" name="password" value={password}
                               error={passwordError} type="password"
                               onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                          this.onPasswordChange(e) 
                                        }
                    />
                    <ValidationError name="error" error={error} />
                    <hr />
                    <div className="form-control-group">
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        )
    }
}

const Login = withRouter(LoginInternal);

export default Login;