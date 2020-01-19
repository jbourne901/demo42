import React from "react";
import {BrowserRouter, Route, Link, Switch} from "react-router-dom";
import UserList from "../user/list";
import UserEdit from "../user/edit";

const App = () => {
    return (        
        <BrowserRouter>           
           <div>Hello</div> 
           <Link to="/users">Users</Link>
           <Link to="/campaigns">Campaigns</Link>
           <Switch>
               <Route path="/users/:userId" component={UserEdit} />
               <Route path="/users/add" component={UserEdit} />
               <Route path="/users" component={UserList} />
           </Switch>
        </BrowserRouter>       
    );
}

export default App;
