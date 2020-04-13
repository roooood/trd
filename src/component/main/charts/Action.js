import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import Price from './action/Price';
import Time from './action/Time';
import { t } from 'locales';
import { toMoney } from 'library/Helper';

import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';

const BuyButton = withStyles(theme => ({
    root: {
        display: 'flex',
        flex: 1,
        color: '#fff',
        maxHeight: 80,
        padding: '30px 0',
        [theme.breakpoints.down('sm')]: {
            padding: '8px 0',
        },
        margin: 5,
        fontSize: '1rem',
        background: 'linear-gradient(0deg, #CC7F0E, #25b940)',
        transition: 'all 0.3s ease-out',
        outlineOffset: 3,
        '&:hover': {
            // color: '#fff',
            boxShadow: 'inset 0 0 10px rgba(87, 227, 36, 0.5), 0 0 10px rgba(87, 227, 36, 0.5)'
        },
    },
}))(Button);

const SellButton = withStyles(theme => ({
    root: {
        display: 'flex',
        flex: 1,
        color: '#fff',
        maxHeight: 80,
        padding: '30px 0',
        [theme.breakpoints.down('sm')]: {
            padding: '8px 0',
        },
        margin: 5,
        fontSize: '1rem',
        background: 'linear-gradient(0deg, #fc155a, #CC7F0E)',
        transition: 'all 0.3s ease-out',
        outlineOffset: 3,
        '&:hover': {
            // color: '#fff',
            boxShadow: 'inset 0 0 10px rgba(210, 38, 54, 0.5), 0 0 10px rgba(210, 38, 54, 0.5)'
        },
    },
}))(Button);

class Action extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            state: 'up',
            bet: 1,
            tradeAt: 1
        };
        this.noOver = false;
        autoBind(this);
    }
    time(tradeAt) {
        this.setState({ tradeAt })
    }
    amount(bet) {
        this.setState({ bet })
    }
    onTrade(tradeType) {
        window.ee.emit('actionBlur' + this.props.parent.id)
        window.ee.emit('trade' + this.props.parent.id, { tradeType, bet: this.state.bet, tradeAt: this.state.tradeAt })
    }
    mouseOver(type) {
        window.ee.emit('actionHover' + this.props.parent.id, type)
    }
    mouseOut(type) {
        window.ee.emit('actionBlur' + this.props.parent.id, type)
    }
    render() {
        let profit = this.context.state.setting.profit || 0;
        let { currency } = this.context.state.user;
        let value = toMoney((this.state.bet * profit / 100).toFixed(2), currency);
        return (
            <div style={styles.root} className="scrollbar">
                <div style={this.context.state.isPortrait ? styles.group2 : styles.group}>
                    <Price amount={this.amount} />
                    {this.context.state.isPortrait &&
                        <div style={styles.profit2}>
                            <Typography variant="button" display="block" >
                                {t('profit')}
                            </Typography>
                            <div style={styles.profit3} >
                                <div style={{...styles.info,...styles.border}} >
                                    <Typography variant="h5" display="block" style={{ color: 'rgb(232, 229, 92)' }} >
                                    {profit}%
                                </Typography>
                                </div>
                                <div style={styles.info} >
                                <Typography display="block" style={{ color: '#41c14b' , fontSize: value.length > 5 ? '1em' : '1.5em'}} >
                                    {value}$
                                </Typography>
                                </div>
                            </div>
                        </div>
                    }
                    <Time time={this.time} />
                </div>
                <Hidden only={['xs', 'sm']}>
                    <div style={styles.profit}>
                        <div style={styles.info} >
                            <Typography variant="button" display="block" >
                                {t('profit')}
                            </Typography>
                            <HelpIcon style={{ ...styles.color, fontSize: 14 }} />
                        </div>
                        <div style={styles.info} >
                            <Typography variant="h4" display="block" style={{ color: 'rgb(232, 229, 92)' }} >
                                {profit}%
                        </Typography>
                        </div>
                        <div style={styles.info} >
                            <Typography variant="h5" display="block" style={{ color: 'rgb(232, 229, 92)', fontSize: value.length > 5 ? '1em' : '1.5em' }} >
                                {value}$
                        </Typography>
                        </div>
                    </div>
                </Hidden>
                <div style={this.context.state.isPortrait ? styles.group2 : styles.group}>
                    <BuyButton
                        onClick={() => this.onTrade('buy')}
                        onMouseEnter={() => this.mouseOver('buy')}
                        onMouseLeave={() => this.mouseOut('buy')}>
                        <TrendingUpIcon style={{ marginRight: '1vw' }} /> {t('buy')}
                    </BuyButton>
                    <SellButton
                        onClick={() => this.onTrade('sell')}
                        onMouseEnter={() => this.mouseOver('sell')}
                        onMouseLeave={() => this.mouseOut('sell')}>
                        <TrendingDownIcon style={{ marginRight: '1vw' }} /> {t('sell')}
                    </SellButton>
                </div>
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
        flexDirection: 'column',
        overflow: 'hidden',
    },
    group: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    group2: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid #2f2f2f',
    },
    profit: {
        border: '1px solid rgba(128, 128, 128, 0.8)',
        margin: 5,
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 100,
    },
    profit2: {
        border: '1px solid rgba(128, 128, 128, 0.8)',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        margin: 5,
        padding: 3
    },
    profit3: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
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
    border: {
        borderRight: '1px solid #4e4d4d',
        paddingRight: 5,
        marginRight: 5,
    }
}
export default Action;