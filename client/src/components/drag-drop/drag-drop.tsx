import React from 'react';
import shortid from 'shortid';
import "./drag-drop.css";
import Block from "./block";
import Palette from "./palette";
import ILabeledShape from '../../model/labelled-shape';
import ICoords from "../../model/coords";
import IPort from "../../model/port";

function template0(label: string) {
    const t: IBlockTemplate = {label, ports: ["OK"]};
    return t;
}



interface IBlock extends ILabeledShape {
    ports: IPort[];
    isTemplate: boolean;
    lastX: number;
    lastY: number;
}

interface IBlockTemplate {
    label: string;
    ports: string[];
}

interface IProps {}
interface IState {
    elements: IBlock[];
    selectedElementId?: string;
    pointedElementId?: string;
    offset?: ICoords;
    lastMousePos?: ICoords;
    selectedPortId?: string;
    pointedPortId?: string;
    selectedPortX?: number;
    selectedPortY?: number;
}
class DragDrop extends React.Component<IProps, IState> {

    private readonly START_X=200;
    private readonly START_Y=200;
    private readonly BLOCK_WIDTH=100;
    private readonly BLOCK_HEIGHT=120;
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
    private readonly FLD_DELIM="|";
    private NEXT_BLOCK_ID=1;

    private readonly templates: IBlockTemplate[] = [ template0("Schedule"),
                                                     template0("Menu"),
                                                     template0("Queue"),
                                                   ];

    constructor(props: IProps) {
        super(props);
        this.state = {
            elements: []
        };
    }

    componentDidMount() {
        const elements = this.templates.map( (t, ndx) => this.createBlockTemplateInfo(t, ndx));
        this.setState({elements});
    }

    // blockId: block_xyz_block
    // frame: block_xyz_frame
    // text: block_xyz_text
    // rect: block_xyz_rect
    // port: abc  : block_xyz_port_abc_port
    // port: abc port knob : block_xyz_port_abc_knob
    // port: abc port text : block_xyz_port_abc_text

    protected extractTag(e: React.BaseSyntheticEvent, tagname: string) {
        const strid: string = (e.target as any).id;
        const pattern=tagname+this.FLD_DELIM;
        let ndx = strid.indexOf(pattern);
        if(ndx<0) {
            return undefined;
        }
        const start = ndx+pattern.length;
        ndx = strid.indexOf(this.FLD_DELIM, start);
        const tag = strid.substring(start, ndx);
        if(tag && tag.length>0) {
            return tag;
        }
        return undefined;
    }


    protected extractBlockId(e: React.BaseSyntheticEvent) {
        return this.extractTag(e, "block");
    }

    protected extractPortId(e: React.BaseSyntheticEvent) {
        return this.extractTag(e, "port");
    }

    protected eventTargetBlockIndexPlus1(e: React.BaseSyntheticEvent) {
       const blockId = this.extractBlockId(e);
       if(blockId && blockId.length>0) {
           const index = this.state.elements.findIndex( (el) => el.uniqueid === blockId);
           if(index>=0) {
               return index+1;
           }
       }
       return 0;
    }

    protected eventTargetPortIndexPlus1(element: IBlock, e: React.BaseSyntheticEvent) {
        const portId = this.extractPortId(e);
        if(portId && portId.length>0) {
            const index = element.ports.findIndex( (p) => p.uniqueid === portId);
            if(index>=0) {
                return index+1;
            }
        }
        return 0;
    }

    protected findElementIndexPlus1(uniqueid?: string) {
        if(uniqueid) {
            const ndx = this.state.elements.findIndex( (e) => e.uniqueid === uniqueid);
            if (ndx>=0) {
                return ndx+1;
            }    
        }
        return 0;
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

    protected onMouseDown(e: React.MouseEvent) {
        e.persist();
        console.log("onMouseDown e=");
        console.dir(e);
        const ndxBlock = this.eventTargetBlockIndexPlus1(e);
        console.log("onMouseDown ndxBlock="  + ndxBlock);
        if ( ndxBlock>0 && this.state.elements[ndxBlock-1]) {
            e.preventDefault();
            const selectedElement = this.state.elements[ndxBlock-1];
            const ndxPort = this.eventTargetPortIndexPlus1(selectedElement, e);            
            const lastMousePos: ICoords = this.getMousePosition(e);
            if(ndxPort>0) {
                const selectedPortId = selectedElement.ports[ndxPort-1].uniqueid;
                console.log("qqqqqq set lastmousepos=");
                console.dir(lastMousePos);
                return this.setState({
                    selectedElementId: selectedElement.uniqueid,
                    selectedPortId,
                    offset: undefined,
                    lastMousePos
                });    
            }
            const offset: ICoords = lastMousePos;
            offset.x -= parseFloat(""+selectedElement.x);
            offset.y -= parseFloat(""+selectedElement.y);
            console.log("qqqqqq set lastmousepos=");
            console.dir(lastMousePos);
            return this.setState({
                    selectedElementId: selectedElement.uniqueid,
                    selectedPortId: undefined,
                    offset,
                    lastMousePos
            });    
        } else {
            this.setState({
                selectedElementId: undefined,
                selectedPortId: undefined,
                offset: undefined
            });              
        }
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

    protected onMouseUp(e: React.MouseEvent) {
        console.log("onMouseUp target=");
        console.dir(e);
        // we should use selected element and not event target
        // otherwise if we shove element under another element 
        // it will not be moved back
        //const ndx = this.eventTargetBlockIndexPlus1(e);
        const ndx = this.findElementIndexPlus1(this.state.selectedElementId);
        if ( ndx>0) {
            const el = this.state.elements[ndx-1];
            if(el.isTemplate) {
                let newElements = this.undoMoveElements(el);
                if( this.isInCanvas(el) ) {
                    const newBlock = this.instantiateTemplate(el);
                    if(newBlock) {
                        newElements = [...newElements, newBlock];
                    }                    
                }
                return this.setState({ elements: newElements,
                                       offset: undefined,
                                       lastMousePos: undefined
                                     });
            } else {
                if(this.isInCanvas(el)) {
                    if(this.state.selectedPortId && this.state.lastMousePos) {
                        const blockNdx = this.findElementIndexPlus1(this.state.selectedElementId);                        
                        if(blockNdx>0) {
                            const selectedElement = this.state.elements[blockNdx-1];
                            if(selectedElement) {
                                const portNdx = this.findPortIndexPlus1(selectedElement, this.state.selectedPortId);
                                if(portNdx>0) {
                                    const selectedPort = selectedElement.ports[portNdx-1];
                                    if(selectedPort) {
                                        const newPort = {...selectedPort};
                                        newPort.connectedToId=el.uniqueid;
                                        const newPorts = selectedElement.ports.map( (p) => (p.uniqueid===this.state.selectedPortId)?newPort:p);                                        
                                        const newElement = {...selectedElement, ports: newPorts};
                                        const newElements = this.state.elements.map( (elm) => (elm.uniqueid===selectedPort.uniqueid)?newElement:elm);
                                        return this.setState({
                                                              elements: newElements,
                                                              offset: undefined,
                                                              lastMousePos: undefined     
                                        });
                                    }
                                }
                            }                            
                        }
                    }
                    return this.setState({
                        offset: undefined,
                        lastMousePos: undefined     
                    });
                } else {
                    console.log("non-template block outside canvas - undoing move");
                    const newElements = this.undoMoveElements(el);
                    //return this.setState({ blockDragOffset: undefined});
                    return this.setState({ elements: newElements, 
                                           offset: undefined,
                                           lastMousePos: undefined
                                         });
                }
            }
        }
        
        return this.setState({
            offset: undefined,
            lastMousePos: undefined
        });
    }

    protected undoMoveElements(el: IBlock) {
        const newEl = {...el, x: el.lastX, y: el.lastY};
        const newElements = this.state.elements.map( (e) => (e.uniqueid===el.uniqueid)?newEl:e);
        return newElements;
    }

    protected blockPort(label: string) {
        return {
            label
        };
    }

    protected getTemplate(label: string) {
        const ndx = this.templates.findIndex( (t) => t.label === label);
        if(ndx>=0) {
            return this.templates[ndx];
        }
        return undefined;
    }

    protected instantiateTemplate(templateBlock: IBlock) {
        const template = this.getTemplate(templateBlock.label);
        console.log("instantiateTemplate templatelabel="+templateBlock.label+" template=");
        console.dir(template);
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

    protected onMouseMove(e: React.MouseEvent) {
        e.persist();
        const lastMousePos = this.getMousePosition(e);
        if(e.buttons===1){
            if(this.state.selectedElementId && this.state.selectedElementId.length>0) {
                const ndx1 = this.findElementIndexPlus1(this.state.selectedElementId);
                const selectedElement = this.state.elements[ndx1-1];
                const offset = this.state.offset;
                if (selectedElement) {
                    if(offset) {
                        e.preventDefault();
                        const coord = this.getMousePosition(e);
                        const x = coord.x - offset.x;
                        const y = coord.y - offset.y;
                        const newElements = this.state.elements.map( (el, ndx) => 
                            (ndx === ndx1-1) ? {...el, x, y} : el 
                                                                   );
                        console.log("qqqqqq set lastmousepos=");
                        console.dir(lastMousePos);
                                                   
                        return this.setState({elements: newElements, lastMousePos});
                    }
                }            
            }
            console.log("qqqqqq set lastmousepos=");
            console.dir(lastMousePos);
            return this.setState({lastMousePos});
        }
        let pointedElementId;
        let pointedPortId;
        if(e.buttons === 0) {            
            const ndx = this.eventTargetBlockIndexPlus1(e);
            if ( ndx>0 && this.state.elements[ndx-1]) {
                const pointedElement = this.state.elements[ndx-1];
                pointedElementId = pointedElement.uniqueid;
                const ndxPort = this.eventTargetPortIndexPlus1(pointedElement, e);
                console.log("---+++--- ndxPort="+ndxPort+" pointedElement.ports=");
                console.dir(pointedElement.ports);
                console.log("ports[ndxPort-1]=");
                console.dir(pointedElement.ports[ndxPort-1]);
                if ( ndxPort>0 && pointedElement.ports[ndxPort-1]) {
                   pointedPortId = pointedElement.ports[ndxPort-1].uniqueid;
                   console.log("--------pointedPortId="+pointedPortId);
                }
            }
        }
        if( this.state.pointedElementId !== pointedElementId) {
            this.setState({pointedElementId, pointedPortId});
        } else {
            if (this.state.pointedPortId !== pointedPortId) {
                this.setState({pointedPortId});
            }
        }
    }

    

    protected onMouseLeave(e: React.MouseEvent) {

    }

    protected addBlock() {
        const newElement = this.createElementInfo(this.START_X, this.START_Y, "NewBlock",
        [ "Port1", "Port2","Port3"],
        false);
        const elements = [...this.state.elements, newElement ];
        console.log("addElement newElement = ");
        console.dir(newElement);
        console.dir(elements);
        this.setState({elements});
    }

    protected createElementInfo(x: number, y: number, label: string, strports: string[], isTemplate: boolean) {
        const newid = shortid.generate();
        const ports = strports.map( (s) => {
             const portId = shortid.generate();
             const port: IPort = {label: s, uniqueid: portId};
             return port;
        });
        const newElement: IBlock = {uniqueid: newid, x, y, label, ports, isTemplate,
                                    lastX: x, lastY: y
                                   };
        return newElement;
    }

    protected formatBlock(e: IBlock, index: number) {
        const key = e.uniqueid;
        const w = this.BLOCK_WIDTH;
        const h = this.BLOCK_HEIGHT;
        const x = e.x;
        const y = e.y;
        const label = e.label;
        const ports: IPort[] = e.ports;
        let selectedElement;
        if (this.state.selectedElementId && this.state.selectedElementId.length>0) {
            const ndx = this.state.elements.findIndex( (el) => el.uniqueid===this.state.selectedElementId);
            selectedElement = this.state.elements[ndx];
        }
        const isSelected = (selectedElement && key === selectedElement.uniqueid) || false;                
        const isPointed = (e.uniqueid === this.state.pointedElementId) || false;
        const pointedPortId = (isPointed) ? this.state.pointedPortId : undefined;
        const selectedPortId = (isSelected) ? this.state.selectedPortId : undefined;
        const lastMousePos = this.state.lastMousePos;
        const lastX = (lastMousePos || {}).x;
        const lastY = (lastMousePos || {}).y;
console.log("qqqqqqqqqqq lastX="+lastX+" lastY="+lastY);
        return (            
            <Block key={key} x={x} y={y} w={w} h={h} uniqueid={key} 
                isSelected={isSelected} label={label} ports = {ports}
                isPointed = {isPointed} pointedPortId = {pointedPortId}
                selectedPortId = {selectedPortId} lastMousePos = {lastMousePos}
            />
        );
    }


    protected createBlockTemplateInfo(t: IBlockTemplate, ndx: number) {
        console.log("addBlockTemplate header="+t.label);
        const x = this.VIEW_X + this.TEMPLATE_GAP_X;
        const y = (this.BLOCK_HEIGHT + this.TEMPLATE_GAP_Y) * ndx + this.TEMPLATE_GAP_Y;
        return this.createElementInfo(x, y, t.label, [], true);
    }

    protected formatBlocks() {
        console.log("formatBlocks elements=");
        console.dir(this.state.elements);
        // in order to correctly render z-order we have to first render all non-selected elements 
        // and render the selected element last
        const selId = this.state.selectedElementId;
        const selNdx = this.state.elements.findIndex( (el) => el.uniqueid===selId);
        let jsxSelected;
        if(selNdx>=0)  {
            jsxSelected = this.formatBlock(this.state.elements[selNdx], selNdx);
        }
        const jsxOthers = this.state.elements.map( (e, ndx) => ( e.uniqueid===selId ? null : this.formatBlock(e, ndx) ) );
        return (
            <React.Fragment>
                {jsxOthers}
                {jsxSelected}
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
                    <Palette x={this.VIEW_X}
                             y={this.VIEW_Y} 
                             w={this.PALETTE_WIDTH}
                             h={this.PALETTE_HEIGHT}
                    />
                    { this.formatBlocks() }
                </svg>
            </React.Fragment>
        )
    }
}
 

export default DragDrop;