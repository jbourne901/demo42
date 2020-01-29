import React from 'react';
import shortid from 'shortid';
import "./edit.css";
import ICoords from "../../../model/flowchart/coords";
import {IPort, PortUtil, IPortVars} from "../../../model/flowchart/port";
import {IBlock, IBlockLayout, IBlocks, BlockUtil, IBlockRenderVars} from "../../../model/flowchart/block";
import {IBlockTemplate} from "../../../model/flowchart/template";


interface IProps {
    templates: IBlockTemplate[]
};

interface IState {
    selectedBlockId?: string;
    pointedBlockId?: string;
    offset?: ICoords;
    lastMousePos?: ICoords;
    selectedPortId?: string;
    pointedPortId?: string;
    selectedPortX?: number;
    selectedPortY?: number;
    blocks: IBlocks;
}

class FlowchartEditInternal extends React.Component<IProps, IState> {

    private readonly START_X=200;
    private readonly START_Y=200;
    private readonly BLOCK_RADIUS=10;
    private readonly VIEW_X=0;
    private readonly VIEW_Y=0;
    private readonly VIEW_WIDTH=3000;
    private readonly VIEW_HEIGHT=2000;
    private readonly PALETTE_WIDTH=200;
    private readonly PALETTE_HEIGHT=2000;
    private readonly CANVAS_WIDTH=this.VIEW_WIDTH-this.PALETTE_WIDTH;
    private readonly CANVAS_HEIGHT=2000;
    private readonly TEMPLATE_GAP_X=20;
    private readonly TEMPLATE_GAP_Y=20;
    private readonly BLOCK_GAP=10;

    private NEXT_BLOCK_ID=1;
    

    constructor(props: IProps) {
        super(props);
        this.state = {
            blocks: {}
        };
    }

    componentDidMount() {        
        const blocks : IBlocks = this.props.templates.reduce( 
                 (bs: IBlocks, t: IBlockTemplate, ndx: number) => {
                        const b = this.createBlockTemplateInfo(t, ndx);                        
                        return {...bs, [b.uniqueid]: b}
                 },
                 {}
        );
        //const elements = this.props.templates.map( (t, ndx) => this.createBlockTemplateInfo(t, ndx));

        this.setState({blocks});
    }

    
 
    
    protected eventTargetBlock(e: React.MouseEvent) {
        let blockId = BlockUtil.extractBlockId(e);
        if(blockId === undefined ) {
            const mousePos = this.getMousePosition(e);
            blockId = this.findBlockByCoords(mousePos.x, mousePos.y);
        }
        if(blockId !== undefined && blockId.length>0) {
            return this.state.blocks[blockId];
        }
        return undefined;
     }

     protected findBlockByCoords(x: number, y: number) {
         const blocks=Object.values(this.state.blocks);
         const ndx = blocks.findIndex( (b) => BlockUtil.isWithinFrame(b, x, y) );         
         if(ndx>=0) {
            const blockId = blocks[ndx].uniqueid;
            return blockId;
         }
         return undefined;
     }

    protected eventTargetPort(e: React.MouseEvent) {
        const blockId = BlockUtil.extractBlockId(e);
        const portId = PortUtil.extractPortId(e);
        if(blockId !== undefined && blockId.length>0 && portId!==undefined && portId.length>0) {
            const block = this.state.blocks[blockId];
            if(block !== undefined) {
                const index = block.ports.findIndex( (p) => p.uniqueid === portId);
                if(index>=0) {
                    return block.ports[index];
                }    
            }
        }
        return undefined;
    }
 
    protected findPortIndexPlus1(element: IBlock, uniqueid?: string) {
        if(element && uniqueid) {
            const ndx = element.ports.findIndex( (e) => e.uniqueid === uniqueid);
            if (ndx>=0) {
                return ndx+1;
            }    
        }
        return 0;
    }

    protected isInCanvas(block: IBlock) {
        if (block.x >= this.VIEW_X + this.PALETTE_WIDTH) {
            return true;
        }
        return false;
    }

    protected clearBlockSelectionState() {
        return {
            selectedBlockId: undefined,
            selectedPortId: undefined,
            offset: undefined
        };
    }

    protected setBlockAndPortSelected(block: IBlock, port: IPort, otherStateFields: any) {
        const blockId = block.uniqueid;
        const portId = port.uniqueid;
        return this.setState({
            ...otherStateFields,
            selectedBlockId: blockId,
            selectedPortId: portId,
        });

    }

    protected onMouseDown(e: React.MouseEvent) {
        e.persist();
        const clickedBlock = this.eventTargetBlock(e);
        if ( clickedBlock === undefined) {
            return this.setState( this.clearBlockSelectionState() );
        }
        e.preventDefault();
        const lastMousePos: ICoords = this.getMousePosition(e);
        
        const clickedPort = this.eventTargetPort(e);
        if(clickedPort !== undefined) {
            return this.setBlockAndPortSelected(clickedBlock, clickedPort, { lastMousePos, offset: undefined} );
        }

        const offset: ICoords = lastMousePos;
        offset.x -= parseFloat(""+clickedBlock.x);
        offset.y -= parseFloat(""+clickedBlock.y);

        this.setBlockOnlySelected(clickedBlock, {offset, lastMousePos});
    }

    protected setBlockOnlySelected(block: IBlock, otherStateFields: any) {
        return this.setState({ ...otherStateFields,
                               selectedBlockId: block.uniqueid,
                               selectedPortId: undefined,
                             });
    }

    protected getMousePosition(e: React.MouseEvent) {
        const svg = document.getElementById("canvas") as any;
        const CTM = svg.getScreenCTM();
        const coords: ICoords = {
            x: (e.clientX - CTM.e) / CTM.a,
            y: (e.clientY - CTM.f) / CTM.d
          }; 
        return coords;       
    }


    protected dragEndState() {
        return {
            offset: undefined,
            lastMousePos: undefined
        };
    }

    protected onMouseUp(e: React.MouseEvent) {
        // we should use selected element and not event target
        // otherwise if we shove element under another element 
        // it will not be moved back
        // mouse up cases: 1
        // 1- dragging template, outsidecanvas -> just release template back to its place
        // 2- dragging template, inside canvas -> release template and instantiate block
        // 3- dragging non-templateblock, outside canvas -> undo move
        // 4- dragging non-templateblock, inside canvas -> move to new place
        // 5- dragging port, drop on blank space inside canvas -> undo move (clear lastMousePos)
        // 6- dragging port, drop on blank space outside canvas -> undo move (clear lastMousePos)
        // 7- dragging port, drop on template -> undo move (clear lastMousePos)
        // 8- dragging port, drop on block -> clear lastMouse pos, create connection
        // todo: check for dup connections
        // 9 - dragging nothing, drop on something -- currently impossble as mouseDown outside of block resets selection
        // todo: implement mouse lasso selection
        //const ndx = this.eventTargetBlockIndexPlus1(e);


        if(this.isDraggingPort()) {
            const dropOnBlock = this.eventTargetBlock(e);
            console.dir(dropOnBlock);

            if (dropOnBlock !== undefined) {
                return this.connectPort(dropOnBlock);
            }            
        }

        if(this.isDraggingBlock()) {
            const draggedBlock = this.getSelectedBlock();
            if(draggedBlock !== undefined ) {
                if(draggedBlock.isTemplate) {
                    return this.dropTemplateBlock(draggedBlock);
                }
                return this.dropInstanceBlock(draggedBlock);    
            }
        }
        return this.setState({...(this.dragEndState()) });
    }

    protected getSelectedBlock() {
        const selectedBlockId = this.state.selectedBlockId;
        if( selectedBlockId !== undefined) {
            return this.state.blocks[selectedBlockId];
        }
        return undefined;
    }

    protected getSelectedPort() {
        if(this.state.selectedPortId === undefined) {
            return undefined;
        }
        const block = this.getSelectedBlock();
        if(block === undefined) {
            return undefined;
        }        
        const ndx = block.ports.findIndex( (p) => p.uniqueid === this.state.selectedPortId);
        if(ndx<0) {
            return undefined;
        }
        return block.ports[ndx];
    }

    protected isDraggingPort() {
        if(this.state.selectedPortId !== undefined && this.state.lastMousePos !== undefined) {
            return true;
        }
        return false;
    }

    protected isDraggingBlock() {
        if(this.state.selectedBlockId!==undefined) {
            return true;
        }
        return false;
    }

        /*
        if ( selectedBlock !== undefined) {
            if(selectedBlock.isTemplate) {
                return this.releaseTemplate(selectedBlock);
            } 
            if(this.isInCanvas(el)) {
                if(this.state.selectedPortId!==undefined && this.state.lastMousePos !== undefined) {
                    return this.connectPort(el);
                }
            } else {
                    return this.undoMoveBlock(selectedBlock, {offset: undefined, lastMousePos: undefined})
            }
        }        
    */

    protected undoMoveBlock(block: IBlock, otherStateFields: any) {
        const blockId = block.uniqueid;
        const updatedBlock = {...block, x: block.lastX, y: block.lastY};
        const blocks = {...this.state.blocks, [blockId]: updatedBlock};

        return this.setState({...otherStateFields, blocks });
    }

    protected dropTemplateBlock(el: IBlock) {
        const updatedEl = {...el, x: el.lastX, y: el.lastY};
        let blocks = {...this.state.blocks, [el.uniqueid]: updatedEl };

        if( this.isInCanvas(el) ) {
            const newBlock = this.instantiateTemplate(el);
            if(newBlock !== undefined ) {
                blocks = {...blocks, [newBlock.uniqueid]: newBlock};
            }                    
        }
        return this.setState({ ...(this.dragEndState()),
                               blocks                              
                             });
    }

    protected dropInstanceBlock(block: IBlock) {
        if(block !== undefined && !this.isInCanvas(block) ) {
                return this.undoMoveBlock(block, this.dragEndState() );                
        }
        return this.setState( this.dragEndState() );
    }

    protected connectPort(toBlock: IBlock) {
        const fromPort = this.getSelectedPort();
        const fromBlock = this.getSelectedBlock();
        console.log("yyyyyyyyy connectPort from="+fromBlock?.uniqueid + " to = " + toBlock.uniqueid);
        if(fromBlock !== undefined && toBlock !== undefined && fromPort !== undefined) {            
            const fromBlockId = fromBlock.uniqueid;
            const fromPortId = fromPort.uniqueid;
            const updatedFromPort = {...fromPort};
            updatedFromPort.connectedToId=toBlock.uniqueid;
            const updatedPorts = fromBlock.ports.map( (p) => (p.uniqueid===fromPortId)? updatedFromPort : p);
            const updatedFromBlock = {...fromBlock, ports: updatedPorts};
            const blocks = {...this.state.blocks, [fromBlockId]: updatedFromBlock};
            return this.setState({ ...(this.dragEndState()),
                                   blocks
                                });        
        }
        return this.setState( this.dragEndState() );
    }
 

    protected blockPort(label: string) {
        return {
            label
        };
    }

    protected getTemplate(label: string) {
        const ndx = this.props.templates.findIndex( (t) => t.label === label);
        if(ndx>=0) {
            return this.props.templates[ndx];
        }
        return undefined;
    }

    protected instantiateTemplate(templateBlock: IBlock) {
        const template = this.getTemplate(templateBlock.label);
        if(template) {
            const {x,y} = templateBlock;
            const newBlock = this.createElementInfo(x, y,
                  template.label+"_"+this.nextBlockId(),
                  template.ports,
                  false
            );
            return newBlock;    
        }
        return undefined;
    }

    protected nextBlockId() {
        this.NEXT_BLOCK_ID+=1;
        return this.NEXT_BLOCK_ID;
    }

    protected moveBlock(block: IBlock, pos: ICoords) {
        const offset = this.state.offset || {x: 0, y: 0};
        const x = pos.x - offset.x;
        const y = pos.y - offset.y;
        const updatedBlock = {...block, x, y};
        const blocks = {...this.state.blocks, [updatedBlock.uniqueid]: updatedBlock};
        return this.setState({blocks, lastMousePos: pos});
    }

    // selectedBlock = undefined , buttons not held - check / update pointed block/port
    // selectedBlock = undefined , buttons held (dragging on empty space) - do nothing
    // selectedBlock != undefined, buttons not held - check/update pointed block/port
    // selectedBlock != undefined, buttons held , isDraggingPort=true - update lastMousePos
    // selectedBlock != undefined, buttons held , isDraggingPort=false - update selected blocks x/y
    protected onMouseMove(e: React.MouseEvent) {
        e.persist();
        if(e.buttons === 1) {
            e.preventDefault();
            //console.log("onMouseMove target="+(e.target as any).id);
        }

        const lastMousePos = this.getMousePosition(e);
        if (this.isDraggingPort() && e.buttons === 1) { 
            return this.setState({lastMousePos});
        }

        if (this.isDraggingBlock() && e.buttons === 1) {
            const selectedBlock = this.getSelectedBlock();
            if(selectedBlock !== undefined && this.state.offset !== undefined) {
                return this.moveBlock(selectedBlock, lastMousePos)
            }            
        }
       
        const pointedBlock = this.eventTargetBlock(e);
        if(e.buttons === 0 && pointedBlock !== undefined) {
            const pointedPort = this.eventTargetPort(e);
            return this.setPointedBlockPort(pointedBlock, pointedPort);
        }
    }

    protected setPointedBlockPort(pointedBlock: IBlock, pointedPort?: IPort) {
        let pointedBlockId = pointedBlock.uniqueid;
        let pointedPortId;
        if(pointedPort !== undefined) {
            pointedPortId = pointedPort.uniqueid;
        }
        if( this.state.pointedBlockId !== pointedBlockId) {
            console.log("setPointedBlockAndPort block = "+pointedBlock.label + " port="+pointedPort?.label);
            return this.setState({pointedBlockId, pointedPortId});
        } 
        if (this.state.pointedPortId !== pointedPortId) {
            console.log("setPointedPortOnly (block unchanged)  port="+pointedPort?.label);
            return this.setState({pointedPortId});
        }        
    }

    

    protected onMouseLeave(e: React.MouseEvent) {

    }

    protected addBlock() {
//        const newBlock = this.createElementInfo(this.START_X, this.START_Y, "NewBlock", [ "Port1", "Port2","Port3"], false);
        const t1: IBlocks = {};
        let prevBlock: IBlock;
        [...Array(12)].forEach( (n, ndx) => { const b = this.createElementInfo(
                                                      this.START_X+ndx*200, 
                                                      20,
                                                      "NewBlock"+ndx,
                                                      [ "Port1", "Port2","Port3"],
                                                      false
                                                   );
                                              if(prevBlock!==undefined) {
                                                  prevBlock.ports[0].connectedToId=b.uniqueid;
                                              }
                                              prevBlock=b;
                                        t1[b.uniqueid] = b;
                                      }
                            );

        const t2: IBlocks = {};
        [...Array(12)].forEach( (n, ndx) => { const b = this.createElementInfo(
                                               this.START_X+ndx*200, 
                                               200,
                                               "NewBlock"+(ndx+100),
                                               [ "Port1", "Port2","Port3"],
                                              false
                                             );                                                   
                                             if(prevBlock!==undefined) {
                                                prevBlock.ports[0].connectedToId=b.uniqueid;
                                             }
                                             prevBlock=b;
                                             t2[b.uniqueid] = b;
                }
        );

        const t3: IBlocks = {};
        [...Array(12)].forEach( (n, ndx) => { const b = this.createElementInfo(
                                               this.START_X+ndx*200, 
                                               350,
                                               "NewBlock"+(ndx+200),
                                               [ "Port1", "Port2","Port3"],
                                              false
                                             );                                                   
                                             if(prevBlock!==undefined) {
                                                prevBlock.ports[0].connectedToId=b.uniqueid;
                                             }
                                             prevBlock=b;
                                             t3[b.uniqueid] = b;
                }
        );

        const t4: IBlocks = {};
        [...Array(12)].forEach( (n, ndx) => { const b = this.createElementInfo(
                                               this.START_X+ndx*200, 
                                               500,
                                               "NewBlock"+(ndx+300),
                                               [ "Port1", "Port2","Port3"],
                                              false
                                             );                                                   
                                             if(prevBlock!==undefined) {
                                                prevBlock.ports[0].connectedToId=b.uniqueid;
                                             }
                                             prevBlock=b;
                                             t4[b.uniqueid] = b;
                }
        );
        const blocks = {...this.state.blocks, ...t1, ...t2, ...t3, ...t4 };
        this.setState({blocks});
    }

    protected createElementInfo(x: number, y: number, label: string, strports: string[], isTemplate: boolean) {
        const uniqueid = shortid.generate();
        const ports = strports.map( (s) => {
             const portId = shortid.generate();
             const port: IPort = {label: s, uniqueid: portId};
             return port;
        });
        const newElement: IBlock = {uniqueid, x, y, label, ports, isTemplate,
                                    lastX: x, lastY: y
                                   };
        return newElement;
    }

    protected formatBlock(e: IBlock) {
        const block: IBlockLayout = {...e};
        
                
        /*
        const rectY=y+textHeight+2*rectGapY;
        const rectHeight = h-textHeight-3*rectGapY;
        */


        const {pointedBlockId, selectedBlockId} = this.state;
        const vars: IBlockRenderVars = {block, pointedBlockId, selectedBlockId};

        const {frameProps, rectProps, textProps} = BlockUtil.blockRenderProps(vars);        


        const frame = (
               <rect {...frameProps} />
        );   

        const rect = (
            <rect {...rectProps} />
        );

        const text = (
            <text {...textProps}> {block.label} </text>
        );

        return (
            <React.Fragment key={block.uniqueid}>

               {frame}
               {rect}
               {text}

               {block.ports.map( (p, ndx) => this.formatPort(e, p, ndx) )}

            </React.Fragment>
        );
    }


    protected createBlockTemplateInfo(t: IBlockTemplate, ndx: number) {
        console.log("addBlockTemplate header="+t.label);
        const x = this.VIEW_X + this.TEMPLATE_GAP_X;
        const y = (BlockUtil.BLOCK_HEIGHT + this.TEMPLATE_GAP_Y) * ndx + this.TEMPLATE_GAP_Y;
        return this.createElementInfo(x, y, t.label, [], true);
    }

    protected formatBlocks() {
        // in order to correctly render z-order we have to first render all non-selected elements 
        // and render the selected element last
        const selId = this.state.selectedBlockId;
        let jsxSelected=null;
        let jsxOthers=null;
        if(selId !== undefined ) {
            const {[selId]: selBlock, ...blocks} = this.state.blocks;
            jsxSelected = this.formatBlock(selBlock);
            jsxOthers = Object.values(blocks).map( (b) => this.formatBlock(b));
        } else {
            jsxOthers = Object.values(this.state.blocks).map( (b) => this.formatBlock(b));
        }
        return (
            <React.Fragment>
                {jsxOthers}
                {jsxSelected}
            </React.Fragment>            
        );
    }

    protected formatConnections() {
        const conns: JSX.Element[] = [];
        Object.values(this.state.blocks).forEach( (b) => 
           b.ports.forEach( (p, ndx) => {
               if(p.connectedToId!==undefined) {
                   const jsx = this.formatConnection(b, p, ndx);
                   if(jsx !== undefined) {
                    conns.push(jsx);
                   }                   
               }
           })
        );
        return conns;
    }

    protected formatConnection( fromBlock: IBlock, fromPort: IPort, fromPortNo: number ) {
        console.log("formatConnection from = " + fromBlock.uniqueid + " to = " + fromPort.connectedToId);
        if(fromPort.connectedToId !== undefined) {
            const toBlock = this.state.blocks[fromPort.connectedToId];
            const connProps = PortUtil.connProps(fromBlock, fromPort, fromPortNo, toBlock);
            const {key, line1Props, line2Props, line3Props} = connProps;
            console.log("ttttttttt connProps=");
            console.dir(connProps);
            return (
                <React.Fragment key={key}>
                   <defs>
                      <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                         <path d="M0,0 L0,6 L9,3 z" fill="#f00" />
                      </marker>
                   </defs>
                   <line {...line1Props} /> 
                   <line {...line2Props} /> 
                   <line {...line3Props} markerEnd="url(#arrow)" />
                   
                </React.Fragment>                
            );    
            //  markerEnd="url(#arrow)" />
        }
        return undefined;
    }


    protected formatPort(block: IBlock, p: IPort, portNo: number) {

        const {selectedBlockId, 
               pointedBlockId, 
               selectedPortId, 
               pointedPortId, 
               lastMousePos } = this.state;

        const vars: IPortVars = {
            block, 
            port: p, 
            portNo, 
            selectedBlockId, 
            pointedBlockId, 
            pointedPortId, 
            selectedPortId, 
            lastMousePos
        };

        const {knobProps, textProps, txtBorderProps, dragConnProps, portKey } = 
        PortUtil.portProps(vars);

        const {key: knobKey, className: knobClass, knobPoints} = knobProps;
        const {key: textKey, className: textClass, textEndX, textBottomY, textWidth} = 
          textProps;
        const {key: txtBorderKey, className: txtBorderClass, height: txtBorderHeight, y: txtBorderY, 
               x: txtBorderX} = txtBorderProps;

        const knob = (
            <polygon id={knobKey} key={knobKey} points={knobPoints} className={knobClass} />
        );

        const text = (
            <text id={textKey} key={textKey} x={textEndX} y={textBottomY} 
                width={textWidth} className={textClass} textAnchor={"end"}
            >
                {p.label}
            </text>
        );


        const txtBorder = (
            <rect id={txtBorderKey} key={txtBorderKey} x={txtBorderX} y={txtBorderY} 
               width={textWidth} height={txtBorderHeight}
               className={txtBorderClass}
            />    
        );

        let dragConn = null;
        if(dragConnProps !== undefined) {
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
    
    protected formatPalette(x: number, y: number, w: number, h: number) {
        return (
            <React.Fragment>
               <rect id="palette" x={x} y={y} width={w} height={h} className="palette">                
               </rect>
            </React.Fragment>            
        );
    }

    public render() {
        const viewBox = this.VIEW_X + " " + this.VIEW_Y + " " + this.VIEW_WIDTH + " " + this.VIEW_HEIGHT;
        return (
            <React.Fragment>
                <button onClick={ () => this.addBlock()}>Add</button>
                <svg id="canvas" xmlns="http://www.w3.org/2000/svg" 
                    viewBox={viewBox}
                    onMouseDown = { (e) => this.onMouseDown(e) }
                    onMouseUp = { (e) => this.onMouseUp(e) }
                    onMouseMove = { (e) => this.onMouseMove(e) }
                    onMouseLeave = { (e) => this.onMouseLeave(e) }
                >
                    <rect id="bkg" x={this.VIEW_X} y={this.VIEW_Y} 
                          width={this.VIEW_WIDTH} height={this.VIEW_HEIGHT} 
                          className="canvas"
                    >
                    </rect>
                    {this.formatPalette(this.VIEW_X, this.VIEW_Y, this.PALETTE_WIDTH, this.PALETTE_HEIGHT)}
                    { this.formatBlocks() }
                    { this.formatConnections() }
                </svg>
            </React.Fragment>
        )
    }
}
 
const FlowchartEdit = FlowchartEditInternal;
export default FlowchartEdit;