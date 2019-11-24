import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import Action from './Action';
import Chart from './Chart';
class Tabs extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }
    render() {
        return (
            <div style={styles.root} className={"chart-dir-" + this.props.parent.id}>
                <div className="item1 chart">
                    <Chart parent={this.props.parent} inView={this.props.parent} />
                </div>
                <div className="item2 action">
                    <Action parent={this.props.parent} />
                </div>
            </div>
        );
    }
}
const styles = {
    root: {
        height: '100%',
        display: 'flex',
        height: '100%'

    },
}
export default Tabs;