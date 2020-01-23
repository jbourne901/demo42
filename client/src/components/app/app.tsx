import React from "react";
import Home from "../home";
import {INotificationService} from "../../service/notification";
import Service from "../../service";

class App extends React.Component {
    private notification: INotificationService;

    constructor(props: any) {
        super(props);
        this.notification = Service.notification();
    }

    public render() {
        return (
            <Home /> 
         );     
    }
}

export default App;
