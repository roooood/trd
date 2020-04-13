import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import { t } from 'locales';

import { withStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Backdrop from '@material-ui/core/Backdrop';


const Fab = withStyles(theme => ({
    fab: {
        background: 'rgba(31, 32, 36, 0.4)',
        backdropFilter: 'blur(3px)',
        border: '1px solid rgba(128, 128, 128, 0.8)',
        width: 40,
        height: 40,
        '&:hover': {
            background: 'rgba(31, 32, 36, 0.5)',
        },
    },
}))(SpeedDial);

const FabAction = withStyles(theme => ({
    fab: {
        background: 'rgba(31, 32, 36, 0.4)',
        backdropFilter: 'blur(3px)',
        border: '1px solid rgba(128, 128, 128, 0.8)',
        color: '#fff',
        width: 35,
        height: 35,
        margin: 2,
        '&:hover': {
            background: 'rgba(31, 32, 36, 0.5)',
        },
    },
}))(SpeedDialAction);

const Candle = () => {
    return (
        <svg  viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"></path><path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"></path><path d="M9 8v12h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z"></path><path d="M10 4h1v3.5h-1zm0 16.5h1V24h-1z"></path></svg>
    )
}
const Line = () => {
    return (
        <svg  viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M11.982 16.689L17.192 12h3.033l4.149-4.668-.748-.664L19.776 11h-2.968l-4.79 4.311L9 12.293l-4.354 4.353.708.708L9 13.707z"></path></svg>
    )
}
const Area = () => {
    return (
        <svg  viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M12.5 17.207L18.707 11h2l3.647-3.646-.708-.708L20.293 10h-2L12.5 15.793l-3-3-4.854 4.853.708.708L9.5 14.207z"></path><path d="M9 16h1v1H9zm1 1h1v1h-1zm-1 1h1v1H9zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1H9zm2 0h1v1h-1zm-3-3h1v1H8zm-1 1h1v1H7zm-1 1h1v1H6zm2 0h1v1H8zm-1 1h1v1H7zm-2 0h1v1H5zm17-9h1v1h-1zm1-1h1v1h-1zm0 2h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-5-7h1v1h-1zm2 0h1v1h-1zm1-1h1v1h-1zm-2 2h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-2-6h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-3-3h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1z"></path></svg>
    )
}
const Bar = () => {
    return (
        <svg  viewBox="0 0 28 28" width="28" height="28"> <g  viewBox="0 0 28 28" width="28" height="28"><g fill="none" stroke="currentColor"><path d="M10.5 9v12M7 18.5h3.5M14 9.5h-3.5M19.5 3v12M16 6.5h3.5M23 14.5h-3.5M18.5 19.5h2a1 1 0 1 0 0-2h-2V22v-2.5zM21.5 22L20 19.5"></path></g></g></svg >
    )
}
const charts = {
    candle: <Candle />,
    line: <Line />,
    area: <Area />,
    bar: <Bar />
}
class Resolution extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        autoBind(this);
        this.actions = [];
        for (let i in charts) {
            this.actions.push({
                value: i,
                icon: charts[i],
                name: t(i + 'Chart')
            })
        }
    }
    changeType(type) {
        this.props.onChange(type)
        this.handleClose();
    }
    handleOpen() {
        this.setState({ open: true });
    }
    handleClose() {
        this.setState({ open: false });
    }
    render() {
        return (
            <div style={styles.root} >
                {this.context.state.isPortrait &&
                    <Backdrop open={this.state.open} />
                }
                <Fab
                    ariaLabel="charts"
                    icon={charts[this.props.value]}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                    open={this.state.open}
                    direction={this.context.state.isPortrait ? "down" : "right"}
                >
                    {
                        this.actions.map(action => (
                            <FabAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                tooltipPlacement={this.context.state.isPortrait ? "right" : "top"}
                                onClick={() => this.changeType(action.value)}
                            />
                        ))
                    }
                </Fab >
            </div>
        );
    }
}
const styles = {
    root: {
        margin: 4,
        height: 40
    },
    text: {
        textTransform: 'none'
    }
}
export default Resolution;