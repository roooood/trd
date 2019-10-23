import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import Resolution from './Resolution';
import Context from '../../../library/Context';
import * as LightweightCharts from 'lightweight-charts';

const chartOptions = {
    layout: {
        backgroundColor: 'transparent',
        textColor: '#b5b5b5'
    },

    grid: {
        vertLines: {
            color: '#333',
            style: 1
        },
        horzLines: {
            color: '#333',
            style: 1
        },
    },
    priceScale: {
        borderColor: 'transparent',
    },
    timeScale: {
        borderColor: 'transparent',
    },

    crosshair: {
        // vertLine: {
        //     width: 5,
        //     color: 'rgba(224, 227, 235, 0.1)',
        //     style: 0,
        // },
        // horzLine: {
        //     width: 5,
        //     color: 'rgba(224, 227, 235, 0.1)',
        //     style: 0,
        // },
    },
}
const candleOption = {
    upColor: '#25b940',
    downColor: '#fc155a',
    wickVisible: true,
    borderVisible: false,
    wickColor: '#eee',
    wickUpColor: '#25b940',
    wickDownColor: '#fc155a',
}
const volumeOption = {
    color: '#333',
    priceFormat: {
        type: 'volume',
    },
    priceLineVisible: false,
    overlay: true,
    scaleMargins: {
        top: 0.85,
        bottom: 0,
    },
}

var candleSeries, chart, volumeSeries;
var data = [
    { time: '2018-10-19', open: 54.62, value: 54.62, color: '#25b940', high: 55.50, low: 54.52, close: 54.90 },
    { time: '2018-10-22', open: 55.08, value: 33.62, high: 55.27, low: 54.61, close: 54.98 },
    { time: '2018-10-23', open: 56.09, value: 55.62, color: '#fc155a', high: 57.47, low: 56.09, close: 57.21 },
    { time: '2018-10-24', open: 57.00, value: 33.62, high: 58.44, low: 56.41, close: 57.42 },
    { time: '2018-10-25', open: 57.46, value: 11.62, high: 57.63, low: 56.17, close: 56.43 },
    { time: '2018-10-26', open: 56.26, value: 11.62, high: 56.62, low: 55.19, close: 55.51 },
    { time: '2018-10-29', open: 55.81, value: 11.62, high: 57.15, low: 55.72, close: 56.48 },
    { time: '2018-10-30', open: 56.92, value: 11.62, high: 58.80, low: 56.92, close: 58.18 },
    { time: '2018-10-31', open: 58.32, value: 11.62, high: 58.32, low: 56.76, close: 57.09 },
    { time: '2018-11-01', open: 56.98, value: 11.62, high: 57.28, low: 55.55, close: 56.05 },
    { time: '2018-11-02', open: 56.34, value: 11.62, high: 57.08, low: 55.92, close: 56.63 },
    { time: '2018-11-05', open: 56.51, value: 11.62, high: 57.45, low: 56.51, close: 57.21 },
    { time: '2018-11-06', open: 57.02, value: 11.62, high: 57.35, low: 56.65, close: 57.21 },
    { time: '2018-11-07', open: 57.55, value: 11.62, high: 57.78, low: 57.03, close: 57.65 },
    { time: '2018-11-08', open: 57.70, value: 11.62, high: 58.44, low: 57.66, close: 58.27 },
    { time: '2018-11-09', open: 58.32, value: 11.62, high: 59.20, low: 57.94, close: 58.46 },
    { time: '2018-11-12', open: 58.84, value: 11.62, high: 59.40, low: 58.54, close: 58.72 },
    { time: '2018-11-13', open: 59.09, value: 11.62, high: 59.14, low: 58.32, close: 58.66 },
];

var lastClose = data[data.length - 1].close;
var lastIndex = data.length - 1;

var targetIndex = lastIndex + 105 + Math.round(Math.random() + 30);
var targetPrice = getRandomPrice();

var currentIndex = lastIndex + 1;
var currentBusinessDay = { day: 29, month: 5, year: 2019 };
var ticksInCurrentBar = 0;
var currentBar = {
    open: null,
    high: null,
    low: null,
    close: null,
    time: currentBusinessDay,
};
function mergeTickToBar(price) {
    if (currentBar.open === null) {
        currentBar.open = price;
        currentBar.high = price;
        currentBar.low = price;
        currentBar.close = price;
    } else {
        currentBar.close = price;
        currentBar.high = Math.max(currentBar.high, price);
        currentBar.low = Math.min(currentBar.low, price);
    }
    candleSeries.update(currentBar);
}

function reset() {
    candleSeries.setData(data);
    lastClose = data[data.length - 1].close;
    lastIndex = data.length - 1;

    targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
    targetPrice = getRandomPrice();

    currentIndex = lastIndex + 1;
    currentBusinessDay = { day: 29, month: 5, year: 2019 };
    ticksInCurrentBar = 0;
}

function getRandomPrice() {
    return 10 + Math.round(Math.random() * 10000) / 100;
}

function nextBusinessDay(time) {
    var d = new Date();
    d.setUTCFullYear(time.year);
    d.setUTCMonth(time.month - 1);
    d.setUTCDate(time.day + 1);
    d.setUTCHours(0, 0, 0, 0);
    return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
    };
}

class Chart extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        this.timer = null;
        this.inView = false;
        this.id = props.parent;
        autoBind(this);
    }
    resize() {
        if (!this.inView)
            return;
        let xwidth = window.innerWidth - (this.actionElement.clientWidth + this.sidebarElement.offsetWidth + 20);
        let xheight = this.chartElemet.clientHeight - 10;
        this.chart.applyOptions({ width: xwidth, height: xheight });
    }
    debounce() {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(this.resize, 100);
    }
    componentWillReceiveProps(nextProps, contextProps) {
        if ('parent' in nextProps) {
            if (contextProps.state.tabbar == nextProps.parent) {
                this.inView = true;
                setTimeout(() => {
                    this.resize();
                }, 100);
            }
            else {
                this.inView = false
            }
        }
    }
    componentDidMount() {
        const active = this.context.state.tabbar == null ? this.props.tab.active : this.context.state.tabbar;
        if (this.props.parent == active) {
            this.inView = true;
        }
        this.chartElemet = document.querySelector(".center .chart-dir-" + this.props.parent + " .chart");
        this.actionElement = document.querySelector(".center .chart-dir-" + this.props.parent + " .action");
        this.sidebarElement = document.querySelector(".sidebar");
        this.selector = document.getElementById('chart' + this.props.parent);

        window.addEventListener('resize', this.resize);
        new ResizeObserver(this.resize).observe(document.querySelector(".sidebar"))

        this.chart = LightweightCharts.createChart(this.selector, {
            width: this.chartElemet.clientWidth,
            height: this.chartElemet.clientHeight,
            ...chartOptions
        });
        candleSeries = this.chart.addCandlestickSeries(candleOption);
        candleSeries.setData(data);

        volumeSeries = this.chart.addHistogramSeries(volumeOption);
        volumeSeries.setData(data);
    };

    dynamicUpdate() {
        setInterval(function () {
            var deltaY = targetPrice - lastClose;
            var deltaX = targetIndex - lastIndex;
            var angle = deltaY / deltaX;
            var basePrice = lastClose + (currentIndex - lastIndex) * angle;
            var noise = (0.1 - Math.random() * 0.2) + 1.0;
            var noisedPrice = basePrice * noise;
            mergeTickToBar(noisedPrice);
            if (++ticksInCurrentBar === 5) {
                // move to next bar
                currentIndex++;
                currentBusinessDay = nextBusinessDay(currentBusinessDay);
                currentBar = {
                    open: null,
                    high: null,
                    low: null,
                    close: null,
                    time: currentBusinessDay,
                };
                ticksInCurrentBar = 0;
                if (currentIndex === 5000) {
                    reset();
                    return;
                }
                if (currentIndex === targetIndex) {
                    // change trend
                    lastClose = noisedPrice;
                    lastIndex = currentIndex;
                    targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
                    targetPrice = getRandomPrice();
                }
            }
        }, 1000);
    }
    render() {
        return (
            <div style={styles.root}>
                <div id={"chart" + this.id} />
                <div style={styles.actions}>
                    <Resolution value={"1"} />
                </div>
            </div>
        );
    }
}
const styles = {
    root: {
        height: '100%',
        display: 'flex',
        height: '100%'

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