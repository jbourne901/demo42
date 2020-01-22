import React from 'react';
import {withRouter, RouteComponentProps} from "react-router-dom";
import EPageIntList from "./intlist";
import Loading from "../../loading";

interface IParam {
    epageid: string;
}
interface IProps extends RouteComponentProps <IParam>{
}

interface IState {
    needRefresh: boolean;  // just a bogus property to kick off re render()
    epageid?: string;
}

class EPageListInternal extends React.Component<IProps, IState> {

    public static getDerivedStateFromProps(props: IProps, state: IState) {
        console.log("EPageList - getDerivedStateFromProps props=");
        console.dir(props);
        if(props.match && props.match && props.match.params) {
            const epageid = props.match.params.epageid;
            if(epageid && epageid.length>0 && epageid !== state.epageid) {
                console.log("EPageList - getDerivedStateFromProps - needrefresh=true epageid="+epageid );
                return {
                         epageid,
                         needRefresh: true
                       };                    
            }
        }
        return null;    
    }

    constructor(props: IProps) {
        super(props);
        this.state = {
            needRefresh: false
        };
    }
    public render() {
        if(!this.state.epageid) {
            return <Loading />
        }
        return (
            <EPageIntList epageid={this.state.epageid} />
        );
    }    
}

const EPageList = withRouter(EPageListInternal);

export default EPageList;