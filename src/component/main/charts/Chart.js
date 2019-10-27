import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { t } from '../../../locales';
import { canddleUrl, resolutionEx, hub2candle, chartOptions, candleOption, volumeOption, lineOption, barOption, areaOption, getDimention } from './Const';
import { connect } from 'react-redux';
import request from '../../../library/Fetch';
import Resolution from './widget/Resolution';
import ChartType from './widget/chartTypes';
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
        this.chartData = {};
        this.chartType = {};
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

        this.createChart();
    }

    getData() {
        let url = canddleUrl;
        let { type, symbol, resolution } = this.props.parent;
        let post = {
            type,
            symbol,
            resolution: resolutionEx[resolution],
            count: this.context.state.setting.maxData,
            token: this.context.state.token
        }
        for (let i in post) {
            url = url.replace('{' + i + '}', post[i])
        }

        if (!(resolution in this.chartData)) {
            this.setState({ loading: true });
            request('candle/', { url }, res => {
                this.setState({ loading: false });
                if (typeof res == 'object') {
                    let data = hub2candle(res);
                    if (data != null) {
                        this.chartData[resolution] = data;
                        this.changeData();
                    }
                }
            });
        } else {
            this.changeData();
        }
    }
    createChart() {
        this.chart = LightweightCharts.createChart(this.selector, {
            ...getDimention(),
            ...chartOptions
        });

        this.volumeSeries = this.chart.addHistogramSeries(volumeOption);
    }
    createSeries() {
        this.chartType['candle'] = this.chart.addCandlestickSeries(candleOption);
        this.chartType['line'] = this.chart.addLineSeries(lineOption);
        this.chartType['area'] = this.chart.addAreaSeries(areaOption);
        this.chartType['bar'] = this.chart.addBarSeries(barOption);
    }
    changeData(ok) {
        this.chart.clear();
        this.createSeries();
        let { resolution, chartType } = this.props.parent;
        this.volumeSeries.setData(this.chartData[resolution]);
        for (let i of ['candle', 'line', 'area', 'bar']) {
            if (i == chartType) {
                this.chartType[i].setData(this.chartData[resolution]);
            }
            else {
                this.chart.removeSeries(this.chartType[i]);
                this.chartType[i] = null;
            }
        }
        this.chart.timeScale().fitContent();
    }
    showAction(action) {
        let { resolution } = this.props.parent;
        if (!(resolution in this.chartData)) {
            return;
        }
        let len = this.chartData[resolution].length;
        let dm = getDimention();
        if (action == 'buy') {
            this.chartType[this.props.parent.chartType].setMarkers([
                {
                    time: this.chartData[resolution][len - 1].time,
                    position: 'aboveBar',
                    color: ['rgba(5, 253, 50,.2) ', 'rgba(0, 0, 0,0)', 'rgb(5, 253, 50)', dm],
                    shape: 'buy',
                }
            ]);
        }
        else {
            this.chartType[this.props.parent.chartType].setMarkers([
                {
                    time: this.chartData[resolution][len - 1].time,
                    position: 'belowBar',
                    color: ['rgba(252, 21, 90,.3)', 'rgba(0, 0, 0, 0)', 'rgb(252, 21, 90)', dm],
                    shape: 'sell',
                },
            ]);
        }
    }
    hideAction() {
        let { resolution } = this.props.parent;
        if (!(resolution in this.chartData)) {
            return;
        }
        let len = this.chartData[resolution].length;
        this.chartType[this.props.parent.chartType].setMarkers([
            {
                time: this.chartData[resolution][len - 1].time,
                shape: 'null',
            }
        ]);
    }
    trade({ tradeType, bet, tradeAt }) {
        // let { balance } = this.context.state.user;
        let { id, resolution } = this.props.parent;
        if (!(resolution in this.chartData)) {
            return;
        }
        let len = this.chartData[resolution].length;
        let data = {
            balanceType: this.props.user.type,
            tradeType,
            bet: bet,
            marketId: id,
            point: this.chartData[resolution][len - 1].time,
            tradeAt: tradeAt
        }
        this.context.game.send({ trade: data });
    }
    order({ point }) {
        this.chartType[this.props.parent.chartType].setMarkers([
            {
                time: point,
                position: 'inBar',
                color: '#5C91D9',
                shape: 'circle',
            }
        ]);
        this.notify({ message: t('orderSuccess'), type: 'success' });
    }
    changeResolution(resolution) {
        this.props.dispatch(TabbarAdd({ key: this.props.tab.active, value: { ...this.props.parent, resolution } }));
        setTimeout(() => {
            this.getData();
        }, 100);
    }
    changeChartType(chartType) {
        this.props.dispatch(TabbarAdd({ key: this.props.tab.active, value: { ...this.props.parent, chartType } }));
        setTimeout(() => {
            this.changeData(true);
        }, 300);
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
                    <Resolution value={this.props.parent.resolution} onChange={this.changeResolution} />
                    <ChartType value={this.props.parent.chartType} onChange={this.changeChartType} />
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
        zIndex: 999
    }
}
export default connect(state => state)(Chart);