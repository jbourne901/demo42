import React from 'react';

interface IProps {
    refresh(): void;
}

class Refresher extends React.Component<IProps> {
    public componentDidMount() {
        this.props.refresh();
    }
    public render() {
        return <React.Fragment></React.Fragment>;
    }
}

export default Refresher;
