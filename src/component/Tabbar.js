import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Context from '../library/Context';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <Typography style={{ width: '100%' }} component="div" role="tabpanel" hidden={value !== index} {...other}>
            {children}
        </Typography>
    );
}
class Tabbar extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }
    render() {
        return (
            <div style={{ ...styles.root }} >
                <TabPanel value={this.context.state.tabbar} index={0}>
                    <Grid container alignItems="center" style={{ width: '100%' }}>
                        <Grid style={{ width: '80%' }}>
                            a
                        </Grid>
                        <Grid style={{ width: '19%' }}>
                            b
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={this.context.state.tabbar} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={this.context.state.tabbar} index={2}>
                    Item Three
                </TabPanel>
                <TabPanel value={this.context.state.tabbar} index={3}>
                    Item Four
                </TabPanel>
                <TabPanel value={this.context.state.tabbar} index={4}>
                    Item Five
                </TabPanel>
                <TabPanel value={this.context.state.tabbar} index={5}>
                    Item Six
                </TabPanel>
                <TabPanel value={this.context.state.tabbar} index={6}>
                    Item Seven
                </TabPanel>
            </div>
        );
    }
}
const styles = {
    root: {
        flexGrow: 1
    },
}
export default Tabbar;