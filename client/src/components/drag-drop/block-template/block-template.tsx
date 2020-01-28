import React from 'react';

interface IProps {
    x: number;
    y: number;
    w: number;
    h: number;
}

class BlockTemplateInternal extends React.Component<IProps> {
    
    public render() {
        return super.render();
    }
}

const BlockTemplate = BlockTemplateInternal;

export default BlockTemplate;