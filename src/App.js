import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { getQuery } from 'library/Helper';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

import GameServer from './library/Game';
import Finnhub from './library/Finnhub';
import Context from './library/Context';
import Route from './Route';
import Snack from './component/Snack'
import Modal from './component/Modal';

import './assets/css/app.css';
import './assets/forex/currency-flags.css';
import './assets/crypto/cryptocoins.css';
import './assets/crypto/cryptocoins-colors.css';

let EventEmitter = require('events')
window.ee = new EventEmitter();

const lang = getQuery('lang') || 'fa';
const dir = lang == 'fa' ? 'rtl' : 'ltr'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: window.innerWidth <= 900,
      isPortrait: window.innerHeight > window.innerWidth,
      setting: {},
      dir: dir,
      menu: false
    };
    this.game = new GameServer('trade');
    this.finnhub = new Finnhub();
    autoBind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }
  resize() {
    this.setState({ isPortrait: window.innerHeight > window.innerWidth })
  }
  changeState(obj) {
    this.setState(obj)
  }
  update() {
    this.forceUpdate();
  }
  app(obj) {
    return this[obj];
  }
  renderLoading() {
    return null;
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={this.renderLoading()}>
          <Context.Provider value={{ game: this.game, live: this.finnhub, state: this.state, app: this.app, setState: this.changeState }}>
            <Snack />
            <Modal ref={r => this.modal = r} />
            <Route />
          </Context.Provider>
        </PersistGate>
      </Provider >
    );
  }
}

export default App;
