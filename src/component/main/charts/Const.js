
export const canddleUrl = '{type}/candle?symbol={symbol}&resolution={resolution}&count={count}&token={token}';
export const resolutionEx = { '1m': '1', '5m': '5', '15m': '15', '30m': '30', 'H': '60', 'D': 'D', 'W': 'W', 'M': 'M' };
export const timeRange = { '1m': 60, '5m': 300, '15m': 900, '30m': 1800, 'H': 3600, 'D': 86400, 'W': 604800, 'M': 2592000 };

function xround(n) {
    let num = n + '';
    let nums = num.split('.');
    if (nums.length == 1)
        return n;
    let count = nums[0].length, prev = -1, check = 0;
    for (let i of nums[1]) {
        count++;
        if (i == prev) {
            check++;
        }
        else {
            check = 0;
        }
        prev = i;
        if (check == 3) {
            break;
        }
    }

    return check == 3 ? n.toFixed(count - 4) : n;
}
export const chartOptions = {
    autoScale: false,
    layout: {
        backgroundColor: 'transparent',
        textColor: '#b5b5b5'
    },
    localization: {
        priceFormatter: (price) => {
            return Math.round(price * 10000000) / 10000000;
        },
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
        mode: 1,
        autoScale: true,
        borderVisible: false,
    },
    timeScale: {
        rightBarStaysOnScroll: false,
        borderVisible: false,
        barSpacing: 25,
        borderColor: 'transparent',
        visible: true,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 15,
        autoScale: true,
        scaleMargins: {
            top: 0.5,
            bottom: 0.5,
        },
    },
    crosshair: {
        vertLine: {
            color: '#6A5ACD',
            width: 0.5,
            style: 1,
            visible: true,
            labelVisible: false,
        },
        horzLine: {
            color: '#6A5ACD',
            width: 0.5,
            style: 1,
            visible: true,
            labelVisible: true,
        },
        mode: 2,
    },
    handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
    },
    handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
    },
}
export const candleOption = {
    priceFormat: {
        minMove: 0.00000001,
        scaleMargins: {
            top: 0,
            bottom: 0.5,
        },
    },
    // upColor: '#25b940',
    // downColor: '#fc155a',
}
export const volumeOption = {
    color: 'rgba(0,0,0,.7)',
    base: 0,
    priceScale: {
        position: 'none',
        borderVisible: false,
    },
    grid: {
        vertLines: {
            visible: false,
        },
        horzLines: {
            visible: false,
        },
    },
    priceLineVisible: true,
    overlay: true,
    scaleMargins: {
        top: 0.85,
        bottom: 0,
    },
}
export const barOption = {
    downColor: '#2DBB54',
    upColor: '#FF0033',
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
    priceFormat: {
        type: 'open',
        minMove: 0.00000001,
    },
}

export function getDimention(isMobile, isPortrait) {
    let sidebarElement = window.document.getElementById("sidebar");
    let action = isPortrait ? 10 : isMobile ? 120 : 150;
    if (sidebarElement == null) {
        return {
            width: window.innerWidth-50,
            height: window.innerHeight - (isPortrait ? 150 : 130),
        }
    }
    return {
        width: window.innerWidth - (sidebarElement.offsetWidth + action),
        height: window.innerHeight - (isPortrait ? 200 : isMobile ? 70 : 130),
    }
}

export function hub2candle(data) {
    let ret = [];
    try {
        if (data == 'null') {
            return null;
        }
        if (data.s == 'no_data' || !('s' in data)) {
            return null;
        }
        let len = data.c.length, i;
        for (i = 0; i < len; i++) {
            ret.push({
                open: data.o[i],
                high: data.h[i],
                low: data.l[i],
                close: data.c[i],
                value: data.c[i],
                volume: data.v[i],
                time: parseInt(data.t[i])
            })
        }
    } catch (error) {

    }

    return ret;
}