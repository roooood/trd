import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from '../../../library/Context';
import Price from './action/Price';
import Time from './action/Time';
import { t } from '../../../locales';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { green, purple } from '@material-ui/core/colors';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';

const BuyButton = withStyles(theme => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        height: '100%',
        marginTop: 5,
        background: 'linear-gradient(0deg, #CC7F0E, #25b940)',
        '&:hover': {
            backgroundColor: purple[700],
        },
    },
}))(Button);

const SellButton = withStyles(theme => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        height: '100%',
        marginTop: 5,
        background: 'linear-gradient(0deg, #fc155a, #CC7F0E)',
        '&:hover': {
            backgroundColor: purple[700],
        },
    },
}))(Button);

class Action extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            state: 'up'
        };
        autoBind(this);
    }
    render() {
        return (
            <div style={styles.root}>
                <Price />
                <Time />
                <div style={styles.profit}>
                    <div style={styles.info} >
                        <Typography variant="button" display="block" >
                            {t('profit')}
                        </Typography>
                        <HelpIcon style={{ ...styles.color, fontSize: 14 }} />
                    </div>
                    <div style={styles.info} >
                        <Typography variant="h4" display="block" style={{ color: this.state.state == 'up' ? '#25b940' : ' #fc155a' }} >
                            +14%
                        </Typography>
                    </div>
                    <div style={styles.info} >
                        <Typography variant="h5" display="block" style={{ color: this.state.state == 'up' ? '#25b940' : ' #fc155a' }} >
                            +20$
                        </Typography>
                    </div>
                </div>
                <BuyButton variant="contained" color="primary">
                    <TrendingUpIcon style={{ marginRight: 20 }} /> {t('buy')}
                </BuyButton>
                <SellButton variant="contained" color="primary">
                    <TrendingDownIcon style={{ marginRight: 20 }} /> {t('sell')}
                </SellButton>
            </div>
        );
    }
}
const styles = {
    root: {
        width: '100%',
        display: 'flex',
        height: '100%',
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    profit: {
        border: '1px solid #333',
        padding: 5,
        borderRadius: 5,
        height: 600,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    color: {
        color: '#b5b5b5'
    },
}
export default Action;