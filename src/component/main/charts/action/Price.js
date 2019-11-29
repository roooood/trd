import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import Context from 'library/Context';
import { t } from 'locales';
import Typography from '@material-ui/core/Typography';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import HelpIcon from '@material-ui/icons/Help';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { toMoney } from 'library/Helper';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const StyledMenu = withStyles({
    paper: {
        background: '#25272b',
        color: '#fff',
        transform: 'translateX(-90px) translateY(-5px)!important'
    },
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        {...props}
    />
));

class Price extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props);
        this.state = {
            open: null,
            value: context.state.user.balance[this.props.user.type] > 0 ? 1 : 0
        };
        this.range = [1, 5, 10, 20, 50, 100, 200, 500, 1000]
        autoBind(this);
    }
    openMenu(event) {
        this.setState({ menu: event.currentTarget })
    }
    closeMenu() {
        this.setState({ menu: null })
    }
    up() {
        this.changeValue(this.state.value + 1);

    }
    down() {
        this.changeValue(this.state.value - 1);
    }
    change(value) {
        this.changeValue(value);
        this.closeMenu();
    }
    changeValue(value) {
        value = parseInt(value);
        if (this.context.state.setting.tradePriceMax <= value) {
            value = this.context.state.setting.tradePriceMax;
        }
        if (value > 0) {
            if (value <= this.context.state.user.balance[this.props.user.type])
                this.setState({ value }, () => {
                    this.props.amount(value)
                });
            else
                this.notify({ message: t('balanceError'), type: 'warning' });

        }
    }
    notify(data) {
        window.ee.emit('notify', data)
    }
    render() {
        return (
            <>
                <div style={styles.root} >
                    <div style={styles.info} onClick={this.openMenu}>
                        <Typography variant="button" display="block" style={styles.color}>
                            {t('amount')}
                        </Typography>
                        <HelpIcon style={{ ...styles.color, fontSize: 14 }} />
                    </div>
                    <div style={styles.display} >
                        <AttachMoneyIcon onClick={this.openMenu} style={{ ...styles.color, fontSize: '1.9em', marginRight: 10 }} />
                        <input
                            type="text"
                            style={styles.input}
                            onChange={e => this.changeValue(e.target.value)}
                            value={this.state.value} />
                    </div>
                    <div style={styles.picker} >
                        <IconButton size="small" onClick={this.down}>
                            <RemoveIcon style={styles.color} />
                        </IconButton>
                        <div style={styles.diver} />
                        <IconButton size="small" onClick={this.up}>
                            <AddIcon style={styles.color} />
                        </IconButton>
                    </div>
                </div>
                <StyledMenu
                    open={Boolean(this.state.menu)}
                    anchorEl={this.state.menu}
                    onClose={this.closeMenu}
                >
                    <List style={{ padding: '0 10px' }}>
                        {this.range.map(item => {
                            if (this.context.state.setting.tradePriceMax >= item)
                                return (
                                    <ListItem style={styles.listItem} key={item} button onClick={() => this.change(item)}>
                                        <Typography style={styles.color}>
                                            ${toMoney(item)}
                                        </Typography>
                                    </ListItem>
                                )
                            return null
                        }
                        )}
                    </List>
                </StyledMenu>
            </>
        );
    }
}
const styles = {
    root: {
        background: 'rgba(255,255,255,.1)',
        padding: 5,
        borderRadius: 5,
        cursor: 'pointer',
    },
    info: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    color: {
        color: '#b5b5b5'
    },
    display: {
        display: 'flex',
        alignItems: 'center',
    },
    picker: {
        borderTop: '1px solid #111',
        display: 'flex',
        justifyContent: 'space-around',
        height: 25,
        alignItems: 'center',
        paddingTop: 5
    },
    diver: {
        borderLeft: '1px solid #111',
        height: '80%',
        width: 1,
    },
    input: {
        background: 'transparent',
        border: 0,
        color: '#fff',
        fontSize: '1.6em',
        padding: 0,
        width: 60
    },
    listItem: {
        marginBottom: 5,
        border: '1px solid #595959',
        padding: '3px 10px',
        borderRadius: 5
    }
}
export default connect(state => state)(Price);