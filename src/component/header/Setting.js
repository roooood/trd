import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import LockIcon from '@material-ui/icons/Lock';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';

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
        margin: 5,
        borderRadius: 5,

        '&:hover': {
            background: 'transparent',
            border: '1px solid #555',
        },
    },
}))(Button);

const StyledMenu = withStyles({
    paper: {
        background: '#25272b',
        color: '#fff'
    },
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

class Setting extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            menu: null,
        };
        autoBind(this);
    }
    openMenu(event) {
        this.setState({ menu: event.currentTarget })
    }
    closeMenu() {
        this.setState({ menu: null })
    }
    deposit() {
        let modal = this.context.app('modal');
        modal.show(<DepositModal />);
    }
    withdraw() {
        let modal = this.context.app('modal');
        modal.show(<WithdrawModal />);
    }
    logOut() {
        this.props.dispatch(User(null));
    }
    render() {
        let { type } = this.props.user;
        let { username } = this.context.state.user;
        return (
            <>
                <ColorButton onClick={this.openMenu} variant="contained" color="primary" style={{ margin: 5 }}>
                    <Hidden only={['md', 'lg', 'xl']}>
                        <AccountCircleIcon style={{ fontSize: '2.5em', color: '#22a2e1', }} />
                    </Hidden>
                    <Hidden only={['xs', 'sm']}>
                        <AccountCircleIcon style={styles.icon} />
                        <Typography component="div" style={{ ...styles.account }}>
                            {username}
                        </Typography>
                        <ExpandMoreRoundedIcon style={{ marginRight: -5, marginLeft: 5 }} />
                    </Hidden>
                </ColorButton>
                <StyledMenu
                    open={Boolean(this.state.menu)}
                    anchorEl={this.state.menu}
                    onClose={this.closeMenu}
                >
                    <List style={{ padding: '0 10px' }}>
                        <ListItem button onClick={this.deposit}>
                            <ListItemAvatar>
                                <VerticalAlignBottomIcon style={{ fontSize: '1.5em', color: '#98FB98' }} />
                            </ListItemAvatar>
                            <ListItemText primary={t('deposit')} />
                        </ListItem>
                        <ListItem button onClick={this.withdraw}>
                            <ListItemAvatar>
                                <VerticalAlignTopIcon style={{ fontSize: '1.5em', color: '#FFA07A' }} />
                            </ListItemAvatar>
                            <ListItemText primary={t('withdraw')} />
                        </ListItem>
                        <ListItem button onClick={this.logOut}>
                            <ListItemAvatar>
                                <LockIcon style={{ fontSize: '1.5em', color: '#7ac1ff' }} />
                            </ListItemAvatar>
                            <ListItemText primary={t('logOut')} />
                        </ListItem>
                    </List>
                </StyledMenu>
            </>
        );
    }
}
const styles = {
    sub: {
        fontSize: 12,
        color: '#b5b5b5'
    },
    account: {
        fontSize: 13,
        whiteSpace: 'nowrap',
        color: '#fff'
    },
    accountSub: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'rgb(247, 183, 28)',
        paddingLeft: 15,
    },
    icon: {
        fontSize: '2.5em',
        color: '#22a2e1',
        marginLeft: -5,
        marginRight: 4
    }
}

export default connect(state => state)(Setting
);