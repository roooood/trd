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
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Grid from '@material-ui/core/Grid';
import HistoryIcon from '@material-ui/icons/History';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';

const StyledInput = withStyles({
    root: {
        '& .MuiInput-root': {
            color: '#f7b71c',
            fontSize: 14,
        },
        '& label': {
            color: '#aeabab',
        },
        '& label.Mui-focused': {
            color: '#aeabab',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: '#aeabab',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#aeabab',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#aeabab',
            },
            '&:hover fieldset': {
                borderColor: '#aeabab',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#aeabab',
            },
        },
    },
})(TextField);

const MyRadio = withStyles({
    root: {
        color: '#aeabab',
        '&$checked': {
            color: '#f7b71c',
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />);

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

class Withdraw extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            withdraw: null,
            history: null,
            route: 'withdraw',
            submiting: false,
            form: {
                address: '',
                type: 'bitcoin',
                price: ''
            }
        };
        autoBind(this);
    }
    componentDidMount() {
        request('cash/withdrawHistory', { token: this.props.user.token }, res => {
            if ('error' in res) {
                this.notify({ message: t('unhandledError'), type: 'error' });
            }
            else {
                this.setState({ history: res.data })
            }
        });
    }
    changeInput(key, value) {
        this.setState(state => state.form[key] = value);
    }
    history() {
        this.setState({ route: 'history' });
    }
    makeWithdraw() {
        this.setState({ route: 'withdraw' });
    }
    maxValue() {
        this.changeInput(key, this.context.state.user.balance.real)
    }
    submitWithdraw() {
        this.setState({ submiting: true })
        request('cash/withdraw', { token: this.props.user.token, ...this.state.form }, res => {
            this.setState({ submiting: false })
            if ('error' in res) {
                this.notify({ message: t('unhandledError'), type: 'error' });
            }
            else if ('balance' in res) {
                this.notify({ message: t('withdrawError'), type: 'error' });
            }
            else if ('empty' in res) {
                this.notify({ message: t('emptyFields'), type: 'error' });
            }
            else {
                this.notify({ message: t('withdrawSubmited'), type: 'success' });
            }
        });
    }
    notify(msg) {
        window.ee.emit('notify', msg)
    }
    loading() {
        return (
            <div style={styles.loading}>
                <ColorCircularProgress />
            </div>
        )
    }
    generateWithdraw() {
        return (
            <div style={styles.tableRoot}>
                <div style={styles.header} >
                    <Typography component="h5">{t('withdraw')}</Typography>
                    <ColorButton onClick={this.history} variant="outlined" >
                        <HistoryIcon />
                        {t('history')}
                    </ColorButton>
                </div>
                <Grid container spacing={2} >
                    <Grid item xs={12} >
                        <FormControl component="fieldset" >
                            <FormLabel component="legend" style={{ color: '#aeabab' }}>{t('wallet')}</FormLabel>
                            <RadioGroup row name="type" value={this.state.form.type} onChange={(e) => this.changeInput('type', e.target.value)}>
                                {["Bitcoin", "Ethereum", "BitcoinCash", "Litecoin"].map(item =>
                                    <FormControlLabel key={item} value={item.toLowerCase()} control={< MyRadio />} label={item} />
                                )}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={7} style={{ marginBottom: 15 }}>
                        <FormControl fullWidth >
                            <StyledInput
                                label={t('address')}
                                value={this.state.form.address}
                                onChange={(e) => this.changeInput('address', e.target.value)}
                                endAdornment={
                                    <LibraryBooksIcon style={{ color: '#aeabab' }} />
                                }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={7} >
                        <FormControl fullWidth >
                            <StyledInput
                                label={t('amount')}
                                value={this.state.form.price}
                                onChange={(e) => this.changeInput('price', e.target.value)}
                                endAdornment={
                                    <MonetizationOnIcon style={{ color: '#aeabab' }} />
                                }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} >
                        <ColorButton onClick={this.maxValue} variant="outlined" >
                            {t('max')}
                        </ColorButton>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: 15, marginBottom: 15 }} >
                        <ColorButton onClick={this.submitWithdraw} variant="outlined" >
                            {this.state.submiting ? <ColorCircularProgress size={25} /> : t('submit')}
                        </ColorButton>
                    </Grid>
                </Grid >
            </div>
        )
    }
    generateHistory() {
        return (
            <div style={styles.tableRoot}>
                <div style={styles.header} >
                    <Typography component="h5">{t('withdraw')}</Typography>
                    <ColorButton onClick={this.makeWithdraw} variant="outlined" >
                        <VerticalAlignBottomIcon />
                        {t('makeWithdraw')}
                    </ColorButton>
                </div>
                {this.state.history == null
                    ? this.loading()
                    : <Scrollbars style={{ height: '50vh' }} >
                        <div style={styles.tableWrapper}>
                            <Table stickyHeader >
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell component="th">{t('wallet')}</StyledTableCell>
                                        <StyledTableCell component="th">{t('address')}</StyledTableCell>
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
                                                <StyledTableCell component="td" >{row.address} </StyledTableCell>
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
                {this.state.route == 'withdraw' &&
                    this.generateWithdraw()
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
}
export default connect(state => state)(Withdraw);