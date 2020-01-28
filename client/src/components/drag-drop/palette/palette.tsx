import React from 'react';

interface IProps {
    x: number;
    y: number;
    w: number;
    h: number;
}

class PaletteInternal extends React.Component<IProps> {

    public render() {
        const {x,y,w,h} = this.props;

        return (
            <React.Fragment>
               <rect id="palette" x={x} y={y} width={w} height={h} className="palette">                
               </rect>
            </React.Fragment>
        );
    }
}

const Palette = PaletteInternal;

export default Palette;