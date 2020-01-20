import React from "react";
import { NavLink, Switch, withRouter, BrowserRouter, RouteComponentProps, Redirect } from "react-router-dom";

import PrivateRoute from "../private-route";
import LandingPage from "../landing";
import CampaignList from "../campaigns/list";
import UserList from "../user/list";
import UserEdit from "../user/edit";


interface IProps extends RouteComponentProps {
    onLogout(): void;
    isLoggedIn: boolean;
    authName: string;
}

class PageManagerInternal extends React.Component<IProps> {

    onLogout(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        this.props.onLogout();
    }

    public render() {
        console.log("PageManager - render()");
        const isLoggedIn = this.props.isLoggedIn;
        console.log("PageManager.render - isLoggedIn="+isLoggedIn);
        if(!isLoggedIn ) {
            return <Redirect to="/" />;
        }
        console.dir(this.props);
        const authName = this.props.authName || "";
        const logoutMsg = "Logged in as: " + authName;
        return (
            <BrowserRouter>
                <nav className="navbar navbar-inverse navbar-expand-lg">
                   <div className="container-fluid">
                      <div className="navbar-header">
                         <a className="navbar-brand" href="/#">SOLO</a>
                      </div>
                      <ul className="nav navbar-nav">
                         <li> <NavLink to="/users"> Users </NavLink> </li>
                         <li> <NavLink to="/campaigns"> Campaigns </NavLink> </li>
                      </ul>
                      <ul className="nav navbar-nav navbar-right">
                        <li className="nav-item">
                           <a href="/#">
                               <span>{logoutMsg}</span>
                           </a>
                        </li>
                        <li className="nav-item">
                           <a href="/#" onClick={ (e: React.MouseEvent<HTMLAnchorElement>) => this.onLogout(e) } 
                                        className="btn btn-link"
                           >
                              <span className="glyphicon glyphicon-log-in"></span>
                                 Logout
                           </a>
                        </li>
                      </ul>
                   </div>
                </nav>
                <Switch>
                   <PrivateRoute exact path="/users" isLoggedIn={isLoggedIn}>
                      <UserList />
                   </PrivateRoute>
                   <PrivateRoute exact path="/users/add" isLoggedIn={isLoggedIn}>
                      <UserEdit />
                   </PrivateRoute>
                   <PrivateRoute path="/users/:userId" isLoggedIn={isLoggedIn}>
                      <UserEdit />
                   </PrivateRoute>
                   <PrivateRoute path="/campaigns" isLoggedIn={isLoggedIn}>
                      <CampaignList />
                   </PrivateRoute>
                   <PrivateRoute isLoggedIn={isLoggedIn}>
                       <LandingPage />
                   </PrivateRoute>
                </Switch>
            </BrowserRouter>
        );
    }
}

const PageManager = withRouter(PageManagerInternal);

export default PageManager;