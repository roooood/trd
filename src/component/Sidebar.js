import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { t } from '../locales';
import Context from '../library/Context';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Work from '@material-ui/icons/WorkOutline';
import History from '@material-ui/icons/History';
import Chat from '@material-ui/icons/ChatBubbleOutline';
import StarBorder from '@material-ui/icons/StarBorder';
import Videocam from '@material-ui/icons/OndemandVideo';
import More from '@material-ui/icons/MoreHoriz';

const StyledTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        color: '#b5b5b5',
        fontSize: theme.typography.pxToRem(13),
        minWidth: 80,
        width: 80,
        lineHeight: '1em',
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
    selected: {}
}))(props => <Tab disableRipple {...props} />);

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            className="animate"
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}
function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}
class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: null
        };
        autoBind(this);
    }
    handleChange(e, tab) {
        if (tab == this.state.tab)
            tab = null;
        this.setState({ tab });
    }
    render() {
        return (
            <div style={styles.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={this.state.tab}
                    onChange={this.handleChange}
                    aria-label="Vertical tabs example"
                    style={styles.tabs}
                >
                    <StyledTab label={t('totalPortfolio')} icon={<Work />} {...a11yProps(0)} />
                    <StyledTab label={t('tradingHistory')} icon={<History />} {...a11yProps(1)} />
                    <StyledTab label={t('chatSupport')} icon={<Chat />} {...a11yProps(2)} />
                    <StyledTab label={t('leaderBoard')} icon={<StarBorder />} {...a11yProps(3)} />
                    <StyledTab label={t('videoToturial')} icon={<Videocam />}{...a11yProps(4)} />
                    <StyledTab label={t('more')} icon={<More />}{...a11yProps(5)} />
                </Tabs>
                <TabPanel value={this.state.tab} index={0}>
                    Item One
      </TabPanel>
                <TabPanel value={this.state.tab} index={1}>
                    Item Two
      </TabPanel>
                <TabPanel value={this.state.tab} index={2}>
                    Item Three
      </TabPanel>
                <TabPanel value={this.state.tab} index={3}>
                    Item Four
      </TabPanel>
                <TabPanel value={this.state.tab} index={4}>
                    Item Five
      </TabPanel>
                <TabPanel value={this.state.tab} index={5}>
                    Item Six
      </TabPanel>
                <TabPanel value={this.state.tab} index={6}>
                    Item Seven
      </TabPanel>
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
        borderRight: `1px solid #333`,
    },
}
export default Sidebar;