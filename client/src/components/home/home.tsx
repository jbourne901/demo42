import React from "react";
import { Switch, BrowserRouter, Route,  RouteComponentProps, withRouter } from "react-router-dom";

import PageManager from "../page-manager";
import PrivateRoute from "../private-route";
import Login from "../login";
import Service from "../../service";
import { IAuthService } from "../../service/auth";

interface IProps extends RouteComponentProps {

}

interface IState {
    isLoggedIn: boolean;
}

class HomeInternal extends React.Component<IProps, IState> {
    private svc: IAuthService;
    constructor(props: IProps) {
        super(props);

        this.state = {
            isLoggedIn: false
        };

        this.svc = Service.auth();
    }

    componentDidMount() {
        const isLoggedIn = this.svc.isLoggedIn();
        this.setState({isLoggedIn});
    }


    onLogout() {
        this.svc.logout();
        console.log("onLogout - isLoggedIn = "+this.svc.isLoggedIn());
        this.setState({isLoggedIn: false});
    }

    public render() {
        const isLoggedIn = this.svc.isLoggedIn();
        console.log("Home render isLoggedIn="+isLoggedIn);

        return (
            <BrowserRouter>
               <Switch>
                   <Route path="/login" >
                       <Login />
                   </Route>
                   <PrivateRoute>
                      <PageManager 
                        onLogout = { () => this.onLogout() } 
                      />
                   </PrivateRoute>
               </Switch>
            </BrowserRouter>
        );
    }
}

const Home = withRouter(HomeInternal);

export default Home;
