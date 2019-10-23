import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import Context from '../../library/Context';
import Tabs from './charts/Tabs';
import Typography from '@material-ui/core/Typography';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <Typography style={{ width: '100%' }} component="div" role="tabpanel" hidden={value != index} {...other}>
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
        const tab = this.props.tab.data || {};
        const active = this.context.state.tabbar == null ? this.props.tab.active : this.context.state.tabbar;

        return (
            <>
                {Object.keys(tab).map((item, i) => {
                    return (
                        <TabPanel key={i} className="swing-in-top-fwd" value={active} index={item}>
                            <Tabs parent={item} />
                        </TabPanel>
                    )
                })
                }
            </>
        );
    }
}
const styles = {

}
export default connect(state => state)(Tabbar);