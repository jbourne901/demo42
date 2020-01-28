import React from 'react';

interface IProps {
    blockId: string;
    x: number;
    y: number;
    w: number;
    h: number;
    isSelected: boolean;
    header: string;
}

class BlockInternal extends React.Component<IProps> {

    public render() {
        const {blockId, x, y, w, h} = this.props;
        const key = blockId;
        const blockFrameId="block_frame_"+blockId;
        const blockRectId="block_rect_"+blockId;
        const blockTextId="block_text_"+blockId;
        const clsName = (this.props.isSelected) ? "block-selected" : "block";


        return (
            <g id={key}>

               <rect id={blockFrameId} x={x} y={y} width={w} height={h}
                   className={clsName}
               />

               <rect id={blockRectId} x={x+8} y={y+30} width={w-16} height={h-36}
                   className="block-rect"
               />

               <text id={blockTextId} x={x+10} y={y+22} className="block-text" >
                   {this.props.header}
               </text>
            </g>
        );
    }
}

const Block = BlockInternal;

export default Block;
