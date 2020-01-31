import ILabelled from "./labelled";
import FlowchartUtil from "./util";
import ICoords from "./coords";
import {BlockUtil, IBlock} from "./block";
import {IHandle, parseHandle} from "../../model/handle";
import OrderedList from "../../framework/ordered-list";

export interface IPort extends ILabelled {
    connectedToId?: IHandle;
}

export interface IPortInfo extends ILabelled {
    connectedToId?: IHandle;
}

export class Ports extends OrderedList<IPort> {
    
}
export interface IPortVars {
    block: IBlock;
    pointedBlockId?: IHandle;
    selectedBlockId?: IHandle;
    port: IPort;
    portNo: number;
    pointedPortId?: IHandle; 
    selectedPortId?: IHandle;
    lastMousePos?: ICoords;
}

interface IPortElementProps {
    key: string;
    className: string;
}
interface IKnobPros extends IPortElementProps {
    knobPoints: string;
}

interface ITextProps extends IPortElementProps {
    textEndX: number;
    textBottomY: number;
    textWidth: number;
}

interface ITxtBorderProps extends IPortElementProps, ICoords {
    height: number;
}

interface IDragConnProps extends IPortElementProps {
        id: string,
        x1: number;
        y1: number;
        x2: number;
        y2: number;
}

interface IConnLineProps extends IPortElementProps {
        id: string,
//        points: string;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
}

interface IConnRenderProps extends IPortElementProps {
    id: string,
    line1Props: IConnLineProps;
    line2Props: IConnLineProps;
    line3Props: IConnLineProps;
}


export interface IPortElementsProps {
    knobProps: IKnobPros;
    textProps: ITextProps;
    txtBorderProps: ITxtBorderProps;
    dragConnProps?: IDragConnProps;
    portKey: string;
};

export class PortUtil {
    public static readonly PORT_GAP_Y=6;
    public static readonly PORT_TEXT_HEIGHT=22;
    public static readonly KNOB_HEIGHT=12;
    public static readonly KNOB_WIDTH=12;
    public static readonly TXTBORDER_GAP_Y=6;
    public static readonly CONN_GAP_X=40;
    public static readonly CONN_ARROW_GAP_X=20;
    public static readonly CONN_GAP_Y=0;
    public static readonly PORT_TEXT_SYMBOL_WIDTH = 10;
    public static readonly TEXT_GAP_Y = 2;

    public static readonly PORT_Y_INTERVAL = PortUtil.PORT_TEXT_HEIGHT + PortUtil.PORT_GAP_Y;
    public static readonly TXTBORDER_HEIGHT = PortUtil.PORT_TEXT_HEIGHT - PortUtil.TXTBORDER_GAP_Y / 2;


    public static portKey(block: IBlock, p: IPort) {
        const delim = FlowchartUtil.FLD_DELIM;
        return "block" + delim + block.handle + delim + "port" + delim + p.handle;
    }

    public static knobKey(block: IBlock, p: IPort) {
        const delim = FlowchartUtil.FLD_DELIM;
        return PortUtil.portKey(block, p) + delim + "knob";
    }

    public static textKey(block: IBlock, p: IPort) {
        const delim = FlowchartUtil.FLD_DELIM;
        return PortUtil.portKey(block, p) + delim + "text";
    }

    public static txtBorderKey(block: IBlock, p: IPort) {
        const delim = FlowchartUtil.FLD_DELIM;
        return PortUtil.portKey(block, p) + delim + "txtborder";
    }

    public static dragConnKey(block: IBlock, p: IPort) {
        const delim = FlowchartUtil.FLD_DELIM;
        return PortUtil.portKey(block, p) + delim + "dragconn";
    }

    public static extractPortId(e: React.BaseSyntheticEvent) {
        const str=FlowchartUtil.extractTag(e, "port");
        if(str!==undefined && str.length>0) {
            return parseHandle(str);
        }
        return undefined;
    }
 

    protected static isPortPointed(p: IPort, b: IBlock, pointedBlockId?: IHandle, selectedBlockId?: IHandle, pointedPortId?: IHandle, selectedPortId?: IHandle) {
        return ( pointedBlockId === b.handle && pointedPortId === p.handle );
    }

    protected static isPortSelected(p: IPort, b: IBlock, pointedBlockId?: IHandle, selectedBlockId?: IHandle, pointedPortId?: IHandle, selectedPortId?: IHandle) {
        return ( selectedBlockId === b.handle && selectedPortId === p.handle );
    }

    public static knobClass(p: IPort, b: IBlock, pointedBlockId?: IHandle, selectedBlockId?: IHandle, pointedPortId?: IHandle, selectedPortId?: IHandle) {
       let clsName="block-port-knob";
       if( this.isPortPointed(p, b, pointedBlockId, selectedBlockId, pointedPortId, selectedPortId ) ) {
           clsName += " block-port-knob-pointed";
       }
       if( this.isPortSelected(p, b, pointedBlockId, selectedBlockId, pointedPortId, selectedPortId ) ) {
           clsName += " block-port-knob-selected";
       }
       return clsName;
    }

    public static textClass(p: IPort, b: IBlock, pointedBlockId?: IHandle, selectedBlockId?: IHandle, pointedPortId?: IHandle, selectedPortId?: IHandle) {
        let clsName="block-port-text";
        if( this.isPortPointed(p, b, pointedBlockId, selectedBlockId, pointedPortId, selectedPortId ) ) {
            clsName += " block-port-text-pointed";
        }
        if( this.isPortSelected(p, b, pointedBlockId, selectedBlockId, pointedPortId, selectedPortId ) ) {
            clsName += " block-port-text-selected";
        }
         return clsName;
    }

    public static txtBorderClass(p: IPort, b: IBlock, pointedBlockId?: IHandle, selectedBlockId?: IHandle, pointedPortId?: IHandle, selectedPortId?: IHandle) {
        let clsName="block-port-txtborder";
        if( this.isPortPointed(p, b, pointedBlockId, selectedBlockId, pointedPortId, selectedPortId ) ) {
            clsName += " block-port-txtborder-pointed";
        }
        if( this.isPortSelected(p, b, pointedBlockId, selectedBlockId, pointedPortId, selectedPortId ) ) {
            clsName += " block-port-txtborder-selected";
        }
        return clsName;
    }

    public static dragConnClass(p: IPort, b: IBlock, pointedBlockId?: IHandle, selectedBlockId?: IHandle, pointedPortId?: IHandle, selectedPortId?: IHandle) {
        return "block-port-dragconn";
    }

     

    public static portY(block: IBlock, portNo: number, port: IPort) {
        const rectY = BlockUtil.rectY(block);
        return rectY + portNo * PortUtil.PORT_Y_INTERVAL + PortUtil.PORT_TEXT_HEIGHT/2;
    }

    public static knobX(block: IBlock, port: IPort) {
        const frameX = BlockUtil.frameX(block);
        const frameWidth = BlockUtil.frameWidth(block);
        return frameX + frameWidth;
    }

    public static textEndX(block: IBlock, port: IPort) {
        return PortUtil.knobX(block, port) - BlockUtil.RECT_GAP_X;        
    }

    public static textBottomY(block: IBlock, portNo: number, port: IPort) {
        const rectY = BlockUtil.rectY(block);
        return rectY + portNo * PortUtil.PORT_Y_INTERVAL + PortUtil.PORT_TEXT_HEIGHT;
    }

    public static textWidth(block: IBlock, port: IPort) {
        const frameWidth = BlockUtil.frameWidth(block);
        return frameWidth - BlockUtil.RECT_GAP_X * 2;
    }

    public static txtBorderX(block: IBlock, port: IPort) {
        return PortUtil.textEndX(block, port) - PortUtil.textWidth(block, port);
    }

    public static txtBorderY(block: IBlock, portNo: number, port: IPort) {
        return PortUtil.textBottomY(block, portNo, port) - PortUtil.PORT_TEXT_HEIGHT +
               PortUtil.TXTBORDER_GAP_Y;
    }

    public static txtBorderHeight(p: IPort) {
        return PortUtil.TXTBORDER_HEIGHT;
    }

    public static knobTopPointX(block: IBlock, port: IPort) {
        return PortUtil.knobX(block, port);
    }

    public static knobTopPointY(block: IBlock, portNo: number, port: IPort) {
        return PortUtil.portY(block, portNo, port);
    }

    public static knobTopPoint(block: IBlock,
                               portNo: number, port: IPort): ICoords {
        const x = PortUtil.knobTopPointX(block, port);
        const y = PortUtil.knobTopPointY(block, portNo, port);
        const c: ICoords = {x, y};
        return c;
    }


    public static knobBottomPointX(block: IBlock, port: IPort) {
        return PortUtil.knobX(block, port);
    }

    public static knobBottomPointY(block: IBlock, portNo: number, port: IPort) {
        const portY = PortUtil.portY(block, portNo, port);
        return (portY+PortUtil.KNOB_HEIGHT);
    }

    public static knobBottomPoint(block: IBlock, portNo: number, port: IPort): ICoords {
        const x = PortUtil.knobBottomPointX(block, port);
        const y = PortUtil.knobBottomPointY(block, portNo, port);
        const c: ICoords = { x, y };
        return c;
    }

    public static knobMidPointX(block: IBlock, port: IPort) {
        return PortUtil.knobX(block, port) + PortUtil.KNOB_WIDTH;
    }

    public static knobMidPointY(block: IBlock, portNo: number, port: IPort) {
        return PortUtil.portY(block, portNo, port) + PortUtil.KNOB_HEIGHT/2;
    }

    public static knobMidPoint(block: IBlock, portNo: number, port: IPort): ICoords {
        const x = PortUtil.knobMidPointX(block, port);
        const y = PortUtil.knobMidPointY(block, portNo, port);
        const c: ICoords = { x, y };
        return c;
    }

    public static knobPoints(block: IBlock, portNo: number, port: IPort): string {

        const knobTopPoint: ICoords = PortUtil.knobTopPoint(block, portNo, port);
        const knobBottomPoint: ICoords = PortUtil.knobBottomPoint(block, portNo, port);
        const knobMidPoint: ICoords = PortUtil.knobMidPoint(block, portNo, port);
        const knobPoints = knobTopPoint.x+","+knobTopPoint.y+" "+
                           knobBottomPoint.x+","+knobBottomPoint.y+" "+
                           knobMidPoint.x+","+knobMidPoint.y+" ";
        return knobPoints;
    }

    public static dragConnStartX(block: IBlock, port: IPort) {
        return PortUtil.knobX(block, port) + PortUtil.KNOB_WIDTH;
    }

    public static dragConnStartY(block: IBlock, portNo: number, port: IPort) {
        return PortUtil.portY(block, portNo, port) + PortUtil.KNOB_HEIGHT/2;
    }

    public static knobProps(vars: IPortVars) {        
        const key = PortUtil.knobKey(vars.block, vars.port);
        const className = PortUtil.knobClass(vars.port, vars.block, vars.pointedBlockId, vars.selectedBlockId, vars.pointedPortId, vars.selectedPortId);
        const knobPoints = PortUtil.knobPoints(vars.block, vars.portNo, vars.port);
        const props: IKnobPros = {key, className, knobPoints};
        return props;
    }

    public static textProps(vars: IPortVars) {
        const key = PortUtil.textKey(vars.block, vars.port);
        const className = PortUtil.textClass(vars.port, vars.block, vars.pointedBlockId,vars.selectedBlockId,  vars.pointedPortId, vars.selectedPortId);
        const textEndX = PortUtil.textEndX(vars.block, vars.port);
        const textBottomY = PortUtil.textBottomY(vars.block, vars.portNo, vars.port);
        const textWidth = PortUtil.textWidth(vars.block, vars.port);
        const props: ITextProps = {key, className, textEndX, textBottomY, textWidth};
        return props;
    }

    public static txtBorderProps (vars: IPortVars) {
        const key = PortUtil.txtBorderKey(vars.block, vars.port);
        const className = PortUtil.txtBorderClass(vars.port, vars.block, vars.pointedBlockId,vars.selectedBlockId,  vars.pointedPortId, vars.selectedPortId);
        const x = PortUtil.txtBorderX(vars.block, vars.port);
        const y = PortUtil.txtBorderY(vars.block, vars.portNo, vars.port);
        const height = PortUtil.txtBorderHeight(vars.port);

        const props: ITxtBorderProps = {
            key, className, x, y, height
        }
        return props;
    }

    public static dragConnProps(vars: IPortVars) {

        //console.log("dragConnProps vars=");
        //console.dir(vars);
        
        if(vars.selectedBlockId === vars.block.handle && vars.selectedPortId === vars.port.handle && vars.lastMousePos!== undefined) {
            const x1=PortUtil.dragConnStartX(vars.block, vars.port);
            const y1=PortUtil.dragConnStartY(vars.block, vars.portNo, vars.port);
            const x2 = vars.lastMousePos.x;
            const y2 = vars.lastMousePos.y;

            const dragConnKey = PortUtil.dragConnKey(vars.block, vars.port); 
            const dragConnClass = PortUtil.dragConnClass(vars.port, vars.block, vars.pointedBlockId, vars.selectedPortId, vars.pointedPortId, vars.selectedPortId);
            
            const dragConnProps: IDragConnProps = {
                id:dragConnKey,
                key:dragConnKey,
                x1, y1, x2, y2,
                className: dragConnClass
            };
            return dragConnProps;
        }
        return undefined;
    }

    public static portProps(vars: IPortVars) {
        const knobProps = PortUtil.knobProps(vars);
        const textProps = PortUtil.textProps(vars);
        const txtBorderProps = PortUtil.txtBorderProps(vars);
        const dragConnProps = PortUtil.dragConnProps(vars);
        const portKey = PortUtil.portKey(vars.block, vars.port);

        const props: IPortElementsProps = {
            knobProps,
            textProps,
            txtBorderProps,
            dragConnProps,
            portKey
        };

        return props;
    }    

    protected static connKey(fromBlock: IBlock, fromPort: IPort) {
        const delim = FlowchartUtil.FLD_DELIM;
        return PortUtil.portKey(fromBlock, fromPort)+delim+"conn";
    }

    protected static connClassName(fromBlock: IBlock, fromPort: IPort) {
        return "block-conn";
    }

    public static connLineKey(fromBlock: IBlock, fromPort: IPort, lineno: number) {
        const dlg = FlowchartUtil.FLD_DELIM;
        return PortUtil.connKey(fromBlock, fromPort) + dlg + "line" + lineno;
    }
    
    protected static connLineClass(fromBlock: IBlock, fromPort: IPort, lineno: number) {
        return "block-conn-line"+lineno;
    }

    protected static connLine1Props(fromBlock: IBlock, fromPort: IPort, fromPortNo: number, toBlock: IBlock) {
        const lineno=1
        const key = PortUtil.connLineKey(fromBlock, fromPort, lineno);
        const id = key;
        const className = PortUtil.connLineClass(fromBlock, fromPort, lineno);
        const x1 = PortUtil.knobMidPointX(fromBlock, fromPort);
        const y1 = PortUtil.knobMidPointY(fromBlock, fromPortNo, fromPort);
        const x2 = x1 + this.CONN_GAP_X;
        const y2 = y1;
        const props : IConnLineProps = {key, id, className, x1, y1, x2, y2};
        return props;
    }

    protected static connLine2Props(fromBlock: IBlock, fromPort: IPort, fromPortNo: number, toBlock: IBlock) {
        const lineno=2
        const key = PortUtil.connLineKey(fromBlock, fromPort, lineno);
        const id = key;
        const className = PortUtil.connLineClass(fromBlock, fromPort, lineno);
        const x1 = PortUtil.knobMidPointX(fromBlock, fromPort) + this.CONN_GAP_X;
        const y1 = PortUtil.knobMidPointY(fromBlock, fromPortNo, fromPort);
        const x2 = BlockUtil.entryPortX(toBlock) - this.CONN_GAP_X;
        const y2 = BlockUtil.entryPortY(toBlock);
        const props : IConnLineProps = {key, id, className, x1, y1, x2, y2};
        return props;
    }

    
    protected static connLine3Props(fromBlock: IBlock, fromPort: IPort, fromPortNo: number, toBlock: IBlock) {
        const lineno=3
        const key = PortUtil.connLineKey(fromBlock, fromPort, lineno);
        const id = key;
        const className = PortUtil.connLineClass(fromBlock, fromPort, lineno);
        const x1 = BlockUtil.entryPortX(toBlock) - this.CONN_GAP_X;
        const y1 = BlockUtil.entryPortY(toBlock);
        const x2 = BlockUtil.entryPortX(toBlock) - this.CONN_ARROW_GAP_X;
        const y2 = y1;
        const props : IConnLineProps = {key, id, className, x1, y1, x2, y2};
        return props;
    }

 
    public static connProps(fromBlock: IBlock, fromPort: IPort, fromPortNo: number, toBlock: IBlock) {
        const key = PortUtil.connKey(fromBlock, fromPort);
        const id = key;
        const className = PortUtil.connClassName(fromBlock, fromPort);
        const line1Props = PortUtil.connLine1Props(fromBlock, fromPort, fromPortNo, toBlock);
        const line2Props = PortUtil.connLine2Props(fromBlock, fromPort, fromPortNo, toBlock);
        const line3Props = PortUtil.connLine3Props(fromBlock, fromPort, fromPortNo, toBlock);
        const props: IConnRenderProps = { id, key, className, 
                                          line1Props,
                                          line2Props,
                                          line3Props
                                        };
        return props;
    }

    public static portsWidth(ports: Ports) {
        let textWidth = 0;
        ports.list().forEach( (h) => {
            const p = ports.safeGet(h);
            if(p!==undefined) {
                if(p.label.length > textWidth) {
                    textWidth = p.label.length;
                }
            }
        });
        return textWidth * PortUtil.PORT_TEXT_SYMBOL_WIDTH;
    }
    
    public static portsHeight(ports: Ports) {
       const numPorts = ports.list().length;
       return numPorts * PortUtil.PORT_TEXT_HEIGHT + 2 * PortUtil.TEXT_GAP_Y;            
    }

    public static portsToInfo(ports: Ports) {
        const prts: IPortInfo[] = [];
        
        ports.list().forEach( (h) => {
            const p = ports.safeGet(h);
            if(p !== undefined) {
                const {label, handle, connectedToId} = p;
                const pi: IPortInfo = {
                    label,
                    handle,
                    connectedToId
                };
                prts.push(pi);
            }
        });

        return prts;
    }

    public static portTemplate(label: string): IPortInfo {
        return {
            label,
            handle: 0
        };
    }

    public static portTemplates(labels: string[]): IPortInfo[] {
        return labels.map( (l) => PortUtil.portTemplate(l) )
    }
}

