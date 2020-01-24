import React from "react";
import Home from "../home";
import {INotificationService} from "../../service/notification";
import Service from "../../service";
import { BrowserRouter } from "react-router-dom";
import { ILocalizationService } from "../../service/localization";
import Loading from "../loading";
import { CancelTokenSource } from "axios";

interface IProps {    
}

interface IState {
    isLoading: boolean;
}

class App extends React.Component<IProps, IState> {
    private readonly notification: INotificationService;
    private localization: ILocalizationService;
    private languageCancel?: CancelTokenSource;
    private localizationCancel?: CancelTokenSource;

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.notification = Service.notification();
        this.localization = Service.localization();
    }

    protected startLoading() {
        this.setState({isLoading: true});
    }

    protected stopLoading() {
        this.setState({isLoading: false});
    }

    public componentDidMount() {
        this.startLoading();
        const cancellableResponse1 = this.localization.reloadLanguages();
        cancellableResponse1.promise
                            .then( () => this.languageReloadCallback() )
                            .catch( () => this.languageReloadCallback() );
        if(this.languageCancel) {
            this.languageCancel.cancel();
        }
        this.languageCancel = cancellableResponse1.cancelControl;
    }

    protected languageReloadCallback() {
        const cancellableResponse2 = this.localization.reloadLocalizations();
        cancellableResponse2.promise
                            .then( () => this.stopLoading() )
                            .catch( () => this.stopLoading() );
        if(this.localizationCancel) {
            this.localizationCancel.cancel();
        }
        this.localizationCancel = cancellableResponse2.cancelControl;
    }

    public componentWillUnmount() {
        if(this.languageCancel) {
            this.languageCancel.cancel();
        }
        if(this.localizationCancel) {
            this.localizationCancel.cancel();
        }
    }

    public render() {
        if(this.state.isLoading) {
            return <Loading />;
        }

        return (            
            <BrowserRouter>
               <Home />
            </BrowserRouter>            
         );     
    }
}

export default App;
