import React from 'react';
import { ILocalizationService } from '../../service/localization';
import Service from "../../service";
import {IUniqueId, withUniqueId} from "../uniqueid"
import { ILanguageInfo } from '../../model/language';

interface IProps extends IUniqueId {
    WrappedComponent: any;    
}

interface IState {
    language?: ILanguageInfo;
}

export interface ILanguageProps {
    language: ILanguageInfo;
}

class LanguageListenerInternal extends React.Component<IProps, IState> {
    private svc: ILocalizationService;
    constructor(props: IProps) {
        super(props);        
        this.svc = Service.localization();
        this.state = {};
        console.log("LocalizationListenerInternal constructor ");
        console.dir(this.state);
    }

    public componentDidMount() {
        this.svc.registerLanguageListener(this.props.uniqueid, 
               (token?: number) => this.languageChanged(token) 
        );
    }

    public languageChanged(languageToken?: number) {
        const language = this.svc.getLanguage();
        this.setState({language});
    }

    public componentWillUnmount() {
        this.svc.unregisterLanguageListener(this.props.uniqueid);
    }

    public render() {
        console.log("LanguageListener state=");
        console.dir(this.state);
        console.log("props=");
        console.dir(this.props);
        const language = this.state.language;
        const WrappedComponent = this.props.WrappedComponent;
        return (
            <WrappedComponent {...this.props} language={language} />
        );                    
    }
}

const LanguageListener = withUniqueId(LanguageListenerInternal);

const withLanguageListener = (Wrapped: any) => (props: any) => {
    return (
        <LanguageListener {...props} WrappedComponent = {Wrapped} />
    )
}

export default withLanguageListener;