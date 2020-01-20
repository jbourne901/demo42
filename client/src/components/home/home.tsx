import React from "react";
import { Switch, BrowserRouter, Route,  Redirect } from "react-router-dom";

import PageManager from "../page-manager";
import PrivateRoute from "../private-route";
import Login from "../login";
import Service from "../../service";
import { IAuthService } from "../../service/auth";

interface IProps {

}

interface IState {
    isLoggedIn: boolean;
    authName?: string;
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

    onLogin() {
        const isLoggedIn = this.svc.isLoggedIn();
        const authName = this.svc.getAuthName();
        this.setState({isLoggedIn, authName});
    }

    onLogout() {
        this.svc.logout()
            .then( () => { 
                           console.log("onLogout - isLoggedIn = "+this.svc.isLoggedIn());
                           this.setState({isLoggedIn: false});
                         }                           
            );        
    }

    public render() {
        const isLoggedIn = this.state.isLoggedIn;
        const authName = this.state.authName || "";
        console.log("Home render isLoggedIn="+isLoggedIn);

        return (
            <BrowserRouter>
               {this.state.isLoggedIn && <Redirect to="/" />}
               <Switch>
                   <Route path="/login" >
                       <Login onLogin = { () => this.onLogin() } />
                   </Route>
                   <PrivateRoute isLoggedIn={isLoggedIn} >
                      <PageManager 
                        isLoggedIn={isLoggedIn}
                        authName={authName}
                        onLogout = { () => this.onLogout() } 
                      />
                   </PrivateRoute>
               </Switch>
            </BrowserRouter>
        );
    }
}

const Home = HomeInternal;

export default Home;
