import React from 'react';
import {withRouter, RouteComponentProps} from "react-router-dom";
import Loading from '../../loading';
import EPageIntEdit from "./intedit";

interface IParams {
    epageid: string;
    entityid?: string;
}

interface IProps extends RouteComponentProps<IParams> {    
}

interface IState {
    needRefresh: boolean;
    epageid?: string;
    entityid?: string;
}

class EPageEditInternal extends React.Component<IProps, IState> {

    public static getDerivedStateFromProps(props: IProps, state: IState) {
        console.log("EPageEditInternal - getDerivedStateFromProps props=");
        console.dir(props);
        console.log("EPageEditInternal - getDerivedStateFromProps state=");
        console.dir(state);

        if(props.match && props.match && props.match.params) {
            const epageid = props.match.params.epageid;
            const entityid = props.match.params.entityid;
            const changed1 = (epageid && epageid.length>0 && epageid !== state.epageid);
            const changed2 = (entityid && entityid.length>0 && entityid !== state.entityid);
            if (changed1 || changed2) {
                console.log("EPageEditInternal - getDerivedStateFromProps - needrefresh=true epageid=" + epageid + " entityid = " + entityid);
                return {
                         epageid,
                         entityid,
                         needRefresh: true
                       };                    
            }
        }
        return null;    
    }

    constructor(props: IProps) {
        super(props);
        console.log("EPageEdit - constructor - props=");
        console.dir(props);

        this.state = {
            needRefresh: false
        };
    }

    public render() {
        console.log("EpageEdit - render");
        if(!this.state.epageid) {
            return <Loading />;
        }
        return (
            <EPageIntEdit epageid={this.state.epageid} entityid={this.state.entityid} />          
        );
    }
 
}

const EPageEdit = withRouter(EPageEditInternal);

export default EPageEdit;