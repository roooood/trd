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

class Resolution extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        autoBind(this);
        this.actions = [
            { value: '1m', icon: <span style={styles.text}>1m</span>, name: '1 ' + t('min') },
            { value: '5m', icon: <span style={styles.text}>5m</span>, name: '5 ' + t('min') },
            { value: '15m', icon: <span style={styles.text}>15m</span>, name: '15 ' + t('min') },
            { value: '30m', icon: <span style={styles.text}>30m</span>, name: '30 ' + t('min') },
            { value: 'H', icon: <span style={styles.text}>H</span>, name: t('hour') },
            { value: 'D', icon: <span style={styles.text}>D</span>, name: t('day') },
            { value: 'W', icon: <span style={styles.text}>W</span>, name: t('week') },
            { value: 'M', icon: <span style={styles.text}>M</span>, name: t('month') },
        ];
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
                    ariaLabel="resolution"
                    icon={<span style={styles.text}>{this.props.value}</span >}
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