export const canddleUrl = 'https://finnhub.io/api/v1/{type}/candle?symbol={symbol}&resolution={resolution}&count={count}&token={token}';
export const resolutionEx = { '1m': '1', '5m': '5', '15m': '15', '30m': '30', 'H': '60', 'D': 'D', 'W': 'W', 'M': 'M' };

export const chartOptions = {
    layout: {
        backgroundColor: 'transparent',
        textColor: '#b5b5b5'
    },
    localization: {
        priceFormatter: function (price) { return '$' + price.toFixed(0); },
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
    wickColor: 'rgba(255,255,255,.3)',
    wickUpColor: '#25b940',
    wickDownColor: '#fc155a',
}
export const volumeOption = {
    color: 'rgba(0,0,0,.7)',
    priceFormat: {
        type: 'volume',
        minMove: 0.00000001,
    },
    base: 0,
    priceLineVisible: false,
    overlay: true,
    scaleMargins: {
        top: 0.85,
        bottom: 0,
    },
}
export const barOption = {
    thinBars: false,
    downColor: '#25b940',
    upColor: '#fc155a',
}
export const areaOption = {
    topColor: 'rgba(21, 146, 230, 0.4)',
    bottomColor: 'rgba(21, 146, 230, 0)',
    lineColor: 'rgba(21, 146, 230, 1)',
    lineStyle: 0,
    lineWidth: 2,
    crosshairMarkerVisible: false,
    crosshairMarkerRadius: 3,
}
export const lineOption = {
    color: 'rgba(21, 146, 230, 1)',
    lineStyle: 0,
    lineWidth: 2,
    priceLineColor: '#4682B4',
    priceLineStyle: 2,
    crosshairMarkerVisible: false,
    crosshairMarkerRadius: 3,
    lineType: 2,
}

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