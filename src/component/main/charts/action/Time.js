import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import { t } from 'locales';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import HelpIcon from '@material-ui/icons/Help';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';

const StyledMenu = withStyles({
    paper: {
        background: '#25272b',
        color: '#fff',
        transform: 'translateX(-100px) translateY(-5px)!important'
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

class Time extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            open: null,
            value: 1
        };
        this.range = [1, 2, 5, 10, 15, 30, 60, 120, 300]
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
        if (this.context.state.setting.tradeTimeMax <= value) {
            value = this.context.state.setting.tradeTimeMax;
        }
        if (value > 0) {
            this.setState({ value }, () => {
                this.props.time(value)
            })
        }
    }
    render() {
        return (
            <>
                <div style={styles.root}>
                    <Hidden only={['xs', 'sm']}>
                        <div style={styles.info} onClick={this.openMenu} >
                            <Typography variant="button" display="block" style={styles.color}>
                                {t('time')}
                            </Typography>
                            <HelpIcon style={{ ...styles.color, fontSize: 14 }} />
                        </div>
                        <div style={styles.display} >
                            <AccessTimeIcon onClick={this.openMenu} style={{ ...styles.color, fontSize: '1.3em', marginRight: 15 }} />
                            <input
                                type="text"
                                onChange={e => this.changeValue(e.target.value)}
                                style={styles.input}
                                value={this.state.value} />
                        </div>
                    </Hidden>
                    <Hidden only={['md', 'lg', 'xl']}>
                        <div style={styles.display} onClick={this.openMenu}>
                            <AccessTimeIcon style={{ ...styles.color, fontSize: '1.3em', marginRight: 15 }} />
                            <input
                                type="text"
                                disabled
                                onChange={e => this.changeValue(e.target.value)}
                                style={styles.input}
                                value={this.state.value} />
                        </div>
                    </Hidden>
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
                            if (this.context.state.setting.tradeTimeMax >= item)
                                return (
                                    <ListItem style={styles.listItem} key={item} button onClick={() => this.change(item)}>
                                        <Typography style={styles.color}>
                                            {item}  min
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
        margin: 5,
        padding: 2,
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
        height: '1em',
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
        fontSize: '1.4em',
        padding: 0,
        width: 45,
        height: '1.4em'
    },
    listItem: {
        marginBottom: 5,
        border: '1px solid #595959',
        padding: '3px 10px',
        borderRadius: 5
    }
}
export default Time;