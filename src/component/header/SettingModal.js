import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import i18n,{ t } from 'locales';
import request from 'library/Fetch';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import Context from 'library/Context';
import Input from '@material-ui/core/Input';


const StyledInput = withStyles(theme => ({
    root: {
        color: '#f7b71c',
        fontSize: 14,
        marginRight: -25,
    },
}))(Input);


class Setting extends Component {
    static contextType = Context;
    constructor(props, Context) {
        super(props);
        let { cur, lang } = Context.state.user;
        this.state = {
            language: lang,
            currency: cur
        };
        autoBind(this);
    }
    componentDidMount() {
        this.context.game.register('currency', this.currency);
    }
    notify(msg) {
        window.ee.emit('notify', msg)
    }
    handleLanguage(event){
        this.setState({ language: event.target.value }, () => {
            this.context.game.send({ lang:this.state.language });
            i18n.changeLanguage(this.state.language);
            let update = this.context.app('update');
            update();
        });
    }
    handleCurrency(event) {
        this.setState({ currency: event.target.value }, () => {
            this.context.game.send({ currency: this.state.currency });
        });
    }
    currency(cur) {
        this.context.state.user.currency = cur;
        let update = this.context.app('update');
        update();
    }
    render() {
        return (
            <div style={styles.root}>
                <List style={styles.list}>
                    <ListItem style={styles.listItem}>
                        <ListItemText primary={t('lanuage')} />
                        <Select
                            value={this.state.language}
                            onChange={this.handleLanguage}
                            style={{color:'#fff'}}
                        >
                            <MenuItem value={'en'}>English</MenuItem>
                            <MenuItem value={'fa'}>فارسی</MenuItem>
                        </Select>
                    </ListItem>
                    <ListItem style={styles.listItem}>
                        <ListItemText primary={t('currency')} />
                        <Select
                            value={this.state.currency}
                            onChange={this.handleCurrency}
                            style={{ color: '#fff' }}
                        >
                            <MenuItem value={'usd'}>Usd</MenuItem>
                            <MenuItem value={'rial'}>Irr(ریال)</MenuItem>
                        </Select>
                    </ListItem>
                </List>

            </div>
        );
    }
}
let theme = createMuiTheme()
const styles = {
    root: {
        flexGrow: 1,
        display: 'flex',
        padding:20
    },
    list: {
        width:'100%'
    },
    listItem: {
        padding: theme.spacing(1, 0),
    },
    title: {
        marginTop: theme.spacing(2),
    },
}
export default connect(state => state)(Setting);