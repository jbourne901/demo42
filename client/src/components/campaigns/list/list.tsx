import React from 'react';
import {withLanguageListener, ILanguageProps } from '../../with-language-listener/with-language-listener';
import { ILanguageInfo } from '../../../model/language';

interface IProps extends ILanguageProps {    
}

interface IState {
    language?: ILanguageInfo;
}

class CampaignListInternal extends React.Component<IProps, IState> {
    private readonly LOCALIZATION_KEY="campaigns";

    constructor(props: IProps) {
        super(props);
        this.state = {

        };
    }

    public static getDerivedStateFromProps(props: IProps, state: IState) {
        return {
            language: props.language
        };
    }

    public render() {
        console.log("campaign list");
        const label = this.props.localization.getLocalization(this.LOCALIZATION_KEY, "pageheader") || "Campaigns";
        return (
            <div>
               <h2>{label}</h2>
            </div>      
        );
    }
}

const CampaignList = withLanguageListener(CampaignListInternal);

export default CampaignList;