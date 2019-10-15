import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { t } from '../../locales';
import Context from '../../library/Context';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
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

class Deposit extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            tab: 0,
        };
        autoBind(this);
    }
    handleChange(e, tab) {
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
                    <Tab label="Item One" {...a11yProps(0)} />
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
        display: 'flex',
    },
    tabs: {
        borderRight: `1px solid #333`,
    },
}
export default Deposit;