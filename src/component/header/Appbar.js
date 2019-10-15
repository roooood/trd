import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Context from '../../library/Context';

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
        minHeight: '8.5vh',
        height: '8.5vh',
        margin: 5,
        borderRadius: 5,
        width: 120,
        border: '1px solid #333',
        // padding: '10px 20px',
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

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}
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
    render() {
        return (
            <div style={{ ...styles.root }} >
                <StyledTabs
                    value={this.context.state.tabbar}
                    onChange={this.handleChangeList}
                    variant="scrollable"
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="scrollable force tabs example"
                >
                    <StyledTab label={tabGenerator({ title: 'test', icon: <i class="cc BTC" />, type: 'Crpto' })}  {...a11yProps(0)} />
                </StyledTabs>
            </div>
        );
    }
}
const styles = {
    root: {
        width: '100%'
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