import React from 'react';
import autoBind from 'react-autobind';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import { createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LockOpenOutlined from '@material-ui/icons/LockOpenOutlined';
import PhoneInput from 'react-phone-input-2';
import 'assets/css/material.css';

import { t } from 'locales';
import { emailPattern } from 'library/Helper';
import request from 'library/Fetch';

import { connect } from 'react-redux';
import { User } from 'redux/action/user';



class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,

            username: '',
            password: '',
            mobile: '',
            email: '',
            agree: false,

            uError: false,
            pError: false,
            eError: false,

            uHelp: null,
            pHelp: null,
            eHelp: null,
        };
        autoBind(this);
    }
    changeUsername(e) {
        this.setState({ username: e.target.value.toLowerCase() }, () => {
            let short = this.state.username.length < 4;
            this.setState({
                uError: short,
                uHelp: short ? t('usernameIsShort') : null
            });
        })
    }
    checkUsername() {
        if (this.state.username.length < 4 || this.state.uError)
            return;
        request('user/username_check', { username: this.state.username }, res => {
            this.checkedUsername(res)
        });
    }
    checkedUsername(res) {
        this.setState({
            uError: !res.success,
            uHelp: t(res.message)
        });
    }
    changePassword(e) {
        this.setState({ password: e.target.value }, () => {
            let short = this.state.password.length < 8;
            this.setState({
                pError: short,
                pHelp: short ? t('passwordIsShort') : null
            });
        })
    }
    changeEmail(e) {
        this.setState({ email: e.target.value.toLowerCase() }, () => {
            let valid = !emailPattern.test(this.state.email);
            this.setState({
                eError: valid,
                eHelp: valid ? t('emailIsInvalid') : null
            });
        })
    }
    checkEmail() {
        if (this.state.email.length < 4 || this.state.eError)
            return;
        request('user/email_check', { email: this.state.email }, res => {
            this.setState({
                eError: !res.success,
                eHelp: t(res.message)
            });
        });
    }

    changeAgree() {
        this.setState({ agree: !this.state.agree })
    }
    changeNumber(mobile) {
        this.setState({ mobile })
    }
    submit() {
        if (this.state.loading)
            return;
        for (let i of ['username', 'password', 'email']) {
            if (this.state[i] == '') {
                this.notify({ message: t('emptyFields'), type: 'warning' });
                return;
            }
        }
        for (let i of ['uError', 'pError', 'eError']) {
            if (this.state[i] != false) {
                this.notify({ message: t('checkFields'), type: 'warning' });
                return;
            }
        }
        if (this.state.agree == false) {
            this.notify({ message: t('agreeTerms'), type: 'warning' });
            return;
        }
        this.setState({ loading: true })
        let { username, password, email, mobile } = this.state
        request('user/add_account', { username, password, email, mobile }, res => {
            this.setState({ loading: false })
            if (res.success) {
                this.notify({ message: t('registered'), type: 'success' });
                this.props.dispatch(User({ ...res.data, type: 'real' }));
            } else {
                this.notify({ message: t('registerFailed'), type: 'error' });
                this.checkErrors(res);
            }
        });
    }
    checkErrors(res) {
        let valid = { username: ['uError', 'uHelp'], password: ['pError', 'pHelp'], email: ['eError', 'eHelp'], }
        for (let i in res.errors) {
            let error = res.errors[i][0];
            if (i in valid) {
                this.setState(state => {
                    state[valid[i][0]] = true
                    state[valid[i][1]] = t(error)
                    return state
                })
            }
        }
    }
    notify(data) {
        window.ee.emit('notify', data)
    }

    render() {
        return (
            <Container component="main" maxWidth="xs">
                <div style={styles.paper}>
                    <Button
                        onClick={() => this.props.goto('login')}
                        type="button"
                        variant="outlined"
                        color="primary"
                        style={styles.back}
                    >
                        <ArrowBackIcon />
                    </Button>
                    <Avatar style={styles.avatar}>
                        <LockOpenOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {t('signUp')}
                    </Typography>
                    <div style={styles.form} noValidate>
                        <TextField
                            onChange={this.changeUsername}
                            onBlur={this.checkUsername}
                            variant="outlined"
                            margin="normal"
                            required
                            error={this.state.uError}
                            fullWidth
                            label={t('username')}
                            name="username"
                            autoComplete="username"
                            autoFocus
                            helperText={this.state.uHelp}
                        />
                        <TextField
                            onChange={this.changePassword}
                            variant="outlined"
                            margin="normal"
                            required
                            error={this.state.pError}
                            fullWidth
                            name="password"
                            label={t('password')}
                            type="password"
                            autoComplete="current-password"
                            helperText={this.state.pHelp}
                        />
                        <PhoneInput
                            disableAreaCodes
                            defaultCountry="us"
                            value={this.state.mobile}
                            onChange={this.changeNumber}
                        />
                        <TextField
                            onChange={this.changeEmail}
                            onBlur={this.checkEmail}
                            variant="outlined"
                            margin="normal"
                            required
                            error={this.state.eError}
                            fullWidth
                            id="email"
                            label={t('recoveryEmail')}
                            name="email"
                            autoComplete="email"
                            helperText={this.state.eHelp}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={this.changeAgree}
                                    value="agree"
                                    color="primary" />
                            }
                            label={(
                                <label style={styles.label}>
                                    {t('agree')}
                                    <Link href="#" variant="body2" style={styles.terms}>
                                        {t('terms')}
                                    </Link>
                                    .
                            </label>
                            )}
                        />

                        <Button
                            onClick={this.submit}
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={styles.submit}
                        >
                            {this.state.loading ? <CircularProgress size={25} color="#fff" thickness={3} /> : t('signUp')}
                        </Button>
                    </div>
                </div>

            </Container>
        );
    }
}
let theme = createMuiTheme()
const styles = {
    paper: {
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        color: '#333'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        padding: theme.spacing(2),
    },
    terms: {
        margin: theme.spacing(0, .4),
    },
    close: {
        padding: theme.spacing(0.5),
    },
    label: {
        color: '#454545'
    },
    back: {
        position: 'absolute',
        left: -10,
        top: -10
    }
}
export default connect(state => state)(Register);