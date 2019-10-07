import React, { Component } from 'react';
import autoBind from 'react-autobind';
import GameServer from './library/Game';
import { getQuery } from './library/Helper';
import Context from './library/Context';
import Route from './Route';
import { t } from './locales';
import './assets/css/app.css';
const lang = getQuery('lang') || 'fa';
const dir = lang == 'fa' ? 'rtl' : 'ltr';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userKey: getQuery('token') || '-',
      dir: dir,
      isMobile: window.innerWidth < 1000
    };
    this.game = new GameServer('trade');
    autoBind(this);
  }
  changeState(obj) {
    this.setState(obj)
  }
  app(obj) {
    return this[obj];
  }
  render() {
    return (
      <Context.Provider value={{ game: this.game, state: this.state, app: this.app, setState: this.changeState }}>
        <Route />
      </Context.Provider>
    );
  }
}

export default App;
