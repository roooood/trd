import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from '../library/Context';
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
            <div style={styles.root}>
                <div className="tab1">
                    <Chart />
                </div>
                <div className="tab2">
                    <Action />
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