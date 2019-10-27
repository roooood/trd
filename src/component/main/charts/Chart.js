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
        this.context.live.register(this.props.parent.symbol, this.update);

        this.getData();
        this.createChart();

        window.addEventListener('resize', this.resize);
        new ResizeObserver(this.resize).observe(document.querySelector(".sidebar"))

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
        this.selector = document.getElementById('chart' + this.id);
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
    changeData() {
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
        let data = this.chartData[resolution].slice(-1);
        let dm = getDimention();
        if (action == 'buy') {
            this.chartType[this.props.parent.chartType].setMarkers([
                {
                    time: data.time,
                    position: 'aboveBar',
                    color: ['rgba(5, 253, 50,.2) ', 'rgba(0, 0, 0,0)', 'rgb(5, 253, 50)', dm],
                    shape: 'buy',
                }
            ]);
        }
        else {
            this.chartType[this.props.parent.chartType].setMarkers([
                {
                    time: data.time,
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
        let data = this.chartData[resolution].slice(-1);
        this.chartType[this.props.parent.chartType].setMarkers([
            {
                time: data.time,
                shape: 'null',
            }
        ]);
    }
    trade({ tradeType, bet, tradeAt }) {
        // let { balance } = this.context.state.user;
        let { symbol, resolution } = this.props.parent;
        if (!(resolution in this.chartData)) {
            return;
        }
        let data = {
            balanceType: this.props.user.type,
            tradeType,
            bet: bet,
            market: symbol,
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
            this.changeData();
        }, 100);
    }
    syncTime() {
        let timestamp = Math.round(new Date() / 1000);
        let data = this.chartData[this.props.parent.resolution].slice(-1);
        this.timeDifference = data.time - timestamp + 60;
    }
    update(targetPrice) {
        let { resolution } = this.props.parent;
        if (!(resolution in this.chartData || resolution != '1m')) {
            return;
        }
        let time = Math.round(new Date() / 1000) + this.timeDifference;
        let lastData = this.chartData[resolution].slice(-1);
        let isNew = time - lastData.time > 60;
        let updateData = isNew
            ? {
                open: targetPrice,
                high: targetPrice,
                low: targetPrice,
                close: targetPrice,
                time: time,
                volume: 0
            }
            : lastData;

        updateData.high = Math.max(updateData.high, targetPrice);
        updateData.low = Math.max(updateData.low, targetPrice);
        updateData.close = targetPrice;
        this.chartType[i].update(updateData);
    }

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