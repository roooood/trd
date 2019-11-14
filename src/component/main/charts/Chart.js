import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { t } from '../../../locales';
import { canddleUrl, resolutionEx, hub2candle, chartOptions, candleOption, volumeOption, lineOption, barOption, areaOption, getDimention, timeRange } from './Const';
import { connect } from 'react-redux';
import request from '../../../library/Fetch';
import Resolution from './widget/Resolution';
import ChartType from './widget/chartTypes';
import Context from '../../../library/Context';
import { clone } from '../../../library/Helper';
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
        this.createChart();

        window.addEventListener('resize', this.resize);
        new ResizeObserver(this.resize).observe(document.getElementById("sidebar"))

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
                        this.syncTime();
                    }
                }
            });
        } else {
            this.changeData();
        }
    }
    createChart() {
        // this.context.live.register(this.props.parent.symbol, this.update);
        this.selector = document.getElementById('chart' + this.id);
        this.chart = LightweightCharts.createChart(this.selector, {
            ...getDimention(),
            ...chartOptions
        });
    }
    createSeries() {
        this.chartType['candle'] = this.chart.addCandlestickSeries(candleOption);
        this.chartType['line'] = this.chart.addLineSeries(lineOption);
        this.chartType['area'] = this.chart.addAreaSeries(areaOption);
        this.chartType['bar'] = this.chart.addBarSeries(barOption);
        // this.volumeSeries = this.chart.addHistogramSeries(volumeOption);
    }
    changeData() {
        this.chart.clear();
        this.createSeries();
        let { resolution, chartType } = this.props.parent;
        // this.volumeSeries.setData(this.chartData[resolution]);
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
        let data = this.lastItem();
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
        let data = this.lastItem();
        this.chartType[this.props.parent.chartType].setMarkers([
            {
                time: data.time,
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
        let data = {
            balanceType: this.props.user.type,
            tradeType,
            bet: bet,
            marketId: id,
            tradeAt: tradeAt
        }
        this.context.game.send({ trade: data });
    }
    order([order]) {
        let lastData = this.lastItem();
        this.chartType[this.props.parent.chartType].setMarkers([
            {
                time: lastData.time,
                position: order.tradeType == 'buy' ? 'aboveBar' : 'belowBar',
                color: order.tradeType == 'buy' ? '#25b940' : '#fc155a',
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
    lastItem(end = 1) {
        let { resolution } = this.props.parent;
        if (resolution in this.chartData) {
            let len = this.chartData[resolution].length;
            if (len > 0)
                return clone(this.chartData[resolution][len - end]);
            else
                return false;
        }
        return false;
    }
    syncTime() {
        let timestamp = Math.round(new Date() / 1000);
        let data = this.lastItem();
        this.timeDifference = data.time - timestamp + 60;
    }
    update(targetPrice) {
        let { resolution, chartType } = this.props.parent;
        let lastData = this.lastItem();
        let timeLimit = timeRange[resolution]
        if (!(resolution in this.chartData) || !lastData || this.chartType[chartType] == null) {
            return;
        }
        let time = Math.round(new Date() / 1000) + this.timeDifference;
        let isNew = time - lastData.time > timeLimit;
        let updateData = isNew
            ? {
                open: targetPrice,
                high: targetPrice,
                low: targetPrice,
                close: targetPrice,
                time: Number(time),
                value: targetPrice
            }
            : lastData;

        updateData.close = targetPrice;
        updateData.value = targetPrice;
        updateData.high = Math.max(updateData.high, targetPrice);
        updateData.low = Math.min(updateData.low, targetPrice);
        if (!isNew) {
            this.chartType[chartType].update(updateData);
            let len = this.chartData[resolution].length;
            this.chartData[resolution][len] = updateData;
        } else {
            this.chartData[resolution].push(updateData);
            this.chartType[chartType].setData(this.chartData[resolution]);
        }
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