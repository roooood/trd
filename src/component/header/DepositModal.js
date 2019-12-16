import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { t } from 'locales';
import request from 'library/Fetch';
import { toMoney } from 'library/Helper';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Context from 'library/Context';
import Typography from '@material-ui/core/Typography';
import { Scrollbars } from 'react-custom-scrollbars';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Grid from '@material-ui/core/Grid';
import HistoryIcon from '@material-ui/icons/History';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
var QRCode = require('qrcode.react');

const StyledInput = withStyles(theme => ({
    root: {
        color: '#f7b71c',
        fontSize: 14,
        marginRight: -25,
    },
}))(Input);

const StyledSnackbarContent = withStyles(theme => ({
    root: {
        color: '#fff',
        background: '#ee7218',
        marginBottom: 25,
    },
}))(SnackbarContent);
const ColorButton = withStyles(theme => ({
    root: {
        color: 'rgb(221, 221, 221)',
        border: '1px solid rgb(85, 145, 240)',
        marginBottom: 7,
    },
}))(Button);
const ColorCircularProgress = withStyles({
    root: {
        color: '#fff',
    },
})(CircularProgress);

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: 'rgb(69, 71, 75)',
        color: '#eee',
        padding: 10,
        borderBottom: '1px solid rgb(193, 78, 192)'
    },
    body: {
        fontSize: 14,
        color: '#fff',
        borderBottom: 0,
        padding: 10
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(even)': {
            backgroundColor: 'rgba(136, 134, 134, 0.2)',
        },
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }
    },
}))(TableRow);
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
class Deposit extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            deposit: null,
            history: null,
            list: [],
            menu: null,
            route: 'history'
        };
        autoBind(this);
    }
    openMenu(event) {
        this.setState({ menu: event.currentTarget })
    }
    closeMenu() {
        this.setState({ menu: null })
    }
    componentDidMount() {
        request('cash/depositHistory', { token: this.props.user.token }, res => {
            if ('error' in res) {
                this.notify({ message: t('unhandledError'), type: 'error' });
            }
            else {
                this.setState({ history: res.data })
            }
        });
        request('cash/deposit', { token: this.props.user.token }, res => {
            if ('error' in res) {
                this.notify({ message: t('unhandledError'), type: 'error' });
            }
            else {
                this.setState({ list: res.data })
            }
        });
    }
    history() {
        this.setState({ route: 'history' });
    }
    makeDeposit() {
        this.setState({ route: 'deposit' })
        if (this.state.deposit == null) {
            request('cash/deposit', { token: this.props.user.token }, res => {
                if ('error' in res) {
                    this.notify({ message: t('unhandledError'), type: 'error' });
                }
                else {
                    let address = res.addresses;
                    delete address.usdc;
                    this.setState({ deposit: address })
                }
            });
        }
    }
    notify(msg) {
        window.ee.emit('notify', msg)
    }
    copy(string) {
        this.notify({ message: t('copied'), type: 'success' });
    }
    loading() {
        return (
            <div style={styles.loading}>
                <ColorCircularProgress />
            </div>
        )
    }
    generateDeposit() {
        return (
            <div style={styles.tableRoot}>
                <div style={styles.header} >
                    <Typography component="h5">{t('deposit')}</Typography>
                    <ColorButton onClick={this.history} variant="outlined" >
                        <HistoryIcon />
                        {t('history')}
                    </ColorButton>
                </div>
                {this.state.deposit == null
                    ? this.loading()
                    : <>
                        <StyledSnackbarContent message={t('depositExpireLimit')} />
                        <Grid container spacing={2}>
                            {Object.keys(this.state.deposit).map(item =>
                                < Grid key={item} item xs={3} style={styles.item}>
                                    <Typography align="center" style={{ color: '#aeabab' }}>{item.toUpperCase()}</Typography>
                                    <div style={styles.gr}>
                                        <QRCode value={this.state.deposit[item]} />
                                    </div>
                                    <StyledInput
                                        value={this.state.deposit[item]}
                                        endAdornment={
                                            <IconButton onClick={() => this.copy(this.state.deposit[item])} >
                                                <FileCopyIcon style={{ color: '#aeabab' }} />
                                            </IconButton>
                                        }
                                    />
                                </Grid>
                            )}
                        </Grid >
                    </>
                }
            </div>
        )
    }
    openLink(link) {
        window.open(link.replace('{token}', this.props.user.token), "_blank")
    }
    generateHistory() {
        return (
            <div style={styles.tableRoot}>
                <div style={styles.header} >
                    <Typography component="h5">{t('deposit')}</Typography>
                    <ColorButton onClick={this.openMenu} variant="outlined" >
                        <VerticalAlignBottomIcon />
                        {t('makeDeposit')}
                    </ColorButton>
                    <StyledMenu
                        open={Boolean(this.state.menu)}
                        anchorEl={this.state.menu}
                        onClose={this.closeMenu}
                    >
                        <List style={{ padding: '0 10px' }}>
                            {
                                this.state.list.map((item, i) => (
                                    <ListItem key={i} button onClick={() => this.openLink(item.link)}>
                                        <ListItemAvatar>
                                            <img src={item.logo} style={{ height: 30, width: 30, borderRadius: 15 }} />
                                        </ListItemAvatar>
                                        <ListItemText primary={item.title} />
                                    </ListItem>
                                ))
                            }
                        </List>
                    </StyledMenu>
                </div>
                {this.state.history == null
                    ? this.loading()
                    : <Scrollbars style={{ height: '50vh' }} >
                        <div style={styles.tableWrapper}>
                            <Table stickyHeader >
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell component="th">{t('wallet')}</StyledTableCell>
                                        <StyledTableCell component="th">{t('amount')}</StyledTableCell>
                                        <StyledTableCell component="th">{t('price')}</StyledTableCell>
                                        <StyledTableCell component="th">{t('status')}</StyledTableCell>
                                        <StyledTableCell component="th">{t('date')}</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.history.map(row => {
                                        return (
                                            <StyledTableRow key={row.id} >
                                                <StyledTableCell component="td" >{row.type} </StyledTableCell>
                                                <StyledTableCell component="td" >{row.amount} </StyledTableCell>
                                                <StyledTableCell component="td" >{toMoney(row.price)} </StyledTableCell>
                                                <StyledTableCell component="td" >{row.status} </StyledTableCell>
                                                <StyledTableCell component="td" >{new Date(row.time).toLocaleString()} </StyledTableCell>
                                            </StyledTableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </Scrollbars>
                }
            </div>
        )
    }
    render() {
        return (
            <div style={styles.root}>
                {this.state.route == 'history' &&
                    this.generateHistory()
                }
                {this.state.route == 'deposit' &&
                    this.generateDeposit()
                }
            </div>
        );
    }
}
const styles = {
    root: {
        flexGrow: 1,
        display: 'flex',
    },
    tableRoot: {
        width: '100%',
    },
    tableWrapper: {
        position: 'relative'
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '50vh'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderBottom: '1px solid rgb(125, 118, 118)',
        marginBottom: 20
    },
    item: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    gr: {
        marginTop: 5,
        marginBottom: 5,
        border: '1px solid #eee',
        padding: '9px 9px 0 9px',
        borderRadius: 5
    },
}
export default connect(state => state)(Deposit);