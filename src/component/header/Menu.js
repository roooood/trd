import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

import { t } from 'locales';
import { connect } from 'react-redux';
import Context from 'library/Context';
import { User } from 'redux/action/user';

const ColorButton = withStyles(theme => ({
    root: {
        background: 'transparent',
        border: '1px solid #333',
        padding: ' 6px 10px',
        margin: 2,
        borderRadius: 5,
        height: 56,
        color: '#eee',
        minWidth: 40,
        [theme.breakpoints.down('sm')]: {
            minHeight: 48,
            height: 48,
        },
        '&:hover': {
            background: 'transparent',
            border: '1px solid #555',
        },
    },
}))(Button);

class Menu extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }

    openMenu() {
        this.context.setState({ menu: !this.context.state.menu });
        window.ee.emit('sideBar', null, 0)

    }
    render() {
        let { type } = this.props.user;
        let { username } = this.context.state.user;
        return (
            <>
                <Hidden only={['md', 'lg', 'xl']}>
                    <ColorButton onClick={this.openMenu}>
                        <MenuIcon style={{ fontSize: 30, color: '#fff' }} />
                    </ColorButton>
                </Hidden>
                <Hidden only={['xs', 'sm']}>
                    <img style={{ width: 120 }} src={require('assets/img/logo.png')} />
                </Hidden>
            </>
        );
    }
}
const styles = {

}

export default connect(state => state)(Menu);