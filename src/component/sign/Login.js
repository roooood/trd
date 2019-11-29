
import React from 'react';
import autoBind from 'react-autobind';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import { createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import LockOpenOutlined from '@material-ui/icons/LockOpenOutlined';

import { t } from 'locales';

import request from 'library/Fetch';

import { connect } from 'react-redux';
import { User } from 'redux/action/user';

let theme = createMuiTheme()
const styles = {
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,

            username: 'siavasham',
            password: 'qazwsxedc',

            uError: false,
            pError: false,

            uHelp: null,
            pHelp: null,
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
    changePassword(e) {
        this.setState({ password: e.target.value }, () => {
            let short = this.state.password.length < 8;
            this.setState({
                pError: short,
                pHelp: short ? t('passwordIsShort') : null
            });
        })
    }
    handleKeyDown(e) {
        if (e.key === 'Enter') {
            this.submit()
        }
    }
    submit() {
        if (this.state.loading)
            return;
        for (let i of ['username', 'password']) {
            if (this.state[i] == '') {
                this.notify({ message: t('emptyFields'), type: 'warning' });
                return;
            }
        }
        for (let i of ['uError', 'pError']) {
            if (this.state[i] != false) {
                this.notify({ message: t('checkFields'), type: 'warning' });
                return;
            }
        }
        this.setState({ loading: true })

        let { username, password } = this.state
        request('user/login', { username, password }, res => {
            this.setState({ loading: false })
            if (res.success) {
                this.notify({ message: t('logined'), type: 'success' });
                this.props.dispatch(User({ ...res.data, type: 'real' }));
            } else {
                this.notify({ message: t('loginFailed'), type: 'error' });
            }
        });
    }
    notify(data) {
        window.ee.emit('notify', data)
    }
    render() {
        return (
            <Container component="main" maxWidth="xs">
                <div style={styles.paper}>
                    <Avatar style={styles.avatar}>
                        <LockOpenOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {t('signIn')}
                    </Typography>
                    <div style={styles.form} noValidate>
                        <TextField
                            onChange={this.changeUsername}
                            onKeyDown={this.handleKeyDown}
                            value={this.state.username}
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
                            onKeyDown={this.handleKeyDown}
                            value={this.state.password}
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

                        <Button
                            onClick={this.submit}
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={styles.submit}
                        >
                            {this.state.loading ? <CircularProgress size={25} color="#fff" thickness={3} /> : t('signIn')}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    {t('forgotPassword')}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link variant="body2" onClick={() => this.props.goto('register')}>
                                    {t('loginSignUp')}
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Container>

        );
    }
}

export default connect(state => state)(Login);