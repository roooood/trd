import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { t } from 'locales';
import Context from 'library/Context';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Work from '@material-ui/icons/WorkOutline';
import HistoryIcon from '@material-ui/icons/History';
import StarBorderRounded from '@material-ui/icons/StarBorderRounded';
import ChatIcon from '@material-ui/icons/ChatBubbleOutline';
import Videocam from '@material-ui/icons/OndemandVideo';
import MoreOutlined from '@material-ui/icons/MoreOutlined';
import Hidden from '@material-ui/core/Hidden';
import History from './sidebar/History';
import Chat from './sidebar/Chat';
import Video from './sidebar/Video';
import LeadBoard from './sidebar/LeadBoard';

const StyledTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        color: '#b5b5b5',
        fontSize: theme.typography.pxToRem(13),
        minWidth: 80,
        width: 80,
        lineHeight: '1em',
        minHeight: 72,
        [theme.breakpoints.between('sm', 'md')]: {
            minHeight: 40,
            fontSize: theme.typography.pxToRem(11),
        },
        backgroundColor: 'transparent',
        '&:hover': {
            opacity: 1,
            color: '#fff',
        },
        '&$selected': {
            color: '#f50057',
            backgroundColor: 'transparent',
        }
    },
    labelIcon: {
        paddingTop: 6
    },
    selected: {}
}))(props => <Tab disableRipple {...props} />);

function TabPanel(props) {
    const { children, value, prev, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            className={prev == null ? "animate" : "animated"}
            {...other}
        >
            {children}
        </Typography>
    );
}
class Sidebar extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            tab: null,
        };
        autoBind(this);
        window.ee.on('sideBar', this.handleChange)
    }
    handleChange(e, tab) {
        this.prev = this.state.tab;
        if (tab == this.state.tab && !this.context.state.isPortrait)
            tab = null;
        this.setState({ tab });
    }
    render() {
        return (
            <div style={styles.root} className="sidebar" id="sidebar">
                <Tabs
                    orientation="vertical"
                    // variant="scrollable"
                    value={this.state.tab}
                    onChange={this.handleChange}
                    aria-label="Vertical tabs example"
                    style={styles.tabs}
                >
                    {/* <StyledTab label={t('totalPortfolio')} icon={<Work />} /> */}
                    <StyledTab label={t('tradingHistory')} icon={<HistoryIcon />} />
                    <StyledTab label={t('chatSupport')} icon={<ChatIcon />} />
                    <StyledTab label={t('leaderBoard')} icon={<StarBorderRounded />} />
                    <StyledTab label={t('videoToturial')} icon={<Videocam />} />
                    {/* <StyledTab label={t('more')} icon={<MoreOutlined />} /> */}
                </Tabs>
                {/* <TabPanel value={this.state.tab} prev={this.prev} index={0}>
                </TabPanel> */}
                <TabPanel value={this.state.tab} prev={this.prev} index={0}>
                    <History />
                </TabPanel>
                <TabPanel value={this.state.tab} prev={this.prev} index={1}>
                    <Chat />
                </TabPanel>
                <TabPanel value={this.state.tab} prev={this.prev} index={2}>
                    <LeadBoard />
                </TabPanel>
                <TabPanel value={this.state.tab} prev={this.prev} index={3}>
                    <Video />
                </TabPanel>
                {/* <TabPanel value={this.state.tab} prev={this.prev} index={5}>
                </TabPanel> */}
            </div>
        );
    }
}
const styles = {
    root: {
        flexGrow: 1,
        backgroundColor: 'trasparent',
        display: 'flex',
        height: '100%',
    },
    tabs: {
        borderRight: '1px solid rgba(128, 128, 128, 0.3)',
    },
}
export default Sidebar;