import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from '../../library/Context';

import { connect } from 'react-redux';
import { User } from '../../redux/action/user';

import Login from './Login';
import Register from './Register';

class Sign extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            route: 'login'
        };
        autoBind(this);
    }
    goto(component) {
        this.setState({
            route: component
        })
    }
    render() {
        return (
            <div className="bg theme-default" style={styles.root} >
                <div style={styles.body}>
                    {this.state.route == 'login' &&
                        <Login goto={this.goto} />
                    }
                    {this.state.route == 'register' &&
                        <Register goto={this.goto} />
                    }
                </div>
            </div>
        );
    }
}
const styles = {
    root: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    body: {
        background: '#fff',
        borderRadius: 10
    }
}
export default connect(state => state)(Sign);