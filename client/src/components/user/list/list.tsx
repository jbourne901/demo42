import React from "react";
import {withRouter, RouteComponentProps} from "react-router-dom";

import {IUserInfo} from "../../../model/user";
import Service from '../../../service';
import {IUserService, IUserListResult} from '../../../service/user';
import {IServiceResult} from "../../../service/service-result";
import Loading from "../../loading";
import "./list.css";
import { CancelTokenSource } from "axios";

interface IProps extends RouteComponentProps {
}

interface IState {
    users: IUserInfo[];
    isLoading: boolean;
}

class UserListInternal extends React.Component<IProps, IState> {
    private readonly svc: IUserService;
    private listCancel?: CancelTokenSource;
    private deleteCancel?: CancelTokenSource;

    constructor(props: IProps) {
        super(props);
        this.svc = Service.user();
        this.state = {
            users: [],
            isLoading: false
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    startLoading() {
        this.setState({isLoading: true});
    }

    stopLoading() {
        this.setState({isLoading: false});
    }

    refreshList() {
        this.startLoading();
        const cancellablePromise = this.svc.userList();
        cancellablePromise.promise
                          .then( (res: IUserListResult) => this.serviceListResult(res) )
                          .catch( (err: any) => this.serviceError(err) );
        if(this.listCancel) {
            this.listCancel.cancel();
        }
        this.listCancel = cancellablePromise.cancelControl;
    }

    serviceListResult(res: IUserListResult) {
        if(res && res.result==="OK") {
            console.log("serviceListResult");
            console.dir(res);
            return this.setState({isLoading: false, users: res.payload});            
        }
        return this.serviceError("Error");
    }

    serviceError(err: any) {
        console.log("UserList: serviceError err="+err);
        this.stopLoading();
    }

    onEdit(u: IUserInfo) {
        this.props.history.push(`/users/${u.id}`);
    }

    onDelete(u: IUserInfo) {
        if(window.confirm(`You sure you want to delete user ${u.name}?`)) {
            this.startLoading();
            const cancellablePromise = this.svc.userDelete(u.id);
            cancellablePromise.promise
                              .then( (res: IServiceResult) => this.serviceDeleteResult(res))
                              .catch( (err: any) => this.serviceError(err) );
            if(this.deleteCancel) {
                this.deleteCancel.cancel();
            }
            this.deleteCancel = cancellablePromise.cancelControl;
        }
    }

    onAdd() {
        this.props.history.push("/users/add");
    }

    serviceDeleteResult(res: IServiceResult) {
        if(res && res.result==="OK") {
            return this.refreshList();
        }
        return this.serviceError("Error");
    }

    formatUser(u: IUserInfo) {
        return (
            <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <th className="centered">
                    <button type="button" onClick={ () => this.onEdit(u)}>Edit</button>
                    <button type="button" onClick={ () => this.onDelete(u)}>Delete</button>
                </th>
            </tr>
        )
    }

    public componentWillUnmount() {
        if(this.listCancel) {
            this.listCancel.cancel();
        }
        if(this.deleteCancel) {
            this.deleteCancel.cancel();
        }
    }

    public render() {
        const users = this.state.users || [];
        if(this.state.isLoading) {
            return <Loading />;
        }
        return (
           <div className="container">
              <h2>User List</h2>
              <div>
                  <button onClick={ () => this.onAdd() }>Add</button>
              </div>
              <hr />
              <table className="table table-bordered table-responsive user-list-table">
                  <thead className="thead">
                      <tr>
                          <th className="col-md-2">Name</th>
                          <th className="col-md-2">Username</th>
                          <th className="col-md-1 centered">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {users.map( (u: IUserInfo) => this.formatUser(u))}
                  </tbody>
              </table>
           </div>
        );
    }
}

const UserList = withRouter(UserListInternal);

export default UserList;
