import {Ports} from "./port";
import ILabelledShape from "./labelled-shape";
import FlowchartUtil from "./util";
import IShape from "./shape";
import ICoords from "./coords";
import OrderedList from "../../framework/ordered-list";
import { parseHandle, IHandle } from "../handle";
import {PortUtil, IPortInfo} from "./port";
import {IBlockTemplate} from "./template";

export interface IBlock extends ILabelledShape {
    ports: Ports;
    isTemplate: boolean;
    lastX: number;
    lastY: number;
}

export interface IBlockInfo extends ILabelledShape {
    ports: IPortInfo[]
};

/*
export interface IBlocks {
    [name: string]: IBlock;
}
*/
export class Blocks extends OrderedList<IBlock> {
    
}

export interface IBlockLayout extends IBlock {

}

export interface IBlockRenderVars {
    block: IBlockLayout;
    pointedBlockId?: IHandle;
    selectedBlockId?: IHandle;
}

interface IBlockProps {
    key: string;
    id: string;
    className: string;
}

interface IShapeProps extends IBlockProps, IShape {
}

export type IFrameProps = IShapeProps;
export type IRectProps = IShapeProps;

interface ICoordProps extends IBlockProps, ICoords {
}

export type ITextProps = ICoordProps;

export interface IBlockRenderProps {
    frameProps: IFrameProps;
    rectProps: IRectProps;
    textProps: ITextProps;
};

export class BlockUtil {
    public static readonly RECT_GAP_X=6;
    public static readonly RECT_GAP_Y=6;
    public static readonly BLOCK_WIDTH=100;
    public static readonly BLOCK_HEIGHT=120;
    public static readonly HEADER_TEXT_HEIGHT=22;
    public static readonly HEADER_TEXT_GAP_X = 10;
    public static readonly HEADER_TEXT_SYMBOL_WIDTH = 10;


    public static extractBlockId(e: React.BaseSyntheticEvent) {
        const id: string = (e.target as any).id;
        if(id !== undefined && id.indexOf("dragconn")<0 && id.indexOf("conn")<0 ) {
            const str = FlowchartUtil.extractTag(e, "block");
            if(str !== undefined && str.length>0) {
                const h = parseHandle(str);
                return h;
            }            
        }
        return undefined;        
    }
    public static pieceKey(blockHandle: IHandle, piece: string) {
        const delim = FlowchartUtil.FLD_DELIM;
        return "block" + delim + blockHandle + delim + piece;
    }

    public static frameKey(blockHandle: IHandle) {
        return BlockUtil.pieceKey(blockHandle, "frame");
    }

    public static rectKey(blockHandle: IHandle) {
        return BlockUtil.pieceKey(blockHandle, "rect");
    }

    public static textKey(blockHandle: IHandle) {
        return BlockUtil.pieceKey(blockHandle, "text");
    }

    public static isPointed(block: IBlock, pointedBlockId?: IHandle) {
        if(pointedBlockId !== undefined) {
            return block.handle === pointedBlockId;
        }
        return false;
    }

    public static isSelected(block: IBlock, selectedBlockId?: IHandle) {
        if(selectedBlockId !== undefined) {
            return block.handle === selectedBlockId;
        }
        return false;
    }

    public static frameClass(block: IBlock, pointedBlockId?: IHandle, selectedBlockId?: IHandle) {
        let clsName = "block";
        const isPointed = BlockUtil.isPointed(block, pointedBlockId);
        const isSelected = BlockUtil.isSelected(block, selectedBlockId);
        if (isPointed) {
            clsName+=" block-pointed";
        }
        if(isSelected) {
            clsName+=" block-selected";
        }
        return clsName;
    }

    public static rectClass(block: IBlock, pointedBlockId?: IHandle, selectedBlockId?: IHandle) {
        return  "block-rect";
    }

    public static textClass(block: IBlock, pointedBlockId?: IHandle, selectedBlockId?: IHandle) {
        return  "block-text";
    }

    protected static blockWidth(block: IBlock) {
        //TODO dynamically calculate block width
        //return BlockUtil.BLOCK_WIDTH;
        let width = BlockUtil.BLOCK_WIDTH;
        const hdrWidth = BlockUtil.headerWidth(block) + 2 * BlockUtil.HEADER_TEXT_GAP_X;
        const portsWidth = PortUtil.portsWidth(block.ports) + 2 * BlockUtil.RECT_GAP_X;
        if(hdrWidth>width) {
            width=hdrWidth;
        }
        if(portsWidth>width) {
            width=portsWidth;
        }
        return width;
    }

    protected static headerWidth(block: IBlock) {
        return block.label.length * BlockUtil.HEADER_TEXT_SYMBOL_WIDTH;        
    }

    public static blockHeight(block: IBlock) {
        //TODO dynamically calculate block height
        let height = BlockUtil.BLOCK_HEIGHT;        
        const rectHeight = this.rectHeight(block) + BlockUtil.HEADER_TEXT_HEIGHT + 4 * BlockUtil.RECT_GAP_Y;
        if(rectHeight>height) {
            height = rectHeight;
        }
        return height;
    }

    public static frameX(block: IBlock) {
        return block.x;
    }
    
    public static frameY(block: IBlock) {
        return block.y;
    }

    public static frameWidth(block: IBlock) {
        return BlockUtil.blockWidth(block);
    }

    public static frameHeight(block: IBlock) {
        return BlockUtil.blockHeight(block);
    }

   

    public static textStartX(block: IBlock) {
        return BlockUtil.frameX(block) + BlockUtil.HEADER_TEXT_GAP_X;
    }

    public static textBottomY(block: IBlock) {
        return BlockUtil.frameY(block) + BlockUtil.HEADER_TEXT_HEIGHT;
    }



    public static rectX(block: IBlock) {
        return BlockUtil.frameX(block) + BlockUtil.RECT_GAP_X;
    }

    public static rectY(block: IBlock) {
        return BlockUtil.textBottomY(block) + 2 * BlockUtil.RECT_GAP_Y;
    }

    public static rectWidth(block: IBlock) {
        return BlockUtil.frameWidth(block) - 2 * BlockUtil.RECT_GAP_X;
    }

    public static rectHeight(block: IBlock) {
        let height = BlockUtil.BLOCK_HEIGHT - BlockUtil.HEADER_TEXT_HEIGHT - 3 * BlockUtil.RECT_GAP_Y;;
        const portHeight = PortUtil.portsHeight(block.ports) + 60//;3 * BlockUtil.RECT_GAP_Y;
        if(portHeight > height) {
            height = portHeight;
        }
        return height;
    }

    public static frameProps(vars: IBlockRenderVars): IFrameProps {
        const {block, pointedBlockId, selectedBlockId} = vars;

        const key = BlockUtil.frameKey(block.handle);
        const id = key;
        const className = BlockUtil.frameClass(block, pointedBlockId, selectedBlockId);
        const x = BlockUtil.frameX(block);
        const y = BlockUtil.frameY(block);
        const width = BlockUtil.frameWidth(block);
        const height = BlockUtil.frameHeight(block);

        const props: IFrameProps = {
            id, key, className, x, y, width, height
        };

        return props;
    }

    public static rectProps(vars: IBlockRenderVars): IRectProps {
        const {block, pointedBlockId, selectedBlockId} = vars;
        const id = BlockUtil.rectKey(block.handle);
        const key = id;
        const className = BlockUtil.rectClass(block, pointedBlockId, selectedBlockId);
        const x = BlockUtil.rectX(block); //blockX+rectGapX
        const y = BlockUtil.rectY(block);  //blockY+this.TEXT_HEIGHT+2*this.RECT_GAP_Y;
        const width = BlockUtil.rectWidth(block); //blockWidth-2*rectGapX
        const height = BlockUtil.rectHeight(block); //blockHeight-this.TEXT_HEIGHT-3*this.RECT_GAP_Y;
 
        const props: IRectProps = {id, key, className, x, y, width, height};
    
        return props;
    }
   
    public static textProps(vars: IBlockRenderVars): ITextProps {
        const {block, pointedBlockId, selectedBlockId} = vars;
        const id = BlockUtil.textKey(block.handle);
        const key = id;
        const className = BlockUtil.textClass(block, pointedBlockId, selectedBlockId);
        const x = BlockUtil.textStartX(block); //frameX+this.TEXT_GAP_X
        const y = BlockUtil.textBottomY(block); //frameY+BlockUtil.HEADER_TEXT_HEIGHT

        const textProps = {id, key, className, x, y };

        return textProps;
    }

    public static blockRenderProps(vars: IBlockRenderVars): IBlockRenderProps {
        const frameProps = BlockUtil.frameProps(vars);
        const rectProps = BlockUtil.rectProps(vars);
        const textProps = BlockUtil.textProps(vars);
        const props: IBlockRenderProps = {
            frameProps, rectProps, textProps
        };

        return props;        
    }

    public static entryPortX(block: IBlock) {
        return BlockUtil.frameX(block)
    }

    public static entryPortY(block: IBlock) {
        return BlockUtil.frameY(block) + BlockUtil.frameHeight(block)/2;
    }

    public static isWithinFrame(b: IBlock, x: number, y: number) {
        const blockX = BlockUtil.frameX(b);
        const blockY = BlockUtil.frameY(b);
        const blockWidth = BlockUtil.frameWidth(b);
        const blockHeight = BlockUtil.frameHeight(b);
        let found=false;
        if(x >= blockX && x <= blockX + blockWidth &&
           y >= blockY && y <= blockY + blockHeight) {
               found=true;
        }
 //       console.log(" isWithinFrame found="+found+" x="+x+" y="+y+" block="+b.label+" b.x="+blockX+" b.y="+blockY+" b.w="+blockWidth+" b.h="+blockHeight);
        return found;
    }

    public static blocksToInfo(blocks: Blocks) {
        const blks: IBlockInfo[] = [];
        blocks.list().forEach( (h) => {
            const b: IBlock|undefined = blocks.safeGet(h);
            if(b !== undefined && !b.isTemplate) {
                const {handle, label, x, y} = b;
                const ports = PortUtil.portsToInfo(b.ports);
                const bi: IBlockInfo = { handle, label, x, y, ports: ports};
                blks.push(bi);
            }
        });
        return blks;
    }

    public static template0(label: string) {
        const t: IBlockTemplate = {label, name: label, ports: [ PortUtil.portTemplate("OK")]};
        return t;
    }

}