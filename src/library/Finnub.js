class Finnhub {
    constructor() {
        this.socket = "wss://finnhub.io/ws";
        this.isConnect = false;
        this.Listen = [];
    }
    connect() {
        if (window.MozWebSocket) {
            logErrorToConsole('Info', 'This browser supports WebSocket using the MozWebSocket constructor');
            window.WebSocket = window.MozWebSocket;
        }
        else if (!window.WebSocket) {
            logErrorToConsole('ERROR', 'This browser does not have support for WebSocket');
            return;
        }

        this.websocket = new WebSocket(this.socket);
        this.websocket.onopen = (evt) => { this.onOpen(evt) };
        this.websocket.onclose = (evt) => { this.onClose(evt) };
        this.websocket.onmessage = (evt) => { this.onMessage(evt) };
        this.websocket.onerror = (evt) => { this.onError(evt) };
    }
    register(key, callback) {
        if (this.Listen[key] == null) {
            this.Listen[key] = [];
        }
        this.Listen[key].push(callback);
    }
    removeListen(key) {
        this.Listen[key] == null
    }
    doDisconnect() {
        this.websocket.close()
    }
    onOpen(evt) {
        this.isConnect = true;
        this.writeToScreen("CONNECTED");
    }

    onClose(evt) {
        this.writeToScreen("DISCONNECTED");
    }

    onMessage(evt) {
        let data = JSON.parse(evt.data);
        if (data.type == 52) {
            let key = data.content.ticker;
            if (this.Listen[key] != null) {
                for (let cb of this.Listen[key]) {
                    cb(data.content.updatePrice);
                }
            }
            else {

            }
        }
        this.writeToScreen(evt.data);
    }

    onError(evt) {
        this.writeToScreen(evt.data);
    }

    send(symbol) {
        if (this.isConnect)
            websocket.send('{"type":50,"ticker":"' + symbol + '"}');
    }

    writeToScreen(message) {
        console.log(message);
    }
}
export default Finnhub;
