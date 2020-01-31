import React from 'react';
import { IBlockTemplate } from '../../model/flowchart/template';
import {BlockUtil} from "../../model/flowchart/block";
import FlowchartEdit from "../flowchart/edit";
import IFlowchart from "../../model/flowchart";

interface IProps {

}

interface IState {
    templates: IBlockTemplate[];
}

class ScriptFlowEditInternal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            templates: [ BlockUtil.template0("Schedule"),
                         BlockUtil.template0("Menu"),
                         BlockUtil.template0("Queue"),
                      ]
        };
    }

    public componentDidMount() {
    }

    protected flowChanged(names: string, value: IFlowchart) {
console.log("flowChanged");
console.dir(value);
    }

    public render() {
        const name="test";
        const value: IFlowchart = [];
        return (
           <FlowchartEdit templates={this.state.templates} name="test" label="test" 
             value={value} error="" 
             onFlowChange = {(val: IFlowchart) => this.flowChanged(name, val) }
           />
        );
    }
}

const ScriptFlowEdit = ScriptFlowEditInternal;

export default ScriptFlowEdit;