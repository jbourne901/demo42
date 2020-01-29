import React from 'react';
import { IBlockTemplate } from '../../model/flowchart/template';
import {template0} from "../../model/flowchart/template";
import FlowchartEdit from "../flowchart/edit";

interface IProps {

}

interface IState {
    templates: IBlockTemplate[];
}

class ScriptFlowEditInternal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            templates: [ template0("Schedule"),
                         template0("Menu"),
                         template0("Queue"),
                      ]
        };
    }

    public componentDidMount() {
    }

    public render() {
        return (
           <FlowchartEdit templates={this.state.templates} />
        );
    }
}

const ScriptFlowEdit = ScriptFlowEditInternal;

export default ScriptFlowEdit;