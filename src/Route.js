import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';

import Rotate90DegreesCcwIcon from '@material-ui/icons/Rotate90DegreesCcw';

import Context from './library/Context';
import { t } from './locales';

import Loading from './component/Loading';
import Setting from './component/header/Setting';
import Account from './component/header/Account';
import Appbar from './component/header/Appbar';

import Tabbar from './component/main/Tabbar';
import Sidebar from './component/main/Sidebar';

import Bottom from './component/bottom/Bottom';

import Sign from './component/sign';

class Route extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        autoBind(this);
    }
    componentWillReceiveProps(nextProps, contextProps) {
        if (nextProps.user.isLogin && !this.props.user.isLogin) {
            this.connectToServer()
        }
    }
    componentDidMount() {
        if (this.props.user.isLogin)
            this.connectToServer();
        this.context.game.register('welcome', this.connected);
        this.context.game.register('setting', this.setting);
        this.context.game.register('user', this.user);
        this.context.game.register('error', this.showError);
        this.context.game.register('balance', this.balance);
    }
    connectToServer() {
        if (!this.context.game.isConnect) {
            this.context.game.connect(
                () => {
                    this.context.game.getAvailableRooms((rooms) => {
                        if (rooms.length > 0) {
                            this.context.game.join(rooms[0].roomId, { key: this.props.user.token });
                        }
                        else {
                            this.context.game.join('trade', { create: true, key: this.props.user.token });
                        }
                    });
                },
                () => setTimeout(() => { this.connectToServer() }, 5000)
            );
        }
    }
    connected(data) {
        this.context.setState(data);
        this.context.live.connect(() => {
            this.setState({ loading: false });
        });
    }
    setting(setting) {
        this.context.setState({ setting });
    }
    user(user) {
        this.context.setState({ user });
    }
    balance({ type, balance }) {
        let user = this.context.state.user;
        user.balance[type] = balance;
        this.context.setState({ user });
    }
    showError(type) {
        this.notify({ message: t(type + 'Error'), type: 'error' });
    }
    notify(data) {
        window.ee.emit('notify', data)
    }
    render() {
        if (!this.props.user.isLogin)
            return <Sign />
        else if (this.state.loading)
            return <Loading full />
        else
            return (
                <div id="content" className={"container column theme-default"} >
                    <div className="rotate">
                        <Rotate90DegreesCcwIcon style={{ fontSize: 100 }} />
                    </div>
                    <div className="container top" >
                        <div className="item1" >
                            <Hidden only={['xs', 'sm']}>
                                <img style={{ width: 120 }} src={require('./assets/img/logo.png')} />
                            </Hidden>
                        </div>
                        <div className="item2">
                            <Appbar />
                        </div>
                        <div className="item3" >
                            <Account />
                            <Setting />
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
                        <Bottom />
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