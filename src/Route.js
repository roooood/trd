import React, { Component } from 'react';
import autoBind from 'react-autobind';

import Grid from '@material-ui/core/Grid';

import Deposit from './component/Deposit';
import Appbar from './component/Appbar';
import Tabbar from './component/Tabbar';
import Sidebar from './component/Sidebar';

class Route extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        autoBind(this);
    }
    render() {
        return (
            <div id="content" className={"container column theme-default"} >
                <div className="container c1" >
                    <div className="item1" >
                        <img style={{ width: '100%' }} src={require('./assets/img/logo.png')} />
                    </div>
                    <div className="item2">
                        <Appbar />
                    </div>
                    <div className="item3" >
                        <Deposit />
                    </div>
                </div>
                <div className="container c2" >
                    <div className="item1" >
                        <Sidebar />
                    </div>
                    <div className="item2 t1" >
                        <Tabbar />
                    </div>
                </div>
                <Grid style={{ height: '5vh', borderTop: '1px solid #333' }} >
                    c
                </Grid>
            </div >
        );
    }
}
const styles = {
    root: {
        flexGrow: 1,
    },
    dir: {
        display: 'flex',
        margin: 10,
        borderRadius: 10,
        position: 'relative',
    },
}
export default Route;