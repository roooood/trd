import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import request from '../../../library/Fetch';
import Resolution from './Resolution';
import Context from '../../../library/Context';
import { TabbarAdd } from '../../../redux/action/tab';
import * as LightweightCharts from './lightweight-charts';

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
        rightOffset: 12,
        barSpacing: 2,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: false,
        borderColor: 'transparent',
        visible: true,
        timeVisible: true,
        secondsVisible: false,
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
    priceFormat: {
        minMove: 0.00000001,
        formatter: function (price) {
            return '$' + price;
        },
        scaleMargins: {
            top: 0,
            bottom: 0.5,
        },
    },
    upColor: '#25b940',
    downColor: '#fc155a',
    wickVisible: true,
    borderVisible: false,
    wickColor: '#eee',
    wickUpColor: '#25b940',
    wickDownColor: '#fc155a',
}
const volumeOption = {
    color: 'rgba(0,0,0,.7)',
    priceFormat: {
        type: 'volume',
        minMove: 0.00000001,
    },
    priceLineVisible: true,
    overlay: true,
    scaleMargins: {
        top: 0.85,
        bottom: 0,
    },
}

// var candleSeries, volumeSeries;

// var lastClose = data[data.length - 1].close;
// var lastIndex = data.length - 1;

// var targetIndex = lastIndex + 105 + Math.round(Math.random() + 30);
// var targetPrice = getRandomPrice();

// var currentIndex = lastIndex + 1;
// var currentBusinessDay = { day: 29, month: 5, year: 2019 };
// var ticksInCurrentBar = 0;
// var currentBar = {
//     open: null,
//     high: null,
//     low: null,
//     close: null,
//     time: currentBusinessDay,
// };
// function mergeTickToBar(price) {
//     if (currentBar.open === null) {
//         currentBar.open = price;
//         currentBar.high = price;
//         currentBar.low = price;
//         currentBar.close = price;
//     } else {
//         currentBar.close = price;
//         currentBar.high = Math.max(currentBar.high, price);
//         currentBar.low = Math.min(currentBar.low, price);
//     }
//     candleSeries.update(currentBar);
// }

// function reset() {
//     candleSeries.setData(data);
//     lastClose = data[data.length - 1].close;
//     lastIndex = data.length - 1;

//     targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
//     targetPrice = getRandomPrice();

//     currentIndex = lastIndex + 1;
//     currentBusinessDay = { day: 29, month: 5, year: 2019 };
//     ticksInCurrentBar = 0;
// }

// function getRandomPrice() {
//     return 10 + Math.round(Math.random() * 10000) / 100;
// }

// function nextBusinessDay(time) {
//     var d = new Date();
//     d.setUTCFullYear(time.year);
//     d.setUTCMonth(time.month - 1);
//     d.setUTCDate(time.day + 1);
//     d.setUTCHours(0, 0, 0, 0);
//     return {
//         year: d.getUTCFullYear(),
//         month: d.getUTCMonth() + 1,
//         day: d.getUTCDate(),
//     };
// }

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
    }
    resize() {
        if (this.props.inView)
            this.chart.applyOptions(this.getDimention());
    }
    debounce() {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(this.resize, 100);
    }
    componentWillReceiveProps(nextProps, contextProps) {
    }
    active() {
        return this.props.tab.active.replace('t', '');
    }
    getDimention() {
        return {
            width: window.innerWidth - (this.sidebarElement.offsetWidth + 150),
            height: window.innerHeight - 100,
        }
    }
    componentDidMount() {
        this.getData();
        this.sidebarElement = document.querySelector(".sidebar");
        this.selector = document.getElementById('chart' + this.id);

        window.addEventListener('resize', this.resize);
        new ResizeObserver(this.resize).observe(document.querySelector(".sidebar"))

        this.chart = LightweightCharts.createChart(this.selector, {
            ...this.getDimention(),
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
        let type = this.props.parent.candle;
        if (!(type in this.candle)) {
            this.candle[type] = []

            let post = {
                market: this.id,
                resolution: type
            }
            this.setState({ loading: true });
            request('candle', post, res => {
                if (typeof res == 'object' && !('success' in res)) {
                    let i, id, open, high, low, close, value, time;
                    for (i in res) {
                        [id, open, high, low, close, value, time] = res[i];
                        this.candle[type].push({ id, open, high, low, close, value, time })
                    }
                    this.setState({ loading: false });
                    this.setValue(type);
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
        let dm = this.getDimention();
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
    changeResolution(candle) {
        this.props.dispatch(TabbarAdd({ key: this.props.tab.active, value: { ...this.props.parent, candle } }));
        this.getData();
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