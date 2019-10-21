import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';

import { t } from '../../locales';
import { connect } from 'react-redux';
import Context from '../../library/Context';
import { User } from '../../redux/action/user';
import { toMoney } from '../../library/Helper';

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

class Account extends Component {
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
    changeAccountType(type) {
        this.closeMenu();
        this.props.dispatch(User({ type }));
    }
    render() {
        let { type, balance } = this.props.user;
        return (
            <>
                <List disablePadding={true} component="div" >
                    <ListItem onClick={this.openMenu} button style={{ paddingBottom: 0, paddingRight: 30, width: 200 }}>
                        <ListItemAvatar style={{ minWidth: 20, marginRight: 5 }}>
                            <MonetizationOnRoundedIcon style={{ fontSize: '2.5em', color: type == 'real' ? '#25b940' : '#fc155a' }} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Typography
                                component="div"
                                style={styles.account}
                            >
                                {type == 'real' ? t('realAccount') : t('practiceAccount')}
                            </Typography>
                            }
                            secondary={
                                <Typography
                                    component="div"
                                    style={styles.accountSub}
                                >
                                    $ {toMoney(balance[type])}
                                </Typography>
                            }
                        />
                        <ListItemSecondaryAction style={{ top: '60%', right: 0 }}>
                            <ExpandMoreRoundedIcon />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
                <StyledMenu
                    open={Boolean(this.state.menu)}
                    anchorEl={this.state.menu}
                    onClose={this.closeMenu}
                >
                    <List style={{ padding: '0 10px' }}>
                        <ListItem button onClick={() => this.changeAccountType('real')}>
                            <ListItemAvatar>
                                <MonetizationOnRoundedIcon style={{ fontSize: '2.5em', color: '#25b940' }} />
                            </ListItemAvatar>
                            <ListItemText primary={t('realAccount')} secondary={
                                <Typography
                                    component="div"
                                    style={styles.sub}
                                >
                                    $ {toMoney(balance['real'])}
                                </Typography>
                            } />
                        </ListItem>
                        <ListItem button onClick={() => this.changeAccountType('practice')}>
                            <ListItemAvatar>
                                <MonetizationOnRoundedIcon style={{ fontSize: '2.5em', color: '#fc155a' }} />
                            </ListItemAvatar>
                            <ListItemText primary={t('practiceAccount')} secondary={
                                <Typography
                                    component="div"
                                    style={styles.sub}
                                >
                                    $ {toMoney(balance['practice'])}
                                </Typography>
                            } />
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
        color: '#fff'
    },
    accountSub: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'rgb(247, 183, 28)'
    }
}

export default connect(state => state)(Account);