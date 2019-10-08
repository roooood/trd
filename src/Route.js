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
            <Grid container direction="column" id="content" className={"theme-default"} >
                <Grid container alignItems="center" style={{ height: '10vh', borderBottom: '1px solid #333' }}>
                    <Grid style={{ width: '12vw' }}>
                        <img style={{ width: '10vw' }} src={require('./assets/img/logo.png')} />
                    </Grid>
                    <Grid style={{ width: '67vw' }}>
                        <Appbar />
                    </Grid>
                    <Grid style={{ width: '20vw', height: '8vh' }}>
                        <Deposit />
                    </Grid>
                </Grid>
                <Grid container alignItems="center" style={{ height: '84vh' }}>
                    <Grid style={{ height: '100%' }}>
                        <Sidebar />
                    </Grid>
                    <Grid style={{ height: '100%' }}>
                        <Tabbar />
                    </Grid>
                </Grid>
                <Grid style={{ height: '5vh', borderTop: '1px solid #333' }} >
                    c
                </Grid>
            </Grid>
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