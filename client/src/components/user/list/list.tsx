import React from "react";
import {withRouter, RouteComponentProps} from "react-router-dom";

import {IUserInfo} from "../../../model/user";
import Service from '../../../service';
import {IUserService, IUserListResult} from '../../../service/user';
import {IServiceResult} from "../../../service/service-result";
import Loading from "../../loading";
import "./list.css";

interface IProps extends RouteComponentProps {
}

interface IState {
    users: IUserInfo[];
    isLoading: boolean;
}

class UserListInternal extends React.Component<IProps, IState> {
    private readonly svc: IUserService;

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
        this.svc.userList()
            .then( (res: IUserListResult) => this.serviceListResult(res) )
            .catch( (err: any) => this.serviceError(err) );
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
            this.svc.userDelete(u.id)
                    .then( (res: IServiceResult) => this.serviceDeleteResult(res))
                    .catch( (err: any) => this.serviceError(err) );
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
                <td>
                    <button type="button" onClick={ () => this.onEdit(u)}>Edit</button>
                    <button type="button" onClick={ () => this.onDelete(u)}>Delete</button>
                </td>
            </tr>
        )
    }

    public render() {
        const users = this.state.users || [];
        if(this.state.isLoading) {
            return <Loading />;
        }
        return (
           <div>
              <h2>User List</h2>
              <div>
                  <button onClick={ () => this.onAdd() }>Add</button>
              </div>
              <hr />
              <table className="user-list-table">
                  <thead>
                      <tr>
                          <td>Name</td>
                          <td>Username</td>
                          <td>Actions</td>
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
