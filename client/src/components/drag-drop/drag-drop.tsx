import React from 'react';
import shortid from 'shortid';
import "./drag-drop.css";
import Block from "./block";

interface ICoords {
    x: number;
    y: number;
}

interface IBlock extends ICoords {
    uniqueid: string;
}

interface IProps {}
interface IState {
    elements: IBlock[];
    selectedElementId: number;
    offset?: ICoords;
}
class DragDrop extends React.Component<IProps, IState> {

    private readonly START_X=200;
    private readonly START_Y=200;
    private readonly BLOCK_WIDTH=100;
    private readonly BLOCK_HEIGHT=120;
    private readonly BLOCK_RADIUS=10;
    private readonly VIEW_X=100;
    private readonly VIEW_Y=100;
    private readonly VIEW_WIDTH=3000;
    private readonly VIEW_HEIGHT=2000;

    constructor(props: IProps) {
        super(props);
        this.state = {
            elements: [],
            selectedElementId: 0
        };
    }

    protected extractBlockId(strid: string) {
        const pattern="block_";
        if (strid.startsWith(pattern)) {
           const tmp = strid.substring(pattern.length);
           const ndx = tmp.indexOf("_");
           const blockId = tmp.substring(ndx+1);
           if(blockId && blockId.length>0) {
               return blockId;
           }
        }
    }

    protected onMouseDown(e: React.MouseEvent) {
        e.persist();
        const strid: string = (e.target as any).id;
        const targetId = this.extractBlockId(strid);
        console.log("onMouseDown targetId="+targetId+" target=");        
        console.dir(e.target);
        const ndx = this.state.elements.findIndex( (b) => b.uniqueid === targetId );
        console.log("onMouseDown ndx="  + ndx);
        if ( ndx>=0 ) {
            const selectedElement = this.state.elements[ndx];
            const offset: ICoords = this.getMousePosition(e);
            offset.x -= parseFloat(""+selectedElement.x);
            offset.y -= parseFloat(""+selectedElement.y);
            console.log("mouseDown set selectedElementId="+ (ndx+1) );
            this.setState({
                selectedElementId: ndx+1,
                offset
            });
          } else {
              console.log("mouseDown - selectedElementId=0");
            this.setState({
                selectedElementId: 0,
                offset: undefined
            });              
          }
    }

    protected getMousePosition(e: React.MouseEvent) {
        const svg = document.getElementById("canvas") as any;
        console.log("getMousePosition svg=");
        console.dir(svg);
        const CTM = svg.getScreenCTM();
        console.log("CTM=");
        console.dir(CTM);
        console.log("e = ");
        console.dir(e);
        const coords: ICoords = {
            x: (e.clientX - CTM.e) / CTM.a,
            y: (e.clientY - CTM.f) / CTM.d
          }; 
        return coords;       
    }

    protected onMouseUp(e: React.MouseEvent) {
        this.setState({
            offset: undefined,
        });
    }

    protected onMouseMove(e: React.MouseEvent) {
        e.persist();
        if(this.state.selectedElementId > 0) {
            const ndx1 = this.state.selectedElementId-1;
            const selectedElement = this.state.elements[ndx1];
            const offset = this.state.offset;
            if (selectedElement) {
                if(offset) {
                    e.preventDefault();
                    const coord = this.getMousePosition(e);
                    const x = coord.x - offset.x;
                    const y = coord.y - offset.y;
                    const newElements = this.state.elements.map( (el, ndx) => 
                        (ndx === ndx1) ? {...el, x, y} : el 
                                                               );
                    this.setState({elements: newElements});
                }
              }            
        }
    }

    protected onMouseLeave(e: React.MouseEvent) {

    }
    
    protected addElement() {
        const newid = shortid.generate();        
        const newElement = {uniqueid: newid, x: this.START_X, y: this.START_Y};
        const elements = [...this.state.elements, newElement ];
        console.log("addElement elements=");
        console.dir(elements);
        this.setState({elements});
    }    

    protected formatBlock(e: IBlock) {
        const key = e.uniqueid;
        const w = this.BLOCK_WIDTH;
        const h = this.BLOCK_HEIGHT;
        const x = e.x;
        const y = e.y;
        const header="Schedule";
        let selectedElement;
        if (this.state.selectedElementId>0) {
            const ndx = this.state.selectedElementId-1;
            selectedElement = this.state.elements[ndx];
        }
        let isSelected = (selectedElement && key === selectedElement.uniqueid) || false;
         
        return (            
            <Block key={key} x={x} y={y} w={w} h={h} blockId={key} 
                isSelected={isSelected} header={header}
            />
        );
    }

    public render() {
        const viewBox = this.VIEW_X + " " + this.VIEW_Y + " " + this.VIEW_WIDTH + " " + this.VIEW_HEIGHT;
        
        return (
            <React.Fragment>
                <button onClick={ () => this.addElement()}>Add</button>
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
                    {this.state.elements.map( (e) => this.formatBlock(e) ) }
                </svg>
            </React.Fragment>
        )
    }
}
 

export default DragDrop;