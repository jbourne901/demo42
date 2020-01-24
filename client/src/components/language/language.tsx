import React from 'react';
import { ILocalizationService } from '../../service/localization';
import Service from "../../service";
import { ILanguage } from '../../model/language';
import Refresher from '../refresher';
import { withUniqueId, IUniqueId } from '../uniqueid';

interface IProps extends IUniqueId {

}

interface IState {
    needrefresh: boolean;
}

class LanguageInternal extends React.Component<IProps, IState> {
    private svc: ILocalizationService;

    constructor(props: any) {
        super(props);
        this.svc = Service.localization();
        this.state = { needrefresh: false };
    }

    componentDidMount() {
        this.svc.registerLanguageListener( this.props.uniqueid, () => this.languageChanged() );
    }

    componentWillUnmount() {
        this.svc.unregisterLanguageListener( this.props.uniqueid );
    }

    public languageChanged() {
        console.log("languageChanged");
        this.setState({needrefresh: true});
    }

    protected refreshDone() {
        this.setState({needrefresh: false});
    }

    protected changeLanguage(e: React.MouseEvent<HTMLAnchorElement>, lang: string) {
        e.preventDefault();
        console.log("changeLanguage");
        this.svc.setLanguage(lang);
    }

    protected formatLanguage(lang: ILanguage) {
        return (
            <li key={lang.language}>
               <a href="/#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => 
                         this.changeLanguage(e, lang.language) }
               >
                   {lang.name}
               </a>
            </li>
        );        
    }

    public render() {
        const currentLang = this.svc.getLanguage();
        console.log("language - render");
        const languages = this.svc.languages();
        let currentLangName = currentLang;
        const ndx = languages.findIndex( (lang: ILanguage) => lang.language === currentLang);
        if(ndx>=0) {
            currentLangName = languages[ndx].name;
        }

        return (
            <React.Fragment>
                <Refresher refresh = { () => this.refreshDone() }/>
                    <li className="dropdown nav-item">
                       <a href="/#" className="dropdown-toggle" data-toggle="dropdown" 
                          role="button" aria-haspopup="true" aria-expanded="false"
                       >
                          {currentLangName}
                          <span className="caret"></span>
                       </a>
                       <ul className="dropdown-menu">
                           {languages.map( (lang: ILanguage) => this.formatLanguage(lang))}
                       </ul>
                    </li>
            </React.Fragment>
        );
    }
}

const Language = withUniqueId(LanguageInternal);

export default Language;
