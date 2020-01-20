import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface IPrivateRouteProps extends RouteProps {
    isLoggedIn: boolean;
}

const PrivateRouteInternal: React.FC<IPrivateRouteProps> = (props) => {
    console.log("PrivateRoute isLoggedIn="+props.isLoggedIn);
    if(props.isLoggedIn) {
        return (
            <Route {...props} />
        );
     }
     console.log("PrivateRoute redirecting to /login");
     return ( <Redirect to="/login" />);
};

const PrivateRoute = PrivateRouteInternal

export default PrivateRoute;
