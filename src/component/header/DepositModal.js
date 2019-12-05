import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { t } from 'locales';
import request from 'library/Fetch';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Context from 'library/Context';
import Typography from '@material-ui/core/Typography';
import { Scrollbars } from 'react-custom-scrollbars';
import Clipboard from 'react-clipboard.js';
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
var QRCode = require('qrcode.react');

const StyledInput = withStyles(theme => ({
    root: {
        color: '#aeabab',
        fontSize: 14,
        marginRight: -25,
        '&:hover': {

        },
    },
}))(Input);

const StyledSnackbarContent = withStyles(theme => ({
    root: {
        color: '#fff',
        background: '#ee7218',
        marginBottom: 25,
        '&:hover': {

        },
    },
}))(SnackbarContent);
const ColorButton = withStyles(theme => ({
    root: {
        color: 'rgb(221, 221, 221)',
        border: '1px solid rgb(85, 145, 240)',
        marginBottom: 7,
        '&:hover': {

        },
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
        cursor: 'pointer',
        '&:nth-of-type(even)': {
            backgroundColor: 'rgba(136, 134, 134, 0.2)',
        },
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }
    },
}))(TableRow);

class Deposit extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            route: 'loading',
            deposit: null,
            history: []
        };
        autoBind(this);
    }
    componentDidMount() {
        this.setState({ route: 'history' });
    }
    handleChange(e, tab) {
        this.setState({ tab });
    }
    changeAmount(e) {
        this.setState({ amount: e.target.value });
    }
    history() {
        this.setState({ route: 'history' });
    }
    makeDeposit() {
        if (this.state.deposit == null) {
            this.setState({ route: 'loading' });
            request('cash/deposit', { token: this.props.user.token }, res => {
                if ('error' in res) {
                    this.notify({ message: t('unhandledError'), type: 'error' });
                }
                else {
                    let address = res.addresses;
                    delete address.usdc;
                    this.setState({ route: 'deposit', deposit: address })
                }
            });
        }
        else {
            this.setState({ route: 'deposit' })
        }
    }
    notify(msg) {
        window.ee.emit('notify', msg)
    }
    copy() {
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
                                    <Clipboard data-clipboard-text={this.state.deposit[item]} onSuccess={this.copy}>
                                        <IconButton >
                                            <FileCopyIcon style={{ color: '#aeabab' }} />
                                        </IconButton>
                                    </Clipboard>
                                }
                            />
                        </Grid>
                    )}
                </Grid >
            </div>
        )
    }
    generateHistory() {
        return (
            <div style={styles.tableRoot}>
                <div style={styles.header} >
                    <Typography component="h5">{t('deposit')}</Typography>
                    <ColorButton onClick={this.makeDeposit} variant="outlined" >
                        <VerticalAlignBottomIcon />
                        {t('makeDeposit')}
                    </ColorButton>
                </div>
                <Scrollbars style={{ height: '50vh' }} >
                    <div style={styles.tableWrapper}>
                        <Table stickyHeader >
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell component="th">{t('address')}</StyledTableCell>
                                    <StyledTableCell component="th">{t('wallet')}</StyledTableCell>
                                    <StyledTableCell component="th">{t('amount')}</StyledTableCell>
                                    <StyledTableCell component="th">{t('status')}</StyledTableCell>
                                    <StyledTableCell component="th">{t('date')}</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.history.map(row => {
                                    return (
                                        <StyledTableRow key={row.id} >
                                            <StyledTableCell component="td" >
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Scrollbars>
            </div>
        )
    }
    render() {
        return (
            <div style={styles.root}>
                {this.state.route == 'loading' &&
                    this.loading()
                }
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
        minHeight: 200
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderBottom: '1px solid #ededed',
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
    alert: {
        background: '#378'
    }
}
export default connect(state => state)(Deposit);