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
import { IAuthService } from "../../service/auth";
import Language from "../language";
import { CancelTokenSource } from "axios";
import {withLanguageListener, ILanguageProps } from "../with-language-listener";
import { ILanguageInfo } from "../../model/language";
import { ILocalizationLocal } from "../../service/localization";
import ScriptFlowEdit from "../scriptflow/scriptflow-edit";

interface IProps extends RouteComponentProps, ILanguageProps {
    onLogout(): void;
}

interface IState {
    isLoading: boolean;
    pages: IEPageInfo[];
    language?: ILanguageInfo;
}

class PageManagerInternal extends React.Component<IProps, IState> {
    private static readonly LOCALIZATION_KEY = "navbarmenu";
    private epageSvc: IEPageService;
    private epageListCancel?: CancelTokenSource;
    private authSvc: IAuthService;
    private local: ILocalizationLocal;

    constructor(props: IProps) {
        super(props);
        console.log("PageManager");
        this.epageSvc = Service.epage();
        this.authSvc = Service.auth();
        this.local = Service.localization().local(PageManagerInternal.LOCALIZATION_KEY);
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
        console.log("PageManager - startLoading");
        this.setState({isLoading: true});
    }

    stopLoading() {
        console.log("PageManager - stopLoading");
        this.setState({isLoading: false});
    }

    refreshPages() {
        this.startLoading();
        const cancellablePromise = this.epageSvc.epageList();
        cancellablePromise.promise
                          .then( (res: IEPageListResult) => this.serviceGetCallback(res) )
                          .catch( (err:any) => this.serviceGetError(err) );
        if(this.epageListCancel) {
            this.epageListCancel.cancel();
        }
        this.epageListCancel = cancellablePromise.cancelControl;
    }

    serviceGetCallback(res: IEPageListResult) {
        console.log("PageManager - serviceGetCallback");
        if(res.result === "OK") {
            this.setState({isLoading: false, pages: res.payload});
            return;
        }
        this.stopLoading();
    }

    serviceGetError(err: any) {
        console.error("PageManager - serviceGetError err="+err.toString());
        console.dir(err);
        if(err.toString()==="Cancel") {            
            return;
        }
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

    public componentWillUnmount() {
        console.log("PageManager - componentWillUnmount");
        if(this.epageListCancel) {
            this.epageListCancel.cancel();
        }
    }

    public render() {
        console.log("PageManager - render()");
        const isLoggedIn = this.authSvc.isLoggedIn();
        console.log("PageManager.render - isLoggedIn="+isLoggedIn);
        if(!isLoggedIn ) {
            return <Redirect to="/" />;
        }
        console.dir(this.props);
        const authName = this.authSvc.getAuthName() || "";
        const loggedInAsLabel = (this.local("loggedinas") || "Logged in as") + ": " + authName;
        const usersLabel = this.local("users");
        const campaignsLabel = this.local("campaigns");
        const logoutLabel = this.local("logout");

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
                             <NavLink to="/users"> {usersLabel} </NavLink>
                         </li>
                         <li> 
                             <NavLink to="/campaigns"> {campaignsLabel} </NavLink> 
                         </li>
                         <li> 
                             <NavLink to="/dragdrop"> DragDrop </NavLink> 
                         </li>
                      </ul>
                      <ul className="nav navbar-nav">
                      {listpages.map( (p: IEPageInfo) => this.formatPage(p) )}
                      </ul>                      
                      <ul className="nav navbar-nav navbar-right">
                        <Language />
                        <li className="nav-item">
                           <a href="/#">
                               <span>{loggedInAsLabel}</span>
                           </a>
                        </li>
                        <li className="nav-item">
                           <a href="/#" onClick={ (e: React.MouseEvent<HTMLAnchorElement>) => this.onLogout(e) } 
                                        className="btn btn-link"
                           >
                              <span className="glyphicon glyphicon-log-in"></span>
                                 {logoutLabel}
                           </a>
                        </li>
                      </ul>
                   </div>
                </nav>
                <Switch>
                   <PrivateRoute exact path="/users">
                      <UserList />
                   </PrivateRoute>
                   <PrivateRoute exact path="/users/add">
                      <UserEdit />
                   </PrivateRoute>
                   <PrivateRoute exact path="/users/:id">
                      <UserEdit />
                   </PrivateRoute>
                   <PrivateRoute exact path="/campaigns">
                      <CampaignList />
                   </PrivateRoute>
                   <PrivateRoute exact path="/dragdrop">
                      <ScriptFlowEdit />
                   </PrivateRoute>
                   <PrivateRoute exact path="/epage/:epageid/list">
                      <EPageList />
                   </PrivateRoute>
                   <PrivateRoute exact path="/epage/:epageid/edit/:entityid">
                      <EPageEdit />
                   </PrivateRoute>
                   <PrivateRoute exact path="/epage/:epageid/edit">
                      <EPageEdit />
                   </PrivateRoute>
                   <PrivateRoute>
                       <LandingPage />
                   </PrivateRoute>
                </Switch>
            </BrowserRouter>
        );
    }
}

const tmp = withLanguageListener(PageManagerInternal);
const PageManager = withRouter(tmp);

export default PageManager;