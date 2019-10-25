import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { t } from '../../../locales';
import { canddleUrl, resolution, hub2candle, chartOptions, candleOption, volumeOption, getDimention } from './Const';
import { connect } from 'react-redux';
import request from '../../../library/Fetch';
import Resolution from './Resolution';
import Context from '../../../library/Context';
import { TabbarAdd } from '../../../redux/action/tab';
import * as LightweightCharts from './lightweight-charts';


class Chart extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
        this.candle = {};
        this.timer = null;
        this.id = props.parent.id;
        autoBind(this);
        window.ee.on('actionHover', this.showAction)
        window.ee.on('actionBlur', this.hideAction)
        window.ee.on('trade', this.trade)
    }
    resize() {
        if (this.props.inView)
            this.chart.applyOptions(getDimention());
    }
    componentWillReceiveProps(nextProps, contextProps) {
    }

    componentDidMount() {
        this.context.game.register('order', this.order);

        this.getData();

        this.selector = document.getElementById('chart' + this.id);

        window.addEventListener('resize', this.resize);
        new ResizeObserver(this.resize).observe(document.querySelector(".sidebar"))

        this.chart = LightweightCharts.createChart(this.selector, {
            ...getDimention(),
            ...chartOptions
        });
        this.candleSeries = this.chart.addCandlestickSeries(candleOption);
        this.volumeSeries = this.chart.addHistogramSeries(volumeOption);
        // this.lineSeries = this.chart.addLineSeries({
        //     overlay: true,
        //     priceLineColor: '#4682B4',
        //     priceLineStyle: 2,
        // });

    }

    getData() {
        let url = canddleUrl;
        let { type, symbol, candle } = this.props.parent;
        let post = {
            type,
            symbol,
            resolution: resolution[candle],
            count: 50,
            token: this.context.state.token
        }
        for (let i in post) {
            url = url.replace('{' + i + '}', post[i])
        }

        if (!(candle in this.candle)) {
            this.setState({ loading: true });
            request('candle/', { url }, res => {
                this.setState({ loading: false });
                if (typeof res == 'object') {
                    let data = hub2candle(res);
                    if (data != null) {
                        this.candle[candle] = data;
                        this.setValue();
                    }
                }
            });
        } else {
            this.setValue();
        }
    }
    setValue() {
        let type = this.props.parent.candle;
        this.volumeSeries.setData(this.candle[type]);
        this.candleSeries.setData(this.candle[type]);

        // this.lineSeries.setData(this.candle[type]);
        this.chart.timeScale().fitContent();
    }
    showAction(action) {
        let type = this.props.parent.candle;
        if (!(type in this.candle)) {
            return;
        }
        let len = this.candle[type].length;
        let dm = getDimention();
        if (action == 'buy') {
            this.candleSeries.setMarkers([
                {
                    time: this.candle[type][len - 1].time,
                    position: 'aboveBar',
                    color: ['rgba(5, 253, 50,.2) ', 'rgba(0, 0, 0,0)', 'rgb(5, 253, 50)', dm],
                    shape: 'buy',
                }
            ]);
        }
        else {
            this.candleSeries.setMarkers([
                {
                    time: this.candle[type][len - 1].time,
                    position: 'belowBar',
                    color: ['rgba(252, 21, 90,.3)', 'rgba(0, 0, 0, 0)', 'rgb(252, 21, 90)', dm],
                    shape: 'sell',
                },
            ]);
        }
    }
    hideAction() {
        let type = this.props.parent.candle;
        if (!(type in this.candle)) {
            return;
        }
        let len = this.candle[type].length;
        this.candleSeries.setMarkers([
            {
                time: this.candle[type][len - 1].time,
                shape: 'null',
            }
        ]);
    }
    trade({ tradeType, bet, tradeAt }) {
        // let { balance } = this.context.state.user;
        let { id, candle } = this.props.parent;
        if (!(candle in this.candle)) {
            return;
        }
        let len = this.candle[candle].length;
        let data = {
            balanceType: this.props.user.type,
            tradeType,
            bet: bet,
            marketId: id,
            point: this.candle[candle][len - 1].time,
            tradeAt: tradeAt
        }
        this.context.game.send({ trade: data });
    }
    order({ point }) {
        this.candleSeries.setMarkers([
            {
                time: point,
                position: 'inBar',
                color: '#5C91D9',
                shape: 'circle',
            }
        ]);
        this.notify({ message: t('orderSuccess'), type: 'success' });
    }
    changeResolution(candle) {
        this.props.dispatch(TabbarAdd({ key: this.props.tab.active, value: { ...this.props.parent, candle } }));
        setTimeout(() => {
            this.getData();
        }, 100);
    }
    // dynamicUpdate() {
    //     setInterval(function () {
    //         var deltaY = targetPrice - lastClose;
    //         var deltaX = targetIndex - lastIndex;
    //         var angle = deltaY / deltaX;
    //         var basePrice = lastClose + (currentIndex - lastIndex) * angle;
    //         var noise = (0.1 - Math.random() * 0.2) + 1.0;
    //         var noisedPrice = basePrice * noise;
    //         mergeTickToBar(noisedPrice);
    //         if (++ticksInCurrentBar === 5) {
    //             // move to next bar
    //             currentIndex++;
    //             currentBusinessDay = nextBusinessDay(currentBusinessDay);
    //             currentBar = {
    //                 open: null,
    //                 high: null,
    //                 low: null,
    //                 close: null,
    //                 time: currentBusinessDay,
    //             };
    //             ticksInCurrentBar = 0;
    //             if (currentIndex === 5000) {
    //                 reset();
    //                 return;
    //             }
    //             if (currentIndex === targetIndex) {
    //                 // change trend
    //                 lastClose = noisedPrice;
    //                 lastIndex = currentIndex;
    //                 targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
    //                 targetPrice = getRandomPrice();
    //             }
    //         }
    //     }, 1000);
    // }
    notify(data) {
        window.ee.emit('notify', data)
    }
    render() {
        return (
            <div style={styles.root}>
                {this.state.loading &&
                    <div class="loading-dir">
                        <div class="loading">
                            <div class="loading-1"></div>
                            <div class="loading-2"></div>
                            <div class="loading-3"></div>
                            <div class="loading-4"></div>
                        </div>
                    </div>
                }
                <div id={"chart" + this.id} />
                <div style={styles.actions}>
                    <Resolution value={this.props.parent.candle} onChange={this.changeResolution} />
                </div>
            </div>
        );
    }
}
const styles = {
    root: {
        height: '100%',
        display: 'flex',
        height: '100%',
        position: 'relative'
    },
    actions: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 50,
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'baseline',
    }
}
export default connect(state => state)(Chart);