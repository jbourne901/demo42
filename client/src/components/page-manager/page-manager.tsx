import React from "react";
import { NavLink, Switch, withRouter, BrowserRouter, RouteComponentProps, Redirect } from "react-router-dom";

import PrivateRoute from "../private-route";
import LandingPage from "../landing";
import CampaignList from "../campaigns/list";
import UserList from "../user/list";
import UserEdit from "../user/edit";
import {IEPageInfo} from "../../model/epage";
import { IEPageService, IEPageListResult } from "../../service/epage";
import Service from "../../service";
import EPageList from "../epage/list";
import EPageEdit from "../epage/edit";

interface IProps extends RouteComponentProps {
    onLogout(): void;
    isLoggedIn: boolean;
    authName: string;
}

interface IState {
    isLoading: boolean;
    pages: IEPageInfo[];
}

class PageManagerInternal extends React.Component<IProps, IState> {
    svc: IEPageService;

    constructor(props: IProps) {
        super(props);
        this.svc = Service.epage();
        this.state = {
            isLoading: false,
            pages: []
        };
    }

    onLogout(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        this.props.onLogout();
    }

    componentDidMount() {
        this.refreshPages();
    }

    startLoading() {
        this.setState({isLoading: true});
    }

    stopLoading() {
        this.setState({isLoading: false});
    }

    refreshPages() {
        this.startLoading();
        this.svc.epageList()
            .then( (res: IEPageListResult) => this.serviceGetCallback(res) )
            .catch( (err:any) => this.serviceGetError(err) );
    }

    serviceGetCallback(res: IEPageListResult) {
        if(res.result === "OK") {
            this.setState({isLoading: false, pages: res.payload});
            return;
        }
        this.stopLoading();
    }

    serviceGetError(err: any) {
        this.stopLoading();
    }

    formatPage(p: IEPageInfo) {
        let type = p.type || "list";
        const url = "/epage/" + p.id + "/" + type;
        return (
                <li className="nav-item" key={p.id}>                    
                    <NavLink to={url}>{p.label}</NavLink>
                </li>
        );
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
        const pages = this.state.pages || [];
        const listpages = pages.filter( (p) => p.type === "list" );
        return (
            <BrowserRouter>
                <nav className="navbar navbar-inverse navbar-expand-lg">
                   <div className="container-fluid">
                      <div className="navbar-header">
                         <a className="navbar-brand" href="/#">SOLO</a>
                      </div>
                      <ul className="nav navbar-nav">
                         <li> 
                             <NavLink to="/users"> Users </NavLink>
                         </li>
                         <li> 
                             <NavLink to="/campaigns"> Campaigns </NavLink> 
                         </li>
                      </ul>
                      <ul className="nav navbar-nav">
                      {listpages.map( (p: IEPageInfo) => this.formatPage(p) )}
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
                   <PrivateRoute exact path="/users/:id" isLoggedIn={isLoggedIn}>
                      <UserEdit />
                   </PrivateRoute>
                   <PrivateRoute exact path="/campaigns" isLoggedIn={isLoggedIn}>
                      <CampaignList />
                   </PrivateRoute>
                   <PrivateRoute exact path="/epage/:epageid/list" isLoggedIn={isLoggedIn}>
                      <EPageList />
                   </PrivateRoute>
                   <PrivateRoute exact path="/epage/:epageid/edit/:entityid" isLoggedIn={isLoggedIn}>
                      <EPageEdit />
                   </PrivateRoute>
                   <PrivateRoute exact path="/epage/:epageid/edit" isLoggedIn={isLoggedIn}>
                      <EPageEdit />
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