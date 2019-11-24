import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { TabbarRemove, TabbarActive, TabbarAdd } from 'redux/action/tab';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Context from 'library/Context';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import AppModal from './marketModal';

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
        minWidth: 100,
        border: '1px solid #333',
        backgroundColor: 'transparent',
        '&:hover': {
            opacity: 1,
            backgroundColor: 'rgba(0,0,0,.3)',
        },
        '&$selected': {
            color: '#b5b5b5',
            borderBottom: '2px solid #638cd1',
        }
    },
    selected: {}
}))(props => <Tab {...props} />);

function tabGenerator(id, props, onRemove) {
    let icon = [];
    if (props.type == 'crypto') {
        props.name.split('/').forEach((i) => {
            icon.push(<i key={i} className={"cc " + i} />)
        });
    }
    else if (props.type == 'forex') {
        props.name.split('/').forEach((i) => {
            icon.push(<i key={i} className={"currency-flag currency-flag-" + i.toLowerCase()} />)
        });
    }
    return (
        <div style={styles.list}>
            <div style={styles.listIcon} className="app-icon">
                {icon}
            </div>
            <div style={styles.listText}>
                <Typography variant="subtitle1" display="block" style={{ fontSize: 13, color: '#fff' }} >
                    {props.name}
                </Typography>
                <Typography variant="subtitle2" display="block" style={{ fontSize: 11, marginPop: -4 }} >
                    {props.type}
                </Typography>
            </div>
            {onRemove != null &&
                <IconButton color="secondary" style={styles.listRemove} onClick={() => onRemove(id)}>
                    <CloseRoundedIcon style={{ fontSize: 18, color: 'rgb(195, 68, 110)' }} />
                </IconButton>
            }
        </div>
    )
}
class Appbar extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }
    componentDidMount() {
        if (Object.keys(this.props.tab.data).length === 0) {
            if (this.context.state.market !== null) {
                this.addTab(this.context.state.market);
            }
            else
                this.list();
        }
    }
    addTab({ id, symbol, display, type }) {
        this.props.dispatch(TabbarAdd({
            key: 't' + id,
            value: {
                id,
                symbol,
                name: display,
                type,
                resolution: this.context.state.setting.reolution,
                chartType: this.context.state.setting.chartType
            }
        }));
    }
    handleChangeList(e, tab) {
        if (tab != this.context.state.tabbar) {
            let keys = Object.keys(this.props.tab.data);
            if (keys.includes(tab))
                this.props.dispatch(TabbarActive(tab));
        }
    }
    list() {
        let modal = this.context.app('modal');
        modal.show(<AppModal />);
    }
    onRemove(id) {
        this.props.dispatch(TabbarRemove(id));
        let keys = Object.keys(this.props.tab.data);
        let index = keys.indexOf(id);

        if (keys[index + 1] != 'undefined') {
            this.handleChangeList(null, keys[index + 1])
        }
        else if (keys[index - 1] != 'undefined') {
            this.handleChangeList(null, keys[index - 1])
        }
    }
    render() {
        const tab = this.props.tab.data || {};
        const keys = Object.keys(tab);
        return (
            <div style={styles.root}>
                <div style={{ ...styles.tabs }} >
                    <StyledTabs
                        value={this.props.tab.active + ""}
                        onChange={this.handleChangeList}
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        {keys.map((item) => {
                            return (
                                <StyledTab key={item} value={item} label={tabGenerator(item, tab[item], keys.length == 1 ? null : this.onRemove)} />
                            )
                        })
                        }
                    </StyledTabs>
                </div>
                <ColorButton onClick={this.list} variant="contained" color="primary" style={{ margin: 5, height: 56 }}>
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

    },
    listIcon: {
        marginRight: 12,
        position: 'relative',
        width: 30,
        height: '100%'
    },
    listRemove: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        zIndex: 9999
    }
}
export default connect(state => state)(Appbar);