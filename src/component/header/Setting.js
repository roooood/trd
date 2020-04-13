import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import SettingsIcon from '@material-ui/icons/Settings';
import LockIcon from '@material-ui/icons/Lock';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import DropDown from 'component/DropDown';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import SettingModal from './SettingModal';

import { t } from 'locales';
import { connect } from 'react-redux';
import Context from 'library/Context';
import { User } from 'redux/action/user';

const ColorButton = withStyles(theme => ({
    root: {
        background: 'transparent',
        border: '1px solid rgba(128, 128, 128, 0.8)',
        padding: ' 6px 10px',
        margin: 2,
        borderRadius: 5,
        minWidth: 40,
        '&:hover': {
            background: 'transparent',
            border: '1px solid rgba(128, 128, 128, 0.5)',
        },
    },
}))(Button);

class Setting extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }

    deposit() {
        let modal = this.context.app('modal');
        modal.show(<DepositModal />);
    }
    settingModal() {
        let modal = this.context.app('modal');
        modal.show(<SettingModal />);
    }
    withdraw() {
        let modal = this.context.app('modal');
        modal.show(<WithdrawModal />);
    }
    logOut() {
        this.props.dispatch(User(null));
        this.context.game.close();
    }
    render() {
        let { type } = this.props.user;
        let { username } = this.context.state.user;
        return (
            <DropDown
                triger={
                    <ColorButton onClick={this.openMenu} >
                        <Hidden only={['md', 'lg', 'xl']}>
                            <AccountCircleIcon style={{ fontSize: '2.5em', color: '#22a2e1', }} />
                        </Hidden>
                        <Hidden only={['xs', 'sm']}>
                            <AccountCircleIcon style={styles.icon} />
                            <Typography component="div" style={{ ...styles.account }}>
                                {username}
                            </Typography>
                            <ExpandMoreRoundedIcon style={{ color: '#fff', marginRight: -5, marginLeft: 5 }} />
                        </Hidden>
                    </ColorButton>
                }
            >
                <List style={{ padding: '0 10px' }}>
                    {/* <ListItem button onClick={this.deposit}>
                        <ListItemAvatar>
                            <VerticalAlignBottomIcon style={{ fontSize: '1.5em', color: '#98FB98' }} />
                        </ListItemAvatar>
                        <ListItemText primary={<Typography style={styles.list}>{t('deposit')}</Typography>} />
                    </ListItem>
                    <ListItem button onClick={this.withdraw}>
                        <ListItemAvatar>
                            <VerticalAlignTopIcon style={{ fontSize: '1.5em', color: '#FFA07A' }} />
                        </ListItemAvatar>
                        <ListItemText primary={<Typography style={styles.list}>{t('withdraw')}</Typography>} />
                    </ListItem> */}
                    <ListItem button onClick={this.settingModal}>
                        <ListItemAvatar>
                            <SettingsIcon style={{ fontSize: '1.5em', color: '#3870c8' }} />
                        </ListItemAvatar>
                        <ListItemText primary={<Typography style={styles.list}>{t('setting')}</Typography>} />
                    </ListItem>
                    <ListItem button onClick={this.logOut}>
                        <ListItemAvatar>
                            <LockIcon style={{ fontSize: '1.5em', color: '#3870c8' }} />
                        </ListItemAvatar>
                        <ListItemText primary={<Typography style={styles.list}>{t('logOut')}</Typography>} />
                    </ListItem>
                </List>
            </DropDown>
        );
    }
}

const styles = {
    account: {
        fontSize: 13,
        whiteSpace: 'nowrap',
        color: '#fff'
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

export default connect(state => state)(Setting);