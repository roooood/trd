import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

import Context from './library/Context';
import { t } from './locales';

import Loading from './component/Loading';
import Deposit from './component/header/Deposit';
import Account from './component/header/Account';
import Appbar from './component/header/Appbar';

import Tabbar from './component/main/Tabbar';
import Sidebar from './component/main/Sidebar';

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
        this.context.live.connect();
        this.setState({ loading: false });
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