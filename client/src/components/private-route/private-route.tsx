import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import Service from "../../service";
import {IAuthService} from "../../service/auth";

interface IProps extends RouteProps {
}

class PrivateRouteInternal extends React.Component<IProps> {

    svc: IAuthService;

    constructor(props: IProps) {
        super(props)
        this.svc = Service.auth();
    }

    public render() {
        const isLoggedIn = this.svc.isLoggedIn();
        console.log("PrivateRoute isLoggedIn = "+isLoggedIn);
        if(isLoggedIn) {
           return (
                <Route {...this.props} />
           );
        }
        console.log("PrivateRoute redirecting to /login");
        return ( <Redirect to="/login" />);
    }
}

const PrivateRoute = PrivateRouteInternal;

export default PrivateRoute;
