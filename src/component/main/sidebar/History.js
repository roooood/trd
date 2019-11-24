import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import Context from 'library/Context';
import { t } from 'locales';
import Typography from '@material-ui/core/Typography';
import { Scrollbars } from 'react-custom-scrollbars';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@material-ui/icons/KeyboardArrowUpRounded';
import play from 'library/Sound';

class Price extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            type: 'open',
            open: [],
            real: [],
            practice: [],
        };
        autoBind(this);
    }
    show(type) {
        this.setState({ type })
    }
    notify(data) {
        window.ee.emit('notify', data)
    }
    componentDidMount() {
        this.context.game.register('orders', this.order);
        this.context.game.register('order', this.order);
        this.context.game.register('orderResult', this.orderResult);
        this.context.game.send({ get: 'Orders' });
    }
    orderResult(order) {
        let i;
        for (i in this.state.open) {
            if (this.state.open[i].id == order.id) {
                this.state.open.splice(i, 1);
                break;
            }
        }
        this.state[order.balanceType].unshift(order);
        this.setState({ test: Math.random() });
        play(order.amount > 0 ? 'win' : 'lose')
        if (order.amount > 0) {
            this.notify({ message: t('uWin') + ' : +$' + order.amount, type: 'success' });
        }
        else {
            this.notify({ message: t('uLose') + ' : -$' + order.bet, type: 'error' });
        }
    }
    order(orders) {
        let i;
        for (i of orders) {
            if (i.status == 'pending') {
                this.state.open.unshift(i)
            }
            else {
                this.state[i.balanceType].unshift(i)
            }
        }
        this.setState({ test: Math.random() })
    }
    timeConverter(timestamp) {
        var a = new Date(timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        return [(("" + hour).length == 1 ? '0' + hour : hour) + ':' + (("" + min).length == 1 ? '0' + min : min), (date + ' ' + month)];
    }
    render() {
        return (
            <div style={styles.root} className="swing-in-top-fwd" >
                <Typography align="center" gutterBottom > {t('tradingHistory')}</Typography >
                <ButtonGroup color="primary" fullWidth size="small">
                    {['open', 'real', 'practice'].map((item, i) => (
                        <Button key={i} style={{ color: this.state.type == item ? "#fff" : "rgb(83, 81, 81)" }} onClick={() => this.show(item)}>{t(item)}</Button>
                    ))
                    }
                </ButtonGroup>
                <Scrollbars style={{ height: '73vh' }}  >
                    {this.state[this.state.type].map((item, i) => {
                        let date = this.timeConverter(item.point)
                        return (
                            <div key={i} style={styles.item}>
                                <div style={styles.subItem}>
                                    <div>{date[0]}</div>
                                    <div style={styles.subItemDesc}>{date[1]}</div>
                                </div>
                                <div style={styles.subItem}>
                                    <div style={styles.subItemText}>{item.market.display}</div>
                                    <div style={styles.subItemDesc}>
                                        {item.price}
                                        {
                                            item.tradeType == 'buy'
                                                ? <KeyboardArrowUpRoundedIcon fontSize="small" style={{ color: '#25b940' }} />
                                                : <KeyboardArrowDownRoundedIcon fontSize="small" style={{ color: '#fc155a' }} />
                                        }
                                    </div>
                                </div>
                                <div style={styles.subItem}>
                                    <div
                                        style={{
                                            ...styles.subItemText,
                                            color: item.status == 'pending' ? '#fff' : item.amount > 0 ? '#25b940' : '#fc155a'
                                        }}>
                                        ${item.status == 'pending'
                                            ? item.bet
                                            : item.amount > 0
                                                ? '+' + item.amount
                                                : '-' + item.bet
                                        }
                                    </div>
                                    <div style={styles.subItemDesc}>${item.bet}</div>
                                </div>
                            </div>
                        )
                    })
                    }
                </Scrollbars>
            </div >
        );
    }
}
const styles = {
    root: {
        flexGrow: 1,
        padding: 7
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,.5)',
        borderRadius: 5,
        padding: 5,
        marginTop: 10
    },
    subItem: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    subItemText: {
        fontSize: 12,
        color: '#fff'
    },
    subItemDesc: {
        display: 'flex',
        fontSize: 10,
        color: 'rgb(181, 181, 181)',
        justifyContent: 'center',
        alignItems: 'center'
    },

}
export default connect(state => state)(Price);