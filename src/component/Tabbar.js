import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Context from '../library/Context';
import Tabs from './Tabs';
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
            <>
                <TabPanel value={this.context.state.tabbar} index={0}>
                    <Tabs />
                </TabPanel>
            </>
        );
    }
}
const styles = {

}
export default Tabbar;