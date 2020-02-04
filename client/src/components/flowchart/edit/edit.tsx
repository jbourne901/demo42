import React from 'react';
import "./edit.css";
import {IHandle} from "../../../model/handle";
import ICoords from "../../../model/flowchart/coords";
import {IPort, PortUtil, IPortVars, Ports, IPortInfo} from "../../../model/flowchart/port";
import {IBlock, IBlockInfo, IBlockLayout, Blocks, BlockUtil, IBlockRenderVars} from 
        "../../../model/flowchart/block";
import {IBlockTemplate} from "../../../model/flowchart/template";
import FlowchartUtil from '../../../model/flowchart/util';
import ValidationError from '../../validation-error';
import IFlowchart from '../../../model/flowchart';
import TemplateTree from '../templatetree';


// state-changing operations:
// initial population of templates
// initial population of blocks (when opening an existing flow)
// select block and port (when clicking on block, port or connection)
// unselect block and port when clicking outside of block, port and connection
// select block only (when clickng on block but not on port)
// cancel drag (when releasing mouse button not after dragging )
// finalize move (when releasing mouse button after dragging an instance block)
// undo move block (when releasing mouse button after dragging an instance block outside of canvas)
// undo move template block (when releasing mouse button after dragging a template block)
// instantiate block from template (when releasing mouse button after dragging a template block inside canvas)
// create connection (when releasing mouse button after dragging a port)
// unhighlight port when moving mouse with no button pressed outside of port/connection
// unhighlight block and port when moving mouse with no button pressed outside of port/connection/block

interface IProps {
    label: string;
    name: string;
    value: IFlowchart;
    error: string;
    templates: IBlockTemplate[];
    onFlowChange(value: IFlowchart): void;

};


interface IState {
    selectedBlockId?: IHandle;
    pointedBlockId?: IHandle;
    offset?: ICoords;
    lastMousePos?: ICoords;
    hasBeenDragged: boolean;
    selectedPortId?: IHandle;
    pointedPortId?: IHandle;
    selectedPortX?: number;
    selectedPortY?: number;
    blocks: Blocks;
}

class FlowchartEditInternal extends React.Component<IProps, IState> {

    private readonly VIEW_X=0;
    private readonly VIEW_Y=0;
    private readonly VIEW_WIDTH=3000;
    private readonly VIEW_HEIGHT=2000;
    //private readonly PALETTE_WIDTH=200;
    private readonly PALETTE_WIDTH=0;
    private readonly PALETTE_TEXT_HEIGHT=20;
    private readonly PALETTE_HEADER_GAP_Y=10;
    private readonly PALETTE_HEIGHT=2000;
    private readonly PALETTE_HEADER_HEIGHT=50;
    private readonly TEMPLATE_GAP_X=20;
    private readonly TEMPLATE_GAP_Y=20;

    constructor(props: IProps) {
        super(props);
        const blocks = new Blocks("Blocks", 0);
        this.state = {
            blocks,
            hasBeenDragged: false
        };
    }

    componentDidMount() {        
        const blocks : Blocks = new Blocks("Blocks", FlowchartUtil.MAX_BLOCKS);
        /* temporary
        this.props.templates.forEach( (t: IBlockTemplate, ndx: number) => {
            this.createTemplateBlock(blocks, t, ndx);                        
        });
        */
        console.log("componentDidMount value=");
        console.dir(this.props.value);
        const originalHandles: { [handle: string]: IHandle } = {};
        if(this.props.value !== undefined && this.props.value !== null) {
            this.props.value.forEach( (t: IBlockInfo) => {
                const strh = t.handle.toString();
                const newBlock = this.createBlock(blocks, t.x, t.y, t.label, t.ports, false);
                if(newBlock !== undefined ) {
                    originalHandles[strh]=newBlock.handle;
                    console.log("newBlock originalHandle "+strh + "="+ newBlock.handle);
                }                
            })
        }
        console.log("blocks = ");
        console.dir(blocks.list());
        blocks.list().forEach( (h) => {
            const b = blocks.safeGet(h);
            if(b!==undefined && !b.isTemplate && b.ports!==undefined) {
                console.log("bbb=");
                console.dir(b);
                b.ports.list().forEach( (ph) => {
                    const p = b.ports.safeGet(ph);
                    if(p!==undefined && p.connectedToId !== undefined) {
                        const newHandle = originalHandles[p.connectedToId];
                        console.log("connection to originalHandle "+p.connectedToId+" = "+newHandle);
                        p.connectedToId = newHandle;
                    }
                })
            }
        })
        this.setState({blocks});
    }

    
    protected eventTargetBlock(e: React.MouseEvent) {
        let blockHandle = BlockUtil.extractBlockId(e);
        let block;
        if(blockHandle !== undefined && blockHandle>=0) {
            block = this.state.blocks.get(blockHandle);
        }
        if(block === undefined ) {
            const mousePos = this.getMousePosition(e);
            block = this.findBlockByCoords(mousePos.x, mousePos.y);            
        }
        return block;
     }

     protected findBlockByCoords(x: number, y: number) {
         //const blocks=Object.values(this.state.blocks);
         const blocks = this.state.blocks;
         return blocks.findFirst( (b: IBlock) => BlockUtil.isWithinFrame(b, x, y) );
     }

    protected eventTargetPort(e: React.MouseEvent) {
        const blockHandle = BlockUtil.extractBlockId(e);
        const portHandle = PortUtil.extractPortId(e);
        const block = this.state.blocks.safeGet(blockHandle);
        if(block !== undefined) {
            return block.ports.safeGet(portHandle);
        }
        return undefined;
    }

    
    protected eventTargetConn(e: React.MouseEvent) {
        const id: string = (e.target as any).id;
        if(id.indexOf("conn") >=0 ) {
            return e;
        }
        return undefined;
    }
  
  
    protected isInCanvas(block: ICoords) {
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

    protected setBlockAndPortSelected(block: IBlock, port: IPort, lastMousePos: ICoords) {
        const blockId = block.handle;
        const portId = port.handle;
        const blocks = this.state.blocks;
        blocks.moveToEnd(blockId);
        return this.setState({
            offset: undefined,
            lastMousePos,
            blocks,
            selectedBlockId: blockId,
            selectedPortId: portId,
        });
    }

    protected onMouseDown(e: React.MouseEvent) {
        e.persist();
        const clickedBlock = this.eventTargetBlock(e);
        if ( clickedBlock === undefined) {
            console.log("mousedown outside of block - clearBlockSelectionState");
            return this.setState( this.clearBlockSelectionState() );
        }
        e.preventDefault();
        const lastMousePos: ICoords = this.getMousePosition(e);
        
        const clickedPort = this.eventTargetPort(e);
        if(clickedPort !== undefined) {
            console.log("mousedown - clickedPort = "+clickedPort.label+" set selected block and port "+clickedBlock.label+" "+clickedPort?.label);
            return this.setBlockAndPortSelected(clickedBlock, clickedPort, lastMousePos );
        }

        const clickedConn = this.eventTargetConn(e);
        if(clickedConn !== undefined) {
            const hBlock = BlockUtil.extractBlockId(clickedConn);
            const hPort = PortUtil.extractPortId(clickedConn);
            const connBlock = this.state.blocks.safeGet(hBlock);
            const connPort = this.state.blocks.safeGet(hPort);
            if(connBlock!==undefined && connPort !== undefined) {
                console.log("mousedown - clicked Conn port = "+connPort.label+" set selected block and port "+connBlock.label+" "+connPort.label);
                return this.setBlockAndPortSelected(connBlock, connPort, lastMousePos );    
            }
        }

        const offset: ICoords = lastMousePos;
        offset.x -= parseFloat(""+clickedBlock.x);
        offset.y -= parseFloat(""+clickedBlock.y);

        console.log("mousdown - clickedblock="+clickedBlock.label+" set selected block only");
        //this.setBlockOnlySelected(clickedBlock, {offset, lastMousePos});
        this.setBlockOnlySelected(clickedBlock, {offset});
    }

    protected setBlockOnlySelected(block: IBlock, otherStateFields: any) {
        const blocks = this.state.blocks;
        blocks.moveToEnd(block.handle);
        return this.setState({ ...otherStateFields,
                               selectedBlockId: block.handle,
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
            lastMousePos: undefined,
            hasBeenDragged: false   
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
            console.log("mouseUp - isDragginPort - dropOnBlock=");
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
            return this.state.blocks.get(selectedBlockId);
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
        return block.ports.get(this.state.selectedPortId);
    }

    protected isDraggingPort() {
        if(this.state.selectedPortId !== undefined && 
           this.state.lastMousePos !== undefined
          ) {
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

    protected undoMoveBlock(block: IBlock, otherStateFields: any) {
        const updatedBlock = {...block, x: block.lastX, y: block.lastY};
        const blocks = this.state.blocks;
        blocks.update(updatedBlock.handle, updatedBlock);

        return this.setState({...otherStateFields, blocks });
    }

    protected dropTemplateBlock(el: IBlock) {
        const updatedEl = {...el, x: el.lastX, y: el.lastY};
        const blocks = this.state.blocks;
        blocks.update(updatedEl.handle, updatedEl);
        
        if( this.isInCanvas(el) ) {
            this.instantiateTemplate(blocks, el);
            this.setState({ ...(this.dragEndState()),
                blocks                              
            });
            this.notifyChange();
            return;
        }
        this.setState({ ...(this.dragEndState()),
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
        if(fromBlock !== undefined && toBlock !== undefined && fromPort !== undefined) {
            if(fromBlock.handle === toBlock.handle && !this.state.hasBeenDragged) {
                console.log("connecting to the same block but has not dragged - skipping");
                return this.setState( this.dragEndState() );
            }
            const updatedFromPort = {...fromPort};
            updatedFromPort.connectedToId=toBlock.handle;
            const updatedPorts = fromBlock.ports;
            updatedPorts.update(updatedFromPort.handle, updatedFromPort);
            
            const updatedFromBlock = {...fromBlock, ports: updatedPorts};
            const blocks = this.state.blocks;
            blocks.update(updatedFromBlock.handle, updatedFromBlock);
            this.setState({ ...(this.dragEndState()),
                                   blocks
                                }); 
            this.notifyChange();
            return;
        }
        return this.setState( this.dragEndState() );
    }
 
    protected getTemplate(label: string) {
        const ndx = this.props.templates.findIndex( (t) => t.label === label);
        if(ndx>=0) {
            return this.props.templates[ndx];
        }
        return undefined;
    }

    protected instantiateTemplate(blocks: Blocks, templateBlock: IBlock) {
        const template = this.getTemplate(templateBlock.label);
        return this.instantiateBlockTemplate(blocks, templateBlock, template);
    }

    protected instantiateBlockTemplate(blocks: Blocks, coords: ICoords, template?: IBlockTemplate) {
        const maxBlockHandle = blocks.getMaxAllocatedHandle()+2;
        if(template!==undefined) {
            const {x,y} = coords;
            this.createBlock(blocks, x, y, template.label+"_"+maxBlockHandle,template.ports);
        }
    }
 
    protected moveBlock(block: IBlock, pos: ICoords) {
        const offset = this.state.offset || {x: 0, y: 0};
        const x = pos.x - offset.x;
        const y = pos.y - offset.y;
        const updatedBlock = {...block, x, y};
        const blocks = this.state.blocks;
        blocks.update(updatedBlock.handle, updatedBlock);
        //return this.setState({blocks, lastMousePos: pos});
        this.setState({blocks});
        this.notifyChange();
        return;
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
            return this.setState({lastMousePos, hasBeenDragged: true});
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
        if(this.state.pointedBlockId !== undefined || this.state.pointedPortId === undefined) {
            return this.setState({
                pointedBlockId: undefined,
                pointedPortId: undefined
            });    
        }
    }

    protected setPointedBlockPort(pointedBlock: IBlock, pointedPort?: IPort) {
        let pointedBlockId = pointedBlock.handle;
        let pointedPortId;
        if(pointedPort !== undefined) {
            pointedPortId = pointedPort.handle;
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
        let prevBlock;
        const blocks = this.state.blocks;
        prevBlock = this.addTestBlocks(blocks, 12, 20, 0, prevBlock);
        prevBlock = this.addTestBlocks(blocks, 12, 200, 100, prevBlock);
        prevBlock = this.addTestBlocks(blocks, 12, 350, 200, prevBlock);
        prevBlock = this.addTestBlocks(blocks, 12, 500, 300, prevBlock);
        console.log(prevBlock);
        this.setState({blocks});
        this.notifyChange();
        return;
    }

    protected addTestBlocks(blocks: Blocks, nBlocks: number, y: number, nameOffset: number, prevBlock?: IBlock) {        
        const startX = this.PALETTE_WIDTH;
        [...Array(nBlocks)].forEach( (n, ndx) => { 
            const b = this.createBlock( blocks, startX + ndx*200, y,
                            "NewBlock"+(nameOffset+ndx),
                           PortUtil.portTemplates([ "Port1", "Port2","Port3","Port4","Port5","Port6","Port7","Port8","Port9","Port10","Port11","Port12"]),
                           );
            if(prevBlock!==undefined) {
                const firstPort = prevBlock.ports?.firstObject();
                console.log("firsPort = ");
                console.dir(firstPort);
                if(firstPort !== undefined && b!==undefined) {
                    firstPort.connectedToId=b.handle;                    
                }
            }
            prevBlock = b;
        });
        return prevBlock;
    }

    protected createBlock(blocks: Blocks, x: number, y: number, label: string, 
                          portInfos: IPortInfo[], isTemplate: boolean=false) {
        const ports: Ports = new Ports("Ports", FlowchartUtil.MAX_PORTS_PER_BLOCK);
        portInfos.forEach( (pi) => {
             const port: IPort = {label: pi.label, handle: 0, connectedToId: pi.connectedToId};
             const h = ports.add(port);
             if(h!==undefined) {
                 port.handle=h;
             }
        });

        const newBlock: IBlock = {handle: 0, x, y, label, ports, isTemplate,
                                    lastX: x, lastY: y
                                   };
        const h = blocks.add(newBlock);
        if(h!==undefined) {
            newBlock.handle = h;
            return newBlock;
        }
        return undefined;
    }




    protected formatBlock(e: IBlock) {
        const block: IBlockLayout = {...e};

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
            <React.Fragment key={block.handle}>

               {frame}
               {rect}
               {text}

               {block.ports.list().map( (h, ndx) => {
                    const port = block.ports.safeGet(h);
                    if(port!==undefined) {
                       return this.formatPort(e, port, ndx);
                    }
                    return null;
                })}

            </React.Fragment>
        );
    }


    protected createTemplateBlock(blocks: Blocks, t: IBlockTemplate, ndx: number) {
        const x = this.VIEW_X + this.TEMPLATE_GAP_X;
        const y = (BlockUtil.BLOCK_HEIGHT + this.TEMPLATE_GAP_Y) * ndx + this.TEMPLATE_GAP_Y + this.PALETTE_HEADER_HEIGHT;
        return this.createBlock(blocks, x, y, t.label, [], true);
    }

    protected formatBlocks() {
        return (
            <React.Fragment>
                {this.state.blocks.list().map( (h) => {
                    const b = this.state.blocks.safeGet(h);
                    if(b!==undefined) {
                        return this.formatBlock(b);
                    }
                    return null;
                })}
            </React.Fragment>            
        );
    }

    protected formatConnections() {
        const conns: JSX.Element[] = [];
        this.state.blocks.list().forEach( (h) => {
            const b = this.state.blocks.safeGet(h);
            if( b!==undefined) {
                this.formatBlockConnections(conns, b)
           }
        });
        return conns;
    }

    protected formatBlockConnections(conns: JSX.Element[], b: IBlock) {
        b.ports.list().forEach( (h, ndx) => {
            const p = b.ports.safeGet(h);
            if(p!==undefined && p.connectedToId!==undefined) {
                const jsx = this.formatConnection(b, p, ndx);
                if(jsx !== undefined) {
                    conns.push(jsx);
                }
            }
        })
    }
          

    protected formatConnection( fromBlock: IBlock, fromPort: IPort, fromPortNo: number ) {
        const toBlock = this.state.blocks.safeGet(fromPort.connectedToId);
        const {selectedBlockId, pointedBlockId, selectedPortId, pointedPortId} = this.state;
        console.log("formatConnection selectedBlockId="+selectedBlockId+" pointedBlockId="+
        pointedBlockId+" selectedPortId="+selectedPortId+" pointedPortId="+pointedPortId);
        if(toBlock!==undefined) {
            const connProps = PortUtil.connProps(fromBlock, fromPort, fromPortNo, toBlock,
                selectedBlockId, pointedBlockId, selectedPortId, pointedPortId);
            const {key, line1Props, line2Props, line3Props} = connProps;
                //console.dir(connProps);
            return (
                    <React.Fragment key={key}>
                       <defs>
                          <marker id="arrow" markerWidth="6" markerHeight="6" refX="0" refY="1" orient="auto" markerUnits="strokeWidth">
                             <path d="M0,0 L0,2 L3,1 z" fill="rgb(16,50,100)" />
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
        const headerHeight = this.PALETTE_HEADER_HEIGHT;
        const paletteY = y + headerHeight;
        const textX = x + w/2;
        const textY = y + this.PALETTE_TEXT_HEIGHT + this.PALETTE_HEADER_GAP_Y;
        if( true ) {
            return null;
        }
        return (
            <React.Fragment>
               <rect id="paletteheader" x={x} y={y} width={w} height={headerHeight} 
                    className="palette-header"
                >                                
               </rect>
               <text x={textX} y={textY} className = "palette-text" textAnchor="middle" >
                   Block Templates
               </text>
               <rect id="palette" x={x} y={paletteY} width={w} height={h} 
                     className="palette">                
               </rect>
            </React.Fragment>            
        );
    }

    public notifyChange() {
        const blocks: IFlowchart = BlockUtil.blocksToInfo(this.state.blocks);
        this.props.onFlowChange(blocks);
    }

    protected onMouseUpContainer(e: React.DragEvent) {
        e.persist();
        const coords: ICoords = this.getMousePosition(e);
        const data = e.dataTransfer.getData("Text");
        console.dir("data="+data);
        console.log("-----onDrop data="+data+" coords="+coords.x+","+coords.y);
        if(data && data.length>0) {
            const template = this.getTemplate(data);
            if(template !== undefined) {   
                const blocks = this.state.blocks;                
                if( this.isInCanvas(coords) ) {
                    this.instantiateBlockTemplate(blocks, coords, template);
                    this.setState({ ...(this.dragEndState()),
                        blocks                              
                    });
                    this.notifyChange();
                    return;
                }
                this.setState({ ...(this.dragEndState()),
                                blocks                              
                              });
        

            }
        }
    }

    public render() {
        const viewBox = this.VIEW_X + " " + this.VIEW_Y + " " + 
                        this.VIEW_WIDTH + " " + this.VIEW_HEIGHT;
            //                           {this.formatPalette(this.VIEW_X, this.VIEW_Y, this.PALETTE_WIDTH, this.PALETTE_HEIGHT)}                        
        return (
            <div className="flowchart-container">
              <div className="flowchart-pane">
              <button onClick={ () => this.addBlock()}>Test</button>
                <hr />
                <table>
                    <tr className="flowchart-table-row">
                        <td className="flowchart-table-left">
                           <TemplateTree templates={this.props.templates}/>
                        </td>
                        <td className="flowchart-table-right">
                            <svg id="canvas" xmlns="http://www.w3.org/2000/svg" 
                                width={this.VIEW_WIDTH} height={this.VIEW_HEIGHT}
                                viewBox={viewBox}
                                onMouseDown = { (e) => this.onMouseDown(e) }
                                onMouseUp = { (e) => this.onMouseUp(e) }
                                onMouseMove = { (e) => this.onMouseMove(e) }
                                onMouseLeave = { (e) => this.onMouseLeave(e) }
                                onDragOver = { (e) => e.preventDefault()}
                                onDrop={ (e) => this.onMouseUpContainer(e) }
                            >
                                <rect id="bkg" x={this.VIEW_X} y={this.VIEW_Y} 
                                    width={this.VIEW_WIDTH} height={this.VIEW_HEIGHT} 
                                    className="canvas"
                                >
                                </rect>
                                { this.formatBlocks() }
                                { this.formatConnections() }
                            </svg>
                        </td>                        
                    </tr>                    
                </table>                
                <ValidationError name={this.props.name} error={this.props.error} />
              </div>
            </div>
        );
    }
}
 
const FlowchartEdit = FlowchartEditInternal;
export default FlowchartEdit;