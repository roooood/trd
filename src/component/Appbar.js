import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import HelpIcon from '@material-ui/icons/Help';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import ThumbDown from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';
import Typography from '@material-ui/core/Typography';
import Context from '../library/Context';

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
        border: '1px solid #757575',
        margin: 5,
        borderRadius: 5,
        width: 100,
        // padding: '10px 20px',
        backgroundColor: 'transparent',
        '&:hover': {
            opacity: 1,
            color: '#fff',
        },
        '&$selected': {
            color: '#f50057',
            backgroundColor: 'transparent',
            border: '1px solid #f50057',
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
                    <StyledTab label="Item One" icon={<PhoneIcon />} {...a11yProps(0)} />
                    <StyledTab label="Item Two" icon={<FavoriteIcon />} {...a11yProps(1)} />
                    <StyledTab label="Item Three" icon={<PersonPinIcon />} {...a11yProps(2)} />
                    <StyledTab label="Item Four" icon={<HelpIcon />} {...a11yProps(3)} />
                    <StyledTab label="Item Five" icon={<ShoppingBasket />} {...a11yProps(4)} />
                    <StyledTab label="Item Six" icon={<ThumbDown />} {...a11yProps(5)} />
                    <StyledTab label="Item Seven" icon={<ThumbUp />} {...a11yProps(6)} />
                </StyledTabs>
            </div>
        );
    }
}
const styles = {
    root: {
        width: '100%'
    },
}
export default Appbar;