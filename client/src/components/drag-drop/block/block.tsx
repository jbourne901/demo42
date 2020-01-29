import React from 'react';
import IPort from "../../../model/port";
import ILabelledShape from "../../../model/labelled-shape";
import ICoords from '../../../model/coords';

interface IProps extends ILabelledShape {
    isSelected: boolean;
    isPointed: boolean;
    w: number;
    h: number;
    ports: IPort[];
    pointedPortId?: string;
    selectedPortId?: string;
    lastMousePos?: ICoords;
}

class BlockInternal extends React.Component<IProps> {
    private readonly RECT_GAP_X=6;
    private readonly RECT_GAP_Y=6;
    private readonly TEXT_HEIGHT=22;
    private readonly TEXT_GAP_X=10;
    private readonly PORT_GAP_Y=6;
    private readonly PORT_HEIGHT=12;
    private readonly PORT_WIDTH=12;
    private readonly FLD_DELIM="|";
    private readonly TXTBORDER_GAP_Y=6;

    protected formatPort(p: IPort, ndx: number, rectY: number) {
        console.log("formatPort p=");
        console.dir(p);
        const portInterval = this.TEXT_HEIGHT + this.PORT_GAP_Y;
        const portY = rectY + ndx*portInterval + this.TEXT_HEIGHT/2;
        const {x, w} = this.props;
        const portKey = "block"+this.FLD_DELIM+this.props.uniqueid+this.FLD_DELIM+"port"+this.FLD_DELIM+p.uniqueid;
        const knobKey=portKey+this.FLD_DELIM+"knob";
        const portX = x + w;
        let clsName="block-port-knob";
        if( this.props.pointedPortId === p.uniqueid ) {
            clsName += " block-port-knob-pointed";
        }
        if( this.props.selectedPortId === p.uniqueid ) {
            clsName += " block-port-knob-pointed";
        }        
        const points = portX+","+portY+" "+portX+","+(portY+this.PORT_HEIGHT)+" "+
                       (portX+this.PORT_WIDTH)+","+(portY+this.PORT_HEIGHT/2);
        const knob = (
            <polygon id={knobKey} key={knobKey} points={points} className={clsName} />
        );

        const textX = x + w - this.RECT_GAP_X;
        const textY = rectY + ndx*portInterval + this.TEXT_HEIGHT;
        const textKey = portKey+this.FLD_DELIM+"text";
        let textClsName="block-port-text";
        if(this.props.pointedPortId === p.uniqueid) {
            textClsName+=" block-port-text-pointed";
        }
        if(this.props.selectedPortId === p.uniqueid) {
            textClsName+=" block-port-text-selected";
        }
        const textWidth = w - this.RECT_GAP_X * 2;
        const text = (
            <text id={textKey} key={textKey} x={textX} y={textY} width={textWidth}
                className={textClsName} textAnchor={"end"}
            >
                {p.label}
            </text>
        );

        const textHeight = this.TEXT_HEIGHT;

        let txtBorderClsName="block-port-txtborder";
        if(this.props.pointedPortId === p.uniqueid) {
            txtBorderClsName+=" block-port-txtborder-pointed";
        }
        if(this.props.selectedPortId === p.uniqueid) {
            txtBorderClsName+=" block-port-txtborder-selected";
        }
        const txtBorderKey = portKey+this.FLD_DELIM+"txtborder";
        const txtBorderX = textX - textWidth;
        const txtBorderY = textY - textHeight + this.TXTBORDER_GAP_Y;
        const txtBorderHeight = textHeight - this.TXTBORDER_GAP_Y / 2;
        const txtBorder = (
            <rect id={txtBorderKey} key={txtBorderKey} x={txtBorderX} y={txtBorderY} 
               width={textWidth} height={txtBorderHeight}
               className={txtBorderClsName}
            />    
        );

        let dragConn = null;
        if(this.props.selectedPortId === p.uniqueid && this.props.lastMousePos) {
            const x1=(portX+this.PORT_WIDTH);
            const y1=(portY+this.PORT_HEIGHT/2);
            const x2 = this.props.lastMousePos.x;
            const y2 = this.props.lastMousePos.y;
            const dragConnKey = portKey+this.FLD_DELIM+"dragconn";
            const dragConnProps = {
                id:dragConnKey,
                key:dragConnKey,
                x1, y1, x2, y2,
                className:"block-port-dragconn"
            };
            console.log("000000000000000000000 line ");
            console.dir(dragConnProps);
            dragConn = (
                <line {...dragConnProps}></line>
            );
        }

        return (
            <React.Fragment key={portKey}>
                {knob}
                {txtBorder}
                {text}
                {dragConn}
            </React.Fragment>
        );
    }
 

    public render() {
        const {uniqueid, x, y, w, h} = this.props;
        const blockFrameId="block"+this.FLD_DELIM+uniqueid+this.FLD_DELIM+"frame";
        const blockRectId="block"+this.FLD_DELIM+uniqueid+this.FLD_DELIM+"rect";
        const blockTextId="block"+this.FLD_DELIM+uniqueid+this.FLD_DELIM+"text";
        let clsName = "block";
        if(this.props.isSelected) {
            clsName+=" block-selected";
        }
        if (this.props.isPointed) {
            clsName+=" block-pointed";
        }
        
        const rectY=y+this.TEXT_HEIGHT+2*this.RECT_GAP_Y;
        const rectHeight = h-this.TEXT_HEIGHT-3*this.RECT_GAP_Y;

        console.log("Block.render props=");
        console.dir(this.props);

        return (
            <React.Fragment>

               <rect id={blockFrameId} 
                   key={blockFrameId}
                   x={x} y={y} width={w} height={h}
                   className={clsName}
                   
               />

               <rect id={blockRectId}
                   key={blockRectId}
                   x={x+this.RECT_GAP_X} 
                   y={rectY} 
                   width={w-2*this.RECT_GAP_X} 
                   height={rectHeight}
                   className="block-rect"
               />

               <text id={blockTextId}
                   key={blockTextId}
                   x={x+this.TEXT_GAP_X} y={y+this.TEXT_HEIGHT} className="block-text" >
                   {this.props.label}
               </text>

               {this.props.ports.map( (p, ndx) => this.formatPort(p, ndx, rectY) )}
            </React.Fragment>
        );
    }
}

const Block = BlockInternal;

export default Block;
