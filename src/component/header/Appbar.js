import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Context from '../../library/Context';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import AppModal from './AppModal';

const ColorButton = withStyles(theme => ({
    root: {
        background: 'transparent',
        border: '1px solid #333',
        margin: 5,
        borderRadius: 5,
        '&:hover': {
            background: 'transparent',
            borderBottom: '2px solid #f07000',
        },
    },
}))(Button);

const StyledTabs = withStyles({
    root: {
        overFlow: 'hidden',
        borderRadius: 10,
    },
    indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > div': {
        },
    },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        color: '#b5b5b5',
        fontSize: theme.typography.pxToRem(13),
        minWidth: 30,
        minHeight: 56,
        height: 56,
        margin: 5,
        borderRadius: 5,
        width: 120,
        border: '1px solid #333',
        backgroundColor: 'transparent',
        '&:hover': {
            opacity: 1,
            borderBottom: '2px solid #f07000',
        },
        '&$selected': {
            color: '#b5b5b5',
            borderBottom: '2px solid #f07000',
        }
    },
    selected: {}
}))(props => <Tab disableRipple {...props} />);

function tabGenerator(props) {
    return (
        <div style={styles.list}>
            {props.icon}
            <div style={styles.listText}>
                <Typography variant="subtitle1" display="block" style={{ color: '#fff' }} >
                    {props.title}
                </Typography>
                <Typography variant="subtitle2" display="block" style={{ fontSize: 10, marginPop: -4 }} >
                    {props.type}
                </Typography>
            </div>
        </div>
    )
}
class Appbar extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }
    handleChangeList(e, tab) {
        this.context.setState({ tabbar: tab });
    }
    list() {
        let modal = this.context.app('modal');
        modal.show(<AppModal />);
    }
    render() {
        return (
            <div style={styles.root}>
                <div style={{ ...styles.tabs }} >
                    <StyledTabs
                        value={this.context.state.tabbar}
                        onChange={this.handleChangeList}
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <StyledTab label={tabGenerator({ title: 'Bitcoin', icon: <i class="cc BTC" />, type: 'Crpto' })} />
                    </StyledTabs>
                </div>
                <ColorButton onClick={this.list} variant="contained" color="primary" style={{ margin: 5 }}>
                    <AddIcon style={{ fontSize: 30 }} />
                </ColorButton>
            </div>
        );
    }
}
const styles = {
    root: {
        display: 'flex',

    },
    tabs: {
        maxWidth: '90%'
    },
    list: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    listText: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',

    }
}
export default Appbar;