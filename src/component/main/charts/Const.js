export const canddleUrl = 'https://finnhub.io/api/v1/{type}/candle?symbol={symbol}&resolution={resolution}&count={count}&token={token}';
export const resolution = { '1m': '1', '5m': '5', '15m': '15', '30m': '30', 'H': '60', 'D': 'D', 'W': 'W', 'M': 'M' };

export const chartOptions = {
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
}
export const candleOption = {
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
export const volumeOption = {
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

export function getDimention() {
    let sidebarElement = document.querySelector(".sidebar")
    return {
        width: window.innerWidth - (sidebarElement.offsetWidth + 150),
        height: window.innerHeight - 100,
    }
}

export function hub2candle(data) {
    if (!('s' in data)) {
        return null;
    }
    let len = data.c.length, i, ret = [];
    for (i = 0; i < len; i++) {
        ret.push({
            open: data.o[i],
            high: data.h[i],
            low: data.l[i],
            close: data.c[i],
            value: data.v[i],
            time: data.t[i],
        })
    }
    return ret;
}