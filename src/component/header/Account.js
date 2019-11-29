import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';

import { t } from 'locales';
import { connect } from 'react-redux';
import Context from 'library/Context';
import { User } from 'redux/action/user';
import { toMoney } from 'library/Helper';

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
        let { type } = this.props.user;
        let { balance } = this.context.state.user;
        return (
            <>
                <ColorButton onClick={this.openMenu} variant="contained" color="primary" style={{ margin: 5 }}>
                    <Hidden only={['md', 'lg', 'xl']}>
                        <MonetizationOnRoundedIcon style={{ fontSize: '2.5em', color: type == 'real' ? '#25b940' : '#fc155a' }} />
                    </Hidden>
                    <Hidden only={['xs', 'sm']}>
                        <MonetizationOnRoundedIcon style={{ fontSize: '2.5em', color: type == 'real' ? '#25b940' : '#fc155a' }} />
                        <Typography component="div" style={{ ...styles.account, width: 100 }}>
                            {type == 'real' ? t('realAccount') : t('practiceAccount')}
                            <Typography component="div" align="left" style={styles.accountSub}  >
                                $ {toMoney(balance[type])}
                            </Typography>
                        </Typography>
                        <ExpandMoreRoundedIcon />
                    </Hidden>
                </ColorButton>
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
        whiteSpace: 'nowrap',
        color: '#fff'
    },
    accountSub: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'rgb(247, 183, 28)',
        paddingLeft: 15,
    }
}

export default connect(state => state)(Account);