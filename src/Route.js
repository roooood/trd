import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';

import Context from './library/Context';
import { t } from './locales';

import Loading from './component/Loading';
import Setting from './component/header/Setting';
import Account from './component/header/Account';
import Appbar from './component/header/Appbar';
import Menu from './component/header/Menu';

import Tabbar from './component/main/Tabbar';
import Sidebar from './component/main/Sidebar';

import Bottom from './component/bottom/Bottom';

import Sign from './component/sign';
import { User } from 'redux/action/user';

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
    logOut() {
        this.props.dispatch(User(null));
        this.context.game.close();
    }
    user(user) {
        if (user == 'invalid') {
            this.showError('invalidUser');
            this.logOut();
        }
        else
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
                <div id="content" className={"container column theme-default " + (this.context.state.isPortrait ? 'portrait' : '')} >
                    <div className="container top" >
                        <div className="item1" >
                            <Menu />
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
                        <div className={"item1 menu " + (this.context.state.menu ? 'open' : '')} >
                            <Sidebar />
                        </div>
                        <div className="item2 main" >
                            <Tabbar />
                        </div>
                    </div>
                    {!this.context.state.isMobile &&
                        <div className="container bottom" >
                            <Bottom />
                        </div>
                    }
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