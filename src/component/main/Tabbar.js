import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import Context from 'library/Context';
import Action from './charts/Action';
import Chart from './charts/Chart';
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
    componentDidMount() {

    }
    render() {
        const tab = this.props.tab.data || {};
        return (
            <>
                {Object.keys(tab).map((item) => {
                    return (
                        <TabPanel key={item} className="swing-in-top-fwd" value={this.props.tab.active} index={item}>
                            <div style={{ ...styles.root, ...(this.context.state.isPortrait ? { flexDirection: 'column' } : {}) }} className={"chart-dir-" + tab[item].id}>
                                <div className="item1 chart">
                                    <Chart parent={tab[item]} inView={this.props.tab.active == item} />
                                </div>
                                <div className="item2 action">
                                    <Action parent={tab[item]} />
                                </div>
                            </div>
                        </TabPanel>
                    )
                })
                }
            </>
        );
    }
}
const styles = {
    root: {
        height: '100%',
        display: 'flex',
        height: '100%'

    }
}
export default connect(state => state)(Tabbar);