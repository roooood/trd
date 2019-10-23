import React, { Component } from 'react';
import autoBind from 'react-autobind';

import Grid from '@material-ui/core/Grid';

import { connect } from 'react-redux';

import Deposit from './component/header/Deposit';
import Account from './component/header/Account';
import Appbar from './component/header/Appbar';

import Tabbar from './component/main/Tabbar';
import Sidebar from './component/main/Sidebar';

import Sign from './component/sign';

class Route extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        autoBind(this);
    }
    render() {
        if (!this.props.user.isLogin)
            return <Sign />
        return (
            <div id="content" className={"container column theme-default"} >
                <div className="container top" >
                    <div className="item1" >
                        <img style={{ width: '100%' }} src={require('./assets/img/logo.png')} />
                    </div>
                    <div className="item2">
                        <Appbar />
                    </div>
                    <div className="item3" >
                        <Account />
                        <Deposit />
                    </div>
                </div>
                <div className="container center" >
                    <div className="item1" >
                        <Sidebar />
                    </div>
                    <div className="item2 main" >
                        <Tabbar />
                    </div>
                </div>
                <div className="container bottom" >
                    test
                </div>
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

export default connect(state => state)(Route);