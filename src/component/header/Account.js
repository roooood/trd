import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import DropDown from 'component/DropDown';
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
        border: '1px solid rgba(128, 128, 128, 0.8)',
        padding: ' 6px 10px',
        margin: 2,
        borderRadius: 5,
        minWidth: 40,
        boxShadow:'none',
        '&:hover': {
            background: 'transparent',
            border: '1px solid rgba(128, 128, 128, 0.5)',
            boxShadow: 'none',
        },
    },
}))(Button);

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
            <DropDown
                triger={
                    <ColorButton onClick={this.openMenu} variant="contained" color="primary" >
                        <Hidden only={['md', 'lg', 'xl']}>
                            <MonetizationOnRoundedIcon style={{ fontSize: '2.5em', color: type == 'real' ? '#25b940' : '#fc155a' }} />
                        </Hidden>
                        <Hidden only={['xs', 'sm']}>
                            <MonetizationOnRoundedIcon style={{ ...styles.icon, color: type == 'real' ? '#25b940' : '#fc155a' }} />
                            <Typography component="div" style={{ ...styles.account, width: 100 }}>
                                {type == 'real' ? t('realAccount') : t('practiceAccount')}
                                <Typography component="div" align="left" style={styles.accountSub}  >
                                    $ {toMoney(Math.round(balance[type] * 10000000) / 10000000)}
                                </Typography>
                            </Typography>
                            <ExpandMoreRoundedIcon style={{ marginRight: -5, marginLeft: 5 }} />
                        </Hidden>
                    </ColorButton>
                }
            >
                <List style={{ padding: '0 10px' }}>
                    <ListItem button onClick={() => this.changeAccountType('real')}>
                        <ListItemAvatar>
                            <MonetizationOnRoundedIcon style={{ fontSize: '2.5em', color: '#25b940' }} />
                        </ListItemAvatar>
                        <ListItemText primary={<Typography style={styles.list}>{t('realAccount')}</Typography>} secondary={
                            <Typography
                                component="div"
                                style={styles.sub}
                            >
                                $ {toMoney(Math.round(balance['real'] * 10000000) / 10000000)}
                            </Typography>
                        } />
                    </ListItem>
                    <ListItem button onClick={() => this.changeAccountType('practice')}>
                        <ListItemAvatar>
                            <MonetizationOnRoundedIcon style={{ fontSize: '2.5em', color: '#fc155a' }} />
                        </ListItemAvatar>
                        <ListItemText primary={<Typography style={styles.list}>{t('practiceAccount')}</Typography>} secondary={
                            <Typography
                                component="div"
                                style={styles.sub}
                            >
                                $ {toMoney(Math.round(balance['practice'] * 10000000) / 10000000)}
                            </Typography>
                        } />
                    </ListItem>
                </List>
            </DropDown>
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
    list: {
        fontSize: '0.85rem',
    },
    icon: {
        fontSize: '2em',
        color: '#22a2e1',
        marginLeft: -5,
        marginRight: 4
    }
}

export default connect(state => state)(Account);