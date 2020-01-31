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
    localization: ILocalizationService;
}

class LanguageListenerInternal extends React.Component<IProps, IState> {
    private svc: ILocalizationService;
    constructor(props: IProps) {
        super(props);        
        this.svc = Service.localization();
        this.state = {};
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
        const language = this.state.language;
        const WrappedComponent = this.props.WrappedComponent;
        return (
            <WrappedComponent {...this.props} language={language} localization={this.svc} />
        );                    
    }
}

const LanguageListener = withUniqueId(LanguageListenerInternal);

export const withLanguageListener = (Wrapped: any) => (props: any) => {
    return (
        <LanguageListener {...props} WrappedComponent = {Wrapped} />
    )
}
