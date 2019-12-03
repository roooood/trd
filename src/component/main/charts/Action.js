import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import Price from './action/Price';
import Time from './action/Time';
import { t } from 'locales';

import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';

const BuyButton = withStyles(theme => ({
    root: {
        color: '#fff',
        maxHeight: 80,
        height: 80,
        marginTop: 5,
        fontSize: '1.1rem',
        background: 'linear-gradient(0deg, #CC7F0E, #25b940)',
        '&:hover': {

        },
    },
}))(Button);

const SellButton = withStyles(theme => ({
    root: {
        color: '#fff',
        maxHeight: 80,
        height: 80,
        marginTop: 5,
        fontSize: '1.1rem',
        background: 'linear-gradient(0deg, #fc155a, #CC7F0E)',
        '&:hover': {

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
        return (
            <div style={styles.root} className="scrollbar">
                <div style={styles.group}>
                    <Price amount={this.amount} />
                    <Time time={this.time} />
                </div>
                <div style={styles.profit}>
                    <div style={styles.info} >
                        <Typography variant="button" display="block" >
                            {t('profit')}
                        </Typography>
                        <HelpIcon style={{ ...styles.color, fontSize: 14 }} />
                    </div>
                    <div style={styles.info} >
                        <Typography variant="h4" display="block" style={{ color: this.state.state == 'up' ? '#25b940' : ' #fc155a' }} >
                            {profit}%
                        </Typography>
                    </div>
                    <div style={styles.info} >
                        <Typography variant="h5" display="block" style={{ color: this.state.state == 'up' ? '#25b940' : ' #fc155a' }} >
                            {(this.state.bet * profit / 100).toFixed(2)}$
                        </Typography>
                    </div>
                </div>
                <div style={styles.group}>
                    <BuyButton
                        variant="contained"
                        color="primary"
                        onClick={() => this.onTrade('buy')}
                        onMouseEnter={() => this.mouseOver('buy')}
                        onMouseLeave={() => this.mouseOut('buy')}>
                        <TrendingUpIcon style={{ marginRight: 20 }} /> {t('buy')}
                    </BuyButton>
                    <SellButton
                        variant="contained"
                        color="primary"
                        onClick={() => this.onTrade('sell')}
                        onMouseEnter={() => this.mouseOver('sell')}
                        onMouseLeave={() => this.mouseOut('sell')}>
                        <TrendingDownIcon style={{ marginRight: 20 }} /> {t('sell')}
                    </SellButton>
                    <Hidden only={['md', 'lg', 'xl']}>
                        <div style={{ height: 50 }} />
                    </Hidden>
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
        overflow: 'auto',
    },
    group: {
        display: 'flex',
        flexDirection: 'column',
    },
    profit: {
        border: '1px solid #333',
        padding: 5,
        borderRadius: 5,
        height: 600,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 100,
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