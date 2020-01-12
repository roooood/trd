import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { t } from 'locales';
import { canddleUrl, resolutionEx, hub2candle, chartOptions, candleOption, volumeOption, lineOption, barOption, areaOption, getDimention, timeRange } from './Const';
import { connect } from 'react-redux';
import request from 'library/Fetch';
import Resolution from './widget/Resolution';
import ChartType from './widget/chartTypes';
import Context from 'library/Context';
import { clone } from 'library/Helper';
import { TabbarAdd } from 'redux/action/tab';
import * as LightweightCharts from 'component/lightweight-charts';
import play from 'library/Sound';


class Chart extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.opens = [];
        this.chartData = {};
        this.chartType = {};
        this.timer = null;
        this.id = props.parent.id;
        this.markers = [];
        this.glower = 2;
        this.up = true;
        autoBind(this);
        window.ee.on('actionHover' + props.parent.id, this.showAction)
        window.ee.on('actionBlur' + props.parent.id, this.hideAction)
        window.ee.on('trade' + props.parent.id, this.trade)
    }
    resize() {
        if (!this.context.state.isPortrait) //this.props.inView && 
            this.chart.applyOptions(getDimention(this.context.state.isMobile, this.context.state.isPortrait));
    }

    componentDidMount() {
        this.context.game.register('order', this.order);
        this.context.game.register('opens', this.openOrders);
        this.context.game.register('orderResult', this.orderResult);
        this.context.game.send({ myOrder: this.props.parent.id });

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
            request('candle/', { url, token: this.props.user.token }, res => {
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
        chartOptions.timeScale.rightOffset = this.context.state.isPortrait ? 2 : 10;
        this.context.live.register(this.props.parent.symbol, this.update);
        this.selector = document.getElementById('chart' + this.id);
        this.chart = LightweightCharts.createChart(this.selector, {
            ...getDimention(this.context.state.isMobile, this.context.state.isPortrait),
            ...chartOptions,
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
        this.setMarkers();
        this.chart.timeScale().scrollToRealTime();
        // this.chart.timeScale().fitContent();

        // this.chart.TimeRangeChangeEventHandler((e) => console.log(e))
    }
    showAction(action) {
        let { resolution, chartType } = this.props.parent;
        if (!(resolution in this.chartData)) {
            return;
        }
        let data = this.lastItem();
        let dm = getDimention(this.context.state.isMobile, this.context.state.isPortrait);
        let item = {};
        if (action == 'buy') {
            item = {
                time: data.time,
                position: 'inBar',
                color: ['rgba(5, 253, 50,.2) ', 'rgba(5, 253, 50,.008)', 'rgb(5, 253, 50)', dm],
                shape: 'buy',
                key: 'trade'
            }
        }
        else {
            item = {
                time: data.time,
                position: 'inBar',
                color: ['rgba(252, 21, 90,.3)', 'rgba(0, 0, 0, 0)', 'rgb(252, 21, 90)', dm],
                shape: 'sell',
                key: 'trade'
            }
        }
        this.markers.push(item)
        this.chartType[chartType].setMarkers(this.markers);
    }
    hideAction() {
        let { resolution, chartType } = this.props.parent;
        if (!(resolution in this.chartData)) {
            return;
        }
        this.markers = this.markers.filter((obj) => {
            return obj.key !== 'trade';
        });
        this.chartType[chartType].setMarkers(this.markers);
    }
    trade({ tradeType, bet, tradeAt }) {
        let { id, resolution } = this.props.parent;
        let lastItem = this.lastItem()
        if (!(resolution in this.chartData) || !lastItem) {
            return;
        }
        let data = {
            balanceType: this.props.user.type,
            tradeType,
            bet: bet,
            marketId: id,
            tradeAt: tradeAt,
            price: lastItem.close
        }
        play('click')
        this.context.game.send({ trade: data });
    }
    openOrders(orders) {
        let i;
        for (i of orders) {
            if (this.props.parent.id == i.market_id) {
                this.opens.push(i)
            }
        }
        this.setMarkers();
    }
    order([order]) {
        if (this.props.parent.id == order.market_id) {
            this.openOrders([order]);
            this.notify({ message: t('orderSuccess'), type: 'success' });
        }
    }
    orderResult(order) {
        if (this.props.parent.id == order.market_id) {
            let i;
            for (i in this.opens) {
                if (this.opens[i].id == order.id) {
                    this.opens.splice(i, 1);
                    break;
                }
            }
            this.setMarkers();
        }
    }
    setMarkers() {
        let { resolution, chartType } = this.props.parent;
        this.markers = [];
        let i, j;
        let lastTime = this.lastItem().time;
        if (resolution in this.chartData) {
            for (j of this.opens) {
                if (!('triger' in j)) {
                    for (i of this.chartData[resolution]) {
                        if (j.point <= i.time) {
                            j.triger = i.time;
                            break;
                        }
                    }
                    if (!('triger' in j)) {
                        j.triger = lastTime;
                    }
                }
                this.markers.push({
                    time: j.triger,
                    price: j.price,
                    position: j.tradeType == 'buy' ? 'aboveBarX' : 'belowBarX',
                    color: [j.tradeType, j.bet],
                    shape: 'trade',
                })

            }
            this.chartType[chartType].setMarkers(this.markers);
            this.glow();
        }
    }
    glow() {
        clearInterval(this.timer);
        let { resolution, chartType } = this.props.parent;
        if (resolution in this.chartData) {
            this.timer = setInterval(() => {
                this.glower += 2;
                if (this.glower == 12) {
                    this.glower = 2
                }

                let last = this.lastItem();
                let item = {
                    time: last.time,
                    position: 'inBar',
                    color: [
                        this.glower,
                        last.open < last.close
                            ? 'rgba(37, 185, 64, 0.' + ((12 - this.glower) * 10) + ')'
                            : 'rgba(252, 21, 90, 0.' + ((12 - this.glower) * 10) + ')',
                        last.open < last.close
                            ? '#2DBB54'//'#aeff1f'
                            : '#FF0033',//ee0f78
                        this.context.state.isMobile],
                    shape: 'glow',
                    key: 'glow'
                }

                let result = -1;
                for (var i in this.markers) {
                    if (this.markers[i].key == 'glow') {
                        result = i;
                    }
                }
                if (result > -1) {
                    this.markers[result] = item;
                }
                else {
                    this.markers.push(item);
                }
                this.chartType[chartType].setMarkers(this.markers);
            }, 200);
        }
    }
    changeResolution(resolution) {
        clearInterval(this.timer);
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
    update(targetPrice) {
        let { resolution, chartType } = this.props.parent;
        let lastData = this.lastItem();
        let timeLimit = 20;//timeRange[resolution]
        if (!(resolution in this.chartData) || !lastData || this.chartType[chartType] == null) {
            return;
        }
        let time = Math.round((new Date()).getTime() / 1000);
        let isNew = time - lastData.time > timeLimit;
        let updateData = isNew
            ? {
                open: targetPrice,
                high: targetPrice,
                low: targetPrice,
                close: targetPrice,
                time: time + timeLimit,
                value: targetPrice
            }
            : lastData;

        updateData.close = targetPrice;
        updateData.value = targetPrice;
        updateData.high = Math.max(updateData.high, targetPrice);
        updateData.low = Math.min(updateData.low, targetPrice);

        if (!isNew) {
            this.chartType[chartType].update(updateData);
            let len = this.chartData[resolution].length - 1;
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
                    <div className="loading-dir">
                        <div className="loading">
                            <div className="loading-1"></div>
                            <div className="loading-2"></div>
                            <div className="loading-3"></div>
                            <div className="loading-4"></div>
                        </div>
                    </div>
                }
                <div id={"chart" + this.id} />
                <div style={this.context.state.isPortrait ? styles.actions2 : styles.actions}>
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
        left: 10,
        width: 50,
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'baseline',
        zIndex: 99999999
    },
    actions2: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 50,
        width: 200,
        display: 'flex',
        alignItems: 'center',
        zIndex: 99999999,
    },

}
export default connect(state => state)(Chart);